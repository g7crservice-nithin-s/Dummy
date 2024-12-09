import { HierarchyMasterTableEnum, MasterTableEnum } from '@app/core/enums/master-table.enum';
import AppLogger from '@app/core/logger/app-logger';
import { AtPayload } from '@app/modules/auth/model/jwt-payload.model';
import {
	ActivityFlowDto,
	CategoryIdDto,
	CityDto,
	CompanyJointDto,
	CompanyProductDto,
	CompanyProjectDto,
	CompanySubJointDto,
	CompanySubProductDto,
	DivisionDto,
	HierarchyMasterTableDto,
	JointDto,
	MasterTableDto,
	PreInstallationDto,
	SubJointDto,
	SubProductCategoryDto,
	UnitDto,
	VoltageDto
} from '@app/modules/masters/dto/master.dto';
import { AppResponse, createResponse } from '@app/shared/app-response.shared';
import { messages } from '@app/shared/messages.shared';
import { currentISODate, maxISODate } from '@app/shared/shared.function';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Op, Sequelize, col, fn, literal, where } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { MasterAbstractSqlDao } from '../abstract/master.abstract';
import { MsSqlConstants } from '../connection/constants.mssql';
import { CompanyJointConfigModel } from '../models/company.company-Joint-config.model';
import { CompanyGeographyInfoAlias, CompanyGeographyInfoColumns, CompanyGeographyInfoModel } from '../models/company.company-geography-info.model';
import { CompanyProjectAlias, CompanyProjectColumns, CompanyProjectModel } from '../models/company.company-project.model';
import { CompanyColumns, CompanyModel } from '../models/company.company.model';
import { KitStatusColumns, KitStatusModel } from '../models/master.kit-status.model';
import { ActivityFLowModel, ActivityFlowColumn } from '../models/masters.activity-flow.model';
import { CityColumns, CityModel } from '../models/masters.city.model';
import { CountryCodeColumns, CountryCodeModel } from '../models/masters.country-code.model';
import { DivisionColumns, DivisionModel } from '../models/masters.division.model';
import { ExcavationConditionColumns, ExcavationConditionModel } from '../models/masters.excavation-condition.model';
import { ExpertiseLevelColumns, ExpertiseLevelModel } from '../models/masters.expertise-level.model';
import { ExpertiseTypeColumns, ExpertiseTypeModel } from '../models/masters.expertise-type.model';
import { JobTypeColumns, JobTypeModel } from '../models/masters.job-type.model';
import { JointColumns, JointModel } from '../models/masters.joint.model';
import { JointerStatusColumns, JointerStatusModel } from '../models/masters.jointer-status.model';
import { JointingCheckListColumns, JointingCheckListModel } from '../models/masters.jointing-checklist.model';
import { ProductColumns, ProductModel } from '../models/masters.product.model';
import { ProjectColumns, ProjectModel } from '../models/masters.project.model';
import { RoleColumns, RoleModel } from '../models/masters.roles.model';
import { SafetyCheckListColumns, SafetyCheckListModel } from '../models/masters.safety-checklist.model';
import { SiteStateColumns, SiteStateModel } from '../models/masters.site-state.model';
import { SubJointColumns, SubJointModel } from '../models/masters.sub-joint.model';
import { SubProductColumns, SubProductModel } from '../models/masters.sub-product.model';
import { UnitColumns, UnitModel } from '../models/masters.unit.model';
import { CategoryColumns, CategoryModel } from '../models/masters.user-category.model';
import { VoltageColumn, VoltageModel } from '../models/masters.voltage.model';
import { JointerModel } from '../models/security.jointer-info.model';
import { UserRoleModel } from '../models/security.user-role.model';
import { UserModel } from '../models/security.user.model';
import { PreInstallationColumns, PreInstallationModel } from '../models/master.pre-instalaltion.model';
import { activityType } from '@app/core/enums/shared.enum';
import { CompanyProductAlias, CompanyProductColumns, CompanyProductModel } from '../models/company.company-product.model';
import { JointerCategoryColumns, JointerCategoryModel } from '../models/master.jointer-category.model';

