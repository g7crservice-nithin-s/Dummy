import { AppConfigService } from '@app/config/app-config.service';
import { RolesEnum } from '@app/core/enums/app-role.enum';
import { RegistrationEnum, UserCategoryEnum } from '@app/core/enums/reg-role.enum';
import { FileTypeEnum, JointerDocType } from '@app/core/enums/shared.enum';
import AppLogger from '@app/core/logger/app-logger';
import { AppMailService } from '@app/core/mail/mail.service';
import { unix_ts_now } from '@app/core/utils/timestamp-util';
import { DatabaseService } from '@app/database/database.service';
import { ManageAccountAbstractSqlDao } from '@app/database/mssql/abstract/manage-account.abstract';
import { CompanyGeographyInfoAlias } from '@app/database/mssql/models/company.company-geography-info.model';
import { CompanyAlias, CompanyColumns } from '@app/database/mssql/models/company.company.model';
import { CityColumns } from '@app/database/mssql/models/masters.city.model';
import { CountryCodeColumns } from '@app/database/mssql/models/masters.country-code.model';
import { ExpertiseLevelColumns } from '@app/database/mssql/models/masters.expertise-level.model';
import { ExpertiseTypeColumns } from '@app/database/mssql/models/masters.expertise-type.model';
import { JointerStatusColumns } from '@app/database/mssql/models/masters.jointer-status.model';
import { RoleColumns } from '@app/database/mssql/models/masters.roles.model';
import { CategoryColumns } from '@app/database/mssql/models/masters.user-category.model';
import { JointerDocumentColumns } from '@app/database/mssql/models/security.jointer-documen.model';
import { JointerAlias, JointerInfoColumns } from '@app/database/mssql/models/security.jointer-info.model';
import { UserRoleAlias, UserRoleColumns } from '@app/database/mssql/models/security.user-role.model';
import { UserAlias, UserColumns } from '@app/database/mssql/models/security.user.model';
import { AppResponse, createResponse } from '@app/shared/app-response.shared';
import { messageFactory, messages } from '@app/shared/messages.shared';
import { BlobSASPermissions, BlobSASSignatureValues, BlobServiceClient, SASProtocol, generateBlobSASQueryParameters } from '@azure/storage-blob';
import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { stringify } from 'csv-stringify';
import { Readable } from 'stream';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import { AtPayload } from '../auth/model/jwt-payload.model';
import {
	CompaniesDto,
	CreateCompanyDto,
	FetchCompaniesDto,
	FetchUsersDto,
	FileUploadSasDto,
	JointerRatingDto,
	JointerRegisterDto,
	RegisterDto,
	SupervisorDto,
	UpdateCompanyDto,
	UpdateJointerDto,
	UpdateUserDto
} from './dto/manage-account.dto';
import { ManageAccountAbstractSvc } from './manage-account.abstract';

const stringifyAsync: any = promisify(stringify);
@Injectable()
export class ManageAccountService implements ManageAccountAbstractSvc {
	private readonly _manageAccountTxn: ManageAccountAbstractSqlDao;

	constructor(
		readonly _dbSvc: DatabaseService,
		private readonly _loggerSvc: AppLogger,
		private readonly _appConfigSvc: AppConfigService,
		private readonly _jwtService: JwtService,
		private _mailService: AppMailService
	) {
		this._manageAccountTxn = _dbSvc.manageAccountSqlTxn;
	}

