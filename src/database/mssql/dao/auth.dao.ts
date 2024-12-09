import { JointerDocType, UpdateType } from '@app/core/enums/shared.enum';
import AppLogger from '@app/core/logger/app-logger';
import { SethDefaultRoleDto, UpdateProfileDto } from '@app/modules/auth/dto/auth.dto';
import { AtPayload } from '@app/modules/auth/model/jwt-payload.model';
import { ISession } from '@app/modules/auth/model/session.model';
import { AppResponse, createResponse } from '@app/shared/app-response.shared';
import { messageFactory, messages } from '@app/shared/messages.shared';
import { currentISODate } from '@app/shared/shared.function';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Op, Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { AuthAbstractSqlDao } from '../abstract/auth.abstract';
import { MsSqlConstants } from '../connection/constants.mssql';
import { SessionColumns, SessionModel } from '../models/logs.session.model';
import { CountryCodeColumns, CountryCodeModel } from '../models/masters.country-code.model';
import { RoleColumns, RoleModel } from '../models/masters.roles.model';
import { JointerDocumentColumns, JointerDocumentModel } from '../models/security.jointer-documen.model';
import { JointerInfoColumns, JointerModel } from '../models/security.jointer-info.model';
import { UserRoleAlias, UserRoleColumns, UserRoleModel } from '../models/security.user-role.model';
import { UserAlias, UserColumns, UserModel } from '../models/security.user.model';
import { UserCategoryEnum } from '@app/core/enums/reg-role.enum';
import { IOTPRecord } from '@app/modules/auth/model/userModel';
import { OTPColumns, OTPModel } from '../models/security.otp-records.model';

@Injectable()
export class AuthSqlDao implements AuthAbstractSqlDao {
	constructor(
		readonly _loggerSvc: AppLogger,
		@Inject(MsSqlConstants.SEQUELIZE_PROVIDER) private _sequelize: Sequelize,
		@Inject(MsSqlConstants.USER) private _userModel: typeof UserModel,
		@Inject(MsSqlConstants.USER_ROLE) private _userRolesModel: typeof UserRoleModel,
		@Inject(MsSqlConstants.ROLE) private _rolesModel: typeof RoleModel,
		@Inject(MsSqlConstants.SESSION) private _sessionModel: typeof SessionModel,
		@Inject(MsSqlConstants.SECURITY_OTP_RECORDS) private _OTPModel: typeof OTPModel,
		@Inject(MsSqlConstants.JOINTER) private _jointerInfoModel: typeof JointerModel,
		@Inject(MsSqlConstants.COUNTRY_CODE) private _countryCodeModel: typeof CountryCodeModel,
		@Inject(MsSqlConstants.JOINTER_DOCUMENT) private _jointerDocumentModel: typeof JointerDocumentModel
	) {}

	async fetchCountyCode(countryCodeId: number): Promise<AppResponse> {
		const res = await this._countryCodeModel.findOne({ where: { [CountryCodeColumns.CountryCodeId]: countryCodeId } });
		if (!res) return createResponse(HttpStatus.BAD_REQUEST, messageFactory(messages.W1, ['country code']));
		return createResponse(HttpStatus.OK, messages.S4, res);
	}

	async validateUserMob(claims: AtPayload, mob?: string, emailId?: string): Promise<AppResponse> {
		const res = await this._userModel.findOne({
			attributes: [UserColumns.UserGuid],
			where: {
				[Op.or]: {
					[UserColumns.PrimaryMobileNo]: mob,
					[UserColumns.SecondaryMobileNo]: mob,
					[UserColumns.EmailId]: emailId
				},
				[UserColumns.UserGuid]: { [Op.notIn]: [claims.sub] }
			}
		});
		return createResponse(HttpStatus.OK, messages.S4, res);
	}