@Injectable()
export class MasterSqlDao implements MasterAbstractSqlDao {
	constructor(
		readonly _loggerSvc: AppLogger,
		@Inject(MsSqlConstants.SAFETY_CHECKLIST) private _safetyListModel: typeof SafetyCheckListModel,
		@Inject(MsSqlConstants.ROLE) private _roleListModel: typeof RoleModel,
		@Inject(MsSqlConstants.COUNTRY_CODE) private _countryCodeModel: typeof CountryCodeModel,
		@Inject(MsSqlConstants.JOINT) private _jointListModel: typeof JointModel,
		@Inject(MsSqlConstants.EXPERTISE_TYPE) private _expertiseTypeModel: typeof ExpertiseTypeModel,
		@Inject(MsSqlConstants.EXPERTISE_LEVEL) private _expertiseLevelModel: typeof ExpertiseLevelModel,
		@Inject(MsSqlConstants.SUB_JOINT) private _subJointModel: typeof SubJointModel,
		@Inject(MsSqlConstants.CITY) private _cityModel: typeof CityModel,
		@Inject(MsSqlConstants.SITE_STATE) private _siteStateModel: typeof SiteStateModel,
		@Inject(MsSqlConstants.USER) private _userModel: typeof UserModel,
		@Inject(MsSqlConstants.USER_ROLE) private _userRoleModel: typeof UserRoleModel,
		@Inject(MsSqlConstants.STATUS) private _jointerStatusModel: typeof JointerStatusModel,
		@Inject(MsSqlConstants.VOLTAGE) private _voltageModel: typeof VoltageModel,
		@Inject(MsSqlConstants.JOB_TYPE) private _jobTypeModel: typeof JobTypeModel,
		@Inject(MsSqlConstants.ACTIVITY_FLOW) private _activityFLowModel: typeof ActivityFLowModel,
		@Inject(MsSqlConstants.CATEGORY) private _categoryModel: typeof CategoryModel,
		@Inject(MsSqlConstants.JOINT_CHECK_LIST) private _JointingCheckListModel: typeof JointingCheckListModel,
		@Inject(MsSqlConstants.SEQUELIZE_PROVIDER) private _sequelize: Sequelize,
		@Inject(MsSqlConstants.CUSTOMER_COMPANY) private _companyModel: typeof CompanyModel,
		@Inject(MsSqlConstants.UNIT) private _unitModel: typeof UnitModel,
		@Inject(MsSqlConstants.PRODUCT_CATEGORY) private _ProductModel: typeof ProductModel,
		@Inject(MsSqlConstants.SUB_PRODUCT_CATEGORY) private _subProductModel: typeof SubProductModel,
		@Inject(MsSqlConstants.COMPANY_PROJECT) private _companyProjectModel: typeof CompanyProjectModel,
		@Inject(MsSqlConstants.PROJECT) private _projectModel: typeof ProjectModel,
		@Inject(MsSqlConstants.DIVISION) private _divisionModel: typeof DivisionModel,
		@Inject(MsSqlConstants.KIT_STATUS) private _kitStatusModel: typeof KitStatusModel,
		@Inject(MsSqlConstants.EXCAVATION_CONDITION) private _excavationConditionModel: typeof ExcavationConditionModel,
		@Inject(MsSqlConstants.JOINTER) private _jointerInfoModel: typeof JointerModel,
		@Inject(MsSqlConstants.COMPANY_JOINT_CONFIG) private _companyJointConfigModel: typeof CompanyJointConfigModel,
		@Inject(MsSqlConstants.COMPANY_GEOGRAPHY_INFO) private _companyGeographyInfoModel: typeof CompanyGeographyInfoModel,
		@Inject(MsSqlConstants.PRE_INSTALLATION) private _preInstallationModel: typeof PreInstallationModel,
		@Inject(MsSqlConstants.COMPANY_PRODUCT) private _companyProductModel: typeof CompanyProductModel,
		@Inject(MsSqlConstants.JOINTER_CATEGORY) private _jointerCategoryModel: typeof JointerCategoryModel
	) {}

