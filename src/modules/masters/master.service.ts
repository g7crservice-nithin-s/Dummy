import { AppConfigService } from '@app/config/app-config.service';
import AppLogger from '@app/core/logger/app-logger';
import { DatabaseService } from '@app/database/database.service';
import { MasterAbstractSqlDao } from '@app/database/mssql/abstract/master.abstract';
import { CompanyProjectAlias } from '@app/database/mssql/models/company.company-project.model';
import { AppResponse, createResponse } from '@app/shared/app-response.shared';
import { messageFactory, messages } from '@app/shared/messages.shared';
import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AtPayload } from '../auth/model/jwt-payload.model';
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
} from './dto/master.dto';
import { MasterAbstractSvc } from './master.abstract';
import { HierarchyMasterTableEnum } from '@app/core/enums/master-table.enum';
import { CompanyProductAlias } from '@app/database/mssql/models/company.company-product.model';
import { ProductColumns } from '@app/database/mssql/models/masters.product.model';
import { JointColumns } from '@app/database/mssql/models/masters.joint.model';
import { SubJointColumns } from '@app/database/mssql/models/masters.sub-joint.model';
import { SubProductColumns } from '@app/database/mssql/models/masters.sub-product.model';

@Injectable()
export class MasterService implements MasterAbstractSvc {
	private readonly _masterAccount: MasterAbstractSqlDao;

	constructor(
		readonly _dbSvc: DatabaseService,
		private readonly _loggerSvc: AppLogger,
		private readonly _appConfigSvc: AppConfigService,
		private readonly _jwtService: JwtService
	) {
		this._masterAccount = _dbSvc.masterSqlTxn;
	}

	async getSafetyCheckList(): Promise<AppResponse> {
		return await this._masterAccount.getSafetyList();
	}

	async getRoleList(categoryId: CategoryIdDto): Promise<AppResponse> {
		return await this._masterAccount.getRoles(categoryId);
	}

	async getCountryCodeList(): Promise<AppResponse> {
		return await this._masterAccount.getCountryCode();
	}

	async getJointList(jointInfo: JointDto): Promise<AppResponse> {
		return await this._masterAccount.getJoints(jointInfo);
	}

	async getExpertiseTypeList(): Promise<AppResponse> {
		return await this._masterAccount.getExpertise();
	}

	async getExpertiseLevelList(): Promise<AppResponse> {
		return await this._masterAccount.getExpertiseLevel();
	}

	async getSubJointLevelList(jointId: SubJointDto): Promise<AppResponse> {
		return await this._masterAccount.getSubJointLevel(jointId);
	}

	async getJointerStatusList(): Promise<AppResponse> {
		return await this._masterAccount.getJointerStatus();
	}

	async getCityList(cityInfo: CityDto): Promise<AppResponse> {
		if (cityInfo.companyId) return await this._masterAccount.getCityFromGeoInfo(cityInfo);
		return await this._masterAccount.getCity();
	}

	async getSiteStateList(): Promise<AppResponse> {
		return await this._masterAccount.getSiteState();
	}

	async getVoltageList(): Promise<AppResponse> {
		return await this._masterAccount.getVoltage();
	}

	async getJointingCheckList(voltage: VoltageDto): Promise<AppResponse> {
		return await this._masterAccount.getJointingCheckList(voltage);
	}

	async getJobTypeList(): Promise<AppResponse> {
		return await this._masterAccount.getJobTypeList();
	}

	async getMasterActivityFlowList(subJoint: ActivityFlowDto): Promise<AppResponse> {
		if (!subJoint?.subJointId && !subJoint?.subProductId)
			return createResponse(HttpStatus.BAD_REQUEST, messageFactory(messages.W1, ['sub joint or sub product']));
		if (subJoint?.subJointId && subJoint?.subProductId) return createResponse(HttpStatus.BAD_REQUEST, messages.W48);
		return await this._masterAccount.getMasterActivityFlowList(subJoint);
	}

	async getMasterUserCategoriesList(): Promise<AppResponse> {
		return await this._masterAccount.getMasterUserCategories();
	}

	async companyList(): Promise<AppResponse> {
		return await this._masterAccount.companyList();
	}

	async unitList(unitInfo: UnitDto): Promise<AppResponse> {
		if (unitInfo.cityId && unitInfo.companyId && unitInfo.divisionId) return await this._masterAccount.unitListFromGeoInfo(unitInfo);
		return await this._masterAccount.unitList(unitInfo);
	}

	async productCategoryList(): Promise<AppResponse> {
		return await this._masterAccount.productCategoryList();
	}

	async productListCompany(companyInfo: CompanyProductDto): Promise<AppResponse> {
		const res = await this._masterAccount.productListCompany(companyInfo);
		if (res?.code !== HttpStatus.OK) return res;

		const uniqueProducts = [];
		const seenProductIds = new Set();

		res?.data.forEach((item: any) => {
			const productId = item[CompanyProductAlias.Product][ProductColumns.ProductId];
			const productName = item[CompanyProductAlias.Product][ProductColumns.ProductName];

			if (!seenProductIds.has(productId)) {
				seenProductIds.add(productId);
				uniqueProducts.push({ ProductId: productId, ProductName: productName });
			}
		});
		return createResponse(HttpStatus.OK, messages.S4, uniqueProducts);
	}

