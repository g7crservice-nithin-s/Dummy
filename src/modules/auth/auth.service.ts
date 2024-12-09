import { AppConfigService } from '@app/config/app-config.service';
import { UserCategoryEnum } from '@app/core/enums/reg-role.enum';
import {
	FileTypeEnum,
	JointerDocType,
	OTPChannelTypeEnum,
	OTPForEnum,
	OTPProviderEnum,
	UpdateType,
	WhatsappEndPoint
} from '@app/core/enums/shared.enum';
import AppLogger from '@app/core/logger/app-logger';
import { AppMailService } from '@app/core/mail/mail.service';
import { unix_ts_now } from '@app/core/utils/timestamp-util';
import { DatabaseService } from '@app/database/database.service';
import { AuthAbstractSqlDao } from '@app/database/mssql/abstract/auth.abstract';
import { ManageAccountAbstractSqlDao } from '@app/database/mssql/abstract/manage-account.abstract';
import { SessionColumns } from '@app/database/mssql/models/logs.session.model';
import { CountryCodeColumns } from '@app/database/mssql/models/masters.country-code.model';
import { RoleColumns } from '@app/database/mssql/models/masters.roles.model';
import { JointerDocumentColumns } from '@app/database/mssql/models/security.jointer-documen.model';
import { JointerAlias, JointerInfoColumns } from '@app/database/mssql/models/security.jointer-info.model';
import { OTPColumns } from '@app/database/mssql/models/security.otp-records.model';
import { UserRoleAlias, UserRoleColumns } from '@app/database/mssql/models/security.user-role.model';
import { AppResponse, createResponse } from '@app/shared/app-response.shared';
import { messageFactory, messages } from '@app/shared/messages.shared';
import ext_api_call from '@app/shared/restapi-request.shared';
import { currentISODate, generateOTP } from '@app/shared/shared.function';
import { BlobSASPermissions, BlobSASSignatureValues, BlobServiceClient, SASProtocol, generateBlobSASQueryParameters } from '@azure/storage-blob';
import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { authenticator } from 'otplib';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';
import { UserAlias, UserColumns } from '../../../src/database/mssql/models/security.user.model';
import { FetchUsersDto } from '../manage-account/dto/manage-account.dto';
import { AuthAbstractSvc } from './auth.abstract';
import {
	FileUploadSasDto,
	LoginDto,
	RefreshTokenPrincipalDto,
	SendOtpDto,
	SethDefaultRoleDto,
	SwitchRoleDto,
	UpdateProfileDto,
	VerifyOtpDto,
	VerifyOtpLoginDto
} from './dto/auth.dto';
import { AtPayload, RtPayload } from './model/jwt-payload.model';
import { ISession } from './model/session.model';
import { IOTPRecord, IUserModel } from './model/userModel';

@Injectable()
export class AuthService implements AuthAbstractSvc {
	private readonly _authTxn: AuthAbstractSqlDao;
	private readonly _manageAccountTxn: ManageAccountAbstractSqlDao;

	constructor(
		readonly _dbSvc: DatabaseService,
		private readonly _loggerSvc: AppLogger,
		private readonly _appConfigSvc: AppConfigService,
		private readonly _jwtService: JwtService,
		private _mailService: AppMailService
	) {
		this._authTxn = _dbSvc.authSqlTxn;
		this._manageAccountTxn = _dbSvc.manageAccountSqlTxn;
	}

