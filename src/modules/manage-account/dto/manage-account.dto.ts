import { RatingValues } from '@app/core/enums/jointer-rating.enum';
import { FileTypeEnum } from '@app/core/enums/shared.enum';
import { messageFactory, messages } from '@app/shared/messages.shared';
import { CommonRegExp } from '@app/shared/regex.shared';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type, plainToClass } from 'class-transformer';
import {
	ArrayMinSize,
	ArrayUnique,
	IsArray,
	IsBoolean,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsUUID,
	Matches,
	Max,
	MaxLength,
	Min,
	MinLength,
	ValidateIf,
	ValidateNested
} from 'class-validator';

class UserRegistrationDto {
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Email Id']) })
	@Matches(CommonRegExp.EMAIL_REGEXP, { message: messageFactory(messages.W1, ['Email id']) })
	@MaxLength(150, { message: messageFactory(messages.W6, ['Email id', '150']) })
	readonly emailId: string;
	@ApiProperty()
	@Matches(CommonRegExp.NAME_REGEXP, { message: messageFactory(messages.W1, ['full name']) })
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Full name']) })
	@MaxLength(100, { message: messageFactory(messages.W6, ['Full name', '100']) })
	readonly name: string;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Primary country code id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['Primary country code id']) })
	@IsInt({ message: messageFactory(messages.W1, ['primary country code id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Primary country code id']) })
	readonly primaryCountryCodeId: number;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Primary mobile number']) })
	@Matches(CommonRegExp.PHONE_REGEXP, { message: messageFactory(messages.W28, ['Primary mobile number']) })
	@MaxLength(15, { message: messageFactory(messages.W6, ['Primary mobile number', '15']) })
	@MinLength(5, { message: messageFactory(messages.W49, ['Primary mobile number', '5']) })
	readonly primaryMobileNumber: string;
	@ApiProperty()
	@IsOptional()
	@IsNumber({}, { message: messageFactory(messages.W3, ['Secondary country code id']) })
	@IsInt({ message: messageFactory(messages.W1, ['secondary country code id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Secondary country code id']) })
	readonly secondaryCountryCodeId: number;
	@ApiProperty()
	@IsOptional()
	@Matches(CommonRegExp.PHONE_REGEXP, { message: messageFactory(messages.W28, ['secondary mobile number']) })
	@MaxLength(15, { message: messageFactory(messages.W6, ['Secondary mobile number', '15']) })
	@MinLength(5, { message: messageFactory(messages.W49, ['Secondary mobile number', '5']) })
	readonly secondaryMobileNumber: string;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['City']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['City']) })
	@IsInt({ message: messageFactory(messages.W1, ['City']) })
	@Min(1, { message: messageFactory(messages.W4, ['City']) })
	readonly cityId: number;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Category Id']) })
	@IsInt({ message: messageFactory(messages.W1, ['Category Id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Category Id']) })
	readonly categoryId: number;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Role']) })
	@IsArray({ message: messageFactory(messages.W1, ['Role']) })
	@ArrayMinSize(1, { message: messageFactory(messages.W13, ['Role']) })
	@ArrayUnique((value) => value.toString(), { message: messageFactory(messages.W14, ['Role']) })
	readonly roles: number[];
	@ApiProperty()
	@IsOptional()
	@IsInt({ message: messageFactory(messages.W1, ['Company Id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Company Id']) })
	companyId: number;
	@ApiProperty()
	@IsOptional()
	avatar: any;
}

class UpdateGeographyInfoDTO {
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['City id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['City id']) })
	@Min(1, { message: messageFactory(messages.W4, ['City id']) })
	@IsInt({ message: messageFactory(messages.W1, ['City id']) })
	readonly cityId: number;
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

class CompanyProductDto {
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Product id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['Product id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Product id']) })
	@IsInt({ message: messageFactory(messages.W1, ['Product id']) })
	readonly productId: number;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Joint id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['Joint id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Joint id']) })
	@IsInt({ message: messageFactory(messages.W1, ['Joint id']) })
	readonly jointId: number;
	@ApiProperty()
	@IsNumber({}, { message: messageFactory(messages.W3, ['Sub joint id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Sub joint id']) })
	@IsInt({ message: messageFactory(messages.W1, ['Sub joint id']) })
	readonly subJointId: number;
	@ApiProperty()
	@IsOptional()
	@Min(1, { message: messageFactory(messages.W4, ['Sub product id']) })
	@IsInt({ message: messageFactory(messages.W1, ['Sub product id']) })
	readonly subProductId: number;
}

