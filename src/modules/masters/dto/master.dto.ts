import { HierarchyMasterTableEnum, MasterTableEnum } from '@app/core/enums/master-table.enum';
import { activityType } from '@app/core/enums/shared.enum';
import { messageFactory, messages } from '@app/shared/messages.shared';
import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, ArrayUnique, IsArray, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

class SubJointDto {
	@ApiProperty()
	@IsOptional()
	@IsArray({ message: messageFactory(messages.W1, ['Joint Id']) })
	@ArrayMinSize(1, { message: messageFactory(messages.W22, ['Joint Id']) })
	@ArrayUnique((value) => value.toString(), { message: messageFactory(messages.W23, ['Joint Id']) })
	readonly jointId: number[];
}
class VoltageDto {
	@ApiProperty()
	@IsOptional()
	@IsNumber({}, { message: messageFactory(messages.W3, ['Voltage Id']) })
	@IsInt({ message: messageFactory(messages.W1, ['Voltage Id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Voltage Id']) })
	readonly voltageId: number;
}
class ActivityFlowDto {
	@ApiProperty()
	@IsOptional()
	@IsNumber({}, { message: messageFactory(messages.W3, ['SubJoint Id']) })
	@IsInt({ message: messageFactory(messages.W1, ['SubJoint Id']) })
	@Min(1, { message: messageFactory(messages.W4, ['SubJoint Id']) })
	readonly subJointId: number;
	@ApiProperty()
	@IsOptional()
	@IsNumber({}, { message: messageFactory(messages.W3, ['Sub product Id']) })
	@IsInt({ message: messageFactory(messages.W1, ['Sub product Id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Sub product Id']) })
	readonly subProductId: number;
}

