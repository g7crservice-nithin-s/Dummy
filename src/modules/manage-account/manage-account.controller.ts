import { AppConfigService } from '@app/config/app-config.service';
import { Authorize } from '@app/core/decorators/authorization.decorator';
import { HasRoles } from '@app/core/decorators/roles.decorator';
import { RoleGroup, RolesEnum } from '@app/core/enums/app-role.enum';
import { AppResponse, createResponse } from '@app/shared/app-response.shared';
import { messageFactory, messages } from '@app/shared/messages.shared';
import { CommonRegExp } from '@app/shared/regex.shared';
import { Body, Controller, HttpStatus, Patch, Post, Req, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
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
import { ManageAccountAbstractSvc } from './manage-account.abstract';

@Controller('manage-account')
export class ManageAccountController {
	constructor(
		private readonly _manageAccountService: ManageAccountAbstractSvc,
		private readonly _appConfigSvc: AppConfigService
	) {}

	@Authorize()
	@HasRoles([RolesEnum.Raychem_Super_Admin, RolesEnum.Customer_Admin])
	@Post('v1/user-register')
	@UseInterceptors(FileFieldsInterceptor([{ name: 'Avatar', maxCount: 10 }]))
	async jobSeekerRegister(
		@Req() req: any,
		@Body() userCred: RegisterDto,
		@UploadedFiles() files: { Avatar?: Express.Multer.File }
	): Promise<AppResponse> {
		if (files?.Avatar) {
			const avatarLimit = this._appConfigSvc.get('uploadAvatar');
			if (files?.Avatar[0].size > avatarLimit.limit) {
				return createResponse(HttpStatus.BAD_REQUEST, messageFactory(messages.W18, [`${avatarLimit.limit / 1048576}`]));
			}
			if (!CommonRegExp.IMAGE_REGEX.test(files?.Avatar[0]?.mimetype)) {
				return createResponse(206, messageFactory(messages.W19, ['.png, .jpg, .jpeg and .gif']));
			}
		}
		userCred.Avatar = files?.Avatar;
		return this._manageAccountService.register(userCred, req.claims);
	}

	@Authorize()
	@HasRoles(RoleGroup.SA_RRP_ROLE)
	@Post('v1/jointer-register')
	@UseInterceptors(FileFieldsInterceptor([{ name: 'Avatar' }, { name: 'Identification' }]))
	async jointerRegister(
		@Req() req: any,
		@Body() jointerCred: JointerRegisterDto,
		@UploadedFiles() files: { Avatar: Express.Multer.File; Identification?: Express.Multer.File }
	): Promise<AppResponse> {
		if (!files?.Avatar) return createResponse(HttpStatus.BAD_REQUEST, messageFactory(messages.W2, ['Avatar']));
		const avatarLimit = this._appConfigSvc.get('uploadAvatar');
		if (files?.Avatar[0].size > avatarLimit.limit) {
			return createResponse(HttpStatus.BAD_REQUEST, messageFactory(messages.W18, [`${avatarLimit.limit / 1048576}`]));
		}
		if (!CommonRegExp.IMAGE_REGEX.test(files?.Avatar[0]?.mimetype)) {
			return createResponse(206, messageFactory(messages.W19, ['.png, .jpg, .jpeg and .gif']));
		}

		const identificationFile = files?.Identification ? files.Identification[0] : null;
		if (identificationFile !== null) {
			if (files?.Identification[0]?.size > avatarLimit.limit) {
				return createResponse(HttpStatus.BAD_REQUEST, messageFactory(messages.W18, [`${avatarLimit.limit / 1048576}`]));
			}
			if (!CommonRegExp.FILE_REGEX.test(files?.Identification[0]?.mimetype)) {
				return createResponse(206, messageFactory(messages.W19, ['.png, .jpg, .jpeg and .pdf']));
			}
			jointerCred.Identification = files?.Identification;
		}
		jointerCred.Avatar = files?.Avatar;

		return this._manageAccountService.jointerRegister(jointerCred, req.claims);
	}

	@Authorize()
	@HasRoles(RoleGroup.SA_RRA_CA_RRP_ROLE)
	@Post('v1/fetch-users')
	async fetchUsers(@Req() req: any, @Body() UserInfo: FetchUsersDto): Promise<AppResponse> {
		return this._manageAccountService.fetchUsers(req.claims, UserInfo);
	}

	@Authorize()
	@HasRoles([RolesEnum.Raychem_Super_Admin])
	@Patch('v1/update-customer')
	async updateCompany(@Req() req: any, @Body() companyInfo: UpdateCompanyDto): Promise<AppResponse> {
		return this._manageAccountService.updateCompany(companyInfo, req.claims);
	}

	@Authorize()
	@HasRoles([RolesEnum.Raychem_Super_Admin])
	@Post('v1/register-customer')
	async registerCompany(@Req() req: any, @Body() companyInfo: CreateCompanyDto): Promise<AppResponse> {
		return this._manageAccountService.registerCompany(companyInfo, req.claims);
	}

	@Authorize()
	@HasRoles(RoleGroup.SA_CA_ROLE)
	@Patch('v1/update-user')
	async updateUser(@Req() req: any, @Body() userInfo: UpdateUserDto): Promise<AppResponse> {
		return this._manageAccountService.updateUser(userInfo, req.claims);
	}

	@Authorize()
	@HasRoles(RoleGroup.SA_RRP_ROLE)
	@Patch('v1/update-jointer')
	@UseInterceptors(FileFieldsInterceptor([{ name: 'Identification' }]))
	async updateJointer(
		@Req() req: any,
		@Body() userInfo: UpdateJointerDto,
		@UploadedFiles() files: { Avatar: Express.Multer.File; Identification?: Express.Multer.File }
	): Promise<AppResponse> {
		const avatarLimit = this._appConfigSvc.get('uploadAvatar');
		const identificationFile = files?.Identification ? files.Identification[0] : null;
		if (identificationFile) {
			if (files?.Identification[0]?.size > avatarLimit.limit) {
				return createResponse(HttpStatus.BAD_REQUEST, messageFactory(messages.W18, [`${avatarLimit.limit / 1048576}`]));
			}
			if (!CommonRegExp.FILE_REGEX.test(files?.Identification[0]?.mimetype)) {
				return createResponse(206, messageFactory(messages.W19, ['.png, .jpg, .jpeg and .pdf']));
			}
			userInfo.Identification = files?.Identification;
		}
		return this._manageAccountService.updateJointer(userInfo, req.claims);
	}

	@Authorize()
	@HasRoles(RoleGroup.SA_RRP_ROLE)
	@Post('v1/fetch-customer-info')
	async companies(@Req() req: any, @Body() companiesInfo: CompaniesDto): Promise<AppResponse> {
		return this._manageAccountService.companies(companiesInfo, req.claims);
	}

	@Authorize()
	@HasRoles(RoleGroup.SA_RRP_ROLE)
	@Post('v1/fetch-customer')
	async companyData(@Body() companyInfo: FetchCompaniesDto): Promise<AppResponse> {
		return this._manageAccountService.companyData(companyInfo);
	}

	@Authorize()
	@HasRoles([RolesEnum.Raychem_Regional_Planner])
	@Post('v1/fetch-supervisor')
	async fetchSupervisor(@Body() supervisorInfo: SupervisorDto, @Req() req: any): Promise<AppResponse> {
		return this._manageAccountService.fetchSupervisor(supervisorInfo, req.claims);
	}

	@Authorize()
	@HasRoles(RoleGroup.RSS_RQS_CRS_RS_RRP)
	@Post('v1/jointer-rating')
	async jointerRating(@Req() req: any, @Body() jointerRating: JointerRatingDto): Promise<AppResponse> {
		return this._manageAccountService.jointerRating(jointerRating, req.claims);
	}

	@Authorize()
	@HasRoles(RoleGroup.SA_RRP_CA_ROLE)
	@Post('v1/export-user-details')
	async exportUser(@Req() req: any, @Body() userInfo: FetchUsersDto): Promise<AppResponse> {
		return await this._manageAccountService.exportUser(userInfo, req.claims);
	}

	@Authorize()
	@HasRoles(RoleGroup.SA_RRP_CA_ROLE)
	@Post('v1/delete-csv-blobData')
	async deleteCsvBlobData(@Req() req: any): Promise<AppResponse> {
		return await this._manageAccountService.deleteCsvBlobData(req.claims);
	}
}