class UpdateCompanyDto {
	@ApiProperty({ type: UpdateGeographyInfoDTO })
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => UpdateGeographyInfoDTO)
	readonly geographyInfo: UpdateGeographyInfoDTO[];
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Company id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['Company id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Company id']) })
	@IsInt({ message: messageFactory(messages.W1, ['Company id']) })
	readonly companyId: number;
	@ApiProperty({ type: CompanyProductDto })
	@IsOptional()
	@ValidateNested({ each: true })
	@ArrayUnique({ message: messages.W30 })
	@Type(() => CompanyProductDto)
	readonly productInfo: CompanyProductDto[];
	@ApiProperty()
	@IsOptional()
	@IsArray({ message: messageFactory(messages.W1, ['Deleted company geography id']) })
	@ArrayMinSize(1, { message: messageFactory(messages.W13, ['Deleted company geography id']) })
	readonly deletedCompanyGeoId: number[];
	@ApiProperty()
	@IsOptional()
	@IsArray({ message: messageFactory(messages.W1, ['Deleted company geography id']) })
	@ArrayMinSize(1, { message: messageFactory(messages.W13, ['Deleted company geography id']) })
	readonly deletedCompanyProducts: number[];
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Company name']) })
	@MaxLength(100, { message: messageFactory(messages.W6, ['Company name', '100']) })
	readonly companyName: string;
}
class RegisterDto {
	@IsOptional()
	Avatar: any;
	@ApiProperty()
	@Type(() => UserRegistrationDto)
	@ValidateNested({ each: true })
	@IsNotEmpty({ message: messageFactory(messages.W2, ['fileInfo']) })
	@Transform(({ value }) => {
		if (typeof value === 'string') value = JSON.parse(value);
		return plainToClass(UserRegistrationDto, value);
	})
	readonly userDetail: UserRegistrationDto;
}
class JointerInfoDto {
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Designation']) })
	@MaxLength(150, { message: messageFactory(messages.W6, ['Designation', '150']) })
	readonly designation: string;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Vendor name']) })
	@MaxLength(150, { message: messageFactory(messages.W6, ['Vendor name', '150']) })
	readonly vendorName: string;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Expertise type Id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['Expertise type Id']) })
	@IsInt({ message: messageFactory(messages.W1, ['Expertise type Id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Expertise type Id']) })
	readonly expertiseTypeId: number;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Expertise level Id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['Expertise level Id']) })
	@IsInt({ message: messageFactory(messages.W1, ['Expertise level Id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Expertise level Id']) })
	readonly expertiseLevelId: number;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Jointer category Id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['Jointer category Id']) })
	@IsInt({ message: messageFactory(messages.W1, ['Jointer category Id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Jointer category Id']) })
	readonly jointerCategoryId: number;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Status Id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['Status Id']) })
	@IsInt({ message: messageFactory(messages.W1, ['Status Id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Status Id']) })
	readonly statusId: number;
	@ApiProperty()
	@IsOptional()
	@IsNumber({}, { message: messageFactory(messages.W3, ['Rating']) })
	@IsInt({ message: messageFactory(messages.W1, ['Rating']) })
	@Min(1, { message: messageFactory(messages.W4, ['Rating']) })
	@Max(5, { message: messageFactory(messages.W26, ['Rating']) })
	readonly rating: number;
}