class CategoryIdDto {
	@ApiProperty()
	@Min(1, { message: messageFactory(messages.W4, ['Category id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['Category id']) })
	@IsInt({ message: messageFactory(messages.W1, ['Category id']) })
	categoryId: number;
}
class JointDto {
	@ApiProperty()
	@IsOptional()
	@IsArray({ message: messageFactory(messages.W1, ['Product id']) })
	@ArrayMinSize(1, { message: messageFactory(messages.W22, ['Product id']) })
	@ArrayUnique((value) => value.toString(), { message: messageFactory(messages.W23, ['Product id']) })
	productId: number[];
}

class DivisionDto {
	@ApiProperty()
	@IsOptional()
	@Min(1, { message: messageFactory(messages.W4, ['city id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['city id']) })
	@IsInt({ message: messageFactory(messages.W1, ['city id']) })
	readonly cityId: number;
	@ApiProperty()
	@IsOptional()
	@Min(1, { message: messageFactory(messages.W4, ['company id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['company id']) })
	@IsInt({ message: messageFactory(messages.W1, ['company id']) })
	readonly companyId: number;
}
class UnitDto {
	@ApiProperty()
	@IsOptional()
	@Min(1, { message: messageFactory(messages.W4, ['city id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['city id']) })
	@IsInt({ message: messageFactory(messages.W1, ['city id']) })
	readonly cityId: number;
	@ApiProperty()
	@IsOptional()
	@Min(1, { message: messageFactory(messages.W4, ['company id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['company id']) })
	@IsInt({ message: messageFactory(messages.W1, ['company id']) })
	readonly companyId: number;
	@ApiProperty()
	@IsOptional()
	@Min(1, { message: messageFactory(messages.W4, ['division id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['division id']) })
	@IsInt({ message: messageFactory(messages.W1, ['division id']) })
	readonly divisionId: number;
}

class MasterTableDto {
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['table name']) })
	@IsEnum(
		[
			MasterTableEnum.ExpertiseLevel,
			MasterTableEnum.ExpertiseType,
			MasterTableEnum.JobType,
			MasterTableEnum.SiteState,
			MasterTableEnum.Voltage,
			MasterTableEnum.City,
			MasterTableEnum.SafetyCheckList,
			MasterTableEnum.Product
		],
		{ message: messageFactory(messages.W1, ['table name']) }
	)
	readonly tableName: string;

	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['table name']) })
	@IsArray({ message: messageFactory(messages.W1, ['table name']) })
	@ArrayMinSize(1, { message: messageFactory(messages.W22, ['table name']) })
	@ArrayUnique((value) => value.toString(), { message: messageFactory(messages.W23, ['table name']) })
	readonly name: string[];
}
class HierarchyMasterTableDto {
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['table name']) })
	@IsEnum(
		[
			HierarchyMasterTableEnum.SubExpertiseType,
			HierarchyMasterTableEnum.SubJoint,
			HierarchyMasterTableEnum.SubProduct,
			HierarchyMasterTableEnum.JointingCheckList,
			HierarchyMasterTableEnum.Division,
			HierarchyMasterTableEnum.Unit,
			HierarchyMasterTableEnum.Joint,
			HierarchyMasterTableEnum.PreInstallation,
			HierarchyMasterTableEnum.ActivityFlow
		],
		{
			message: messageFactory(messages.W1, ['table name'])
		}
	)
	readonly tableName: string;

	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['parent id']) })
	@Min(1, { message: messageFactory(messages.W4, ['parent id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['parent id']) })
	@IsInt({ message: messageFactory(messages.W1, ['parent id']) })
	readonly parentId: number;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['table name']) })
	@IsArray({ message: messageFactory(messages.W1, ['table name']) })
	@ArrayMinSize(1, { message: messageFactory(messages.W22, ['table name']) })
	@ArrayUnique((value) => value.toString(), { message: messageFactory(messages.W23, ['table name']) })
	readonly name: string[];
	@ApiProperty()
	@IsOptional()
	@IsEnum(activityType, { message: messageFactory(messages.W1, ['activity type']) })
	readonly type: string;
}

class CityDto {
	@ApiProperty()
	@IsOptional()
	@IsNumber({}, { message: messageFactory(messages.W3, ['Company id']) })
	@IsInt({ message: messageFactory(messages.W1, ['Company id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Company id']) })
	readonly companyId: number;
}
class SubProductCategoryDto {
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Sub Joint id']) })
	@IsArray({ message: messageFactory(messages.W1, ['Sub Joint id']) })
	@ArrayMinSize(1, { message: messageFactory(messages.W22, ['Sub Joint id']) })
	@ArrayUnique((value) => value.toString(), { message: messageFactory(messages.W23, ['Sub Joint id']) })
	readonly subJointId: number[];
}
class CompanyProjectDto {
	@ApiProperty()
	@IsOptional()
	@IsNumber({}, { message: messageFactory(messages.W3, ['Company id']) })
	@IsInt({ message: messageFactory(messages.W1, ['Company id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Company id']) })
	readonly companyId: number;
}
class PreInstallationDto {
	@ApiProperty()
	@IsOptional()
	@IsNumber({}, { message: messageFactory(messages.W3, ['Joint Id']) })
	@IsInt({ message: messageFactory(messages.W1, ['Joint Id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Joint Id']) })
	readonly jointId: number;
}
class CompanyProductDto {
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Company id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['Company id']) })
	@IsInt({ message: messageFactory(messages.W1, ['Company id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Company id']) })
	readonly companyId: number;
}

class CompanyJointDto {
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Company id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['Company id']) })
	@IsInt({ message: messageFactory(messages.W1, ['Company id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Company id']) })
	readonly companyId: number;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Product id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Product id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['Product id']) })
	@IsInt({ message: messageFactory(messages.W1, ['Product id']) })
	readonly productId: number;
}
class CompanySubJointDto {
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Company id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['Company id']) })
	@IsInt({ message: messageFactory(messages.W1, ['Company id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Company id']) })
	readonly companyId: number;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Product id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Product id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['Product id']) })
	@IsInt({ message: messageFactory(messages.W1, ['Product id']) })
	readonly productId: number;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Joint Id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['Joint Id']) })
	@IsInt({ message: messageFactory(messages.W1, ['Joint Id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Joint Id']) })
	readonly jointId: number;
}
class CompanySubProductDto {
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Company id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['Company id']) })
	@IsInt({ message: messageFactory(messages.W1, ['Company id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Company id']) })
	readonly companyId: number;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Product id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Product id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['Product id']) })
	@IsInt({ message: messageFactory(messages.W1, ['Product id']) })
	readonly productId: number;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['Joint Id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['Joint Id']) })
	@IsInt({ message: messageFactory(messages.W1, ['Joint Id']) })
	@Min(1, { message: messageFactory(messages.W4, ['Joint Id']) })
	readonly jointId: number;
	@ApiProperty()
	@IsNotEmpty({ message: messageFactory(messages.W2, ['SubJoint Id']) })
	@IsNumber({}, { message: messageFactory(messages.W3, ['SubJoint Id']) })
	@IsInt({ message: messageFactory(messages.W1, ['SubJoint Id']) })
	@Min(1, { message: messageFactory(messages.W4, ['SubJoint Id']) })
	readonly subJointId: number;
}

export {
	ActivityFlowDto,
	CategoryIdDto,
	CityDto,
	CompanyProjectDto,
	DivisionDto,
	HierarchyMasterTableDto,
	MasterTableDto,
	SubJointDto,
	SubProductCategoryDto,
	UnitDto,
	VoltageDto,
	JointDto,
	PreInstallationDto,
	CompanyProductDto,
	CompanyJointDto,
	CompanySubJointDto,
	CompanySubProductDto
};
