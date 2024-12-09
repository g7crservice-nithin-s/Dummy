import { AppResponse } from '@app/shared/app-response.shared';
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
import { AtPayload } from './model/jwt-payload.model';

export abstract class AuthAbstractSvc {
	abstract logIn(userCred: LoginDto): Promise<AppResponse>;
	abstract logout(claims: AtPayload): Promise<AppResponse>;
	abstract setDefaultRole(claims: AtPayload, roles: SethDefaultRoleDto): Promise<AppResponse>;
	abstract switchRole(claims: AtPayload, roles: SwitchRoleDto): Promise<AppResponse>;
	abstract validateToken(token: any): Promise<AppResponse>;
	abstract refreshToken(rtReq: RefreshTokenPrincipalDto): Promise<AppResponse>;
	abstract myInfo(claims: AtPayload): Promise<AppResponse>;
	abstract updateProfile(claims: AtPayload, userInfo: UpdateProfileDto): Promise<AppResponse>;
	abstract sendOTPUpdateProfile(info: SendOtpDto, claims: AtPayload, ip: string, token: any): Promise<AppResponse>;
	abstract verifyOTPUpdateProfile(info: VerifyOtpDto, claims: AtPayload): Promise<AppResponse>;
	abstract verifyOTPLogin(otpInfo: VerifyOtpLoginDto): Promise<AppResponse>;
	abstract resendOTP(ip: string, id: string): Promise<AppResponse>;
}
