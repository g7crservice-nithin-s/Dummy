import { AppResponse } from '@app/shared/app-response.shared';
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
import { AtPayload } from '../auth/model/jwt-payload.model';

export abstract class MasterAbstractSvc {
	abstract getSafetyCheckList(): Promise<AppResponse>;
	abstract getRoleList(categoryId: CategoryIdDto): Promise<AppResponse>;
	abstract getCountryCodeList(): Promise<AppResponse>;
	abstract getJointList(jointInfo: JointDto): Promise<AppResponse>;
	abstract getExpertiseTypeList(): Promise<AppResponse>;
	abstract getExpertiseLevelList(): Promise<AppResponse>;
	abstract getSubJointLevelList(jointId: SubJointDto): Promise<AppResponse>;
	abstract getJointerStatusList(): Promise<AppResponse>;
	abstract getCityList(cityInfo: CityDto): Promise<AppResponse>;
	abstract getSiteStateList(): Promise<AppResponse>;
	abstract getVoltageList(): Promise<AppResponse>;
	abstract getJointingCheckList(voltage: VoltageDto): Promise<AppResponse>;
	abstract getJobTypeList(): Promise<AppResponse>;
	abstract getMasterActivityFlowList(subJoint: ActivityFlowDto): Promise<AppResponse>;
	abstract getMasterUserCategoriesList(): Promise<AppResponse>;
	abstract companyList(): Promise<AppResponse>;
	abstract unitList(unitInfo: UnitDto): Promise<AppResponse>;
	abstract productCategoryList(): Promise<AppResponse>;
	abstract productListCompany(companyInfo: CompanyProductDto): Promise<AppResponse>;
	abstract jointListCompany(companyInfo: CompanyJointDto): Promise<AppResponse>;
	abstract subJointListCompany(companyInfo: CompanySubJointDto): Promise<AppResponse>;
	abstract subProductListCompany(companyInfo: CompanySubProductDto): Promise<AppResponse>;
	abstract subProductCategoryList(subCategoryInfo: SubProductCategoryDto): Promise<AppResponse>;
	abstract companyProject(companyInfo: CompanyProjectDto): Promise<AppResponse>;
	abstract preInstallationList(jointId: PreInstallationDto): Promise<AppResponse>;
	abstract divisionList(divisionInfo: DivisionDto): Promise<AppResponse>;
	abstract kitStatus(): Promise<AppResponse>;
	abstract excavationCondition(): Promise<AppResponse>;
	abstract jointerCategory(): Promise<AppResponse>;
	abstract addMasters(tableInfo: MasterTableDto, claims: AtPayload): Promise<AppResponse>;
	abstract hierarchyAddMasters(tableInfo: HierarchyMasterTableDto, claims: AtPayload): Promise<AppResponse>;
}
