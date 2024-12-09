import { AppResponse } from '@app/shared/app-response.shared';
import { AtPayload } from '../auth/model/jwt-payload.model';
import {
	CompaniesDto,
	CreateCompanyDto,
	FetchCompaniesDto,
	FetchUsersDto,
	JointerRatingDto,
	JointerRegisterDto,
	RegisterDto,
	SupervisorDto,
	UpdateCompanyDto,
	UpdateJointerDto,
	UpdateUserDto
} from './dto/manage-account.dto';

export abstract class ManageAccountAbstractSvc {
	abstract register(userCred: RegisterDto, claims: AtPayload): Promise<AppResponse>;
	abstract jointerRegister(jointerCred: JointerRegisterDto, claims: AtPayload): Promise<AppResponse>;
	abstract fetchUsers(claims: AtPayload, UserInfo: FetchUsersDto): Promise<AppResponse>;
	abstract registerCompany(companyInfo: CreateCompanyDto, claims: AtPayload): Promise<AppResponse>;
	abstract updateUser(userInfo: UpdateUserDto, claims: AtPayload): Promise<AppResponse>;
	abstract updateJointer(userInfo: UpdateJointerDto, claims: AtPayload): Promise<AppResponse>;
	abstract companies(companiesInfo: CompaniesDto, claims: AtPayload): Promise<AppResponse>;
	abstract companyData(companyInfo: FetchCompaniesDto): Promise<AppResponse>;
	abstract fetchSupervisor(supervisorInfo: SupervisorDto, claims: AtPayload): Promise<AppResponse>;
	abstract jointerRating(jointerRating: JointerRatingDto, claims: AtPayload): Promise<AppResponse>;
	abstract exportUser(userInfo: FetchUsersDto, claims: AtPayload): Promise<AppResponse>;
	abstract updateCompany(companyInfo: UpdateCompanyDto, claims: AtPayload): Promise<AppResponse>;
	abstract deleteCsvBlobData(claims: AtPayload): Promise<AppResponse>;
}