	async jointListCompany(companyInfo: CompanyJointDto): Promise<AppResponse> {
		const res = await this._masterAccount.jointListCompany(companyInfo);
		if (res?.code !== HttpStatus.OK) return res;

		const uniqueProducts = [];
		const seenProductIds = new Set();

		res?.data.forEach((item: any) => {
			const jointId = item[CompanyProductAlias.Joint][JointColumns.JointId];
			const jointName = item[CompanyProductAlias.Joint][JointColumns.JointName];

			if (!seenProductIds.has(jointId)) {
				seenProductIds.add(jointId);
				uniqueProducts.push({ JointId: jointId, JointName: jointName });
			}
		});
		return createResponse(HttpStatus.OK, messages.S4, uniqueProducts);
	}

	async subJointListCompany(companyInfo: CompanySubJointDto): Promise<AppResponse> {
		const res = await this._masterAccount.subJointListCompany(companyInfo);
		if (res?.code !== HttpStatus.OK) return res;

		const uniqueProducts = [];
		const seenProductIds = new Set();

		res?.data.forEach((item: any) => {
			const subJointId = item[CompanyProductAlias.SubJoint][SubJointColumns.SubJointId];
			const subJointName = item[CompanyProductAlias.SubJoint][SubJointColumns.SubJointName];

			if (!seenProductIds.has(subJointId)) {
				seenProductIds.add(subJointId);
				uniqueProducts.push({ SubJointId: subJointId, SubJointName: subJointName });
			}
		});
		return createResponse(HttpStatus.OK, messages.S4, uniqueProducts);
	}

	async subProductListCompany(companyInfo: CompanySubProductDto): Promise<AppResponse> {
		const res = await this._masterAccount.subProductListCompany(companyInfo);
		if (res?.code !== HttpStatus.OK) return res;

		const uniqueProducts = [];
		const seenProductIds = new Set();

		res?.data?.forEach((item: any) => {
			if (item?.SubProductCategory !== null) {
				const subProductId = item[CompanyProductAlias.SubProductCategory][SubProductColumns.SubProductId];
				const subProductName = item[CompanyProductAlias.SubProductCategory][SubProductColumns.SubProductName];

				if (!seenProductIds.has(subProductId)) {
					seenProductIds.add(subProductId);
					uniqueProducts.push({ SubProductId: subProductId, SubProductName: subProductName });
				}
			}
		});
		return createResponse(HttpStatus.OK, messages.S4, uniqueProducts);
	}

	async subProductCategoryList(subCategoryInfo: SubProductCategoryDto): Promise<AppResponse> {
		return await this._masterAccount.subProductCategoryList(subCategoryInfo);
	}

	async preInstallationList(jointId: PreInstallationDto): Promise<AppResponse> {
		return await this._masterAccount.preInstallationList(jointId);
	}

	async companyProject(companyInfo: CompanyProjectDto): Promise<AppResponse> {
		const res = await this._masterAccount.companyProject(companyInfo);
		if (res?.code !== HttpStatus.OK) return res;
		const data = res?.data?.map((data) => data[CompanyProjectAlias.Project]);
		return createResponse(HttpStatus.OK, messages.S4, data);
	}

	async divisionList(divisionInfo: DivisionDto): Promise<AppResponse> {
		if (divisionInfo.cityId && divisionInfo.companyId) return this._masterAccount.divisionListFromGeoInfo(divisionInfo);
		return await this._masterAccount.divisionList(divisionInfo);
	}

	async kitStatus(): Promise<AppResponse> {
		return await this._masterAccount.kitStatus();
	}

	async excavationCondition(): Promise<AppResponse> {
		return await this._masterAccount.excavationCondition();
	}

	async jointerCategory(): Promise<AppResponse> {
		return await this._masterAccount.jointerCategory();
	}

	async addMasters(tableInfo: MasterTableDto, claims: AtPayload): Promise<AppResponse> {
		const filteredNames = tableInfo?.name?.filter((name) => name.trim() === '');
		if (filteredNames?.length > 0) return createResponse(HttpStatus.BAD_REQUEST, messages.W33);
		return await this._masterAccount.addMasters(tableInfo, claims);
	}

	async hierarchyAddMasters(tableInfo: HierarchyMasterTableDto, claims: AtPayload): Promise<AppResponse> {
		const filteredNames = tableInfo?.name?.filter((name) => name.trim() === '');
		if (filteredNames?.length > 0) return createResponse(HttpStatus.BAD_REQUEST, messages.W33);
		if (tableInfo.tableName === HierarchyMasterTableEnum.ActivityFlow) {
			if (!tableInfo.type) return createResponse(HttpStatus.BAD_REQUEST, messageFactory(messages.W1, ['activity type']));
		}
		return await this._masterAccount.hierarchyAddMasters(tableInfo, claims);
	}
}
