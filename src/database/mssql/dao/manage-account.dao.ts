import { RolesEnum } from '@app/core/enums/app-role.enum';
import { UserCategoryEnum } from '@app/core/enums/reg-role.enum';
import AppLogger from '@app/core/logger/app-logger';
import { AtPayload } from '@app/modules/auth/model/jwt-payload.model';
import {
	CategoryIdDto,
	CompaniesDto,
	CreateCompanyDto,
	FetchCompaniesDto,
	FetchUsersDto,
	JointerRatingDto,
	JointerRegisterDto,
	RegisterDto,
	SethDefaultRoleDto,
	SupervisorDto,
	UpdateCompanyDto,
	UpdateJointerDto,
	UpdateUserDto
} from '@app/modules/manage-account/dto/manage-account.dto';
import { AppResponse, createResponse } from '@app/shared/app-response.shared';
import { messageFactory, messages } from '@app/shared/messages.shared';
import { currentISODate, maxISODate } from '@app/shared/shared.function';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Op, Sequelize, col, fn } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { ManageAccountAbstractSqlDao } from '../abstract/manage-account.abstract';
import { MsSqlConstants } from '../connection/constants.mssql';
import { CompanyJointConfigModel } from '../models/company.company-Joint-config.model';
import { CompanyGeographyInfoAlias, CompanyGeographyInfoColumns, CompanyGeographyInfoModel } from '../models/company.company-geography-info.model';
import { CompanyProductAlias, CompanyProductColumns, CompanyProductModel } from '../models/company.company-product.model';
import { CompanyAlias, CompanyColumns, CompanyModel } from '../models/company.company.model';
import { EmailColumns, EmailModel } from '../models/logs.emails.model';
import { SessionModel } from '../models/logs.session.model';
import { JointerCategoryColumns, JointerCategoryModel } from '../models/master.jointer-category.model';
import { CityColumns, CityModel } from '../models/masters.city.model';
import { CountryCodeColumns, CountryCodeModel } from '../models/masters.country-code.model';
import { DivisionColumns, DivisionModel } from '../models/masters.division.model';
import { ExpertiseLevelColumns, ExpertiseLevelModel } from '../models/masters.expertise-level.model';
import { ExpertiseTypeColumns, ExpertiseTypeModel } from '../models/masters.expertise-type.model';
import { JointColumns, JointModel } from '../models/masters.joint.model';
import { JointerStatusColumns, JointerStatusModel } from '../models/masters.jointer-status.model';
import { ProductColumns, ProductModel } from '../models/masters.product.model';
import { RoleColumns, RoleModel } from '../models/masters.roles.model';
import { SubJointColumns, SubJointModel } from '../models/masters.sub-joint.model';
import { SubProductColumns, SubProductModel } from '../models/masters.sub-product.model';
import { UnitColumns, UnitModel } from '../models/masters.unit.model';
import { CategoryColumns, CategoryModel } from '../models/masters.user-category.model';
import { JointerDocumentColumns, JointerDocumentModel } from '../models/security.jointer-documen.model';
import { JointerAlias, JointerInfoColumns, JointerModel } from '../models/security.jointer-info.model';
import { JointerRatingColumns, JointerRatingModel } from '../models/security.jointer-rating.model';
import { UserRoleAlias, UserRoleColumns, UserRoleModel } from '../models/security.user-role.model';
import { UserAlias, UserColumns, UserModel } from '../models/security.user.model';
import { TicketColumns, TicketModel } from '../models/ticket.ticket.model';
import { TicketAssignColumns, TicketAssignModel } from '../models/tickets.ticket-assign.model';
import { TicketStatusEnum } from '@app/core/enums/ticket-status.enum';
import { JointerDocType } from '@app/core/enums/shared.enum';

@Injectable()
export class ManageAccountSqlDao implements ManageAccountAbstractSqlDao {
	constructor(
		readonly _loggerSvc: AppLogger,
		@Inject(MsSqlConstants.SEQUELIZE_PROVIDER) private _sequelize: Sequelize,
		@Inject(MsSqlConstants.USER) private _userModel: typeof UserModel,
		@Inject(MsSqlConstants.EXPERTISE_LEVEL) private _expertiseLevelModel: typeof ExpertiseLevelModel,
		@Inject(MsSqlConstants.EXPERTISE_TYPE) private _expertiseTypeModel: typeof ExpertiseTypeModel,
		@Inject(MsSqlConstants.STATUS) private _statusModel: typeof JointerStatusModel,
		@Inject(MsSqlConstants.USER_ROLE) private _userRolesModel: typeof UserRoleModel,
		@Inject(MsSqlConstants.ROLE) private _rolesModel: typeof RoleModel,
		@Inject(MsSqlConstants.SESSION) private _sessionModel: typeof SessionModel,
		@Inject(MsSqlConstants.CATEGORY) private _categoryModel: typeof CategoryModel,
		@Inject(MsSqlConstants.CUSTOMER_COMPANY) private _companyModel: typeof CompanyModel,
		@Inject(MsSqlConstants.JOINTER) private _jointerInfoModel: typeof JointerModel,
		@Inject(MsSqlConstants.COUNTRY_CODE) private _countryCodeModel: typeof CountryCodeModel,
		@Inject(MsSqlConstants.COMPANY_JOINT_CONFIG) private _companyJointConfigModel: typeof CompanyJointConfigModel,
		@Inject(MsSqlConstants.COMPANY_GEOGRAPHY_INFO) private _companyGeographyInfoModel: typeof CompanyGeographyInfoModel,
		@Inject(MsSqlConstants.UNIT) private _unitModel: typeof UnitModel,
		@Inject(MsSqlConstants.CITY) private _cityModel: typeof CityModel,
		@Inject(MsSqlConstants.DIVISION) private _divisionModel: typeof DivisionModel,
		@Inject(MsSqlConstants.SUB_JOINT) private _subJointModel: typeof SubJointModel,
		@Inject(MsSqlConstants.COMPANY_PRODUCT) private _companyProduct: typeof CompanyProductModel,
		@Inject(MsSqlConstants.SUB_PRODUCT_CATEGORY) private _subProductModel: typeof SubProductModel,
		@Inject(MsSqlConstants.PRODUCT_CATEGORY) private _productModel: typeof ProductModel,
		@Inject(MsSqlConstants.JOINTER_RATING) private _jointerRatingModel: typeof JointerRatingModel,
		@Inject(MsSqlConstants.JOB_ASSIGN) private _ticketAssignModel: typeof TicketAssignModel,
		@Inject(MsSqlConstants.TICKET) private _ticketModel: typeof TicketModel,
		@Inject(MsSqlConstants.JOINT) private _jointModel: typeof JointModel,
		@Inject(MsSqlConstants.EMAIL) private _emailModel: typeof EmailModel,
		@Inject(MsSqlConstants.JOINTER_CATEGORY) private _jointerCategoryModel: typeof JointerCategoryModel,
		@Inject(MsSqlConstants.JOINTER_DOCUMENT) private _jointerDocumentModel: typeof JointerDocumentModel
	) {}