	async sendOTPUpdateProfile(info: SendOtpDto, claims: any, ip: string, token: any): Promise<AppResponse> {
		try {
			let tokenData: any;
			if (token) {
				tokenData = JSON.parse(Buffer.from(token?.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8'));
			} else {
				tokenData = claims;
			}
			if (!info?.type && tokenData?.isVerify === false) return createResponse(HttpStatus.BAD_REQUEST, messageFactory(messages.W1, ['data']));

			const credRes = await this.settoken_meta();
			if (credRes.code !== 200) return credRes;
			const tokenMetadata = credRes.data;
			let accessToken;
			let sendOTPTo: any = '';
			let sendMail = false;

			let userName = '';

			if (info?.type && !tokenData?.isVerify) {
				const userExists = await this._authTxn.userExists(tokenData?.sub);
				if (userExists.code !== HttpStatus.OK) return userExists;
				if (!userExists.data) return createResponse(HttpStatus.BAD_REQUEST, messageFactory(messages.W1, ['user']));
				if (info.type === UpdateType.Email) {
					sendOTPTo = `${userExists.data[UserAlias.PrimaryCountryCodes][CountryCodeColumns.CountryCode]}${userExists.data[UserColumns.PrimaryMobileNo]}`;
				} else {
					sendMail = true;
					sendOTPTo = userExists.data[UserColumns.EmailId];
				}
				userName = userExists.data[UserColumns.FullName];
				accessToken = await this.AccessTempToken({ id: tokenData.sub, type: info.type }, tokenMetadata);
			}

			if (tokenData?.isVerify === true) {
				const type = tokenData.updateType === UpdateType.Email ? 'email' : 'mobile';
				if (!info.mobileNo && !info.emailId) return createResponse(HttpStatus.BAD_REQUEST, messageFactory(messages.W1, [type]));

				const userExists = await this._authTxn.userExists(tokenData?.id);
				if (userExists.code !== HttpStatus.OK) return userExists;
				userName = userExists.data[UserColumns.FullName];
				if (tokenData?.type === UpdateType.PrimaryMobileNo || tokenData?.type === UpdateType.SecondaryMobileNo) {
					if (!info.countryCodeId) return createResponse(HttpStatus.BAD_REQUEST, messageFactory(messages.W1, ['country code']));
					const countryCodeExit = await this._authTxn.countryCodeExists(info.countryCodeId);
					if (countryCodeExit?.code !== HttpStatus.OK) return countryCodeExit;
					if (!countryCodeExit?.data) return createResponse(HttpStatus.BAD_REQUEST, messageFactory(messages.W1, ['country code']));
					const res = await this._authTxn.mobEmailExist({ mobileNumber: info.mobileNo });
					if (res.code !== HttpStatus.OK) return res;
					if (res.data) return createResponse(HttpStatus.BAD_REQUEST, messageFactory(messages.W8, [info.mobileNo]));
					const countryCode = await this._authTxn.fetchCountyCode(info.countryCodeId);
					if (countryCode.code !== HttpStatus.OK) return countryCode;
					sendOTPTo = `${countryCode.data[CountryCodeColumns.CountryCode]}${info.mobileNo}`;
					const updateType = tokenData?.type === UpdateType.PrimaryMobileNo ? UpdateType.PrimaryMobileNo : UpdateType.SecondaryMobileNo;
					accessToken = await this.AccessTempToken(
						{ id: tokenData.id, updateType: updateType, mobileNo: info.mobileNo, countryCode: info.countryCodeId },
						tokenMetadata
					);

					// send otp on updated number
				} else {
					const res = await this._authTxn.mobEmailExist({ emailId: info.emailId });
					if (res.code !== HttpStatus.OK) return res;
					if (res.data) return createResponse(HttpStatus.BAD_REQUEST, messages.W9);
					sendOTPTo = info.emailId;
					accessToken = await this.AccessTempToken(
						{ id: tokenData.id, updateType: UpdateType.Email, email: info.emailId, update: true },
						tokenMetadata
					);
					sendMail = true;
					// send otp on email
				}
			}

			const otpValidityInMin = this._appConfigSvc.get('otpSvc').otpValidityInMin;
			const contactSupportMailId = this._appConfigSvc.get('logInLink')?.contactMail;
			const otpInfo = generateOTP(otpValidityInMin);
			if (!sendMail) {
				const sendOTPMessage = await this.sendOTPMessage(sendOTPTo, otpInfo.otp);
				if (sendOTPMessage.code !== HttpStatus.OK) return sendOTPMessage;
			} else {
				const emailInfo = {
					filePath: tokenData?.isVerify ? '../../core/mail/template/UpdateEmail.html' : '../../core/mail/template/UpdateMobileNo.html',
					replacements: {
						expInMin: otpValidityInMin,
						name: userName,
						OTP: otpInfo.otp,
						contactEmail: contactSupportMailId
					},
					mailOptions: {
						to: sendOTPTo,
						subject: tokenData?.isVerify ? messages.T4 : messages.T3,
						text: 'message'
					}
				};
				const mailRes = await this._mailService.sendEmail(emailInfo, claims);
				if (mailRes.code !== HttpStatus.OK) return mailRes;
			}
			const otpData: IOTPRecord = {
				TxnGuid: uuidv4(),
				OTPSecret: otpInfo.secret,
				OTP: otpInfo.otp,
				Channel: OTPChannelTypeEnum.WhatsApp,
				IsVerified: false,
				Count: 1,
				OTPFor: OTPForEnum.updateProfile,
				MessageContent: '',
				Provider: OTPProviderEnum.Twillio,
				UserGuid: claims.sub,
				CreatedBy: claims.sub,
				CreatedOnUTC: currentISODate(),
				IpAddress: ip,
				OTPExpireInMin: otpValidityInMin,
				OTPTo: sendOTPTo
			};
			const OTPRes = await this._authTxn.createOTP(otpData);
			if (OTPRes.code !== HttpStatus.OK) return OTPRes;

			const response = { OTP: otpInfo.otp, id: otpInfo.secret, accessToken: accessToken?.data, expInMin: otpValidityInMin };
			return createResponse(HttpStatus.OK, messages.S14, response);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async verifyOTPUpdateProfile(info: VerifyOtpDto, claims: any): Promise<AppResponse> {
		try {
			let tokenData;
			if (claims) {
				tokenData = JSON.parse(Buffer.from(claims?.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8'));
			} else {
				return createResponse(HttpStatus.BAD_REQUEST, messages.W61);
			}
			const fetchOtpRes = await this._authTxn.fetchOtpInfo(info.id);
			if (fetchOtpRes.code !== HttpStatus.OK) return fetchOtpRes;
			if (fetchOtpRes.data[OTPColumns.IsVerified]) return createResponse(HttpStatus.BAD_REQUEST, messages.W59);
			const isValid = authenticator.verify({ secret: info.id, token: info.OTP });
			if (!isValid) return createResponse(HttpStatus.BAD_REQUEST, messages.W57);
			const otpData = {
				[OTPColumns.IsVerified]: true,
				[OTPColumns.ModifiedOnUTC]: currentISODate()
			};
			const updateOTP = await this._authTxn.updateOtpInfo(otpData, info.id);
			if (updateOTP.code !== HttpStatus.OK) return updateOTP;

			const credRes = await this.settoken_meta();
			if (credRes.code !== 200) return credRes;
			const tokenMetadata = credRes.data;
			let accessToken;
			// verify otp
			if (!tokenData?.updateType?.toString()) {
				accessToken = await this.AccessTempToken({ id: tokenData.id, type: tokenData.type, isVerify: true }, tokenMetadata);
				return createResponse(HttpStatus.OK, messages.S16, accessToken?.data);
			}
			return await this._authTxn.updateProfileByOTP(tokenData);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async fileUploadSas(info: FileUploadSasDto, claims: AtPayload, permission: string = 'c'): Promise<AppResponse> {
		try {
			const now = new Date();
			const blobData = this._appConfigSvc.get('blobStorage');
			// Use BlobServiceClient from the storage connection string
			const storageConnectionString = blobData.blobAccountConnectionString;
			const blobServiceClient: any = BlobServiceClient.fromConnectionString(storageConnectionString);
			// Create a ContainerClient
			const containerName = blobData.blobTicketContainer;
			const storagePath = info.fileName;
			const expiryTime = new Date();
			if (permission === 'c') {
				expiryTime.setUTCMinutes(expiryTime.getUTCMinutes() + info.type === FileTypeEnum.Image ? 1 : 4);
			} else {
				expiryTime.setHours(expiryTime.getHours() + 1); // Expiry after 1 hour
			}

			const blobSASSignatureValues: BlobSASSignatureValues = {
				containerName: containerName,
				blobName: storagePath,
				startsOn: now,
				permissions: BlobSASPermissions.parse(permission),
				protocol: SASProtocol.Https,
				expiresOn: expiryTime
			};
			const sasToken = generateBlobSASQueryParameters(blobSASSignatureValues, blobServiceClient.credential);
			// Generate blob token
			let data = '';
			if (permission === 'c') {
				const blobUrl = `${blobServiceClient.url}${containerName}/${storagePath}`;
				data = `${blobUrl}?${sasToken}`;
			} else {
				const sasToken = generateBlobSASQueryParameters(blobSASSignatureValues, blobServiceClient.credential);
				data = `${blobServiceClient.url}${containerName}/${storagePath}?${sasToken}`;
			}
			return createResponse(HttpStatus.OK, messages.S4, data);
		} catch (error: any) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR, claims.sid);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async updateProfile(claims: AtPayload, userInfo: UpdateProfileDto): Promise<AppResponse> {
		const userData: FetchUsersDto = { userId: claims.sub, categoryId: claims.category, active: true, pageId: 1, pageLimit: 10, search: '' };
		const res = await this._manageAccountTxn.fetchUsers(claims, userData, false);
		if (res.code !== HttpStatus.OK) return res;

		if (claims.role === UserCategoryEnum.Jointer && (userInfo?.joinerDetail?.document || userInfo?.joinerDetail?.deletedDocumentId)) {
			const documentCount = res?.data?.rows[0]?.[UserAlias.JointerInfo][JointerAlias.JointerDocument].filter(
				(document) => document[JointerDocumentColumns.DocType] === JointerDocType.Certification
			);

			const documentCountLength = documentCount?.length ?? 0;
			const newDocumentLength = userInfo?.joinerDetail?.document?.length ?? 0;
			const deletedDocumentLength = userInfo?.joinerDetail?.deletedDocumentId?.length ?? 0;
			const totalDocuments = documentCountLength + newDocumentLength - deletedDocumentLength;
			if (totalDocuments > 4) {
				return createResponse(HttpStatus.BAD_REQUEST, messageFactory(messages.W52, ['document', '4']));
			}

			if (userInfo?.joinerDetail?.deletedDocumentId) {
				const allDocumentId = documentCount.map((docId) => docId[JointerDocumentColumns.JointerDocGuid]);
				const deletedDocumentIds = userInfo.joinerDetail.deletedDocumentId;
				const missingDocumentIds = deletedDocumentIds.filter((id) => !allDocumentId.includes(id));
				if (missingDocumentIds.length > 0) {
					return createResponse(HttpStatus.BAD_REQUEST, messageFactory(messages.W1, ['deleted ID']));
				}
				for (const document of deletedDocumentIds) {
					const documentName = documentCount.filter((doc) => doc[JointerDocumentColumns.JointerDocGuid] === document);
					const res = await this.deleteFileFromBlob(documentName[0][JointerDocumentColumns.JointerDocName]);
					if (res.code !== HttpStatus.OK) return res;
				}
			}
		}
		if (userInfo?.Avatar) {
			if (res.data?.rows[0]?.[UserColumns.Avatar]) {
				const deleteResult = await this.deleteFileFromBlob(res.data?.rows[0]?.[UserColumns.Avatar]);
				if (deleteResult.code !== HttpStatus.OK) return deleteResult;
			}

			const blobName = `user/${claims.sub}/image/${unix_ts_now()}-${userInfo.Avatar[0].originalname}`;
			userInfo.joinerDetail.avatar = blobName;
			const uploadFile = await this.uploadFileToBlob(userInfo.Avatar, blobName);
			if (uploadFile.code !== HttpStatus.OK) return uploadFile;
		} else if (userInfo.joinerDetail.isDelete === true) {
			if (res.data?.rows[0]?.[UserColumns.Avatar]) {
				const deleteResult = await this.deleteFileFromBlob(res.data?.rows[0]?.[UserColumns.Avatar]);
				if (deleteResult.code !== HttpStatus.OK) return deleteResult;
			}
		}
		return await this._authTxn.updateProfile(claims, userInfo);
	}

	async myInfo(claims: AtPayload): Promise<AppResponse> {
		const userInfo: FetchUsersDto = { userId: claims.sub, categoryId: claims.category, active: true, pageId: 1, pageLimit: 10, search: '' };
		const res = await this._manageAccountTxn.fetchUsers(claims, userInfo, false);
		if (res.code !== HttpStatus.OK) return res;
		if (res.data?.rows[0]?.[UserColumns.Avatar]) {
			const sas = await this.fileUploadSas({ fileName: res?.data?.rows[0]?.[UserColumns.Avatar], type: FileTypeEnum.Image }, claims, 'r');
			res.data.SASToken = sas.data;
		}
		if (res?.data?.rows[0]?.[UserAlias.JointerInfo]?.[JointerAlias.JointerDocument]?.length > 0) {
			for (const document of res.data.rows[0][UserAlias.JointerInfo][JointerAlias.JointerDocument]) {
				if (document?.dataValues?.[JointerDocumentColumns.JointerDocName]) {
					const sas = await this.fileUploadSas(
						{ fileName: document?.dataValues[JointerDocumentColumns.JointerDocName], type: FileTypeEnum.Image },
						claims,
						'r'
					);
					document.dataValues.SASToken = sas.data;
				}
			}
		}
		delete res.data.count;
		return createResponse(HttpStatus.OK, messages.S4, res?.data);
	}

	async refreshToken(rtReq: RefreshTokenPrincipalDto): Promise<AppResponse> {
		const credRes = await this.settoken_meta();
		if (credRes.code !== 200) {
			return credRes;
		}
		const tokenMetadata = credRes.data;
		/*Verify refresh token */
		// if()
		const rtClaims = await this.verifyRefreshToken(rtReq.refreshToken, tokenMetadata);
		if (rtClaims.code !== HttpStatus.OK) return createResponse(HttpStatus.UNAUTHORIZED, messages.E3);
		/*Find user Session */
		const userSession = await this._authTxn.findSessionBySid(rtClaims.data);
		if (userSession.code !== HttpStatus.OK) return userSession;
		const userInfo = await this._authTxn.mobEmailExist({ emailId: rtClaims.data.username });
		if (userInfo.code !== HttpStatus.OK) return userInfo;
		if (!userInfo?.data?.[UserColumns.IsActive]) return createResponse(HttpStatus.BAD_REQUEST, messages.W11);
		const claimsInfo = { tokenMetadata, rtClaims: rtClaims.data, sessionInfo: userSession.data, userInfo: userInfo.data, rtReq };
		if (
			new Date(userInfo?.data?.[UserAlias.JointerInfo]?.[JointerInfoColumns.EffectiveFromUTC]) > new Date() ||
			new Date(userInfo?.data?.[UserAlias.JointerInfo]?.[JointerInfoColumns.EffectiveTillUTC]) < new Date()
		)
			return createResponse(HttpStatus.BAD_REQUEST, messages.W11);
		const role = await this._manageAccountTxn.getRoles([userSession?.data[SessionColumns.RoleId]]);
		if (role.code !== HttpStatus.OK) return role;
		return await this.validateRefreshToken(claimsInfo, role?.data[0][RoleColumns.RoleName]);
	}

	async validateRefreshToken(claimsInfo: any, role: string): Promise<AppResponse> {
		try {
			const { tokenMetadata, sessionInfo, userInfo, rtClaims, rtReq } = claimsInfo;
			const sid = rtClaims.sid;
			const atPayload: AtPayload = {
					sub: userInfo[UserColumns.UserGuid],
					role: role,
					sid: sid,
					username: userInfo[UserColumns.EmailId],
					name: userInfo[UserColumns.FullName],
					ip_address: rtClaims.ip,
					category: userInfo?.[UserColumns.CategoryId],
					city_id: userInfo?.[UserColumns.CityId],
					company_id: userInfo?.[UserColumns.companyId] ? userInfo?.[UserColumns.companyId] : null
				},
				accessToken = await this.AccessToken(atPayload, tokenMetadata);
			if (accessToken.code !== HttpStatus.OK) return accessToken;
			const sessionUpdateData = { [SessionColumns.SessionGuid]: rtClaims.sid };
			if (sessionInfo[SessionColumns.IpAddress] !== rtClaims?.ip) {
				sessionUpdateData[SessionColumns.IpAddress] = rtReq.ip;
			}
			sessionUpdateData[SessionColumns.EndsAtUTC] = new Date(
				Number(sessionInfo[SessionColumns.EndsAtUTC]) + parseInt(tokenMetadata.atExpiresIn, 10) * 60
			).toISOString();
			const resp = await this._authTxn.updateSession(sessionUpdateData);
			if (resp.code !== HttpStatus.OK) createResponse(HttpStatus.UNAUTHORIZED, messages.W4);

			const data = {
				accessToken: accessToken.data,
				exp: await this.parseJwt(accessToken.data).exp
			};
			return createResponse(HttpStatus.OK, messages.S4, data);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async verifyRefreshToken(refresh_token: string, tokenMetadata: any) {
		try {
			const tokenInfo = await this._jwtService.verifyAsync(refresh_token, {
				secret: tokenMetadata.appRtSecret,
				ignoreExpiration: true
			});
			return createResponse(HttpStatus.OK, messages.S4, tokenInfo);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async switchRole(claims: AtPayload, roles: SwitchRoleDto): Promise<AppResponse> {
		const res = await this._authTxn.fetchUserRoles(claims.sub);
		if (res.code !== HttpStatus.OK) return res;
		const roleExist = { roleName: '', roleExists: false };
		if (res.data) {
			await res?.data?.[UserAlias.UserRoles]?.map((role) => {
				if (role?.[UserRoleColumns.RoleId] === roles.roleId) {
					roleExist.roleExists = true;
					roleExist.roleName = role?.[UserRoleAlias.Role]?.[RoleColumns.RoleName];
				}
			});
			if (!roleExist.roleExists) return createResponse(HttpStatus.BAD_REQUEST, messages.W12);
		}
		const fetchSessionRes = await this._authTxn.findSessionBySid(claims);
		if (fetchSessionRes?.data?.dataValues?.[SessionColumns.RoleId] === roles.roleId) return createResponse(HttpStatus.BAD_REQUEST, messages.W54);
		if (fetchSessionRes?.data?.[SessionColumns.DeviceID] !== roles?.deviceId?.toString()) return createResponse(HttpStatus.BAD_REQUEST, messages.W21);
		const sessionRes = await this._authTxn.logoutSession(claims.sid);
		if (sessionRes.code !== HttpStatus.OK) return sessionRes;
		return this.generateAccessToken(res.data, roles.ip, roleExist.roleName, roles.agentType, roles.deviceId?.toString(), roles.roleId);
	}

	async setDefaultRole(claims: AtPayload, roles: SethDefaultRoleDto): Promise<AppResponse> {
		const res = await this._authTxn.setDefaultRole(claims, roles);
		if (res.code !== HttpStatus.OK) return res;
		return createResponse(HttpStatus.OK, messages.S7);
	}

	async logout(claims: AtPayload): Promise<AppResponse> {
		return await this._authTxn.logoutSession(claims.sid);
	}

	async sendOTPMessage(to: string, otp: string): Promise<AppResponse> {
		const messagesInfo = this._appConfigSvc.get('messages');
		const data = {
			to,
			type: 'template',
			template: {
				name: messagesInfo.otpTemplate,
				language: {
					code: 'en_GB'
				},
				components: [
					{
						type: 'body',
						parameters: [
							{
								type: 'text',
								text: otp
							}
						]
					},
					{
						type: 'button',
						sub_type: 'url',
						index: '0',
						parameters: [
							{
								type: 'text',
								text: otp
							}
						]
					}
				]
			}
		};
		const config = {
			method: 'POST',
			url: `${WhatsappEndPoint.sharedEndpoint}whatsapp-cloud/messages`,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${messagesInfo.accessToken}`
			},
			data
		};
		const res = await ext_api_call(config);
		if (res.status !== HttpStatus.OK) {
			this._loggerSvc.error(res?.data?.description, res.status);
			return createResponse(HttpStatus.BAD_REQUEST, res?.data?.description ? res?.data?.description : res?.data?.message);
		}
		return createResponse(HttpStatus.OK, messages.S4);
	}

	async logIn(userCred: LoginDto): Promise<AppResponse> {
		const res = await this._authTxn.mobEmailExist({ mobileNumber: userCred.mobileNo });
		if (res.code !== HttpStatus.OK) return res;
		if (!res.data) return createResponse(HttpStatus.BAD_REQUEST, messages.W10);
		if (res?.data) {
			const primaryMobileMatches = res.data[UserColumns.PrimaryMobileNo] === userCred.mobileNo;
			const secondaryMobileMatches = res.data[UserColumns.SecondaryMobileNo] === userCred.mobileNo;
			if (primaryMobileMatches && res.data[UserColumns.PrimaryCountryCodeId] !== userCred.countryCodeId) {
				return createResponse(HttpStatus.BAD_REQUEST, messageFactory(messages.W1, ['credential']));
			}
			if (secondaryMobileMatches && res.data[UserColumns.SecondaryCountryCodeId] !== userCred.countryCodeId) {
				return createResponse(HttpStatus.BAD_REQUEST, messageFactory(messages.W1, ['credential']));
			}
		}

		if (res?.data[UserColumns.IsActive] === false) return createResponse(HttpStatus.PARTIAL_CONTENT, messages.W11);
		const userExists = await this._authTxn.userSessionExists(res.data[UserColumns.UserGuid]);
		if (!userExists.data) {
			const resUser = await this._authTxn.updateFirstLogin(res.data[UserColumns.UserGuid]);
			if (resUser.code !== HttpStatus.OK) return resUser;
		}
		const otpValidityInMin = this._appConfigSvc.get('otpSvc').otpValidityInMin;
		const otpInfo = generateOTP(otpValidityInMin);
		const to = `${res.data[UserAlias.PrimaryCountryCodes][CountryCodeColumns.CountryCode]}${res.data[UserColumns.PrimaryMobileNo]}`;
		const otpData: IOTPRecord = {
			TxnGuid: uuidv4(),
			OTPSecret: otpInfo.secret,
			OTP: otpInfo.otp,
			Channel: OTPChannelTypeEnum.WhatsApp,
			IsVerified: false,
			Count: 1,
			OTPFor: OTPForEnum.Login,
			MessageContent: '',
			Provider: OTPProviderEnum.Twillio,
			UserGuid: res.data[UserColumns.UserGuid],
			CreatedBy: res.data[UserColumns.UserGuid],
			CreatedOnUTC: currentISODate(),
			IpAddress: userCred.ip,
			OTPExpireInMin: otpValidityInMin,
			OTPTo: to
		};
		const sendOTPMessage = await this.sendOTPMessage(to, otpInfo.otp);
		if (sendOTPMessage.code !== HttpStatus.OK) return sendOTPMessage;
		const OTPRes = await this._authTxn.createOTP(otpData);
		if (OTPRes.code !== HttpStatus.OK) return OTPRes;
		return createResponse(HttpStatus.OK, messageFactory(messages.S19, [res.data[UserColumns.PrimaryMobileNo]?.slice(-4)]), {
			id: otpInfo.secret,
			expInMin: otpValidityInMin
		});
		// return this.generateAccessToken(res.data, userCred.ip, '', userCred.agentType, userCred.deviceId);
	}

	async AccessTempToken(payload: any, tokenMetadata: any): Promise<AppResponse> {
		try {
			const token = await this._jwtService.signAsync(payload, {
				secret: tokenMetadata.appAtSecret,
				expiresIn: `${tokenMetadata.tempExpiryIn}m`
			});
			return createResponse(HttpStatus.OK, messages.S3, token);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E7);
		}
	}
	async AccessToken(payload: AtPayload, tokenMetadata: any): Promise<AppResponse> {
		try {
			const token = await this._jwtService.signAsync(payload, {
				secret: tokenMetadata.appAtSecret,
				expiresIn: `${tokenMetadata.atExpiresIn}m`
			});
			return createResponse(HttpStatus.OK, messages.S3, token);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E7);
		}
	}

	async settoken_meta(): Promise<AppResponse> {
		try {
			const tokenMetadata = this._appConfigSvc.get('tokenMetadata'),
				credMetaInfo = {
					atExpiresIn: tokenMetadata.web.at.expiresIn,
					rtExpiresIn: tokenMetadata.web.rt.expiresIn,
					maxTtl: tokenMetadata.web.rt.maxTtl,
					appAtSecret: tokenMetadata.appAtSecret,
					appRtSecret: tokenMetadata.appRtSecret,
					tempExpiryIn: tokenMetadata.web.tempAt.expiresIn
				};
			return createResponse(HttpStatus.OK, messages.S3, credMetaInfo);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E7);
		}
	}

	async generateAccessToken(
		userInfo: IUserModel,
		ip: string,
		roleName?: string,
		authType?: string,
		deviceId?: string,
		roleId?: number
	): Promise<AppResponse> {
		const credRes = await this.settoken_meta();
		if (credRes.code !== 200) return credRes;
		const tokenMetadata = credRes.data,
			sid = uuidv4(),
			atPayload: AtPayload = {
				sub: userInfo?.[UserColumns.UserGuid],
				role: roleName ? roleName : userInfo?.[UserAlias.Role]?.[RoleColumns.RoleName],
				sid: sid,
				username: userInfo?.[UserColumns.EmailId],
				name: userInfo?.[UserColumns.FullName],
				ip_address: ip,
				category: userInfo?.[UserColumns.CategoryId],
				city_id: userInfo?.[UserColumns.CityId],
				company_id: userInfo?.[UserColumns.companyId] ? userInfo?.[UserColumns.companyId] : null
			};

		/*Generate access token*/
		const accessTokenRes = await this.AccessToken(atPayload, tokenMetadata);
		if (accessTokenRes.code !== 200) return accessTokenRes;
		const access_token = accessTokenRes.data,
			rTpayload: RtPayload = {
				sub: userInfo?.[UserColumns.UserGuid],
				sid: sid,
				username: userInfo?.[UserColumns.EmailId],
				name: userInfo?.[UserColumns.FullName]
			};
		/*Generate refresh token*/
		const refreshTokenRes = await this.generateRefreshToken(rTpayload, tokenMetadata);
		if (refreshTokenRes.code !== 200) return refreshTokenRes;
		const refresh_token = refreshTokenRes.data,
			session: ISession = {
				SessionGuid: sid,
				UserGuid: userInfo?.[UserColumns.UserGuid],
				RoleId: roleId ?? userInfo?.[UserColumns.DefaultRole],
				StartsAtUTC: currentISODate(),
				EndsAtUTC: new Date(new Date().getTime() + parseInt(tokenMetadata.rtExpiresIn) * 60 * 1000).toISOString(),
				DeviceID: deviceId.toString(),
				AgentType: authType,
				IpAddress: ip,
				CreatedOnUTC: currentISODate()
			},
			signInRes = {
				access_token,
				refresh_token,
				exp: await this.parseJwt(access_token).exp,
				state: {
					deviceId
				}
			};

		const sessionRes = await this._authTxn.createSession(session);
		if (sessionRes.code !== 200) return sessionRes;
		return createResponse(HttpStatus.OK, messages.S4, signInRes);
	}

	async validateToken(token: string): Promise<AppResponse> {
		try {
			const tokenMetadata = this._appConfigSvc.get('tokenMetadata');
			const jwtRes = await this._jwtService.verifyAsync(token, {
				secret: tokenMetadata.appAtSecret
			});
			return createResponse(HttpStatus.OK, messages.S3, jwtRes);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.UNAUTHORIZED);
			return createResponse(HttpStatus.UNAUTHORIZED, messages.E3);
		}
	}

	parseJwt(token: string) {
		try {
			return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async generateRefreshToken(payload: RtPayload, tokenMetadata: any): Promise<AppResponse> {
		try {
			const refresh_token = await this._jwtService.signAsync(payload, {
				secret: tokenMetadata.appRtSecret,
				expiresIn: `${tokenMetadata.rtExpiresIn}m`
			});
			return createResponse(HttpStatus.OK, messages.S3, refresh_token);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async uploadFileToBlob(file: Express.Multer.File, blobName: string) {
		try {
			const blobData = this._appConfigSvc.get('blobStorage'),
				connString = blobData.blobAccountConnectionString,
				blobServiceClient = BlobServiceClient.fromConnectionString(connString),
				blobContainerClient = blobServiceClient.getContainerClient(blobData.blobTicketContainer),
				blobDir = blobName,
				blockBlobClient = blobContainerClient.getBlockBlobClient(blobDir),
				stream = new Readable({
					read() {
						this.push(file[0].buffer);
						this.push(null);
					}
				});
			await blockBlobClient.uploadStream(stream);
			return createResponse(HttpStatus.OK, messages.S4);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async deleteFileFromBlob(blobName: string) {
		try {
			const blobData = this._appConfigSvc.get('blobStorage');
			const connString = blobData.blobAccountConnectionString;
			const blobServiceClient = BlobServiceClient.fromConnectionString(connString);
			const blobContainerClient = blobServiceClient.getContainerClient(blobData.blobTicketContainer);

			const blobClient = blobContainerClient.getBlobClient(blobName);
			const checkDelete = await this.isImageExitBlobStorage(blobName);
			if ((await checkDelete?.data) === true) await blobClient.delete();

			return createResponse(HttpStatus.OK, messages.S4);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async isImageExitBlobStorage(imgName: string) {
		try {
			const blobData = this._appConfigSvc.get('blobStorage');
			const storageConnectionString = blobData.blobAccountConnectionString;
			const blobServiceClient = BlobServiceClient.fromConnectionString(storageConnectionString);
			const containerClient = blobServiceClient.getContainerClient(blobData.blobTicketContainer);
			const blobClient = containerClient.getBlobClient(imgName);
			const exists = await blobClient.exists();
			return createResponse(HttpStatus.OK, messages.S4, exists);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async verifyOTPLogin(otpInfo: VerifyOtpLoginDto): Promise<AppResponse> {
		const fetchOtpRes = await this._authTxn.fetchOtpInfo(otpInfo.id);
		if (fetchOtpRes.code !== HttpStatus.OK) return fetchOtpRes;
		if (fetchOtpRes.data[OTPColumns.IsVerified]) return createResponse(HttpStatus.BAD_REQUEST, messages.W59);
		const dummyInfo = this._appConfigSvc.get('dummyContact');
		if (fetchOtpRes.data[OTPColumns.OTPTo] === dummyInfo.dummyMobileNo && otpInfo.OTP === dummyInfo.dummyOtp) {
		} else {
			const isValid = authenticator.verify({ secret: otpInfo.id, token: otpInfo.OTP });
			if (!isValid) return createResponse(HttpStatus.BAD_REQUEST, messages.W57);
		}
		const otpData = {
			[OTPColumns.IsVerified]: true,
			[OTPColumns.ModifiedOnUTC]: currentISODate()
		};
		const updateOTP = await this._authTxn.updateOtpInfo(otpData, otpInfo.id);
		if (updateOTP.code !== HttpStatus.OK) return updateOTP;
		const res = await this._authTxn.fetchUserRoles(fetchOtpRes.data[OTPColumns.UserGuid]);
		return this.generateAccessToken(res.data, otpInfo.ip, '', otpInfo.agentType, otpInfo.deviceId);
	}

	async resendOTP(ip: string, id: string): Promise<AppResponse> {
		const fetchOtpRes = await this._authTxn.fetchOtpInfo(id);
		if (fetchOtpRes.code !== HttpStatus.OK) return createResponse(HttpStatus.BAD_REQUEST, messages.W59);
		if (fetchOtpRes.data[OTPColumns.IsVerified]) return createResponse(HttpStatus.BAD_REQUEST, messages.W59);
		const otpValidityInMin = this._appConfigSvc.get('otpSvc').otpValidityInMin;
		const otpInfo = generateOTP(otpValidityInMin);
		const sendOTPMessage = await this.sendOTPMessage(fetchOtpRes.data[OTPColumns.OTPTo], otpInfo.otp);
		if (sendOTPMessage.code !== HttpStatus.OK) return sendOTPMessage;
		const otpData = {
			[OTPColumns.OTP]: otpInfo.otp,
			[OTPColumns.OTPSecret]: otpInfo.secret,
			[OTPColumns.ModifiedOnUTC]: currentISODate(),
			[OTPColumns.Count]: Number(fetchOtpRes.data[OTPColumns.Count]) + 1
		};
		const otpRes = await this._authTxn.updateOtpInfo(otpData, id);
		if (otpRes.code !== HttpStatus.OK) return otpRes;
		return createResponse(HttpStatus.OK, messages.S20, {
			id: otpInfo.secret,
			expInMin: fetchOtpRes.data[OTPColumns.OTPExpireInMin]
		});
	}
}
