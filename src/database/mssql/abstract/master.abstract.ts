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
import { AppResponse } from '@app/shared/app-response.shared';

export abstract class MasterAbstractSqlDao {
	abstract getSafetyList(): Promise<AppResponse>;
	abstract getRoles(categoryId: CategoryIdDto): Promise<AppResponse>;
	abstract getCountryCode(): Promise<AppResponse>;
	abstract getJoints(jointInfo: JointDto): Promise<AppResponse>;
	abstract getExpertise(): Promise<AppResponse>;
	abstract getExpertiseLevel(): Promise<AppResponse>;
	abstract getSubJointLevel(jointId: SubJointDto): Promise<AppResponse>;
	abstract getJointerStatus(): Promise<AppResponse>;
	abstract getCity(): Promise<AppResponse>;
	abstract getCityFromGeoInfo(cityInfo: CityDto): Promise<AppResponse>;
	abstract getSiteState(): Promise<AppResponse>;
	abstract getVoltage(): Promise<AppResponse>;
	abstract getJointingCheckList(voltage: VoltageDto): Promise<AppResponse>;
	abstract getJobTypeList(): Promise<AppResponse>;
	abstract getMasterActivityFlowList(subJoint: ActivityFlowDto): Promise<AppResponse>;
	abstract getMasterUserCategories(): Promise<AppResponse>;
	abstract companyList(): Promise<AppResponse>;
	abstract divisionList(divisionInfo: DivisionDto): Promise<AppResponse>;
	abstract kitStatus(): Promise<AppResponse>;
	abstract excavationCondition(): Promise<AppResponse>;
	abstract jointerCategory(): Promise<AppResponse>;
	abstract divisionListFromGeoInfo(divisionInfo: DivisionDto): Promise<AppResponse>;
	abstract unitList(unitInfo: UnitDto): Promise<AppResponse>;
	abstract productCategoryList(): Promise<AppResponse>;
	abstract productListCompany(companyInfo: CompanyProductDto): Promise<AppResponse>;
	abstract jointListCompany(companyInfo: CompanyJointDto): Promise<AppResponse>;
	abstract subJointListCompany(companyInfo: CompanySubJointDto): Promise<AppResponse>;
	abstract subProductListCompany(companyInfo: CompanySubProductDto): Promise<AppResponse>;
	abstract subProductCategoryList(subCategoryInfo: SubProductCategoryDto): Promise<AppResponse>;
	abstract preInstallationList(jointId: PreInstallationDto): Promise<AppResponse>;
	abstract companyProject(companyInfo: CompanyProjectDto): Promise<AppResponse>;
	abstract unitListFromGeoInfo(unitInfo: UnitDto): Promise<AppResponse>;
	abstract addMasters(tableInfo: MasterTableDto, claims: AtPayload): Promise<AppResponse>;
	abstract hierarchyAddMasters(tableInfo: HierarchyMasterTableDto, claims: AtPayload): Promise<AppResponse>;
}