	async updateProfile(claims: AtPayload, userInfo: UpdateProfileDto): Promise<AppResponse> {
		const transaction = await this._sequelize.transaction();
		try {
			const obj = {
				[UserColumns.FullName]: userInfo.joinerDetail.name
			};
			if (userInfo.joinerDetail.avatar) {
				obj[UserColumns.Avatar] = userInfo.joinerDetail.avatar;
			}

			if (claims.role === UserCategoryEnum.Jointer && userInfo.joinerDetail.document) {
				const documents = userInfo.joinerDetail.document.map((document) => ({
					[JointerDocumentColumns.JointerDocGuid]: uuidv4(),
					[JointerDocumentColumns.UserGuid]: claims.sub,
					[JointerDocumentColumns.DocType]: JointerDocType.Certification,
					[JointerDocumentColumns.JointerDocName]: document,
					[JointerDocumentColumns.CreatedBy]: claims.sub,
					[JointerDocumentColumns.CreatedOnUTC]: currentISODate()
				}));

				await this._jointerDocumentModel.bulkCreate(documents, { transaction: transaction });
			}
			if (claims.role === UserCategoryEnum.Jointer && userInfo.joinerDetail.deletedDocumentId?.length > 0) {
				await this._jointerDocumentModel.destroy({
					where: { [JointerDocumentColumns.JointerDocGuid]: { [Op.in]: userInfo.joinerDetail.deletedDocumentId } },
					transaction: transaction
				});
			}
			await this._userModel.update({ ...obj }, { where: { [UserColumns.UserGuid]: claims.sub }, transaction: transaction });
			transaction.commit();
			return createResponse(HttpStatus.OK, messages.S9);
		} catch (error) {
			if (transaction) {
				transaction.rollback();
			}
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR, claims.sid);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async updateProfileByOTP(claims: any): Promise<AppResponse> {
		const transaction = await this._sequelize.transaction();
		try {
			const obj = {};
			if (claims?.updateType == UpdateType.PrimaryMobileNo) {
				obj[UserColumns.PrimaryCountryCodeId] = claims?.countryCode;
				obj[UserColumns.PrimaryMobileNo] = claims?.mobileNo;
			} else if (claims?.updateType == UpdateType.SecondaryMobileNo) {
				obj[UserColumns.SecondaryCountryCodeId] = claims?.countryCode;
				obj[UserColumns.SecondaryMobileNo] = claims?.mobileNo;
			} else {
				obj[UserColumns.EmailId] = claims?.email;
			}

			await this._userModel.update({ ...obj }, { where: { [UserColumns.UserGuid]: claims.id }, transaction: transaction });
			transaction.commit();
			return createResponse(HttpStatus.OK, messages.S9);
		} catch (error) {
			if (transaction) {
				transaction.rollback();
			}
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR, claims.id);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async updateSession(sessionInfo: any): Promise<AppResponse> {
		const transaction = await this._sequelize.transaction();
		try {
			await this._sessionModel.update(
				{ [SessionColumns.IpAddress]: sessionInfo?.[SessionColumns.IpAddress], [SessionColumns.EndsAtUTC]: sessionInfo?.[SessionColumns.EndsAtUTC] },
				{ where: { [SessionColumns.SessionGuid]: sessionInfo?.[SessionColumns.SessionGuid] }, transaction: transaction }
			);
			transaction.commit();
			return createResponse(HttpStatus.OK, messages.S4);
		} catch (error) {
			if (transaction) {
				transaction.rollback();
			}
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async findSessionBySid(claims: AtPayload): Promise<AppResponse> {
		const res = await this._sessionModel.findOne({ where: { [SessionColumns.SessionGuid]: claims.sid, [SessionColumns.UserGuid]: claims.sub } });
		if (!res) return createResponse(HttpStatus.UNAUTHORIZED, messages.E3);
		return createResponse(HttpStatus.OK, messages.S4, res);
	}

	async updateFirstLogin(userGuid: string): Promise<AppResponse> {
		const transaction = await this._sequelize.transaction();
		try {
			await this._userModel.update(
				{ [UserColumns.FirstLoggedInOnUTC]: new Date().toISOString() },
				{
					where: {
						[UserColumns.UserGuid]: userGuid
					},
					transaction: transaction
				}
			);
			transaction.commit();
			return createResponse(HttpStatus.OK, messages.S4);
		} catch (error) {
			if (transaction) {
				transaction.rollback();
			}
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async userSessionExists(userGuid: string): Promise<AppResponse> {
		const exists = await this._sessionModel.findOne({
			attributes: [SessionColumns.SessionGuid],
			where: {
				[UserColumns.UserGuid]: userGuid
			}
		});
		return createResponse(HttpStatus.OK, messages.S4, exists);
	}

	async countryCodeExists(countryCode: number): Promise<AppResponse> {
		const exists = await this._countryCodeModel.findOne({
			attributes: [CountryCodeColumns.CountryCodeId],
			where: {
				[CountryCodeColumns.CountryCodeId]: countryCode
			}
		});
		return createResponse(HttpStatus.OK, messages.S4, exists);
	}

	async userExists(userGuid: string): Promise<AppResponse> {
		const exists = await this._userModel.findOne({
			attributes: [UserColumns.PrimaryMobileNo, UserColumns.SecondaryMobileNo, UserColumns.EmailId],
			where: {
				[UserColumns.UserGuid]: userGuid
			},
			include: [
				{
					model: this._countryCodeModel,
					as: UserAlias.PrimaryCountryCodes,
					attributes: [CountryCodeColumns.CountryCode, CountryCodeColumns.CountryCodeId]
				}
			]
		});
		return createResponse(HttpStatus.OK, messages.S4, exists);
	}

	async setDefaultRole(claims: AtPayload, roles: SethDefaultRoleDto): Promise<AppResponse> {
		const transaction = await this._sequelize.transaction();
		try {
			const res = await this.fetchUserRoles(claims.sub);
			if (!res.data) return createResponse(HttpStatus.BAD_REQUEST, messages.W15);
			if (res.data) {
				const roleExist = await res?.data?.[UserAlias.UserRoles]?.filter((role) => role?.[UserRoleColumns.RoleId] === roles.roleId);
				if (!roleExist?.length) return createResponse(HttpStatus.BAD_REQUEST, messages.W12);
			}
			await this._userModel.update(
				{ [UserColumns.DefaultRole]: roles.roleId },
				{ where: { [UserColumns.UserGuid]: claims.sub }, transaction: transaction }
			);
			transaction.commit();
			return createResponse(HttpStatus.OK, messages.S4);
		} catch (error) {
			if (transaction) {
				transaction.rollback();
			}
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async fetchUserRoles(UserGuid: string): Promise<AppResponse> {
		const res = await this._userModel.findOne({
			where: { [UserColumns.UserGuid]: UserGuid, [UserColumns.IsActive]: true },
			include: [
				{
					model: this._userRolesModel,
					as: UserAlias.UserRoles,
					attributes: [UserRoleColumns.RoleId],
					where: {
						[UserRoleColumns.EffectiveFromUTC]: { [Op.lt]: currentISODate() },
						[UserRoleColumns.EffectiveTillUTC]: { [Op.gt]: currentISODate() }
					},
					include: [{ model: this._rolesModel, as: UserRoleAlias.Role, attributes: [RoleColumns.RoleId, RoleColumns.RoleName] }]
				},
				{ model: this._rolesModel, as: UserAlias.Role, attributes: [RoleColumns.RoleId, RoleColumns.RoleName] }
			]
		});
		return createResponse(HttpStatus.OK, messages.S4, res);
	}

	async logoutSession(sessionId: string): Promise<AppResponse> {
		const transaction = await this._sequelize.transaction();
		try {
			await this._sessionModel.update(
				{ [SessionColumns.EndsAtUTC]: currentISODate() },
				{ where: { [SessionColumns.SessionGuid]: sessionId }, transaction: transaction }
			);
			transaction.commit();
			return createResponse(HttpStatus.OK, messages.S6);
		} catch (error) {
			if (transaction) {
				transaction.rollback();
			}
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async createSession(session: ISession): Promise<AppResponse> {
		const transaction = await this._sequelize.transaction();
		try {
			await this._sessionModel.create(session);
			transaction.commit();
			return createResponse(HttpStatus.OK, messages.S4);
		} catch (error) {
			if (transaction) {
				transaction.rollback();
			}
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async mobEmailExist(info: any): Promise<AppResponse> {
		let filter = {};
		if (info.mobileNumber && info.emailId) {
			filter = {
				[Op.or]: {
					[UserColumns.PrimaryMobileNo]: info.mobileNumber,
					[UserColumns.SecondaryMobileNo]: info.mobileNumber,
					[UserColumns.EmailId]: info.emailId
				}
			};
		} else if (info.mobileNumber)
			filter = {
				[Op.or]: {
					[UserColumns.PrimaryMobileNo]: info.mobileNumber,
					[UserColumns.SecondaryMobileNo]: info.mobileNumber
				}
			};
		else if (info.emailId) filter = { [UserColumns.EmailId]: info.emailId };
		const res = await this._userModel.findOne({
			where: { ...filter },
			include: [
				{ model: this._rolesModel, as: UserAlias.Role, attributes: [RoleColumns.RoleId, RoleColumns.RoleName] },
				{
					model: this._jointerInfoModel,
					as: UserAlias.JointerInfo,
					attributes: [JointerInfoColumns.EffectiveFromUTC, JointerInfoColumns.EffectiveTillUTC]
				},
				{
					model: this._countryCodeModel,
					as: UserAlias.PrimaryCountryCodes,
					attributes: [CountryCodeColumns.CountryCode, CountryCodeColumns.CountryCodeId]
				}
			]
		});
		if (info.emailId && info.mobileNumber) {
			if (res) {
				if (res[UserColumns.PrimaryMobileNo] === info.mobileNumber)
					return createResponse(HttpStatus.PARTIAL_CONTENT, messageFactory(messages.W8, [res[UserColumns.PrimaryMobileNo]]));
				if (res[UserColumns.EmailId] === info.emailId) return createResponse(HttpStatus.PARTIAL_CONTENT, messages.W9);
			}
		}
		return createResponse(HttpStatus.OK, messages.S4, res);
	}

	async getRoles(rolesIds: any): Promise<AppResponse> {
		try {
			const res = await this._rolesModel.findAll({
				where: {
					[RoleColumns.RoleId]: { [Op.in]: rolesIds }
				}
			});
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async createOTP(OTPData: IOTPRecord): Promise<AppResponse> {
		const transaction = await this._sequelize.transaction();
		try {
			await this._OTPModel.create(OTPData, { transaction: transaction });
			transaction.commit();
			return createResponse(HttpStatus.OK, messages.S4);
		} catch (error) {
			if (transaction) {
				transaction.rollback();
			}
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async fetchOtpInfo(OTPSecret: string): Promise<AppResponse> {
		try {
			const res = await this._OTPModel.findOne({ where: { [OTPColumns.OTPSecret]: OTPSecret } });
			if (!res) return createResponse(HttpStatus.BAD_REQUEST, messages.W57);
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async updateOtpInfo(OTPInfo: any, OTPSecret: string): Promise<AppResponse> {
		const transaction = await this._sequelize.transaction();
		try {
			await this._OTPModel.update({ ...OTPInfo }, { where: { [OTPColumns.OTPSecret]: OTPSecret }, transaction: transaction });
			transaction.commit();
			return createResponse(HttpStatus.OK, messages.S4);
		} catch (error) {
			if (transaction) {
				transaction.rollback();
			}
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}
}