	async sendMail(userDetails: any, countryCode: any, roles: any, filePath: string, subject: string, claims: AtPayload): Promise<AppResponse> {
		try {
			const logInAccess = this._appConfigSvc.get('logInLink');
			const role = roles && Array.isArray(roles) ? roles.map((role: any) => role[RoleColumns.RoleName]).join(', ') : roles;
			const emailInfo = {
				filePath: filePath,
				replacements: {
					name: userDetails.name,
					mobile: `${countryCode.data[CountryCodeColumns.CountryCode]}${userDetails.mobileNo}`,
					role: role,
					access_your_account: logInAccess?.link,
					contactEmail: logInAccess?.contactMail
				},
				mailOptions: {
					to: userDetails.email,
					subject: subject,
					text: 'message'
				}
			};
			await this._mailService.sendEmail(emailInfo, claims);
			return createResponse(HttpStatus.OK, messages.S4);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR, claims.sid);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async updateCompany(companyInfo: UpdateCompanyDto, claims: AtPayload): Promise<AppResponse> {
		if (companyInfo?.companyName) {
			const checkExit = await this._manageAccountTxn.validateCompany(companyInfo?.companyName, companyInfo.companyId);
			if (checkExit.code !== HttpStatus.OK) return checkExit;
			if (checkExit?.data) return createResponse(HttpStatus.BAD_REQUEST, messages.W24);
		}
		if (companyInfo?.deletedCompanyProducts) {
			const deleteProduct = await this._manageAccountTxn.deleteProduct(companyInfo);
			if (deleteProduct.code !== HttpStatus.OK) return deleteProduct;
		}
		if (companyInfo?.productInfo?.length) {
			const subJointRes = await this._manageAccountTxn.fetchCompanyProduct(companyInfo);
			if (subJointRes.code !== HttpStatus.OK) return subJointRes;
		}
		if (companyInfo?.geographyInfo?.length) {
			const productRes = await this._manageAccountTxn.fetchCompanyGeoInfo(companyInfo);
			if (productRes.code !== HttpStatus.OK) return productRes;
		}

		return await this._manageAccountTxn.updateCompany(companyInfo, claims);
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

	async register(userCred: RegisterDto, claims: AtPayload): Promise<AppResponse> {
		try {
			const countryCode = await this._manageAccountTxn.fetchCountryCode(userCred?.userDetail?.primaryCountryCodeId);
			if (countryCode?.code !== HttpStatus.OK) return countryCode;
			if (userCred.userDetail.primaryMobileNumber === userCred?.userDetail?.secondaryMobileNumber)
				return createResponse(HttpStatus.BAD_REQUEST, messages.W29);
			const isCustomerRole = await this._manageAccountTxn.getCategoryRoleName(userCred.userDetail.categoryId);
			if (isCustomerRole.data === null || isCustomerRole.data === undefined) return createResponse(HttpStatus.BAD_REQUEST, messages.E2);
			if (isCustomerRole.data[CategoryColumns.CategoryName] === RegistrationEnum.RaychemRPG) userCred.userDetail.companyId = null;
			if (isCustomerRole.data[CategoryColumns.CategoryName] === RegistrationEnum.Customer && !userCred.userDetail.companyId)
				return createResponse(HttpStatus.BAD_REQUEST, messages.E18);

			const roles = await this._manageAccountTxn.getRoles(userCred.userDetail.roles);
			for (const role of roles.data) {
				if (role[RoleColumns.RoleName] === RegistrationEnum.Jointer) return createResponse(HttpStatus.BAD_REQUEST, messages.E15);
				if (role[RoleColumns.RoleName] === RolesEnum.Raychem_Super_Admin)
					return createResponse(HttpStatus.BAD_REQUEST, messageFactory(messages.E19, [`'${RolesEnum.Raychem_Super_Admin}'`]));
				if (claims.role === RolesEnum.Customer_Admin && role[RoleColumns.RoleName] === RolesEnum.Customer_Admin)
					return createResponse(HttpStatus.BAD_REQUEST, messageFactory(messages.E19, [`'${RolesEnum.Customer_Admin}'`]));
				if (role[RoleColumns.CategoryId] !== userCred.userDetail.categoryId) return createResponse(HttpStatus.BAD_REQUEST, messages.E16);
			}
			if (claims.company_id) {
				userCred.userDetail.companyId = claims.company_id;
			}

			const res = await this._manageAccountTxn.mobEmailExist({
				mobileNumber: userCred.userDetail.primaryMobileNumber,
				emailId: userCred.userDetail.emailId
			});
			if (res.code !== HttpStatus.OK) return res;
			const res1 = await this._manageAccountTxn.mobEmailExist({
				mobileNumber: userCred.userDetail.secondaryMobileNumber,
				emailId: userCred.userDetail.emailId
			});
			if (res1.code !== HttpStatus.OK) return res1;
			const uuid: string = uuidv4();
			if (userCred?.Avatar) {
				const blobName = `user/${uuid}/image/${unix_ts_now()}-${userCred.Avatar[0].originalname}`;
				userCred.userDetail.avatar = blobName;
				const uploadFile = await this.uploadFileToBlob(userCred.Avatar, blobName);
				if (uploadFile.code !== HttpStatus.OK) return uploadFile;
			}
			const registerRes = await this._manageAccountTxn.register(userCred, claims, uuid);
			if (registerRes.code !== HttpStatus.OK) return registerRes;

			const filePath = '../../core/mail/template/Invitation.html';
			const userDetails = {
				name: userCred?.userDetail?.name,
				mobileNo: userCred.userDetail.primaryMobileNumber,
				email: userCred?.userDetail?.emailId
			};
			await this.sendMail(userDetails, countryCode, roles?.data, filePath, messages.T1, claims);
			return registerRes;
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async uploadFileToBlob(file: Express.Multer.File, blobName: string, isCSV?: boolean) {
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
			if (isCSV) {
				const stream = new Readable({
					read() {
						this.push(file);
						this.push(null);
					}
				});

				await blockBlobClient.uploadStream(stream, 1, undefined, {
					blobHTTPHeaders: {
						blobContentType: 'text/csv'
					}
				});
			} else {
				await blockBlobClient.uploadStream(stream);
			}

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
			await blobClient.delete();

			return createResponse(HttpStatus.OK, messages.S4);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async jointerRegister(jointerCred: JointerRegisterDto, claims: AtPayload): Promise<AppResponse> {
		try {
			const countryCode = await this._manageAccountTxn.fetchCountryCode(jointerCred?.jointerDetail?.primaryCountryCodeId);
			if (countryCode?.code !== HttpStatus.OK) return countryCode;
			if (jointerCred?.jointerDetail?.primaryMobileNumber === jointerCred?.jointerDetail?.secondaryMobileNumber)
				return createResponse(HttpStatus.BAD_REQUEST, messages.W29);
			const uuid: string = uuidv4();
			if (jointerCred?.Avatar) {
				const blobName = `user/${uuid}/image/${unix_ts_now()}-${jointerCred.Avatar[0].originalname}`;
				jointerCred.jointerDetail.avatar = blobName;
				const uploadFile = await this.uploadFileToBlob(jointerCred.Avatar, blobName);
				if (uploadFile.code !== HttpStatus.OK) return uploadFile;
			}
			if (jointerCred?.Identification) {
				const blobName = `user/${uuid}/identification/${unix_ts_now()}-${jointerCred.Identification[0].originalname}`;
				jointerCred.jointerDetail.identification = blobName;
				const uploadFile = await this.uploadFileToBlob(jointerCred.Identification, blobName);
				if (uploadFile.code !== HttpStatus.OK) return uploadFile;
			}
			const primaryMobExist = await this._manageAccountTxn.mobEmailExist({
				mobileNumber: jointerCred.jointerDetail.primaryMobileNumber,
				emailId: jointerCred.jointerDetail.emailId
			});
			if (primaryMobExist.code !== HttpStatus.OK) return primaryMobExist;
			const secondaryMobileExist = await this._manageAccountTxn.mobEmailExist({
				mobileNumber: jointerCred.jointerDetail.secondaryMobileNumber,
				emailId: jointerCred.jointerDetail.emailId
			});
			if (secondaryMobileExist.code !== HttpStatus.OK) return secondaryMobileExist;
			const jointerRes = await this._manageAccountTxn.jointerRegister(jointerCred, uuid, claims);
			if (jointerRes.code !== HttpStatus.OK) return jointerRes;

			const filePath = '../../core/mail/template/Invitation.html';
			const userDetails = {
				name: jointerCred?.jointerDetail?.name,
				mobileNo: jointerCred.jointerDetail.primaryMobileNumber,
				email: jointerCred?.jointerDetail?.emailId
			};
			await this.sendMail(userDetails, countryCode, UserCategoryEnum.Jointer, filePath, messages.T2, claims);

			return createResponse(HttpStatus.OK, messages.S8);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}
	async fetchUsers(claims: AtPayload, UserInfo: FetchUsersDto): Promise<AppResponse> {
		const res = await this._manageAccountTxn.fetchUsers(claims, UserInfo, false);
		if (res.code !== HttpStatus.OK) return res;

		const updatedRows = [];
		for (const user of res.data.rows) {
			if (user?.[UserColumns.Avatar]) {
				const sas = await this.fileUploadSas({ fileName: user?.[UserColumns.Avatar], type: FileTypeEnum.Image }, claims, 'r');
				const updatedUser = { ...user.dataValues, SASToken: sas.data };
				updatedRows.push(updatedUser);
			} else {
				const updateUser = { ...user.dataValues };
				updatedRows.push(updateUser);
			}
		}
		res.data.rows = updatedRows;

		if (UserInfo.userId && res?.data?.rows[0]?.[UserAlias.JointerInfo]?.[JointerAlias.JointerDocument]?.length > 0) {
			for (const document of res?.data?.rows[0]?.[UserAlias.JointerInfo]?.[JointerAlias.JointerDocument]) {
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
		return res;
	}

	async registerCompany(companyInfo: CreateCompanyDto, claims: AtPayload): Promise<AppResponse> {
		const seenCombinations = new Set<string>();

		for (const info of companyInfo.geographyInfo) {
			const combination = `${info.cityId}-${info.divisionId}-${info.unitId}`;
			if (seenCombinations.has(combination)) {
				return createResponse(HttpStatus.BAD_REQUEST, messages.W32);
			}
			seenCombinations.add(combination);
		}
		const productCombination = new Set<string>();

		for (const info of companyInfo.productInfo) {
			const combination = `${info.productId}-${info.jointId}-${info.subJointId}-${info.subProductId}`;
			if (productCombination.has(combination)) {
				return createResponse(HttpStatus.BAD_REQUEST, messages.W46);
			}
			productCombination.add(combination);
		}
		return await this._manageAccountTxn.createCompany(companyInfo, claims);
	}

	async updateJointer(userInfo: UpdateJointerDto, claims: AtPayload): Promise<AppResponse> {
		const userData = await this._manageAccountTxn.fetchJointerInfo(userInfo.jointerDetail.userId);
		if (!userData.data) return createResponse(HttpStatus.BAD_REQUEST, messageFactory(messages.W1, ['User id']));
		if (userInfo?.Identification) {
			const blobName = `user/${userInfo.jointerDetail.userId}/identification/${unix_ts_now()}-${userInfo.Identification[0].originalname}`;
			userInfo.jointerDetail.identification = blobName;
			const uploadFile = await this.uploadFileToBlob(userInfo.Identification, blobName);
			if (uploadFile.code !== HttpStatus.OK) return uploadFile;
			const documentCount = userData?.data?.[UserAlias.JointerInfo][JointerAlias.JointerDocument].filter(
				(document) => document[JointerDocumentColumns.DocType] === JointerDocType.Identification
			);
			userInfo.jointerDetail.docTypeGuid = documentCount[0]?.[JointerDocumentColumns.JointerDocGuid];
			if (documentCount[0]?.[JointerDocumentColumns.JointerDocName]) {
				await this.deleteFileFromBlob(documentCount[0]?.[JointerDocumentColumns.JointerDocName]);
			}
		}
		if (userInfo?.Identification === null || userInfo?.Identification === undefined) {
			const documentCount = userData?.data?.[UserAlias.JointerInfo][JointerAlias.JointerDocument].filter(
				(document) => document[JointerDocumentColumns.DocType] === JointerDocType.Identification
			);
			userInfo.jointerDetail.docTypeGuid = documentCount[0]?.[JointerDocumentColumns.JointerDocGuid];
			if (documentCount[0]?.[JointerDocumentColumns.JointerDocName]) {
				await this.deleteFileFromBlob(documentCount[0]?.[JointerDocumentColumns.JointerDocName]);
			}
		}
		return await this._manageAccountTxn.updateJointer(userInfo, claims);
	}

	async jointerRating(jointerRating: JointerRatingDto, claims: AtPayload): Promise<AppResponse> {
		if (claims.role !== RolesEnum.Customer_Regional_Supervisors) return createResponse(HttpStatus.PARTIAL_CONTENT, messages.W55);
		const userData = await this._manageAccountTxn.fetchUserInfo(jointerRating.jointerId);
		if (userData.code !== HttpStatus.OK) return userData;
		if (!userData.data) return createResponse(HttpStatus.BAD_REQUEST, messageFactory(messages.W1, ['Jointer id']));
		const ratingExistRes = await this._manageAccountTxn.validateRating(jointerRating.jointerId, jointerRating.ticketGuid, claims);
		if (ratingExistRes.code !== HttpStatus.OK) return ratingExistRes;
		return await this._manageAccountTxn.jointerRating(jointerRating, claims);
	}

	async updateUser(userInfo: UpdateUserDto, claims: AtPayload): Promise<AppResponse> {
		if (userInfo?.userId === claims.sub) return createResponse(HttpStatus.BAD_REQUEST, messages.W53);
		if (userInfo?.active?.toString()) {
			return await this._manageAccountTxn.updateUserStatus(userInfo.userId, userInfo.active, claims);
		} else {
			const userData = await this._manageAccountTxn.fetchUserInfo(userInfo.userId);
			if (!userData.data) return createResponse(HttpStatus.BAD_REQUEST, messageFactory(messages.W1, ['User id']));
			const roles = await this._manageAccountTxn.getRolesByCategory({ categoryId: userData?.data?.[UserColumns.CategoryId] });
			const roleIdsInDatabase = roles.data.map((role) => role[RoleColumns.RoleId]);
			const rolesNotFound = userInfo.roles.filter((role) => !roleIdsInDatabase.includes(role));
			if (rolesNotFound.length > 0) {
				return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E21);
			}
			const rolesRes = await this._manageAccountTxn.getRoles(userInfo.roles);
			for (const role of rolesRes.data) {
				if (role[RoleColumns.RoleName] === RolesEnum.Raychem_Super_Admin) return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E20);
			}

			const uerRoles = userData.data?.[UserAlias.UserRoles]?.map((role) => role?.[UserRoleColumns.RoleId]),
				deletedRoles = uerRoles.filter((role) => !userInfo.roles.includes(role)),
				newRoles = userInfo.roles.filter((role) => !uerRoles.includes(role));
			const exist = deletedRoles.includes(userData?.data?.[UserColumns.DefaultRole]);

			return await this._manageAccountTxn.updateUserRoles(userInfo, newRoles, deletedRoles, claims, exist ? userInfo.roles[0] : null);
		}
	}

	async companies(companiesInfo: CompaniesDto, claims: AtPayload): Promise<AppResponse> {
		const res = await this._manageAccountTxn.companies(companiesInfo, claims);

		if (!res?.data?.length || res?.code !== HttpStatus.OK) return res;

		const modifiedResponse = [];
		res?.data[0]?.CompanyProduct?.forEach((item) => {
			const ProductId = item.Product.ProductId;
			const existingJoint = modifiedResponse.find((joint) => joint?.JointModel?.JointId === ProductId);
			if (existingJoint) {
				existingJoint.SubJoints.push({
					SubJointId: item.SubJoint.SubJointId,
					SubJointName: item.SubJoint.SubJointName,
					CompanyJointConfigGuid: item.CompanyJointConfigGuid
				});
			} else {
				modifiedResponse.push({
					JointModel: item.SubJoint.JointModel,
					SubJoints: [
						{
							SubJointId: item.SubJoint.SubJointId,
							SubJointName: item.SubJoint.SubJointName,
							CompanyJointConfigGuid: item.CompanyJointConfigGuid
						}
					]
				});
			}
		});

		return createResponse(HttpStatus.OK, messages.S4, res.data);
	}

	async companyData(companyInfo: FetchCompaniesDto): Promise<AppResponse> {
		const res = await this._manageAccountTxn.companyData(companyInfo);
		const count = res.data?.count;
		const data = res.data?.res?.map((company) => {
			const uniqueCities = {};
			const uniqueCityInfo = [];
			company[CompanyAlias.CompanyGeographyInfo].forEach((cityInfo: any) => {
				const cityId = cityInfo[CompanyGeographyInfoAlias.City][CityColumns.CityId];
				const cityName = cityInfo[CompanyGeographyInfoAlias.City][CityColumns.CityName];
				if (!uniqueCities[cityId]) {
					uniqueCities[cityId] = true;
					uniqueCityInfo.push({
						[CityColumns.CityName]: cityName,
						[CityColumns.CityId]: cityId
					});
				}
			});
			company[CompanyAlias.CompanyGeographyInfo] = uniqueCityInfo;
			return {
				[CompanyColumns.CompanyId]: company[CompanyColumns.CompanyId],
				[CompanyColumns.CompanyName]: company[CompanyColumns.CompanyName],
				[CompanyColumns.CreatedOnUTC]: company[CompanyColumns.CreatedOnUTC],
				[CompanyAlias.CompanyGeographyInfo]: uniqueCityInfo
			};
		});

		return createResponse(HttpStatus.OK, messages.S4, { data, count });
	}

	async fetchSupervisor(supervisorInfo: SupervisorDto, claims: AtPayload): Promise<AppResponse> {
		const res = await this._manageAccountTxn.fetchSupervisor(supervisorInfo);
		if (res.code !== HttpStatus.OK) return res;
		if (!res.data?.length) return res;

		const updatedRows = [];
		for (const user of res.data) {
			if (user?.[UserColumns.Avatar]) {
				const sas = await this.fileUploadSas({ fileName: user?.[UserColumns.Avatar], type: FileTypeEnum.Image }, claims, 'r');
				const updatedUser = { ...user.dataValues, SASToken: sas.data };
				updatedRows.push(updatedUser);
			} else {
				const updateUser = { ...user.dataValues };
				updatedRows.push(updateUser);
			}
		}
		res.data = updatedRows;
		return res;
	}

	async exportUser(userInfo: FetchUsersDto, claims: AtPayload): Promise<AppResponse> {
		const res = await this._manageAccountTxn.fetchUsers(claims, userInfo, true);

		const csvFields = [
			[
				'Sr. No',
				UserColumns.UserGuid,
				UserColumns.FullName,
				UserColumns.EmailId,
				UserColumns.PrimaryCountryCodeId,
				UserColumns.PrimaryMobileNo,
				UserColumns.SecondaryCountryCodeId,
				UserColumns.SecondaryMobileNo,
				RoleColumns.RoleName,
				CityColumns.CityName,
				UserColumns.CreatedOnUTC,
				UserColumns.IsActive,
				...(res?.data?.categoryRes[0]?.[CategoryColumns.CategoryName] === UserCategoryEnum.Jointer
					? [
							JointerInfoColumns.Designation,
							JointerInfoColumns.RaychemId,
							JointerInfoColumns.VendorName,
							JointerInfoColumns.Rating,
							JointerInfoColumns.TotalRating,
							ExpertiseLevelColumns.ExpertLevelName,
							ExpertiseTypeColumns.ExpertTypeName,
							JointerStatusColumns.JStatusName
						]
					: []),
				...(res?.data?.categoryRes[0]?.[CategoryColumns.CategoryName] === UserCategoryEnum.Customer ? [CompanyColumns.CompanyName] : [])
			]
		];

		// // Map the query results to CSV data
		res?.data?.rows?.map((user, index) => {
			const baseData: any = {
				'Sr. No': index + 1,
				[UserColumns.UserGuid]: user[UserColumns.UserGuid],
				[UserColumns.FullName]: user[UserColumns.FullName],
				[UserColumns.EmailId]: user[UserColumns.EmailId],
				[UserColumns.PrimaryCountryCodeId]: user[UserAlias.PrimaryCountryCodes]
					? user[UserAlias.PrimaryCountryCodes][CountryCodeColumns.CountryCode]
					: 'NA',
				[UserColumns.PrimaryMobileNo]: user[UserColumns.PrimaryMobileNo]?.toString(),
				[UserColumns.SecondaryCountryCodeId]: user[UserAlias.SecondaryCountryCode]
					? user[UserAlias.SecondaryCountryCode][CountryCodeColumns.CountryCode]
					: 'NA',
				[UserColumns.SecondaryMobileNo]: user[UserColumns.SecondaryMobileNo]?.toString(),
				[RoleColumns.RoleName]: user[UserAlias.UserRoles]?.map((role) => role[UserRoleAlias.Role][RoleColumns.RoleName])?.join(','),
				[CityColumns.CityName]: user[UserAlias.City] ? user[UserAlias.City][CityColumns.CityName] : 'NA',
				[UserColumns.CreatedOnUTC]: user[UserColumns.CreatedOnUTC].toLocaleString(),
				[UserColumns.IsActive]: user[UserColumns.IsActive] ? 'true' : 'false'
			};

			if (res?.data?.categoryRes[0]?.[CategoryColumns.CategoryName] === UserCategoryEnum.Jointer) {
				baseData[JointerInfoColumns.Designation] = user[UserAlias.JointerInfo][JointerInfoColumns.Designation] || 'NA';
				baseData[JointerInfoColumns.RaychemId] = user[UserAlias.JointerInfo][JointerInfoColumns.RaychemId] || 'NA';
				baseData[JointerInfoColumns.VendorName] = user[UserAlias.JointerInfo][JointerInfoColumns.VendorName] || 'NA';
				baseData[JointerInfoColumns.Rating] = user[UserAlias.JointerInfo][JointerInfoColumns.Rating] || 'NA';
				baseData[JointerInfoColumns.TotalRating] = user[UserAlias.JointerInfo][JointerInfoColumns.TotalRating] || 'NA';
				baseData[ExpertiseLevelColumns.ExpertLevelName] =
					user[UserAlias.JointerInfo][JointerAlias.ExpertiseLevel][ExpertiseLevelColumns.ExpertLevelName] || 'NA';
				baseData[ExpertiseTypeColumns.ExpertTypeName] =
					user[UserAlias.JointerInfo][JointerAlias.ExpertiseType][ExpertiseTypeColumns.ExpertTypeName] || 'NA';
				baseData[JointerStatusColumns.JStatusName] =
					user[UserAlias.JointerInfo][JointerAlias.JointerStatus][JointerStatusColumns.JStatusName] || 'NA';
			}
			if (res?.data?.categoryRes[0]?.[CategoryColumns.CategoryName] === UserCategoryEnum.Customer) {
				baseData[CompanyColumns.CompanyName] = user[UserAlias.Company]?.[CompanyColumns.CompanyName] || 'NA';
			}
			const arr: any = Object.values(baseData);
			csvFields.push(arr);
		});
		const stringifyData = await stringifyAsync(csvFields);
		const blobName = `Dashboard/users/Users-${new Date().toISOString()}.csv`;
		const uploadFile = await this.uploadFileToBlob(stringifyData, blobName, true);
		if (uploadFile.code !== HttpStatus.OK) return uploadFile;
		const sas = await this.fileUploadSas({ fileName: blobName, type: FileTypeEnum.Document }, claims, 'r');
		if (sas.code !== HttpStatus.OK) return sas;
		return createResponse(HttpStatus.OK, messages.S4, sas?.data);
	}

	async deleteCsvBlobData(claims: AtPayload): Promise<AppResponse> {
		try {
			const blobData = this._appConfigSvc.get('blobStorage');
			const connString = blobData.blobAccountConnectionString;
			const blobServiceClient = BlobServiceClient.fromConnectionString(connString);
			const blobContainerClient = blobServiceClient.getContainerClient(blobData.blobTicketContainer);
			const folderPrefix = 'Dashboard/';

			const blobsToDelete = [];
			const iterator = blobContainerClient.listBlobsFlat({ prefix: folderPrefix });
			for await (const blob of iterator) {
				blobsToDelete.push(blob.name);
			}

			await Promise.all(blobsToDelete.map((blobName) => blobContainerClient.deleteBlob(blobName)));

			return createResponse(HttpStatus.OK, messages.S18);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR, claims.sid);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}
}
