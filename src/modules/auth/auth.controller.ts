import { AppConfigService } from '@app/config/app-config.service';
import { Authorize } from '@app/core/decorators/authorization.decorator';
import { AppResponse, createResponse } from '@app/shared/app-response.shared';
import { messageFactory, messages } from '@app/shared/messages.shared';
import { CommonRegExp } from '@app/shared/regex.shared';
import { Body, Controller, Get, Headers, HttpException, HttpStatus, Param, Patch, Post, Req, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { getClientIp } from 'request-ip';
import { AuthAbstractSvc } from './auth.abstract';
import {
	LoginDto,
	RefreshTokenPrincipalDto,
	SendOtpDto,
	SethDefaultRoleDto,
	SwitchRoleDto,
	UpdateProfileDto,
	VerifyOtpDto,
	VerifyOtpLoginDto
} from './dto/auth.dto';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly _authService: AuthAbstractSvc,
		private readonly _appConfigSvc: AppConfigService
	) {}

	@Post('v1/login')
	async logIn(@Req() req: any, @Headers('x-forwarded-for') forwardedFor: string, @Body() userCred: LoginDto): Promise<AppResponse> {
		userCred.ip = forwardedFor || req.connection.remoteAddress;
		userCred.agentType = req.headers['user-agent'].toLowerCase();
		return this._authService.logIn(userCred);
	}

	@Authorize()
	@Get('v1/logout')
	async logout(@Req() req: any): Promise<AppResponse> {
		return this._authService.logout(req.claims);
	}

	@Authorize()
	@Post('v1/set-default-role')
	async setDefaultRole(@Req() req: any, @Body() roles: SethDefaultRoleDto): Promise<AppResponse> {
		return this._authService.setDefaultRole(req.claims, roles);
	}

	@Authorize()
	@Post('v1/switch-role')
	async switchRole(@Req() req: any, @Headers('x-forwarded-for') forwardedFor: string, @Body() roles: SwitchRoleDto): Promise<AppResponse> {
		roles.ip = forwardedFor || req.connection.remoteAddress;
		roles.agentType = req.headers['user-agent'].toLowerCase();
		return this._authService.switchRole(req.claims, roles);
	}

	@Patch('v1/refresh-token')
	async refreshToken(
		@Req() req: any,
		@Headers('x-forwarded-for') forwardedFor: string,
		@Body() rtReq: RefreshTokenPrincipalDto
	): Promise<AppResponse> {
		rtReq.ip = forwardedFor || req.connection.remoteAddress;
		return await this._authService.refreshToken(rtReq);
	}

	@Authorize()
	@Get('v1/me')
	async myInfo(@Req() req: any): Promise<AppResponse> {
		return this._authService.myInfo(req.claims);
	}

	@Authorize()
	@Patch('v1/update-profile')
	@UseInterceptors(FileFieldsInterceptor([{ name: 'Avatar' }]))
	async updateProfile(
		@Req() req: any,
		@Body() userInfo: UpdateProfileDto,
		@UploadedFiles()
		files: { Avatar: Express.Multer.File }
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
		userInfo.Avatar = files?.Avatar;
		return this._authService.updateProfile(req.claims, userInfo);
	}

	@Authorize()
	@Post('v1/send-otp-updateProfile')
	async sendOTPUpdateProfile(@Req() req: any, @Body() info: SendOtpDto, @Headers() headers: any): Promise<AppResponse> {
		const token = req?.headers['custom-authorization'];
		const ip = headers['x-forwarded-for'] ? headers['x-forwarded-for'] : getClientIp(req);
		return this._authService.sendOTPUpdateProfile(info, req.claims, ip, token);
	}

	@Authorize()
	@Post('v1/verify-otp-updateProfile')
	async verifyOTPUpdateProfile(@Req() req: any, @Body() info: VerifyOtpDto, @Headers() headers: any): Promise<AppResponse> {
		info.ip = headers['x-forwarded-for'] ? headers['x-forwarded-for'] : getClientIp(req);
		const token = req?.headers['custom-authorization'];
		return this._authService.verifyOTPUpdateProfile(info, token);
	}

	@Post('v1/verify-otp-login')
	async verifyOTPLogin(@Req() req: any, @Headers() header: string, @Body() otpInfo: VerifyOtpLoginDto): Promise<AppResponse> {
		/* header validation*/
		const requiredHeader = { key: 'content-type', value: 'application/x-www-form-urlencoded' };
		await this.validateHeader(header, requiredHeader);
		otpInfo['ip'] = header['x-forwarded-for'] ? header['x-forwarded-for'] : getClientIp(req);
		otpInfo['agentType'] = req.headers['user-agent'].toLowerCase();
		return this._authService.verifyOTPLogin(otpInfo);
	}

	@Get('v1/resend-otp/:id')
	async resendOTP(@Req() req: any, @Param('id') id: string, @Headers() headers: any): Promise<AppResponse> {
		const ip = headers['x-forwarded-for'] ? headers['x-forwarded-for'] : getClientIp(req);
		return this._authService.resendOTP(ip, id);
	}

	async validateHeader(header: any, headerToValidate: any): Promise<AppResponse> {
		const headerMatch = header[headerToValidate.key].includes(headerToValidate['value']);
		if (headerMatch) {
			return createResponse(HttpStatus.OK, messages.S3);
		}
		const message = messageFactory(messages.E19, [headerToValidate['key'], header[headerToValidate['key']]]);
		throw new HttpException(message, HttpStatus.BAD_REQUEST);
	}
}
