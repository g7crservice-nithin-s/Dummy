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
import { AppResponse } from '@app/shared/app-response.shared';
import { ISendMailOptions } from '@nestjs-modules/mailer';

export abstract class ManageAccountAbstractSqlDao {
	abstract register(userCred: RegisterDto, claims: AtPayload, uuid: string): Promise<AppResponse>;
	abstract jointerRegister(jointerCred: JointerRegisterDto, uuid: string, claims: AtPayload): Promise<AppResponse>;
	abstract mobEmailExist(info: any): Promise<AppResponse>;
	abstract fetchUserRoles(UserGuid: string): Promise<AppResponse>;
	abstract validateRating(jointerId: string, ticketGuid: string, claims: AtPayload): Promise<AppResponse>;
	abstract setDefaultRole(claims: AtPayload, roles: SethDefaultRoleDto): Promise<AppResponse>;
	abstract getRoles(rolesIds: any): Promise<AppResponse>;
	abstract getCategoryRoleName(categoryId: number): Promise<AppResponse>;
	abstract fetchUsers(claims: AtPayload, UserInfo: FetchUsersDto, bypass?: boolean): Promise<AppResponse>;
	abstract addUnit(unitName: string, claims: AtPayload): Promise<AppResponse>;
	abstract createCompany(companyInfo: CreateCompanyDto, claims: AtPayload): Promise<AppResponse>;
	abstract updateJointer(userInfo: UpdateJointerDto, claims: AtPayload): Promise<AppResponse>;
	abstract updateUserStatus(userId: string, status: boolean, claims: AtPayload): Promise<AppResponse>;
	abstract updateUserRoles(
		userInfo: UpdateUserDto,
		newRoles: number[],
		deleteRoles: number[],
		claims: AtPayload,
		role?: number | null
	): Promise<AppResponse>;
	abstract fetchUserInfo(userId: string): Promise<AppResponse>;
	abstract fetchJointerInfo(userId: string): Promise<AppResponse>;
	abstract getRolesByCategory(categoryId: CategoryIdDto): Promise<AppResponse>;
	abstract companies(companiesInfo: CompaniesDto, claims: AtPayload): Promise<AppResponse>;
	abstract companyData(companyInfo: FetchCompaniesDto): Promise<AppResponse>;
	abstract fetchSupervisor(supervisorInfo: SupervisorDto): Promise<AppResponse>;
	abstract jointerRating(jointerRating: JointerRatingDto, claims: AtPayload): Promise<AppResponse>;
	abstract fetchCompanyProduct(companyInfo: UpdateCompanyDto): Promise<AppResponse>;
	abstract deleteProduct(companyInfo: UpdateCompanyDto): Promise<AppResponse>;
	abstract fetchCompanyGeoInfo(companyInfo: UpdateCompanyDto): Promise<AppResponse>;
	abstract fetchCountryCode(countryId: number): Promise<AppResponse>;
	abstract validateCompany(name: string, companyId?: number): Promise<AppResponse>;
	abstract updateCompany(companyInfo: UpdateCompanyDto, claims: AtPayload): Promise<AppResponse>;
	abstract createEmailLogs(email: ISendMailOptions, isSuccess: boolean, claims?: AtPayload): Promise<AppResponse>;
}
