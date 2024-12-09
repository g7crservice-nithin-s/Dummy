import { SethDefaultRoleDto, UpdateProfileDto } from '@app/modules/auth/dto/auth.dto';
import { AtPayload } from '@app/modules/auth/model/jwt-payload.model';
import { ISession } from '@app/modules/auth/model/session.model';
import { IOTPRecord } from '@app/modules/auth/model/userModel';
import { AppResponse } from '@app/shared/app-response.shared';

export abstract class AuthAbstractSqlDao {
	abstract mobEmailExist(info: any): Promise<AppResponse>;
	abstract createSession(session: ISession): Promise<AppResponse>;
	abstract logoutSession(sessionId: string): Promise<AppResponse>;
	abstract setDefaultRole(claims: AtPayload, roles: SethDefaultRoleDto): Promise<AppResponse>;
	abstract findSessionBySid(claims: AtPayload): Promise<AppResponse>;
	abstract updateSession(sessionInfo: any): Promise<AppResponse>;
	abstract getRoles(rolesIds: any): Promise<AppResponse>;
	abstract updateProfile(claims: AtPayload, userInfo: UpdateProfileDto): Promise<AppResponse>;
	abstract updateProfileByOTP(claims: any): Promise<AppResponse>;
	abstract userSessionExists(userGuid: string): Promise<AppResponse>;
	abstract userExists(userGuid: string): Promise<AppResponse>;
	abstract updateFirstLogin(userGuid: string): Promise<AppResponse>;
	abstract fetchUserRoles(UserGuid: string): Promise<AppResponse>;
	abstract countryCodeExists(countryCode: number): Promise<AppResponse>;
	abstract validateUserMob(claims: AtPayload, mob?: string, emailId?: string): Promise<AppResponse>;
	abstract createOTP(OTPData: IOTPRecord): Promise<AppResponse>;
	abstract fetchOtpInfo(OTPSecret: string): Promise<AppResponse>;
	abstract updateOtpInfo(OTPInfo: any, OTPSecret: string): Promise<AppResponse>;
	abstract fetchCountyCode(countryCodeId: number): Promise<AppResponse>;
}
