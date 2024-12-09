import { FileTypeEnum, UpdateType } from '@app/core/enums/shared.enum';
import { messageFactory, messages } from '@app/shared/messages.shared';
import { CommonRegExp } from '@app/shared/regex.shared';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type, plainToClass } from 'class-transformer';
import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	IsBoolean,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsUUID,
	Matches,
	MaxLength,
	Min,
	ValidateIf,
	ValidateNested
} from 'class-validator';

class SendOTPLogInDto {
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Mobile number']) })
	@Matches(CommonRegExp.PHONE_REGEXP, { message: messageFactory(messages.W2, ['mobile number']) })
	@MaxLength(20, { message: messageFactory(messages.W6, ['Mobile number', '20']) })
	readonly mobileNo: string;
	@ApiProperty()
	@IsNumber({}, { message: messageFactory(messages.W3, ['Primary country code id']) })
	@IsInt({ message: messageFactory(messages.W1, ['primary country code id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Primary country code id']) })
	readonly countryCodeId: number;
}
class LoginDto {
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Mobile number']) })
	@Matches(CommonRegExp.PHONE_REGEXP, { message: messageFactory(messages.W1, ['mobile number']) })
	@MaxLength(15, { message: messageFactory(messages.W6, ['Mobile number', '15']) })
	readonly mobileNo: string;
	@ApiProperty()
	@IsNumber({}, { message: messageFactory(messages.W3, ['Primary country code id']) })
	@IsInt({ message: messageFactory(messages.W1, ['primary country code id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Primary country code id']) })
	readonly countryCodeId: number;
	@IsOptional()
	ip: string;
	@ApiProperty()
	@IsOptional()
	agentType: string;
}

class SendOtpDto {
	@ApiProperty()
	@IsOptional()
	@IsEnum(UpdateType, { message: messageFactory(messages.W1, ['update type']) })
	readonly type: string;
	@ApiProperty()
	@IsOptional()
	@IsNumber({}, { message: messageFactory(messages.W3, ['Primary country code id']) })
	@IsInt({ message: messageFactory(messages.W1, ['primary country code id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Primary country code id']) })
	readonly countryCodeId: number;
	@ApiProperty()
	@IsOptional()
	@Matches(CommonRegExp.PHONE_REGEXP, { message: messageFactory(messages.W2, ['mobile number']) })
	@MaxLength(20, { message: messageFactory(messages.W6, ['Mobile number', '20']) })
	readonly mobileNo: string;
	@ApiProperty()
	@IsOptional()
	@Matches(CommonRegExp.EMAIL_REGEXP, { message: messageFactory(messages.W1, ['Email id']) })
	@MaxLength(150, { message: messageFactory(messages.W6, ['Email id', '150']) })
	readonly emailId: string;
}
class VerifyOtpDto {
	@IsNotEmpty({ message: messageFactory(messages.W2, ['OTP']) })
	readonly OTP: string;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Id']) })
	readonly id: string;
	@IsOptional()
	ip: string;
}

class VerifyOtpLoginDto {
	@IsNotEmpty({ message: messageFactory(messages.W2, ['OTP']) })
	@MaxLength(6, { message: messageFactory(messages.W6, ['OTP', '6']) })
	readonly OTP: string;
	@IsOptional()
	ip: string;
	@IsOptional()
	agentType: string;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Id']) })
	readonly id: string;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Device id']) })
	@MaxLength(30, { message: messageFactory(messages.W6, ['Device id', '30']) })
	readonly deviceId: string;
}

class SethDefaultRoleDto {
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Role id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['Role id']) })
	@IsInt({ message: messageFactory(messages.W1, ['Role id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Role id']) })
	readonly roleId: number;
}

class SwitchRoleDto {
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Role id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['Role id']) })
	@IsInt({ message: messageFactory(messages.W1, ['role id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Role id']) })
	readonly roleId: number;
	@ApiProperty()
	@IsOptional()
	ip: string;
	@ApiProperty()
	@IsOptional()
	agentType: string;
	@ApiProperty()
	@IsNumber({}, { message: messageFactory(messages.W3, ['Device id']) })
	@IsInt({ message: messageFactory(messages.W1, ['device id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Device id']) })
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Device id']) })
	readonly deviceId: number;
}

class RefreshTokenPrincipalDto {
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Refresh token']) })
	readonly refreshToken: string;
	@ApiProperty()
	@IsOptional()
	ip: string;
}