class JointerDetailsDto {
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Email Id']) })
	@Matches(CommonRegExp.EMAIL_REGEXP, { message: messageFactory(messages.W1, ['Email id']) })
	@MaxLength(150, { message: messageFactory(messages.W6, ['Email id', '150']) })
	readonly emailId: string;
	@ApiProperty()
	@Matches(CommonRegExp.NAME_REGEXP, { message: messageFactory(messages.W1, ['Full name']) })
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Full name']) })
	@MaxLength(100, { message: messageFactory(messages.W6, ['Full name', '100']) })
	readonly name: string;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['City']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['City']) })
	@IsInt({ message: messageFactory(messages.W1, ['City']) })
	@Min(1, { message: messageFactory(messages.W4, ['City']) })
	readonly cityId: number;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Primary country code id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['Primary country code id']) })
	@IsInt({ message: messageFactory(messages.W1, ['primary country code id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Primary country code id']) })
	readonly primaryCountryCodeId: number;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Primary mobile number']) })
	@Matches(CommonRegExp.PHONE_REGEXP, { message: messageFactory(messages.W28, ['Primary mobile number']) })
	@MaxLength(15, { message: messageFactory(messages.W6, ['Primary mobile number', '15']) })
	@MinLength(5, { message: messageFactory(messages.W49, ['Primary mobile number', '5']) })
	readonly primaryMobileNumber: string;
	@ApiProperty()
	@IsOptional()
	@IsNumber({}, { message: messageFactory(messages.W3, ['Secondary country code id']) })
	@IsInt({ message: messageFactory(messages.W1, ['secondary country code id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Secondary country code id']) })
	readonly secondaryCountryCodeId: number;
	@ApiProperty()
	@IsOptional()
	@Matches(CommonRegExp.PHONE_REGEXP, { message: messageFactory(messages.W28, ['Secondary mobile number']) })
	@MaxLength(15, { message: messageFactory(messages.W6, ['Secondary mobile number', '15']) })
	@MinLength(5, { message: messageFactory(messages.W49, ['Secondary mobile number', '5']) })
	readonly secondaryMobileNumber: string;
	@ApiProperty()
	@IsOptional()
	avatar: string;
	@ApiProperty()
	@IsOptional()
	identification: string;
	@ApiProperty({ type: JointerInfoDto })
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Jointer information']) })
	@ValidateNested({ each: true })
	@Type(() => JointerInfoDto)
	readonly jointerInfo: JointerInfoDto;
}
class JointerRegisterDto {
	@ApiProperty()
	@IsOptional()
	Avatar: any;
	@ApiProperty()
	@IsOptional()
	Identification: any;
	@ApiProperty()
	@Type(() => JointerDetailsDto)
	@ValidateNested({ each: true })
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Jointer Details']) })
	@Transform(({ value }) => {
		if (typeof value === 'string') value = JSON.parse(value);
		return plainToClass(JointerDetailsDto, value);
	})
	readonly jointerDetail: JointerDetailsDto;
}

class LoginDto {
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Mobile number']) })
	@Matches(CommonRegExp.PHONE_REGEXP, { message: messageFactory(messages.W28, ['mobile number']) })
	@MaxLength(15, { message: messageFactory(messages.W6, ['Mobile number', '15']) })
	@MinLength(5, { message: messageFactory(messages.W49, ['Mobile number', '5']) })
	readonly mobileNo: string;
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

class FetchUsersDto {
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Category id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['Category id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Category id']) })
	readonly categoryId: number;
	@ApiProperty()
	@IsOptional()
	@Matches(CommonRegExp.UUID_REGEX, { message: messageFactory(messages.W1, ['user id']) })
	readonly userId: string;
	@ApiProperty()
	@IsOptional()
	@IsBoolean({ message: messageFactory(messages.W1, ['active boolean status']) })
	readonly active: boolean;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Page id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['Page id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Page id']) })
	readonly pageId: number;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Page limit']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['Page limit']) })
	@Min(1, { message: messageFactory(messages.W4, ['Page limit']) })
	readonly pageLimit: number;
	@ApiProperty()
	@IsOptional()
	@IsArray({ message: messageFactory(messages.W1, ['expert type id']) })
	@ArrayMinSize(1, { message: messageFactory(messages.W22, ['expert type id']) })
	@ArrayUnique((value) => value.toString(), { message: messageFactory(messages.W23, ['expert type id']) })
	readonly expertTypeId?: number[];
	@ApiProperty()
	@IsOptional()
	@IsArray({ message: messageFactory(messages.W1, ['expert level id']) })
	@ArrayMinSize(1, { message: messageFactory(messages.W22, ['expert level id']) })
	@ArrayUnique((value) => value.toString(), { message: messageFactory(messages.W23, ['expert level id']) })
	readonly expertLevelId?: number[];
	@ApiProperty()
	@IsOptional()
	@IsArray({ message: messageFactory(messages.W1, ['jointer category id']) })
	@ArrayMinSize(1, { message: messageFactory(messages.W22, ['jointer category id']) })
	@ArrayUnique((value) => value.toString(), { message: messageFactory(messages.W23, ['jointer category id']) })
	readonly jointerCategoryId?: number[];
	@ApiProperty()
	@IsOptional()
	@Matches(CommonRegExp.DATE_REGEX, { message: messageFactory(messages.W20, ['From date']) })
	readonly fromDate?: string;
	@ApiProperty()
	@IsOptional()
	@Matches(CommonRegExp.DATE_REGEX, { message: messageFactory(messages.W20, ['To date']) })
	readonly toDate?: string;
	@ApiProperty()
	@IsOptional()
	@IsArray({ message: messageFactory(messages.W1, ['role id']) })
	@ArrayMinSize(1, { message: messageFactory(messages.W22, ['role id']) })
	@ArrayUnique((value) => value.toString(), { message: messageFactory(messages.W23, ['role id']) })
	readonly rolesId?: number[];
	@ApiProperty()
	@IsOptional()
	@IsArray({ message: messageFactory(messages.W1, ['customer company id']) })
	@ArrayMinSize(1, { message: messageFactory(messages.W22, ['customer company id']) })
	@ArrayUnique((value) => value.toString(), { message: messageFactory(messages.W23, ['customer company id']) })
	readonly companyId?: number[];
	@ApiProperty()
	@IsOptional()
	@IsArray({ message: messageFactory(messages.W1, ['city id']) })
	@ArrayMinSize(1, { message: messageFactory(messages.W22, ['city id']) })
	@ArrayUnique((value) => value.toString(), { message: messageFactory(messages.W23, ['city id']) })
	readonly cityId?: number[];
	@ApiProperty()
	@IsOptional()
	@IsArray({ message: messageFactory(messages.W1, ['status id']) })
	@ArrayMinSize(1, { message: messageFactory(messages.W22, ['status id']) })
	@ArrayUnique((value) => value.toString(), { message: messageFactory(messages.W23, ['status id']) })
	readonly statusId?: number[];
	@ApiProperty()
	@IsOptional()
	readonly search: string;
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
// class UpdateProfileDto {
// 	@IsOptional()
// 	Avatar: any;
// 	@ApiProperty()
// 	@Type(() => ProfileInfoDto)
// 	@ValidateNested({ each: true })
// 	@IsNotEmpty({ message: messageFactory(messages.W2, ['fileInfo']) })
// 	@Transform(({ value }) => {
// 		if (typeof value === 'string') value = JSON.parse(value);
// 		return plainToClass(ProfileInfoDto, value);
// 	})
// 	readonly joinerDetail: ProfileInfoDto;
// }
class GeographyInfoDTO {
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['City id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['City id']) })
	@Min(1, { message: messageFactory(messages.W4, ['City id']) })
	@IsInt({ message: messageFactory(messages.W1, ['City id']) })
	readonly cityId: number;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Division id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['Division id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Division id']) })
	@IsInt({ message: messageFactory(messages.W1, ['Division id']) })
	readonly divisionId: number;
	@ApiProperty()
	@IsNumber({}, { message: messageFactory(messages.W3, ['Unit id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Unit id']) })
	@IsInt({ message: messageFactory(messages.W1, ['Unit id']) })
	readonly unitId: number;
}