	async validateRating(jointerId: string, ticketGuid: string, claims: AtPayload): Promise<AppResponse> {
		const isJointerAssign = await this._ticketAssignModel.findOne({
			attributes: [TicketAssignColumns.TicketGuid],
			where: {
				[TicketAssignColumns.UserGuid]: jointerId,
				[TicketAssignColumns.TicketGuid]: ticketGuid
			}
		});
		if (!isJointerAssign) return createResponse(HttpStatus.BAD_REQUEST, messages.W45);
		const res = await this._jointerRatingModel.findOne({
			attributes: [JointerRatingColumns.RatingGuid],
			where: {
				[JointerRatingColumns.CreatedBy]: claims.sub,
				[JointerRatingColumns.UserGuid]: jointerId,
				[JointerRatingColumns.TicketGuid]: ticketGuid
			}
		});
		if (res) return createResponse(HttpStatus.BAD_REQUEST, messages.W43);
		return createResponse(HttpStatus.OK, messages.S4);
	}

	async fetchCompanyGeoInfo(companyInfo: UpdateCompanyDto): Promise<AppResponse> {
		for (const config of companyInfo.geographyInfo) {
			const res = await this._companyGeographyInfoModel.findOne({
				attributes: [CompanyGeographyInfoColumns.CompanyGeographyGuid],
				where: {
					[CompanyGeographyInfoColumns.EffectiveFromUTC]: { [Op.lte]: currentISODate() },
					[CompanyGeographyInfoColumns.EffectiveTillUTC]: { [Op.gt]: currentISODate() },
					[CompanyGeographyInfoColumns.CompanyId]: companyInfo.companyId,
					[CompanyGeographyInfoColumns.CityId]: config.cityId,
					[CompanyGeographyInfoColumns.DivisionId]: config.divisionId,
					[CompanyGeographyInfoColumns.UnitId]: config.unitId
				}
			});
			if (res) return createResponse(HttpStatus.BAD_REQUEST, messageFactory(messages.W47, ['city, division, and unit']));
		}
		return createResponse(HttpStatus.OK, messages.S4);
	}

	async deleteProduct(companyInfo: UpdateCompanyDto): Promise<AppResponse> {
		for (const productGuid of companyInfo.deletedCompanyProducts) {
			const productId = await this._companyProduct.findOne({
				where: { [CompanyProductColumns.CompanyProductGuid]: productGuid },
				attributes: [
					CompanyProductColumns.JointId,
					CompanyProductColumns.SubJointId,
					CompanyProductColumns.ProductId,
					CompanyProductColumns.CompanyId
				]
			});
			if (productId) {
				const res = await this._ticketModel.findAll({
					attributes: [TicketColumns.TicketGuid],
					where: {
						[TicketColumns.ProductCategoryId]: productId?.[CompanyProductColumns.ProductId],
						[TicketColumns.SubJointId]: productId?.[CompanyProductColumns.SubJointId],
						[TicketColumns.JointId]: productId?.[CompanyProductColumns.JointId],
						[TicketColumns.CompanyId]: productId?.[CompanyProductColumns.CompanyId],
						[TicketColumns.CurrentStatus]: {
							[Op.notIn]: [TicketStatusEnum.Completed, TicketStatusEnum.Cancelled, TicketStatusEnum.Rejected, TicketStatusEnum.Escalated]
						}
					}
				});

				if (res?.length > 0) return createResponse(HttpStatus.BAD_REQUEST, messages.W56);
			}
		}
		return createResponse(HttpStatus.OK, messages.S4);
	}