class ProfileInfoDto {
	@ApiProperty()
	@Matches(CommonRegExp.NAME_REGEXP, { message: messageFactory(messages.W1, ['full name']) })
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Full name']) })
	@MaxLength(100, { message: messageFactory(messages.W6, ['Full name', '100']) })
	readonly name: string;
	@ApiProperty()
	@IsOptional()
	avatar: string;
	@ApiProperty()
	@IsOptional()
	readonly isDelete: boolean;
	@ApiProperty()
	@IsOptional()
	@ArrayMinSize(1, { message: messageFactory(messages.W22, ['document']) })
	@ArrayMaxSize(4, { message: messageFactory(messages.W50, ['document', '4']) })
	readonly document: string[];
	@ApiProperty()
	@IsOptional()
	@ArrayMinSize(1, { message: messageFactory(messages.W22, ['document']) })
	@ArrayMaxSize(4, { message: messageFactory(messages.W50, ['document', '4']) })
	readonly deletedDocumentId: string[];
}

class FileUploadSasDto {
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['File name']) })
	@MaxLength(200, { message: messageFactory(messages.W6, ['File name', '200']) })
	readonly fileName: string;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['File name']) })
	@IsEnum([FileTypeEnum.Image, FileTypeEnum.Document, FileTypeEnum.Video], { message: messageFactory(messages.W1, ['file type']) })
	readonly type: string;
}
class UpdateProfileDto {
	@IsOptional()
	Avatar: any;
	@ApiProperty()
	@Type(() => ProfileInfoDto)
	@ValidateNested({ each: true })
	@IsNotEmpty({ message: messageFactory(messages.W2, ['fileInfo']) })
	@Transform(({ value }) => {
		if (typeof value === 'string') value = JSON.parse(value);
		return plainToClass(ProfileInfoDto, value);
	})
	readonly joinerDetail: ProfileInfoDto;
}
class GeographyInfoDTO {
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['City id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['City id']) })
	@Min(1, { message: messageFactory(messages.W4, ['City id']) })
	@IsInt({ message: messageFactory(messages.W1, ['City id']) })
	readonly CityId: number;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Division id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['Division id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Division id']) })
	@IsInt({ message: messageFactory(messages.W1, ['Division id']) })
	readonly divisionId: number;
	@ApiProperty()
	@IsOptional()
	@IsNumber({}, { message: messageFactory(messages.W3, ['Unit id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Unit id']) })
	@IsInt({ message: messageFactory(messages.W1, ['Unit id']) })
	unitId: number;
	@ApiProperty()
	@ValidateIf((o) => o.unitId === undefined || o.unitId === null)
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Unit name']) })
	@MaxLength(50, { message: messageFactory(messages.W6, ['Unit name', '50']) })
	readonly unitName: string;
}

class CreateCompanyDto {
	@ApiProperty({ type: GeographyInfoDTO })
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Geography info']) })
	@ValidateNested({ each: true })
	@Type(() => GeographyInfoDTO)
	readonly geographyInfo: GeographyInfoDTO[];
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Company name']) })
	@MaxLength(100, { message: messageFactory(messages.W6, ['Company name', '100']) })
	readonly companyName: string;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Sub joint id']) })
	@IsArray({ message: messageFactory(messages.W1, ['Sub joint id']) })
	@ArrayMinSize(1, { message: messageFactory(messages.W22, ['Sub joint id']) })
	readonly subJointId: number[];
}

class UpdateUserDto {
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['User id']) })
	@IsUUID('all', { message: messageFactory(messages.W1, ['user id']) })
	readonly userId: string;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Role']) })
	@IsArray({ message: messageFactory(messages.W1, ['Role']) })
	@ArrayMinSize(1, { message: messageFactory(messages.W22, ['Role']) })
	readonly roles: number[];
	@ApiProperty()
	@IsOptional()
	@IsBoolean({ message: messageFactory(messages.W1, ['active boolean status']) })
	readonly active: boolean;
}

export {
	CreateCompanyDto,
	FileUploadSasDto,
	LoginDto,
	RefreshTokenPrincipalDto,
	SendOtpDto,
	SethDefaultRoleDto,
	SwitchRoleDto,
	UpdateProfileDto,
	UpdateUserDto,
	VerifyOtpDto,
	SendOTPLogInDto,
	VerifyOtpLoginDto
};