class CreateCompanyDto {
	@ApiProperty({ type: GeographyInfoDTO })
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Geography info']) })
	@ValidateNested({ each: true })
	@ArrayUnique({ message: messages.W30 })
	@Type(() => GeographyInfoDTO)
	readonly geographyInfo: GeographyInfoDTO[];
	@ApiProperty({ type: CompanyProductDto })
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Product info']) })
	@ValidateNested({ each: true })
	@ArrayUnique({ message: messages.W30 })
	@Type(() => CompanyProductDto)
	readonly productInfo: CompanyProductDto[];
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Company name']) })
	@MaxLength(100, { message: messageFactory(messages.W6, ['Company name', '100']) })
	readonly companyName: string;
}
class UpdateUserDto {
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['User id']) })
	@IsUUID('all', { message: messageFactory(messages.W1, ['user id']) })
	readonly userId: string;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Role']) })
	@IsArray({ message: messageFactory(messages.W1, ['Role']) })
	@ArrayMinSize(1, { message: messageFactory(messages.W13, ['Role']) })
	readonly roles: number[];
	@ApiProperty()
	@IsOptional()
	@IsBoolean({ message: messageFactory(messages.W1, ['active boolean status']) })
	readonly active: boolean;
}

class UpdateJointerDetailsDto {
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['User id']) })
	@IsUUID('all', { message: messageFactory(messages.W1, ['user id']) })
	readonly userId: string;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Designation']) })
	@MaxLength(150, { message: messageFactory(messages.W6, ['Designation', '150']) })
	readonly designation: string;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Vendor name']) })
	@MaxLength(150, { message: messageFactory(messages.W6, ['Vendor name', '150']) })
	readonly vendorName: string;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Expertise type Id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['Expertise type Id']) })
	@IsInt({ message: messageFactory(messages.W1, ['Expertise type Id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Expertise type Id']) })
	readonly expertiseTypeId: number;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Expertise level Id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['Expertise level Id']) })
	@IsInt({ message: messageFactory(messages.W1, ['Expertise level Id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Expertise level Id']) })
	readonly expertiseLevelId: number;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Jointer category Id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['Jointer category Id']) })
	@IsInt({ message: messageFactory(messages.W1, ['Jointer category Id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Jointer category Id']) })
	readonly jointerCategoryId: number;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Status Id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['Status Id']) })
	@IsInt({ message: messageFactory(messages.W1, ['Status Id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Status Id']) })
	readonly statusId: number;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['City Id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['City Id']) })
	@IsInt({ message: messageFactory(messages.W1, ['City Id']) })
	@Min(1, { message: messageFactory(messages.W4, ['City Id']) })
	readonly cityId: number;
	@ApiProperty()
	@IsOptional()
	@IsBoolean({ message: messageFactory(messages.W1, ['active boolean status']) })
	readonly active: boolean;
	@ApiProperty()
	@IsOptional()
	identification: string;
	@ApiProperty()
	@IsOptional()
	docTypeGuid: string;
}