	async fetchUsers(claims: AtPayload, UserInfo: FetchUsersDto, bypass: boolean = false): Promise<AppResponse> {
		try {
			const offSet = (UserInfo.pageId - 1) * UserInfo.pageLimit;
			const fromDate = UserInfo.fromDate ? new Date(UserInfo.fromDate) : new Date(0);
			fromDate.setHours(0, 0, 0, 0);
			const toDate = UserInfo.toDate ? new Date(UserInfo.toDate) : new Date();
			toDate.setHours(23, 59, 59, 999);
			const filter = {};
			const rolesFilter = {};
			if (UserInfo.userId) filter[UserColumns.UserGuid] = UserInfo.userId;
			if (UserInfo?.active?.toString()) filter[UserColumns.IsActive] = UserInfo.active;
			if (claims.company_id) filter[UserColumns.companyId] = claims.company_id;
			else if (UserInfo?.companyId?.length) filter[UserColumns.companyId] = { [Op.in]: UserInfo.companyId };
			if (UserInfo?.cityId?.length) filter[UserColumns.CityId] = { [Op.in]: UserInfo.cityId };
			if (UserInfo?.toDate && UserInfo?.fromDate) filter[UserColumns.CreatedOnUTC] = { [Op.between]: [fromDate.toISOString(), toDate.toISOString()] };
			if (UserInfo?.rolesId?.length) rolesFilter[UserRoleColumns.RoleId] = { [Op.in]: UserInfo.rolesId };

			if (UserInfo?.search) {
				filter[Op.or] = [
					{ [UserColumns.PrimaryMobileNo]: { [Op.like]: `%${UserInfo.search}%` } },
					{ [UserColumns.FullName]: { [Op.like]: `%${UserInfo.search}%` } },
					{ [UserColumns.EmailId]: { [Op.like]: `%${UserInfo.search}%` } },
					{ ['$City.CityName$']: { [Op.like]: `%${UserInfo.search}%` } }
				];
			}

			//jointer filter
			const jointerFilter = {};
			if (UserInfo?.expertLevelId?.length) jointerFilter[JointerInfoColumns.ExpertiseLevelId] = { [Op.in]: UserInfo.expertLevelId };
			if (UserInfo?.expertTypeId?.length) jointerFilter[JointerInfoColumns.ExpertiseTypeId] = { [Op.in]: UserInfo.expertTypeId };
			if (UserInfo?.jointerCategoryId?.length) jointerFilter[JointerInfoColumns.JointerCategoryId] = { [Op.in]: UserInfo.jointerCategoryId };
			if (UserInfo?.statusId?.length) jointerFilter[JointerInfoColumns.StatusId] = { [Op.in]: UserInfo.statusId };
			if (UserInfo?.toDate && UserInfo?.fromDate)
				jointerFilter[JointerInfoColumns.CreatedOnUTC] = { [Op.between]: [fromDate.toISOString(), toDate.toISOString()] };

			const categoryIdRes = await this._categoryModel.findAll({ attributes: [CategoryColumns.CategoryId, CategoryColumns.CategoryName] });
			const categoryRes = categoryIdRes?.filter((category) => category[CategoryColumns.CategoryId] === UserInfo.categoryId);
			if (categoryRes[0][CategoryColumns.CategoryName] === UserCategoryEnum.Jointer) {
				if (UserInfo?.search) {
					filter[Op.or] = [...filter[Op.or], { '$JointerInfo.VendorName$': { [Op.like]: `%${UserInfo.search}%` } }];
				}
			}

			const query: any = {
				attributes: [
					UserColumns.EmailId,
					UserColumns.FullName,
					UserColumns.PrimaryMobileNo,
					UserColumns.SecondaryMobileNo,
					UserColumns.UserGuid,
					UserColumns.CreatedOnUTC,
					UserColumns.IsActive,
					UserColumns.Avatar,
					UserColumns.FirstLoggedInOnUTC,
					UserColumns.ModifiedOnUTC
				],
				where: { [UserColumns.CategoryId]: UserInfo.categoryId, ...filter },
				include: [
					{
						model: this._userModel,
						as: UserAlias.CreatedUser,
						attributes: [UserColumns.FullName, UserColumns.EmailId]
					},
					{
						model: this._rolesModel,
						as: UserAlias.Role,
						attributes: [RoleColumns.RoleName, RoleColumns.RoleId]
					},
					{
						model: this._countryCodeModel,
						as: UserAlias.PrimaryCountryCodes,
						attributes: [CountryCodeColumns.CountryCode, CountryCodeColumns.CountryCodeId]
					},
					{
						model: this._countryCodeModel,
						as: UserAlias.SecondaryCountryCode,
						attributes: [CountryCodeColumns.CountryCode, CountryCodeColumns.CountryCodeId]
					},
					{
						model: this._cityModel,
						as: UserAlias.City,
						attributes: [CityColumns.CityId, CityColumns.CityName]
					}
				],
				offset: offSet,
				limit: UserInfo.pageLimit,
				order: [[UserColumns.CreatedOnUTC, 'DESC']]
			};
			if (bypass) {
				delete query.offset;
				delete query.limit;
			}
			if (categoryRes[0][CategoryColumns.CategoryName] === UserCategoryEnum.Customer) {
				// customer
				const obj: any = [
					{
						model: this._companyModel,
						as: UserAlias.Company,
						attributes: [CompanyColumns.CompanyName, CompanyColumns.CompanyId]
					}
				];
				query.include.push(...obj);
			}
			if (UserInfo.userId || bypass) {
				const roleObj = [
					{
						model: this._userRolesModel,
						as: UserAlias.UserRoles,
						attributes: [UserRoleColumns.UserRoleGuid],
						where: {
							[UserRoleColumns.EffectiveFromUTC]: { [Op.lt]: currentISODate() },
							[UserRoleColumns.EffectiveTillUTC]: { [Op.gt]: currentISODate() },
							...rolesFilter
						},
						include: [{ model: this._rolesModel, as: UserRoleAlias.Role, attributes: [RoleColumns.RoleId, RoleColumns.RoleName] }]
					},
					{
						model: this._userModel,
						as: UserAlias.ModifiedUser,
						attributes: [UserColumns.FullName, UserColumns.EmailId]
					}
				];
				query.include.push(...roleObj);
			}
			if (categoryRes[0][CategoryColumns.CategoryName] === UserCategoryEnum.Jointer) {
				// jointer
				if (UserInfo.userId || bypass) {
					const obj = {
						model: this._jointerInfoModel,
						as: UserAlias.JointerInfo,
						attributes: [
							JointerInfoColumns.Designation,
							JointerInfoColumns.EffectiveFromUTC,
							JointerInfoColumns.EffectiveTillUTC,
							JointerInfoColumns.RaychemId,
							JointerInfoColumns.VendorName,
							JointerInfoColumns.Rating,
							JointerInfoColumns.TotalRating
						],
						include: [
							{
								model: this._expertiseLevelModel,
								as: JointerAlias.ExpertiseLevel,
								attributes: [ExpertiseLevelColumns.ExpertLevelName, ExpertiseLevelColumns.ExpertLevelId]
							},
							{
								model: this._expertiseTypeModel,
								as: JointerAlias.ExpertiseType,
								attributes: [ExpertiseTypeColumns.ExpertTypeName, ExpertiseTypeColumns.ExpertTypeId]
							},
							{
								model: this._jointerCategoryModel,
								as: JointerAlias.JointerCategory,
								attributes: [JointerCategoryColumns.JointerCategoryId, JointerCategoryColumns.JointerCategoryName]
							},
							{
								model: this._statusModel,
								as: JointerAlias.JointerStatus,
								attributes: [JointerStatusColumns.JStatusName, JointerStatusColumns.JStatusId]
							},
							{
								model: this._jointerDocumentModel,
								as: JointerAlias.JointerDocument,
								attributes: [JointerDocumentColumns.JointerDocGuid, JointerDocumentColumns.JointerDocName, JointerDocumentColumns.DocType]
							}
						]
					};
					query.include.push(obj);
				} else {
					const obj = {
						model: this._jointerInfoModel,
						as: UserAlias.JointerInfo,
						where: { ...jointerFilter },
						attributes: [JointerInfoColumns.RaychemId, JointerInfoColumns.Rating, JointerInfoColumns.VendorName],
						include: [
							{
								model: this._statusModel,
								as: JointerAlias.JointerStatus,
								attributes: [JointerStatusColumns.JStatusName, JointerStatusColumns.JStatusId]
							}
						]
					};
					query.include.push(obj);
				}
			}

			if (UserInfo.userId) {
				delete query.offset;
				delete query.limit;
			}

			const res = await this._userModel.findAll({ ...query, subQuery: false, order: [[UserColumns.CreatedOnUTC, 'DESC']] });
			const count = await this._userModel.count({
				where: { [UserColumns.CategoryId]: UserInfo.categoryId, ...filter },
				distinct: true,
				include: [
					{
						model: this._cityModel,
						as: UserAlias.City
					},
					{
						model: this._jointerInfoModel,
						as: UserAlias.JointerInfo,
						required: Object.keys(jointerFilter).length > 0 ? true : false,
						where: { ...jointerFilter }
					},
					{
						model: this._userRolesModel,
						as: UserAlias.UserRoles,
						where: {
							[UserRoleColumns.EffectiveFromUTC]: { [Op.lt]: currentISODate() },
							[UserRoleColumns.EffectiveTillUTC]: { [Op.gt]: currentISODate() },
							...rolesFilter
						}
					}
				]
			});
			if (bypass) return createResponse(HttpStatus.OK, messages.S4, { rows: res, count, categoryRes });
			return createResponse(HttpStatus.OK, messages.S4, { rows: res, count });
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR, claims.sid);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
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
				}
			]
		});
		return createResponse(HttpStatus.OK, messages.S4, res);
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
		} else if (info.mobileNumber) filter = { [UserColumns.PrimaryMobileNo]: info.mobileNumber, [UserColumns.SecondaryMobileNo]: info.mobileNumber };
		else if (info.emailId) filter = { [UserColumns.EmailId]: info.emailId };
		const res = await this._userModel.findOne({
			where: { ...filter },
			include: [{ model: this._rolesModel, as: UserAlias.Role, attributes: [RoleColumns.RoleId, RoleColumns.RoleName] }]
		});
		if (info.emailId && info.mobileNumber) {
			if (res) {
				if (res[UserColumns.PrimaryMobileNo] === info.mobileNumber)
					return createResponse(HttpStatus.PARTIAL_CONTENT, messageFactory(messages.W8, [res[UserColumns.PrimaryMobileNo]]));
				if (res[UserColumns.SecondaryMobileNo] === info.mobileNumber)
					return createResponse(HttpStatus.PARTIAL_CONTENT, messageFactory(messages.W8, [res[UserColumns.SecondaryMobileNo]]));
				if (res[UserColumns.EmailId] === info.emailId) return createResponse(HttpStatus.PARTIAL_CONTENT, messages.W9);
			}
		}
		return createResponse(HttpStatus.OK, messages.S4, res);
	}

	async register(userCred: RegisterDto, claims: AtPayload, uuid: string): Promise<AppResponse> {
		const transaction = await this._sequelize.transaction();
		try {
			let secondaryCountryCode = null,
				secondaryMobile = null;
			if (userCred.userDetail.secondaryMobileNumber && userCred.userDetail.secondaryCountryCodeId) {
				secondaryCountryCode = userCred.userDetail.secondaryCountryCodeId;
				secondaryMobile = userCred.userDetail.secondaryMobileNumber;
			}
			await this._userModel.create(
				{
					[UserColumns.UserGuid]: uuid,
					[UserColumns.EmailId]: userCred.userDetail.emailId,
					[UserColumns.FullName]: userCred.userDetail.name,
					[UserColumns.PrimaryMobileNo]: userCred.userDetail.primaryMobileNumber,
					[UserColumns.PrimaryCountryCodeId]: userCred.userDetail.primaryCountryCodeId,
					[UserColumns.SecondaryMobileNo]: secondaryMobile,
					[UserColumns.SecondaryCountryCodeId]: secondaryCountryCode,
					[UserColumns.IsActive]: true,
					[UserColumns.Avatar]: userCred.userDetail.avatar,
					[UserColumns.CategoryId]: userCred.userDetail.categoryId,
					[UserColumns.companyId]: userCred.userDetail.companyId ? userCred.userDetail.companyId : null,
					[UserColumns.CityId]: userCred.userDetail.cityId,
					[UserColumns.DefaultRole]: userCred.userDetail.roles[0],
					[UserColumns.CreatedOnUTC]: new Date().toISOString(),
					[UserColumns.CreatedBy]: claims.sub
				},
				{ transaction: transaction }
			);
			for (const role of userCred.userDetail.roles) {
				await this._userRolesModel.create(
					{
						[UserRoleColumns.UserRoleGuid]: uuidv4(),
						[UserRoleColumns.UserGuid]: uuid,
						[UserRoleColumns.RoleId]: role,
						[UserRoleColumns.CreatedBy]: claims.sub,
						[UserRoleColumns.CreatedOnUTC]: new Date().toISOString(),
						[UserRoleColumns.EffectiveFromUTC]: currentISODate(),
						[UserRoleColumns.EffectiveTillUTC]: maxISODate()
					},
					{ transaction: transaction }
				);
			}
			transaction.commit();
			return createResponse(HttpStatus.OK, messages.S5);
		} catch (error) {
			if (transaction) {
				transaction.rollback();
			}
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async generateSiteCode() {
		let raychemId;
		do {
			raychemId = Math.floor(10000000 + Math.random() * 90000000);
		} while (await this._jointerInfoModel.findOne({ where: { [JointerInfoColumns.RaychemId]: raychemId.toString() } }));
		return raychemId;
	}

	async jointerRegister(jointerCred: JointerRegisterDto, uuid: string, claims: AtPayload): Promise<AppResponse> {
		const transaction = await this._sequelize.transaction();
		try {
			let secondaryCountryCode = null,
				secondaryMobile = null;
			if (jointerCred.jointerDetail.secondaryMobileNumber && jointerCred.jointerDetail.secondaryCountryCodeId) {
				secondaryCountryCode = jointerCred.jointerDetail.secondaryCountryCodeId;
				secondaryMobile = jointerCred.jointerDetail.secondaryMobileNumber;
			}
			const raychemId = await this.generateSiteCode().then();
			const roles = await this._rolesModel.findAll();
			const jointerRole = roles.filter((role) => role[RoleColumns.RoleName] === RolesEnum.Raychem_Jointer);
			const CreatedOnUTC = new Date().toISOString();
			await this._userModel.create(
				{
					[UserColumns.UserGuid]: uuid,
					[UserColumns.EmailId]: jointerCred.jointerDetail.emailId,
					[UserColumns.FullName]: jointerCred.jointerDetail.name,
					[UserColumns.PrimaryMobileNo]: jointerCred.jointerDetail.primaryMobileNumber,
					[UserColumns.PrimaryCountryCodeId]: jointerCred.jointerDetail.primaryCountryCodeId,
					[UserColumns.SecondaryCountryCodeId]: secondaryCountryCode,
					[UserColumns.SecondaryMobileNo]: secondaryMobile,
					[UserColumns.IsActive]: true,
					[UserColumns.Avatar]: jointerCred.jointerDetail.avatar,
					[UserColumns.CategoryId]: jointerRole[0][RoleColumns.CategoryId],
					[UserColumns.DefaultRole]: jointerRole[0][RoleColumns.RoleId],
					[UserColumns.CityId]: jointerCred.jointerDetail.cityId,
					[UserColumns.CreatedOnUTC]: CreatedOnUTC,
					[UserColumns.CreatedBy]: claims.sub
				},
				{ transaction: transaction }
			);

			await this._jointerInfoModel.create(
				{
					[JointerInfoColumns.JointerGuid]: uuidv4(),
					[JointerInfoColumns.UserGuid]: uuid,
					[JointerInfoColumns.Designation]: jointerCred.jointerDetail.jointerInfo.designation,
					[JointerInfoColumns.VendorName]: jointerCred.jointerDetail.jointerInfo.vendorName,
					[JointerInfoColumns.RaychemId]: raychemId.toString(),
					[JointerInfoColumns.ExpertiseTypeId]: jointerCred.jointerDetail.jointerInfo.expertiseTypeId,
					[JointerInfoColumns.ExpertiseLevelId]: jointerCred.jointerDetail.jointerInfo.expertiseLevelId,
					[JointerInfoColumns.JointerCategoryId]: jointerCred.jointerDetail.jointerInfo.jointerCategoryId,
					[JointerInfoColumns.StatusId]: jointerCred.jointerDetail.jointerInfo.statusId,
					[JointerInfoColumns.Rating]: jointerCred.jointerDetail.jointerInfo.rating,
					[JointerInfoColumns.CreatedOnUTC]: CreatedOnUTC,
					[JointerInfoColumns.CreatedBy]: claims.sub,
					[JointerInfoColumns.EffectiveFromUTC]: currentISODate(),
					[JointerInfoColumns.EffectiveTillUTC]: maxISODate()
				},
				{ transaction: transaction }
			);

			await this._userRolesModel.create(
				{
					[UserRoleColumns.UserRoleGuid]: uuidv4(),
					[UserRoleColumns.UserGuid]: uuid,
					[UserRoleColumns.RoleId]: jointerRole[0][RoleColumns.RoleId],
					[UserRoleColumns.CreatedBy]: claims.sub,
					[UserRoleColumns.CreatedOnUTC]: CreatedOnUTC,
					[UserRoleColumns.EffectiveFromUTC]: CreatedOnUTC,
					[UserRoleColumns.EffectiveTillUTC]: maxISODate()
				},
				{ transaction: transaction }
			);
			if (jointerCred?.Identification && jointerCred?.jointerDetail?.identification) {
				await this._jointerDocumentModel.create(
					{
						[JointerDocumentColumns.JointerDocGuid]: uuidv4(),
						[JointerDocumentColumns.UserGuid]: uuid,
						[JointerDocumentColumns.DocType]: JointerDocType.Identification,
						[JointerDocumentColumns.JointerDocName]: jointerCred?.jointerDetail?.identification,
						[JointerDocumentColumns.CreatedOnUTC]: CreatedOnUTC,
						[JointerDocumentColumns.CreatedBy]: claims.sub
					},
					{ transaction: transaction }
				);
			}
			transaction.commit();
			return createResponse(HttpStatus.OK, messages.S8);
		} catch (error) {
			if (transaction) {
				transaction.rollback();
			}
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
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

	async getCategoryRoleName(categoryId: number): Promise<AppResponse> {
		try {
			const res = await this._categoryModel.findOne({
				where: {
					[CategoryColumns.CategoryId]: categoryId
				}
			});
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async fetchCompanyProduct(companyInfo: UpdateCompanyDto): Promise<AppResponse> {
		for (const product of companyInfo.productInfo) {
			const res = await this._companyProduct.findOne({
				attributes: [CompanyProductColumns.CompanyProductGuid],
				where: {
					[CompanyProductColumns.EffectiveFromUTC]: { [Op.lte]: currentISODate() },
					[CompanyProductColumns.EffectiveTillUTC]: { [Op.gt]: currentISODate() },
					[CompanyProductColumns.CompanyId]: companyInfo.companyId,
					[CompanyProductColumns.ProductId]: product.productId,
					[CompanyProductColumns.JointId]: product.jointId,
					[CompanyProductColumns.SubJointId]: product.subJointId,
					[CompanyProductColumns.SubProductId]: product.subProductId
				}
			});
			if (res) return createResponse(HttpStatus.BAD_REQUEST, messageFactory(messages.W47, ['product, sub product, joint and sub-joint']));
		}
		return createResponse(HttpStatus.OK, messages.S4);
	}

	async updateCompany(companyInfo: UpdateCompanyDto, claims: AtPayload): Promise<AppResponse> {
		const transaction = await this._sequelize.transaction();
		try {
			await this._companyModel.update(
				{ [CompanyColumns.CompanyName]: companyInfo?.companyName },
				{ where: { [CompanyColumns.CompanyId]: companyInfo.companyId }, transaction: transaction }
			);

			const currentUTC = currentISODate();
			if (companyInfo?.deletedCompanyProducts?.length) {
				await this._companyProduct.update(
					{
						[CompanyProductColumns.EffectiveTillUTC]: currentISODate(),
						[CompanyProductColumns.ModifiedBy]: claims.sub,
						[CompanyProductColumns.ModifiedOnUTC]: currentISODate()
					},
					{
						where: {
							[CompanyProductColumns.CompanyId]: companyInfo.companyId,
							[CompanyProductColumns.CompanyProductGuid]: { [Op.in]: companyInfo?.deletedCompanyProducts },
							[CompanyProductColumns.EffectiveFromUTC]: { [Op.lte]: currentISODate() },
							[CompanyProductColumns.EffectiveTillUTC]: { [Op.gt]: currentISODate() }
						},
						transaction: transaction
					}
				);
			}
			if (companyInfo?.deletedCompanyGeoId?.length) {
				await this._companyGeographyInfoModel.update(
					{
						[CompanyGeographyInfoColumns.EffectiveTillUTC]: currentUTC,
						[CompanyGeographyInfoColumns.ModifiedBy]: claims.sub,
						[CompanyGeographyInfoColumns.ModifiedOnUTC]: currentUTC
					},
					{
						where: {
							[CompanyGeographyInfoColumns.CompanyGeographyGuid]: { [Op.in]: companyInfo.deletedCompanyGeoId },
							[CompanyGeographyInfoColumns.CompanyId]: companyInfo.companyId,
							[CompanyGeographyInfoColumns.EffectiveFromUTC]: { [Op.lte]: currentISODate() },
							[CompanyGeographyInfoColumns.EffectiveTillUTC]: { [Op.gt]: currentISODate() }
						},
						transaction: transaction
					}
				);
			}
			const geographyData = [];
			if (companyInfo?.geographyInfo?.length) {
				for (const info of companyInfo.geographyInfo) {
					const obj = {
						[CompanyGeographyInfoColumns.CompanyGeographyGuid]: uuidv4(),
						[CompanyGeographyInfoColumns.CityId]: info.cityId,
						[CompanyGeographyInfoColumns.CompanyId]: companyInfo.companyId,
						[CompanyGeographyInfoColumns.DivisionId]: info.divisionId,
						[CompanyGeographyInfoColumns.UnitId]: info.unitId,
						[CompanyGeographyInfoColumns.EffectiveFromUTC]: currentISODate(),
						[CompanyGeographyInfoColumns.EffectiveTillUTC]: maxISODate(),
						[CompanyGeographyInfoColumns.CreatedBy]: claims.sub,
						[CompanyGeographyInfoColumns.CreatedOnUTC]: currentISODate()
					};
					geographyData?.push(obj);
				}
			}
			const productData = [];
			if (companyInfo?.productInfo?.length) {
				for (const info of companyInfo.productInfo) {
					const obj = {
						[CompanyProductColumns.CompanyProductGuid]: uuidv4(),
						[CompanyProductColumns.ProductId]: info.productId,
						[CompanyProductColumns.CompanyId]: companyInfo.companyId,
						[CompanyProductColumns.SubProductId]: info.subProductId,
						[CompanyProductColumns.JointId]: info.jointId,
						[CompanyProductColumns.SubJointId]: info.subJointId,
						[CompanyProductColumns.EffectiveFromUTC]: currentISODate(),
						[CompanyProductColumns.EffectiveTillUTC]: maxISODate(),
						[CompanyProductColumns.CreatedBy]: claims.sub,
						[CompanyProductColumns.CreatedOnUTC]: currentISODate()
					};
					productData?.push(obj);
				}
			}
			if (geographyData?.length) {
				await this._companyGeographyInfoModel.bulkCreate(geographyData, { transaction });
			}
			if (productData?.length) await this._companyProduct.bulkCreate(productData, { transaction });
			transaction.commit();
			return createResponse(HttpStatus.OK, messages.S13);
		} catch (error) {
			if (transaction) {
				transaction.rollback();
			}
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR, claims.sid);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async fetchCountryCode(countryId: number): Promise<AppResponse> {
		try {
			const res = await this._countryCodeModel.findOne({
				where: {
					[CountryCodeColumns.CountryCodeId]: countryId
				},
				attributes: [CountryCodeColumns.CountryCodeId, CountryCodeColumns.CountryCode]
			});
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async validateCompany(name: string, companyId?: number): Promise<AppResponse> {
		try {
			const filter = { [CompanyColumns.CompanyName]: { [Op.like]: `%${name}%` } };
			if (companyId) filter[CompanyColumns.CompanyId] = { [Op.notIn]: [companyId] };
			const companyExist = await this._companyModel.findOne({
				where: { ...filter }
			});
			return createResponse(HttpStatus.OK, messages.S4, companyExist);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async createCompany(companyInfo: CreateCompanyDto, claims: AtPayload): Promise<AppResponse> {
		const transaction = await this._sequelize.transaction();
		try {
			const companyExist = await this.validateCompany(companyInfo.companyName);
			const currentUTC = currentISODate();
			if (companyExist?.data) return createResponse(HttpStatus.BAD_REQUEST, messages.W24);
			const companyId = await this._companyModel.max(CompanyColumns.CompanyId);
			const companyRes = await this._companyModel.create(
				{
					[CompanyColumns.CompanyId]: Number(companyId) + 1,
					[CompanyColumns.CompanyName]: companyInfo.companyName,
					[CompanyColumns.CreatedBy]: claims.sub,
					[CompanyColumns.CreatedOnUTC]: currentUTC
				},
				{ transaction: transaction }
			);
			const productData = [];
			for (const product of companyInfo.productInfo) {
				const obj = {
					[CompanyProductColumns.CompanyProductGuid]: uuidv4(),
					[CompanyProductColumns.CompanyId]: companyRes[CompanyColumns.CompanyId],
					[CompanyProductColumns.ProductId]: product.productId,
					[CompanyProductColumns.JointId]: product.jointId,
					[CompanyProductColumns.SubJointId]: product.subJointId,
					[CompanyProductColumns.SubProductId]: product?.subProductId,
					[CompanyProductColumns.EffectiveFromUTC]: currentUTC,
					[CompanyProductColumns.EffectiveTillUTC]: maxISODate(),
					[CompanyProductColumns.CreatedBy]: claims.sub,
					[CompanyProductColumns.CreatedOnUTC]: currentUTC
				};
				productData.push({ ...obj });
			}
			const geographyInfoData = [];
			for (const info of companyInfo.geographyInfo) {
				const obj = {
					[CompanyGeographyInfoColumns.CompanyGeographyGuid]: uuidv4(),
					[CompanyGeographyInfoColumns.CityId]: info.cityId,
					[CompanyGeographyInfoColumns.CompanyId]: companyRes[CompanyColumns.CompanyId],
					[CompanyGeographyInfoColumns.DivisionId]: info.divisionId,
					[CompanyGeographyInfoColumns.UnitId]: info.unitId,
					[CompanyGeographyInfoColumns.EffectiveFromUTC]: currentISODate(),
					[CompanyGeographyInfoColumns.EffectiveTillUTC]: maxISODate(),
					[CompanyGeographyInfoColumns.CreatedBy]: claims.sub,
					[CompanyGeographyInfoColumns.CreatedOnUTC]: currentISODate()
				};
				geographyInfoData.push({ ...obj });
			}
			if (productData?.length) await this._companyProduct.bulkCreate(productData, { transaction: transaction });
			if (geographyInfoData?.length) await this._companyGeographyInfoModel.bulkCreate(geographyInfoData, { transaction: transaction });
			transaction.commit();
			return createResponse(HttpStatus.OK, messages.S10);
		} catch (error) {
			if (transaction) {
				transaction.rollback();
			}
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR, claims.sid);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async addUnit(name: string, claims: AtPayload) {
		const transaction = await this._sequelize.transaction();
		try {
			const data = await this._unitModel.findOne({ where: { [UnitColumns.UnitName]: { [Op.like]: `%${name}%` } } });
			if (data) return createResponse(HttpStatus.OK, messages.S4, data);
			const maxUnitId = await this._unitModel.max(UnitColumns.UnitId);
			const res = await this._unitModel.create(
				{
					[UnitColumns.UnitId]: Number(maxUnitId) + 1,
					[UnitColumns.UnitName]: name,
					[UnitColumns.CreatedBy]: claims.sub,
					[UnitColumns.CreatedOnUTC]: currentISODate()
				},
				{ transaction: transaction }
			);
			transaction.commit();
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			if (transaction) {
				transaction.rollback();
			}
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR, claims.sid);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async updateJointer(userInfo: UpdateJointerDto, claims: AtPayload): Promise<AppResponse> {
		const transaction = await this._sequelize.transaction();
		try {
			if (userInfo?.jointerDetail.active?.toString()) {
				await this._userModel.update(
					{
						[UserColumns.IsActive]: userInfo.jointerDetail.active,
						[UserColumns.ModifiedBy]: claims.sub,
						[UserColumns.ModifiedOnUTC]: currentISODate()
					},
					{ where: { [UserColumns.UserGuid]: userInfo.jointerDetail.userId }, transaction: transaction }
				);
			} else {
				await this._jointerInfoModel.update(
					{
						[JointerInfoColumns.Designation]: userInfo.jointerDetail.designation,
						[JointerInfoColumns.ExpertiseLevelId]: userInfo.jointerDetail.expertiseLevelId,
						[JointerInfoColumns.ExpertiseTypeId]: userInfo.jointerDetail.expertiseTypeId,
						[JointerInfoColumns.JointerCategoryId]: userInfo.jointerDetail.jointerCategoryId,
						[JointerInfoColumns.VendorName]: userInfo.jointerDetail.vendorName,
						[JointerInfoColumns.StatusId]: userInfo.jointerDetail.statusId,
						[JointerInfoColumns.ModifiedBy]: claims.sub,
						[JointerInfoColumns.ModifiedOnUTC]: currentISODate()
					},
					{ where: { [UserColumns.UserGuid]: userInfo.jointerDetail.userId }, transaction: transaction }
				);
				await this._userModel.update(
					{
						[UserColumns.CityId]: userInfo.jointerDetail.cityId,
						[UserColumns.ModifiedBy]: claims.sub,
						[UserColumns.ModifiedOnUTC]: currentISODate()
					},
					{ where: { [UserColumns.UserGuid]: userInfo.jointerDetail.userId }, transaction: transaction }
				);
				if (userInfo?.jointerDetail?.docTypeGuid) {
					if (userInfo?.jointerDetail?.identification) {
						await this._jointerDocumentModel.update(
							{
								[JointerDocumentColumns.UserGuid]: userInfo?.jointerDetail?.userId,
								[JointerDocumentColumns.DocType]: JointerDocType.Identification,
								[JointerDocumentColumns.JointerDocName]: userInfo?.jointerDetail?.identification
							},
							{
								where: {
									[JointerDocumentColumns.JointerDocGuid]: userInfo?.jointerDetail?.docTypeGuid
								},
								transaction: transaction
							}
						);
					} else {
						await this._jointerDocumentModel.destroy({
							where: {
								[JointerDocumentColumns.JointerDocGuid]: userInfo?.jointerDetail?.docTypeGuid
							},
							transaction: transaction
						});
					}
				} else if (userInfo?.Identification && !userInfo?.jointerDetail?.docTypeGuid) {
					await this._jointerDocumentModel.create(
						{
							[JointerDocumentColumns.JointerDocGuid]: uuidv4(),
							[JointerDocumentColumns.UserGuid]: userInfo?.jointerDetail.userId,
							[JointerDocumentColumns.DocType]: JointerDocType.Identification,
							[JointerDocumentColumns.JointerDocName]: userInfo?.jointerDetail?.identification ? userInfo?.jointerDetail?.identification : null,
							[JointerDocumentColumns.CreatedOnUTC]: currentISODate(),
							[JointerDocumentColumns.CreatedBy]: claims.sub
						},
						{ transaction: transaction }
					);
				}
			}
			transaction.commit();
			return createResponse(HttpStatus.OK, messages.S11);
		} catch (error) {
			if (transaction) {
				transaction.rollback();
			}
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async updateUserStatus(userId: string, status: boolean, claims: AtPayload): Promise<AppResponse> {
		const transaction = await this._sequelize.transaction();
		try {
			await this._userModel.update(
				{ [UserColumns.IsActive]: status, [UserColumns.ModifiedBy]: claims.sub, [UserColumns.ModifiedOnUTC]: currentISODate() },
				{ where: { [UserColumns.UserGuid]: userId }, transaction: transaction }
			);
			transaction.commit();
			return createResponse(HttpStatus.OK, messages.S11);
		} catch (error) {
			if (transaction) {
				transaction.rollback();
			}
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async updateUserRoles(
		userInfo: UpdateUserDto,
		newRoles: number[],
		deleteRoles: number[],
		claims: AtPayload,
		role?: number | null
	): Promise<AppResponse> {
		const transaction = await this._sequelize.transaction();
		try {
			await this._userRolesModel.update(
				{
					[UserRoleColumns.EffectiveTillUTC]: currentISODate(),
					[UserRoleColumns.ModifiedBy]: claims.sub,
					[UserRoleColumns.ModifiedOnUTC]: currentISODate()
				},
				{
					where: {
						[UserRoleColumns.UserGuid]: userInfo.userId,
						[UserRoleColumns.EffectiveFromUTC]: { [Op.lt]: currentISODate() },
						[UserRoleColumns.EffectiveTillUTC]: { [Op.gt]: currentISODate() },
						[UserRoleColumns.RoleId]: { [Op.in]: deleteRoles }
					},
					transaction: transaction
				}
			);
			if (role) {
				await this._userModel.update(
					{ [UserColumns.DefaultRole]: role },
					{ where: { [UserColumns.UserGuid]: userInfo.userId }, transaction: transaction }
				);
			}
			for (const role of newRoles) {
				await this._userRolesModel.create(
					{
						[UserRoleColumns.UserRoleGuid]: uuidv4(),
						[UserRoleColumns.UserGuid]: userInfo.userId,
						[UserRoleColumns.RoleId]: role,
						[UserRoleColumns.EffectiveFromUTC]: currentISODate(),
						[UserRoleColumns.EffectiveTillUTC]: maxISODate(),
						[UserRoleColumns.CreatedBy]: claims.sub,
						[UserRoleColumns.CreatedOnUTC]: currentISODate()
					},
					{ transaction: transaction }
				);
			}
			transaction.commit();
			return createResponse(HttpStatus.OK, messages.S11);
		} catch (error) {
			if (transaction) {
				transaction.rollback();
			}
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR, claims.sid);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async fetchUserInfo(userId: string): Promise<AppResponse> {
		const res = await this._userModel.findOne({
			attributes: [UserColumns.UserGuid, UserColumns.CategoryId, UserColumns.DefaultRole],
			where: { [UserColumns.UserGuid]: userId },
			include: [
				{
					model: this._userRolesModel,
					as: UserAlias.UserRoles,
					where: {
						[UserRoleColumns.EffectiveFromUTC]: { [Op.lt]: currentISODate() },
						[UserRoleColumns.EffectiveTillUTC]: { [Op.gt]: currentISODate() }
					},
					include: [{ model: this._rolesModel, as: UserRoleAlias.Role, attributes: [RoleColumns.RoleId, RoleColumns.RoleName] }]
				}
			]
		});
		return createResponse(HttpStatus.OK, messages.S4, res);
	}

	async fetchJointerInfo(userId: string): Promise<AppResponse> {
		const res = await this._userModel.findOne({
			attributes: [UserColumns.UserGuid, UserColumns.CategoryId, UserColumns.DefaultRole],
			where: { [UserColumns.UserGuid]: userId },
			include: [
				{
					model: this._userRolesModel,
					as: UserAlias.UserRoles,
					include: [{ model: this._rolesModel, as: UserRoleAlias.Role, attributes: [RoleColumns.RoleId, RoleColumns.RoleName] }]
				},
				{
					model: this._jointerInfoModel,
					as: UserAlias.JointerInfo,
					attributes: [JointerInfoColumns.JointerGuid],
					include: [
						{
							model: this._jointerDocumentModel,
							as: JointerAlias.JointerDocument,
							attributes: [JointerDocumentColumns.JointerDocGuid, JointerDocumentColumns.DocType, JointerDocumentColumns.JointerDocName]
						}
					]
				}
			]
		});
		return createResponse(HttpStatus.OK, messages.S4, res);
	}

	async getRolesByCategory(categoryId: CategoryIdDto): Promise<AppResponse> {
		try {
			const res = await this._rolesModel.findAll({
				where: {
					// [RoleColumns.IsActive]: true,
					[RoleColumns.CategoryId]: categoryId.categoryId
				},
				attributes: [RoleColumns.RoleId, RoleColumns.RoleName]
			});
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async companies(companiesInfo: CompaniesDto, claims: AtPayload): Promise<AppResponse> {
		try {
			const res = await this._companyModel.findAll({
				attributes: [CompanyColumns.CompanyId, CompanyColumns.CompanyName, CompanyColumns.CreatedOnUTC],
				where: { [CompanyColumns.CompanyId]: companiesInfo.companyId },
				include: [
					{
						model: this._userModel,
						as: CompanyAlias.CreatedUser,
						attributes: [UserColumns.FullName, UserColumns.EmailId]
					},
					{
						model: this._companyGeographyInfoModel,
						required: false,
						as: CompanyAlias.CompanyGeographyInfo,
						where: {
							[CompanyGeographyInfoColumns.CompanyId]: companiesInfo.companyId,
							[CompanyGeographyInfoColumns.EffectiveFromUTC]: { [Op.lt]: currentISODate() },
							[CompanyGeographyInfoColumns.EffectiveTillUTC]: { [Op.gt]: currentISODate() }
						},
						attributes: [CompanyGeographyInfoColumns.CompanyGeographyGuid, CompanyGeographyInfoColumns.CompanyId],
						include: [
							{
								model: this._cityModel,
								required: false,
								as: CompanyGeographyInfoAlias.City,
								attributes: [CityColumns.CityId, CityColumns.CityName]
							},
							{
								model: this._divisionModel,
								required: false,
								as: CompanyGeographyInfoAlias.Division,
								attributes: [DivisionColumns.DivisionId, DivisionColumns.DivisionName]
							},
							{
								model: this._unitModel,
								required: false,
								as: CompanyGeographyInfoAlias.Unit,
								attributes: [UnitColumns.UnitId, UnitColumns.UnitName]
							}
						]
					},
					{
						model: this._companyProduct,
						as: CompanyAlias.CompanyProduct,
						attributes: [CompanyProductColumns.CompanyProductGuid],
						where: {
							[CompanyProductColumns.EffectiveFromUTC]: { [Op.lt]: currentISODate() },
							[CompanyProductColumns.EffectiveTillUTC]: { [Op.gt]: currentISODate() }
						},
						include: [
							{
								model: this._subProductModel,
								as: CompanyProductAlias.SubProductCategory,
								attributes: [SubProductColumns.SubProductId, SubProductColumns.SubProductName]
							},
							{
								model: this._productModel,
								as: CompanyProductAlias.Product,
								attributes: [ProductColumns.ProductId, ProductColumns.ProductName]
							},
							{
								model: this._jointModel,
								as: CompanyProductAlias.Joint,
								attributes: [JointColumns.JointId, JointColumns.JointName]
							},
							{
								model: this._subJointModel,
								as: CompanyProductAlias.SubJoint,
								attributes: [SubJointColumns.SubJointId, SubJointColumns.SubJointName]
							}
						]
					}
				]
			});

			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR, claims.sid);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async companyData(companyInfo: FetchCompaniesDto): Promise<AppResponse> {
		try {
			const offSet = (companyInfo.pageId - 1) * companyInfo.pageLimit;
			const fromDate = companyInfo.fromDate ? new Date(companyInfo.fromDate) : new Date(0);
			fromDate.setHours(0, 0, 0, 0);
			const toDate = companyInfo.toDate ? new Date(companyInfo.toDate) : new Date();
			toDate.setHours(23, 59, 59, 999);
			const filterCompany = {};
			if (companyInfo?.toDate && companyInfo?.fromDate)
				filterCompany[CompanyColumns.CreatedOnUTC] = { [Op.between]: [fromDate.toISOString(), toDate.toISOString()] };
			if (companyInfo?.search) filterCompany[CompanyColumns.CompanyName] = { [Op.like]: `%${companyInfo.search}%` };
			const filter = {
				[CompanyGeographyInfoColumns.EffectiveFromUTC]: { [Op.lt]: currentISODate() },
				[CompanyGeographyInfoColumns.EffectiveTillUTC]: { [Op.gt]: currentISODate() }
			};
			if (companyInfo?.cityId?.length) filter[CompanyGeographyInfoColumns.CityId] = { [Op.in]: companyInfo.cityId };

			let res;
			res = await this._companyModel.findAll({
				where: { ...filterCompany },
				attributes: [CompanyColumns.CompanyId],
				include: [
					{
						model: this._companyGeographyInfoModel,
						as: CompanyAlias.CompanyGeographyInfo,
						separate: true,
						attributes: [CompanyGeographyInfoColumns.CityId],
						where: { ...filter }
					}
				],
				subQuery: false,
				offset: offSet,
				limit: companyInfo.pageLimit,
				order: [[CompanyColumns.CreatedOnUTC, 'DESC']]
			});
			const companyIds = res?.map((company) => company[CompanyColumns.CompanyId]);
			const filterSec = {
				[CompanyGeographyInfoColumns.EffectiveFromUTC]: { [Op.lt]: currentISODate() },
				[CompanyGeographyInfoColumns.EffectiveTillUTC]: { [Op.gt]: currentISODate() }
			};
			if (companyIds?.length) {
				filterSec[CompanyGeographyInfoColumns.CompanyId] = { [Op.in]: companyIds };
				res = await this._companyModel.findAll({
					where: { ...filterCompany },
					attributes: [CompanyColumns.CompanyId, CompanyColumns.CompanyName, CompanyColumns.CreatedOnUTC],
					include: [
						{
							model: this._companyGeographyInfoModel,
							as: CompanyAlias.CompanyGeographyInfo,
							attributes: [CompanyGeographyInfoColumns.CityId],
							where: { ...filterSec, ...filter },
							include: [
								{
									model: this._cityModel,
									required: false,
									as: CompanyGeographyInfoAlias.City,
									attributes: [CityColumns.CityName, CityColumns.CityId]
								}
							]
						}
					],
					subQuery: false,
					order: [[CompanyColumns.CreatedOnUTC, 'DESC']]
				});
			}
			const count = await this._companyModel.count({
				where: { ...filterCompany },
				distinct: true,
				include: [
					{
						model: this._companyGeographyInfoModel,
						as: CompanyAlias.CompanyGeographyInfo,
						where: { ...filter }
					}
				]
			});

			return createResponse(HttpStatus.OK, messages.S4, { res, count });
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async jointerRating(jointerRating: JointerRatingDto, claims: AtPayload): Promise<AppResponse> {
		const transaction = await this._sequelize.transaction();
		try {
			const ticketStatusRes = await this._ticketModel.findOne({
				attributes: [TicketColumns.CurrentStatus],
				where: { [TicketColumns.TicketGuid]: jointerRating.ticketGuid }
			});
			if (!ticketStatusRes) return createResponse(HttpStatus.BAD_REQUEST, messageFactory(messages.W1, ['ticket id']));
			const res = await this._jointerInfoModel.findOne({
				attributes: [JointerInfoColumns.TotalRating],
				where: { [JointerInfoColumns.UserGuid]: jointerRating.jointerId }
			});
			const result: any = await JointerRatingModel.findAll({
				attributes: [[fn('SUM', col(JointerRatingColumns.Rating)), 'totalRating']],
				where: {
					UserGuid: jointerRating.jointerId
				}
			});
			const currentRating = result[0].dataValues.totalRating ? result[0].dataValues.totalRating : 0;
			const ratings = currentRating + jointerRating.rating;
			const totalRating = ratings / (res[JointerInfoColumns.TotalRating] + 1);
			// return totalRating;
			await this._jointerInfoModel.update(
				{
					[JointerInfoColumns.Rating]: totalRating,
					[JointerInfoColumns.TotalRating]: res[JointerInfoColumns.TotalRating] + 1
				},
				{
					where: {
						[JointerInfoColumns.UserGuid]: jointerRating.jointerId
					},
					transaction: transaction
				}
			);
			await this._jointerRatingModel.create(
				{
					[JointerRatingColumns.RatingGuid]: uuidv4(),
					[JointerRatingColumns.Rating]: jointerRating.rating,
					[JointerRatingColumns.TicketGuid]: jointerRating.ticketGuid,
					[JointerRatingColumns.UserGuid]: jointerRating.jointerId,
					[JointerRatingColumns.CreatedBy]: claims.sub,
					[JointerRatingColumns.CreatedOnUTC]: currentISODate()
				},
				{
					transaction: transaction
				}
			);
			transaction.commit();
			return createResponse(HttpStatus.OK, messages.S12);
		} catch (error) {
			if (transaction) {
				transaction.rollback();
			}
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async fetchSupervisor(supervisorInfo: SupervisorDto): Promise<AppResponse> {
		try {
			const filter = {};
			if (supervisorInfo?.supervisorName) filter[UserColumns.FullName] = { [Op.like]: `%${supervisorInfo.supervisorName}%` };

			const res = await this._userModel.findAll({
				where: {
					[UserColumns.IsActive]: true,
					...filter
				},
				attributes: [UserColumns.UserGuid, UserColumns.FullName, UserColumns.Avatar],
				include: [
					{
						model: this._userRolesModel,
						as: UserAlias.UserRoles,
						required: true,
						attributes: [],
						include: [
							{
								model: this._rolesModel,
								required: true,
								as: UserRoleAlias.Role,
								where: {
									[RoleColumns.RoleName]: RolesEnum.Raychem_Supervisor,
									[UserRoleColumns.EffectiveFromUTC]: { [Op.lt]: currentISODate() },
									[UserRoleColumns.EffectiveTillUTC]: { [Op.gt]: currentISODate() }
								},
								attributes: []
							}
						]
					}
				]
			});
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async createEmailLogs(email: ISendMailOptions, isSuccess: boolean, claims?: AtPayload): Promise<AppResponse> {
		const transaction = await this._sequelize.transaction();
		try {
			await this._emailModel.create(
				{
					[EmailColumns.EmailGuid]: uuidv4(),
					[EmailColumns.FromEmailAddressComma]: String(email?.from),
					[EmailColumns.ToEmailAddressComma]: String(email?.to),
					[EmailColumns.CCEmailAddressComma]: String(email?.cc) ? String(email?.cc) : null,
					[EmailColumns.BCCEmailAddressComma]: String(email?.bcc) ? String(email?.bcc) : null,
					[EmailColumns.EmailSubject]: String(email?.subject),
					[EmailColumns.EmailBody]: String(email?.html),
					[EmailColumns.Status]: isSuccess === true ? 'success' : 'fail',
					[EmailColumns.CreatedBy]: claims?.sub,
					[EmailColumns.CreatedOnUTC]: currentISODate()
				},
				{ transaction: transaction }
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
}