	async getSafetyList(): Promise<AppResponse> {
		try {
			const res = await this._safetyListModel.findAll({
				attributes: [SafetyCheckListColumns.SCheckListId, SafetyCheckListColumns.SCheckListName]
			});
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async getRoles(categoryId: CategoryIdDto): Promise<AppResponse> {
		try {
			const res = await this._roleListModel.findAll({
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

	async getCountryCode(): Promise<AppResponse> {
		try {
			const res = await this._countryCodeModel.findAll({
				attributes: [CountryCodeColumns.CountryCodeId, CountryCodeColumns.CountryName, CountryCodeColumns.CountryCode]
			});
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async getJoints(jointInfo: JointDto): Promise<AppResponse> {
		try {
			const filter = {};
			if (jointInfo?.productId) filter[JointColumns.ProductId] = { [Op.in]: jointInfo?.productId };
			const res = await this._jointListModel.findAll({
				attributes: [JointColumns.JointId, JointColumns.JointName, JointColumns.ProductId],
				where: { ...filter }
			});
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async getExpertise(): Promise<AppResponse> {
		try {
			const res = await this._expertiseTypeModel.findAll({
				attributes: [ExpertiseTypeColumns.ExpertTypeId, ExpertiseTypeColumns.ExpertTypeName]
			});
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async getExpertiseLevel(): Promise<AppResponse> {
		try {
			const res = await this._expertiseLevelModel.findAll({
				attributes: [ExpertiseLevelColumns.ExpertLevelId, ExpertiseLevelColumns.ExpertLevelName]
			});
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async getSubJointLevel(jointId: SubJointDto): Promise<AppResponse> {
		try {
			const filter = {};
			if (jointId?.jointId) filter[SubJointColumns.JointId] = { [Op.in]: jointId?.jointId };
			const res = await this._subJointModel.findAll({
				where: { ...filter },
				attributes: [SubJointColumns.SubJointId, SubJointColumns.SubJointName, SubJointColumns.JointId]
			});
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async getJointerStatus(): Promise<AppResponse> {
		try {
			const res = await this._jointerStatusModel.findAll({
				attributes: [JointerStatusColumns.JStatusId, JointerStatusColumns.JStatusName]
			});
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async getCity(): Promise<AppResponse> {
		try {
			const res = await this._cityModel.findAll({
				attributes: [CityColumns.CityId, CityColumns.CityName]
			});
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async getCityFromGeoInfo(cityInfo: CityDto): Promise<AppResponse> {
		try {
			const res = await this._companyGeographyInfoModel.findAll({
				where: {
					[CompanyGeographyInfoColumns.CompanyId]: cityInfo.companyId,
					[CompanyGeographyInfoColumns.EffectiveFromUTC]: { [Op.lte]: currentISODate() },
					[CompanyGeographyInfoColumns.EffectiveTillUTC]: { [Op.gte]: currentISODate() }
				},
				attributes: [
					[literal(`DISTINCT ${this._companyGeographyInfoModel.name}.${CompanyGeographyInfoColumns.CityId}`), CompanyGeographyInfoColumns.CityId]
				],
				include: [
					{
						model: this._cityModel,
						as: CompanyGeographyInfoAlias.City,
						attributes: [CityColumns.CityName]
					}
				],
				raw: true
			});
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async getSiteState(): Promise<AppResponse> {
		try {
			const res = await this._siteStateModel.findAll({
				attributes: [SiteStateColumns.SiteStateId, SiteStateColumns.SiteStateName]
			});
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async getVoltage(): Promise<AppResponse> {
		try {
			const res = await this._voltageModel.findAll({
				attributes: [VoltageColumn.VoltageId, VoltageColumn.VoltageName]
			});
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async getJointingCheckList(voltage: VoltageDto): Promise<AppResponse> {
		try {
			const filter = {};
			if (voltage?.voltageId) filter[JointingCheckListColumns.VoltageId] = voltage?.voltageId;
			const res = await this._JointingCheckListModel.findAll({
				where: { ...filter },
				attributes: [JointingCheckListColumns.JointingCheckListGuid, JointingCheckListColumns.JointingCheckListName]
			});
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async getJobTypeList(): Promise<AppResponse> {
		try {
			const res = await this._jobTypeModel.findAll({
				attributes: [JobTypeColumns.JobTypeId, JobTypeColumns.JobTypeName]
			});
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async getMasterActivityFlowList(subJoint: ActivityFlowDto): Promise<AppResponse> {
		try {
			const filter = {};
			if (subJoint?.subJointId) filter[ActivityFlowColumn.SubJointId] = subJoint?.subJointId;
			else filter[ActivityFlowColumn.SubProductId] = subJoint?.subProductId;

			const res = await this._activityFLowModel.findAll({
				where: { ...filter },
				attributes: [ActivityFlowColumn.ActivityFlowGuid, ActivityFlowColumn.ActivityName]
			});
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async getMasterUserCategories(): Promise<AppResponse> {
		try {
			const res = await this._categoryModel.findAll({
				attributes: [CategoryColumns.CategoryId, CategoryColumns.CategoryName]
			});
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async companyList(): Promise<AppResponse> {
		try {
			const res = await this._companyModel.findAll({
				attributes: [CompanyColumns.CompanyId, CompanyColumns.CompanyName]
			});
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async divisionList(divisionInfo: DivisionDto): Promise<AppResponse> {
		try {
			const filter = {};
			if (divisionInfo?.cityId) filter[DivisionColumns.CityId] = divisionInfo?.cityId;
			const res = await this._divisionModel.findAll({
				where: { ...filter },
				attributes: [DivisionColumns.DivisionId, DivisionColumns.DivisionName]
			});
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async kitStatus(): Promise<AppResponse> {
		try {
			const res = await this._kitStatusModel.findAll({
				attributes: [KitStatusColumns.KitStatusId, KitStatusColumns.KitStatusName]
			});
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async excavationCondition(): Promise<AppResponse> {
		try {
			const res = await this._excavationConditionModel.findAll({
				attributes: [ExcavationConditionColumns.ExcavationConditionId, ExcavationConditionColumns.ExcavationConditionName]
			});
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async jointerCategory(): Promise<AppResponse> {
		try {
			const res = await this._jointerCategoryModel.findAll({
				attributes: [JointerCategoryColumns.JointerCategoryId, JointerCategoryColumns.JointerCategoryName]
			});
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async divisionListFromGeoInfo(divisionInfo: DivisionDto): Promise<AppResponse> {
		try {
			const res = await this._companyGeographyInfoModel.findAll({
				where: {
					[CompanyGeographyInfoColumns.CityId]: divisionInfo.cityId,
					[CompanyGeographyInfoColumns.CompanyId]: divisionInfo.companyId,
					[CompanyGeographyInfoColumns.EffectiveFromUTC]: { [Op.lte]: currentISODate() },
					[CompanyGeographyInfoColumns.EffectiveTillUTC]: { [Op.gte]: currentISODate() }
				},
				attributes: [
					[
						literal(`DISTINCT ${this._companyGeographyInfoModel.name}.${CompanyGeographyInfoColumns.DivisionId}`),
						CompanyGeographyInfoColumns.DivisionId
					]
				],
				include: [
					{
						model: this._divisionModel,
						as: CompanyGeographyInfoAlias.Division,
						attributes: [DivisionColumns.DivisionName]
					}
				],
				raw: true
			});
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async unitList(unitInfo: UnitDto): Promise<AppResponse> {
		try {
			const filter = {};
			if (unitInfo?.divisionId) filter[UnitColumns.DivisionId] = unitInfo?.divisionId;
			const res = await this._unitModel.findAll({
				where: { ...filter },
				attributes: [UnitColumns.UnitId, UnitColumns.UnitName]
			});
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async productCategoryList(): Promise<AppResponse> {
		try {
			const res = await this._ProductModel.findAll({
				attributes: [ProductColumns.ProductId, ProductColumns.ProductName]
			});
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async productListCompany(companyInfo: CompanyProductDto): Promise<AppResponse> {
		try {
			const filter = {};
			if (companyInfo?.companyId) filter[CompanyProductColumns.CompanyId] = companyInfo?.companyId;
			const res = await this._companyProductModel.findAll({
				where: { ...filter },
				attributes: [CompanyProductColumns.CompanyProductGuid],
				include: [
					{
						model: this._ProductModel,
						as: CompanyProductAlias.Product,
						attributes: [ProductColumns.ProductId, ProductColumns.ProductName]
					}
				]
			});
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async jointListCompany(companyInfo: CompanyJointDto): Promise<AppResponse> {
		try {
			const res = await this._companyProductModel.findAll({
				where: {
					[CompanyProductColumns.CompanyId]: companyInfo?.companyId,
					[CompanyProductColumns.ProductId]: companyInfo?.productId
				},
				attributes: [CompanyProductColumns.CompanyProductGuid],
				include: [
					{
						model: this._jointListModel,
						as: CompanyProductAlias.Joint,
						attributes: [JointColumns.JointId, JointColumns.JointName]
					}
				]
			});
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async subJointListCompany(companyInfo: CompanySubJointDto): Promise<AppResponse> {
		try {
			const res = await this._companyProductModel.findAll({
				where: {
					[CompanyProductColumns.CompanyId]: companyInfo?.companyId,
					[CompanyProductColumns.ProductId]: companyInfo?.productId,
					[CompanyProductColumns.JointId]: companyInfo?.jointId
				},
				attributes: [CompanyProductColumns.CompanyProductGuid],
				include: [
					{
						model: this._subJointModel,
						as: CompanyProductAlias.SubJoint,
						attributes: [SubJointColumns.SubJointId, SubJointColumns.SubJointName]
					}
				]
			});
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async subProductListCompany(companyInfo: CompanySubProductDto): Promise<AppResponse> {
		try {
			const res = await this._companyProductModel.findAll({
				where: {
					[CompanyProductColumns.CompanyId]: companyInfo?.companyId,
					[CompanyProductColumns.ProductId]: companyInfo?.productId,
					[CompanyProductColumns.JointId]: companyInfo?.jointId,
					[CompanyProductColumns.SubJointId]: companyInfo?.subJointId
				},
				attributes: [CompanyProductColumns.CompanyProductGuid],
				include: [
					{
						model: this._subProductModel,
						as: CompanyProductAlias.SubProductCategory,
						attributes: [SubProductColumns.SubProductId, SubProductColumns.SubProductName]
					}
				]
			});
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async subProductCategoryList(subCategoryInfo: SubProductCategoryDto): Promise<AppResponse> {
		try {
			const filter = {};
			if (subCategoryInfo?.subJointId) filter[SubProductColumns.SubJointId] = { [Op.in]: subCategoryInfo?.subJointId };
			const res = await this._subProductModel.findAll({
				where: { ...filter },
				attributes: [SubProductColumns.SubProductId, SubProductColumns.SubProductName, SubProductColumns.SubJointId]
			});
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async preInstallationList(jointId: PreInstallationDto): Promise<AppResponse> {
		try {
			const filter = {};
			if (jointId?.jointId) filter[PreInstallationColumns.JointId] = jointId?.jointId;
			const res = await this._preInstallationModel.findAll({
				where: { ...filter },
				attributes: [PreInstallationColumns.PreInstallationGuid, PreInstallationColumns.PreInstallationName]
			});
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async companyProject(companyInfo: CompanyProjectDto): Promise<AppResponse> {
		try {
			const filter = {};
			if (companyInfo?.companyId) filter[CompanyProjectColumns.CompanyId] = companyInfo?.companyId;

			const res = await this._companyProjectModel.findAll({
				where: { ...filter },
				attributes: [],
				include: [
					{
						model: this._projectModel,
						as: CompanyProjectAlias.Project,
						attributes: [ProjectColumns.ProjectId, ProjectColumns.ProjectName]
					}
				]
			});
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async unitListFromGeoInfo(unitInfo: UnitDto): Promise<AppResponse> {
		try {
			const res = await this._companyGeographyInfoModel.findAll({
				where: {
					[CompanyGeographyInfoColumns.CityId]: unitInfo.cityId,
					[CompanyGeographyInfoColumns.CompanyId]: unitInfo.companyId,
					[CompanyGeographyInfoColumns.DivisionId]: unitInfo.divisionId,
					[CompanyGeographyInfoColumns.EffectiveFromUTC]: { [Op.lte]: currentISODate() },
					[CompanyGeographyInfoColumns.EffectiveTillUTC]: { [Op.gte]: currentISODate() }
				},
				attributes: [
					[literal(`DISTINCT ${this._companyGeographyInfoModel.name}.${CompanyGeographyInfoColumns.UnitId}`), CompanyGeographyInfoColumns.UnitId]
				],
				include: [
					{
						model: this._unitModel,
						as: CompanyGeographyInfoAlias.Unit,
						attributes: [UnitColumns.UnitName]
					}
				],
				raw: true
			});
			return createResponse(HttpStatus.OK, messages.S4, res);
		} catch (error) {
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}

	async addMasters(tableInfo: MasterTableDto, claims: AtPayload): Promise<AppResponse> {
		const transaction = await this._sequelize.transaction();
		try {
			const commonColumns = {
				createdBy: UnitColumns.CreatedBy,
				createdOnUTC: UnitColumns.CreatedOnUTC
			};
			const bulkCreate = [];

			const modelMap = {
				[MasterTableEnum.ExpertiseLevel]: {
					model: this._expertiseLevelModel,
					column: {
						id: ExpertiseLevelColumns.ExpertLevelId,
						name: ExpertiseLevelColumns.ExpertLevelName,
						...commonColumns
					}
				},
				[MasterTableEnum.ExpertiseType]: {
					model: this._expertiseTypeModel,
					column: {
						id: ExpertiseTypeColumns.ExpertTypeId,
						name: ExpertiseTypeColumns.ExpertTypeName,
						...commonColumns
					}
				},
				[MasterTableEnum.JobType]: {
					model: this._jobTypeModel,
					column: {
						id: JobTypeColumns.JobTypeId,
						name: JobTypeColumns.JobTypeName,
						...commonColumns
					}
				},
				[MasterTableEnum.SiteState]: {
					model: this._siteStateModel,
					column: {
						id: SiteStateColumns.SiteStateId,
						name: SiteStateColumns.SiteStateName,
						...commonColumns
					}
				},
				[MasterTableEnum.Voltage]: {
					model: this._voltageModel,
					column: {
						id: VoltageColumn.VoltageId,
						name: VoltageColumn.VoltageName,
						...commonColumns
					}
				},
				[MasterTableEnum.City]: {
					model: this._cityModel,
					column: {
						id: CityColumns.CityId,
						name: CityColumns.CityName,
						...commonColumns
					}
				},
				[MasterTableEnum.Product]: {
					model: this._ProductModel,
					column: {
						id: ProductColumns.ProductId,
						name: ProductColumns.ProductName,
						...commonColumns
					}
				},
				[MasterTableEnum.SafetyCheckList]: {
					model: this._safetyListModel,
					column: {
						id: SafetyCheckListColumns.SCheckListId,
						name: SafetyCheckListColumns.SCheckListName,
						effectiveFromUTC: SafetyCheckListColumns.EffectiveFromUTC,
						effectiveTillUTC: SafetyCheckListColumns.EffectiveTillUTC,
						...commonColumns
					}
				}
			};

			const { model: selectedModel, column } = modelMap[tableInfo.tableName];
			const id = await selectedModel.max(column.id);
			let newId = Number(id) + 1;

			for (const name of tableInfo.name) {
				const existingRecord = await selectedModel.findOne({
					where: where(fn('lower', col(column.name)), fn('lower', name))
				});
				if (!existingRecord) {
					const obj = {
						[column.id]: newId,
						[column.name]: name,
						[column.createdBy]: claims.sub,
						[column.createdOnUTC]: currentISODate()
					};

					if (tableInfo.tableName === MasterTableEnum.SafetyCheckList) {
						obj[column.effectiveFromUTC] = currentISODate();
						obj[column.effectiveTillUTC] = maxISODate();
					}

					bulkCreate.push(obj);
					newId++;
				}
			}
			await selectedModel.bulkCreate(bulkCreate, { transaction: transaction });
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

	async hierarchyAddMasters(tableInfo: HierarchyMasterTableDto, claims: AtPayload): Promise<AppResponse> {
		const transaction = await this._sequelize.transaction();
		try {
			let existingRecord;
			const created: any = {
				[CityColumns.CreatedBy]: claims.sub,
				[CityColumns.CreatedOnUTC]: currentISODate()
			};
			const effective: any = {
				[ActivityFlowColumn.EffectiveFromUTC]: currentISODate(),
				[ActivityFlowColumn.EffectiveTillUTC]: maxISODate()
			};
			const bulkCreate = [];

			if (tableInfo.tableName === HierarchyMasterTableEnum.ActivityFlow) {
				for (const name of tableInfo.name) {
					existingRecord = await this._activityFLowModel.findOne({
						where: where(fn('lower', col(ActivityFlowColumn.ActivityName)), fn('lower', name))
					});
					if (!existingRecord) {
						const obj = {
							...created,
							...effective,
							[ActivityFlowColumn.ActivityFlowGuid]: uuidv4(),
							[ActivityFlowColumn.ActivityName]: name,
							[ActivityFlowColumn.SubJointId]: tableInfo.type === activityType.SubJoint ? tableInfo.parentId : null,
							[ActivityFlowColumn.SubProductId]: tableInfo.type === activityType.SubProduct ? tableInfo.parentId : null
						};
						bulkCreate.push(obj);
					}
				}
				await this._activityFLowModel.bulkCreate(bulkCreate, { transaction: transaction });
			} else if (tableInfo.tableName === HierarchyMasterTableEnum.SubJoint) {
				const id = await this._subJointModel.max(SubJointColumns.SubJointId);
				let newId = Number(id) + 1;
				for (const name of tableInfo.name) {
					existingRecord = await this._subJointModel.findOne({
						where: where(fn('lower', col(SubJointColumns.SubJointName)), fn('lower', name))
					});
					if (!existingRecord) {
						const obj = {
							...created,
							[SubJointColumns.SubJointId]: newId,
							[SubJointColumns.SubJointName]: name,
							[SubJointColumns.JointId]: tableInfo.parentId
						};
						bulkCreate.push(obj);
						newId = Number(newId) + 1;
					}
				}
				await this._subJointModel.bulkCreate(bulkCreate, { transaction: transaction });
			} else if (tableInfo.tableName === HierarchyMasterTableEnum.SubProduct) {
				const id = await this._subProductModel.max(SubProductColumns.SubProductId);
				let newId = Number(id) + 1;
				for (const name of tableInfo.name) {
					existingRecord = await this._subProductModel.findOne({
						where: where(fn('lower', col(SubProductColumns.SubProductName)), fn('lower', name))
					});
					if (!existingRecord) {
						const obj = {
							...created,
							[SubProductColumns.SubProductId]: newId,
							[SubProductColumns.SubProductName]: name,
							[SubProductColumns.SubJointId]: tableInfo.parentId
						};
						bulkCreate.push(obj);
						newId = Number(newId) + 1;
					}
				}
				await this._subProductModel.bulkCreate(bulkCreate, { transaction: transaction });
			} else if (tableInfo.tableName === HierarchyMasterTableEnum.JointingCheckList) {
				for (const name of tableInfo.name) {
					existingRecord = await this._JointingCheckListModel.findOne({
						where: where(fn('lower', col(JointingCheckListColumns.JointingCheckListName)), fn('lower', name))
					});
					if (!existingRecord) {
						const obj = {
							...created,
							...effective,
							[JointingCheckListColumns.JointingCheckListGuid]: uuidv4(),
							[JointingCheckListColumns.JointingCheckListName]: name,
							[JointingCheckListColumns.VoltageId]: tableInfo.parentId
						};
						bulkCreate.push(obj);
					}
				}
				await this._JointingCheckListModel.bulkCreate(bulkCreate, { transaction: transaction });
			} else if (tableInfo.tableName === HierarchyMasterTableEnum.Division) {
				const id = await this._divisionModel.max(DivisionColumns.DivisionId);
				let newId = Number(id) + 1;
				for (const name of tableInfo.name) {
					existingRecord = await this._divisionModel.findOne({
						where: where(fn('lower', col(DivisionColumns.DivisionName)), fn('lower', name))
					});
					if (!existingRecord) {
						const obj = {
							...created,
							[DivisionColumns.DivisionId]: newId,
							[DivisionColumns.DivisionName]: name,
							[DivisionColumns.CityId]: tableInfo.parentId
						};
						bulkCreate.push(obj);
						newId = Number(newId) + 1;
					}
				}
				await this._divisionModel.bulkCreate(bulkCreate, { transaction: transaction });
			} else if (tableInfo.tableName === HierarchyMasterTableEnum.Unit) {
				const id = await this._unitModel.max(UnitColumns.UnitId);
				let newId = Number(id) + 1;
				for (const name of tableInfo.name) {
					existingRecord = await this._unitModel.findOne({
						where: where(fn('lower', col(UnitColumns.UnitName)), fn('lower', name))
					});
					if (!existingRecord) {
						const obj = {
							...created,
							[UnitColumns.UnitId]: newId,
							[UnitColumns.UnitName]: name,
							[UnitColumns.DivisionId]: tableInfo.parentId
						};
						bulkCreate.push(obj);
						newId = Number(newId) + 1;
					}
				}
				await this._unitModel.bulkCreate(bulkCreate, { transaction: transaction });
			} else if (tableInfo.tableName === HierarchyMasterTableEnum.Joint) {
				const id = await this._jointListModel.max(JointColumns.JointId);
				let newId = Number(id) + 1;
				for (const name of tableInfo.name) {
					existingRecord = await this._jointListModel.findOne({
						where: where(fn('lower', col(JointColumns.JointName)), fn('lower', name))
					});
					if (!existingRecord) {
						const obj = {
							...created,
							[JointColumns.JointId]: newId,
							[JointColumns.JointName]: name,
							[JointColumns.ProductId]: tableInfo.parentId
						};
						bulkCreate.push(obj);
						newId = Number(newId) + 1;
					}
				}
				await this._jointListModel.bulkCreate(bulkCreate, { transaction: transaction });
			} else if (tableInfo.tableName === HierarchyMasterTableEnum.PreInstallation) {
				for (const name of tableInfo.name) {
					existingRecord = await this._preInstallationModel.findOne({
						where: where(fn('lower', col(PreInstallationColumns.PreInstallationName)), fn('lower', name))
					});
					if (!existingRecord) {
						const obj = {
							...created,
							[PreInstallationColumns.PreInstallationGuid]: uuidv4(),
							[PreInstallationColumns.PreInstallationName]: name,
							[PreInstallationColumns.JointId]: tableInfo.parentId
						};
						bulkCreate.push(obj);
					}
				}
				await this._preInstallationModel.bulkCreate(bulkCreate, { transaction: transaction });
			} else {
				return createResponse(HttpStatus.BAD_REQUEST, messages.W27);
			}
			await transaction.commit();
			return createResponse(HttpStatus.OK, messages.S4);
		} catch (error) {
			if (transaction) {
				transaction.rollback();
			}
			this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR, claims.sid);
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
		}
	}
}
