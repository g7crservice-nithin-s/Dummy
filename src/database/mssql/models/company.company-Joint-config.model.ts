import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { CompanyColumns, CompanyModel } from './company.company.model';
import { SubJointColumns, SubJointModel } from './masters.sub-joint.model';
import { UserColumns, UserModel } from './security.user.model';

const enum CompanyJointConfigColumns {
	CompanyJointConfigGuid = 'CompanyJointConfigGuid',
	CompanyId = 'CompanyId',
	SubJointId = 'SubJointId',
	EffectiveFromUTC = 'EffectiveFromUTC',
	EffectiveTillUTC = 'EffectiveTillUTC',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC',
	ModifiedBy = 'ModifiedBy',
	ModifiedOnUTC = 'ModifiedOnUTC'
}

const enum CompanyJointConfigAlias {
	CreatedUser = 'CreatedUser',
	Company = 'Company',
	Joint = 'Joint',
	SubJoint = 'SubJoint',
	ModifiedUser = 'ModifiedUser'
}

@Table({ tableName: Tables.Tbl_CompanyJointConfig, schema: Schema.Company, timestamps: false })
class CompanyJointConfigModel extends Model<CompanyJointConfigModel> {
	@Column({ primaryKey: true, type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[CompanyJointConfigColumns.CompanyJointConfigGuid]: string;

	@Column({ type: DataType.TINY_INT, allowNull: false })
	[CompanyJointConfigColumns.CompanyId]: number;

	@Column({ type: DataType.TINY_INT, allowNull: false })
	[CompanyJointConfigColumns.SubJointId]: number;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[CompanyJointConfigColumns.EffectiveFromUTC]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[CompanyJointConfigColumns.EffectiveTillUTC]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[CompanyJointConfigColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[CompanyJointConfigColumns.CreatedOnUTC]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: true })
	[CompanyJointConfigColumns.ModifiedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: true })
	[CompanyJointConfigColumns.ModifiedOnUTC]: string;

	@BelongsTo(() => CompanyModel, {
		foreignKey: CompanyJointConfigColumns.CompanyId,
		targetKey: CompanyColumns.CompanyId,
		as: CompanyJointConfigAlias.Company
	})
	Company: CompanyModel;

	@BelongsTo(() => SubJointModel, {
		foreignKey: CompanyJointConfigColumns.SubJointId,
		targetKey: SubJointColumns.SubJointId,
		as: CompanyJointConfigAlias.SubJoint
	})
	SubJoint: SubJointModel;

	@BelongsTo(() => UserModel, {
		foreignKey: CompanyJointConfigColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: CompanyJointConfigAlias.CreatedUser
	})
	CreatedUser: UserModel;

	@BelongsTo(() => UserModel, {
		foreignKey: CompanyJointConfigColumns.ModifiedBy,
		targetKey: UserColumns.UserGuid,
		as: CompanyJointConfigAlias.ModifiedUser
	})
	ModifiedUser: UserModel;
}

export { CompanyJointConfigAlias, CompanyJointConfigColumns, CompanyJointConfigModel };