class UpdateJointerDto {
	@ApiProperty()
	@IsOptional()
	Identification: any;
	@ApiProperty()
	@Type(() => UpdateJointerDetailsDto)
	@ValidateNested({ each: true })
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Jointer Details']) })
	@Transform(({ value }) => {
		if (typeof value === 'string') value = JSON.parse(value);
		return plainToClass(UpdateJointerDetailsDto, value);
	})
	readonly jointerDetail: UpdateJointerDetailsDto;
}

class CompaniesDto {
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Company id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['Company id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Company id']) })
	readonly companyId: number;
}

class FetchJointersDto {
	@ApiProperty()
	@IsOptional()
	readonly jointerName: string;
}
class JointerRatingDto {
	@ApiProperty()
	@Matches(CommonRegExp.UUID_REGEX, { message: messageFactory(messages.W1, ['Jointer id']) })
	readonly jointerId: string;
	@ApiProperty()
	@IsNumber({}, { message: messageFactory(messages.W3, ['Rating']) })
	@Min(1, { message: messageFactory(messages.W4, ['Rating']) })
	@Max(5, { message: messageFactory(messages.W26, ['Rating']) })
	@IsEnum(RatingValues, { message: messageFactory(messages.W1, ['Rating value']) })
	readonly rating: number;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Ticket id']) })
	@MaxLength(16, { message: messageFactory(messages.W6, ['Ticket id', '16']) })
	readonly ticketGuid: string;
}

class CategoryIdDto {
	@ApiProperty()
	@Min(1, { message: messageFactory(messages.W4, ['Category id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['Category id']) })
	@IsInt({ message: messageFactory(messages.W1, ['Category id']) })
	categoryId: number;
}

class FetchCompaniesDto {
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Page id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['Page id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Page id']) })
	readonly pageId: number;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Page limit']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['Page limit']) })
	@Min(1, { message: messageFactory(messages.W4, ['Page limit']) })
	readonly pageLimit: number;
	@ApiProperty()
	@IsOptional()
	@Matches(CommonRegExp.DATE_REGEX, { message: messageFactory(messages.W20, ['From date']) })
	readonly fromDate?: string;
	@ApiProperty()
	@IsOptional()
	@Matches(CommonRegExp.DATE_REGEX, { message: messageFactory(messages.W20, ['To date']) })
	readonly toDate?: string;
	@ApiProperty()
	@IsOptional()
	@IsArray({ message: messageFactory(messages.W1, ['City id']) })
	@ArrayMinSize(1, { message: messageFactory(messages.W22, ['City id']) })
	@ArrayUnique((value) => value.toString(), { message: messageFactory(messages.W23, ['City id']) })
	readonly cityId: number[];
	@ApiProperty()
	@IsOptional()
	readonly search: string;
}
class SupervisorDto {
	@ApiProperty()
	@IsOptional()
	readonly supervisorName: string;
}

export {
	CategoryIdDto,
	CompaniesDto,
	// UpdateProfileDto,
	CreateCompanyDto,
	FetchCompaniesDto,
	FetchJointersDto,
	FetchUsersDto,
	FileUploadSasDto,
	JointerRatingDto,
	JointerRegisterDto,
	LoginDto,
	RefreshTokenPrincipalDto,
	RegisterDto,
	SethDefaultRoleDto,
	SupervisorDto,
	SwitchRoleDto,
	UpdateCompanyDto,
	UpdateJointerDto,
	UpdateUserDto
};
