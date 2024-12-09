import { Authorize } from '@app/core/decorators/authorization.decorator';
import { AppResponse } from '@app/shared/app-response.shared';
import { Body, Controller, Get, Post, Req } from '@nestjs/common';
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

@Controller('master')
export class MasterController {
	constructor(private readonly _masterService: MasterAbstractSvc) {}

	@Authorize()
	@Get('v1/safety-check-list')
	async safetyCheckList(): Promise<AppResponse> {
		return this._masterService.getSafetyCheckList();
	}

	@Authorize()
	@Post('v1/role')
	async roleList(@Body() categoryId: CategoryIdDto): Promise<AppResponse> {
		return this._masterService.getRoleList(categoryId);
	}

	@Get('v1/country-code')
	async countryCodeList(): Promise<AppResponse> {
		return this._masterService.getCountryCodeList();
	}

	@Authorize()
	@Post('v1/joint')
	async jointList(@Body() jointInfo: JointDto): Promise<AppResponse> {
		return this._masterService.getJointList(jointInfo);
	}

	@Authorize()
	@Get('v1/expertise-type')
	async expertiseType(): Promise<AppResponse> {
		return this._masterService.getExpertiseTypeList();
	}

	@Authorize()
	@Get('v1/expertise-level')
	async expertiseLevel(): Promise<AppResponse> {
		return this._masterService.getExpertiseLevelList();
	}

	@Authorize()
	@Post('v1/sub-joint')
	async subJointLevel(@Req() req: any, @Body() jointId: SubJointDto): Promise<AppResponse> {
		return this._masterService.getSubJointLevelList(jointId);
	}

	@Authorize()
	@Get('v1/jointer-status')
	async jointerStatus(): Promise<AppResponse> {
		return this._masterService.getJointerStatusList();
	}

	@Authorize()
	@Post('v1/city')
	async cityMaster(@Body() cityInfo: CityDto): Promise<AppResponse> {
		return this._masterService.getCityList(cityInfo);
	}

	@Authorize()
	@Get('v1/site-state')
	async siteState(): Promise<AppResponse> {
		return this._masterService.getSiteStateList();
	}

	@Authorize()
	@Get('v1/voltage')
	async voltage(): Promise<AppResponse> {
		return this._masterService.getVoltageList();
	}

	@Authorize()
	@Post('v1/jointing-check-list')
	async jointingCheckList(@Req() req: any, @Body() voltage: VoltageDto): Promise<AppResponse> {
		return this._masterService.getJointingCheckList(voltage);
	}

	@Authorize()
	@Get('v1/job-type')
	async jobTypeList(): Promise<AppResponse> {
		return this._masterService.getJobTypeList();
	}

	@Authorize()
	@Post('v1/activity-flow')
	async masterActivityFlowList(@Req() req: any, @Body() subJoint: ActivityFlowDto): Promise<AppResponse> {
		return this._masterService.getMasterActivityFlowList(subJoint);
	}

	@Authorize()
	@Get('v1/user-categories')
	async masterUserCategoriesList(): Promise<AppResponse> {
		return this._masterService.getMasterUserCategoriesList();
	}

	@Authorize()
	@Get('v1/company')
	async companyList(): Promise<AppResponse> {
		return this._masterService.companyList();
	}

	@Authorize()
	@Post('v1/division')
	async divisionList(@Body() divisionInfo: DivisionDto): Promise<AppResponse> {
		return this._masterService.divisionList(divisionInfo);
	}

	@Authorize()
	@Post('v1/unit')
	async unitList(@Body() unitInfo: UnitDto): Promise<AppResponse> {
		return this._masterService.unitList(unitInfo);
	}

	@Authorize()
	@Get('v1/product-category')
	async productCategoryList(): Promise<AppResponse> {
		return this._masterService.productCategoryList();
	}

	@Authorize()
	@Post('v1/product-company')
	async productListCompany(@Body() companyInfo: CompanyProductDto): Promise<AppResponse> {
		return this._masterService.productListCompany(companyInfo);
	}

	@Authorize()
	@Post('v1/joint-company')
	async jointListCompany(@Body() companyInfo: CompanyJointDto): Promise<AppResponse> {
		return this._masterService.jointListCompany(companyInfo);
	}

	@Authorize()
	@Post('v1/subJoint-company')
	async subJointListCompany(@Body() companyInfo: CompanySubJointDto): Promise<AppResponse> {
		return this._masterService.subJointListCompany(companyInfo);
	}

	@Authorize()
	@Post('v1/subProduct-company')
	async subProductListCompany(@Body() companyInfo: CompanySubProductDto): Promise<AppResponse> {
		return this._masterService.subProductListCompany(companyInfo);
	}

	@Authorize()
	@Post('v1/sub-product-category')
	async subProductCategoryList(@Body() subCategoryInfo: SubProductCategoryDto): Promise<AppResponse> {
		return this._masterService.subProductCategoryList(subCategoryInfo);
	}

	@Authorize()
	@Post('v1/company-project')
	async companyProject(@Body() companyInfo: CompanyProjectDto): Promise<AppResponse> {
		return this._masterService.companyProject(companyInfo);
	}

	@Authorize()
	@Post('v1/pre-installation')
	async preInstallationList(@Body() jointId: PreInstallationDto): Promise<AppResponse> {
		return this._masterService.preInstallationList(jointId);
	}

	@Authorize()
	@Get('v1/kit-status')
	async kitStatus(): Promise<AppResponse> {
		return this._masterService.kitStatus();
	}

	@Authorize()
	@Get('v1/excavation-condition')
	async excavationCondition(): Promise<AppResponse> {
		return this._masterService.excavationCondition();
	}

	@Authorize()
	@Get('v1/jointer-category')
	async jointerCategory(): Promise<AppResponse> {
		return this._masterService.jointerCategory();
	}

	@Authorize()
	@Post('v1/create-masters-data')
	async addMasters(@Req() req: any, @Body() tableInfo: MasterTableDto): Promise<AppResponse> {
		return this._masterService.addMasters(tableInfo, req.claims);
	}

	@Authorize()
	@Post('v1/create-masters-hierarchy')
	async hierarchyAddMasters(@Req() req: any, @Body() tableInfo: HierarchyMasterTableDto): Promise<AppResponse> {
		return this._masterService.hierarchyAddMasters(tableInfo, req.claims);
	}
}
