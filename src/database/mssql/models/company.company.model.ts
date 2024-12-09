import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, HasMany, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { UserColumns, UserModel } from './security.user.model';
import { CompanyJointConfigModel } from './company.company-Joint-config.model';
import { CompanyGeographyInfoModel } from './company.company-geography-info.model';
import { CompanyProductModel } from './company.company-product.model';

const enum CompanyColumns {
	CompanyId = 'CompanyId',
	CompanyName = 'CompanyName',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum CompanyAlias {
	CreatedUser = 'CreatedUser',
	CompanyGeographyInfo = 'CompanyGeographyInfo',
	CompanyJointConfig = 'CompanyJointConfig',
	CompanyProduct = 'CompanyProduct'
}

@Table({ tableName: Tables.Tbl_Company, schema: Schema.Company, timestamps: false })
class CompanyModel extends Model<CompanyModel> {
	@Column({ primaryKey: true, type: DataType.TINY_INT, allowNull: false })
	[CompanyColumns.CompanyId]: number;

	@Column({ type: `${DataType.VARCHAR}(100)`, allowNull: false })
	[CompanyColumns.CompanyName]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[CompanyColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[CompanyColumns.CreatedOnUTC]: string;

	@BelongsTo(() => UserModel, {
		foreignKey: CompanyColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: CompanyAlias.CreatedUser
	})
	CreatedUser: UserModel;

	@HasMany(() => CompanyGeographyInfoModel, {
		foreignKey: CompanyColumns.CompanyId,
		as: CompanyAlias.CompanyGeographyInfo
	})
	CompanyGeographyInfo: CompanyGeographyInfoModel;

	@HasMany(() => CompanyJointConfigModel, {
		foreignKey: CompanyColumns.CompanyId,
		as: CompanyAlias.CompanyJointConfig
	})
	CompanyJointConfig: CompanyJointConfigModel;

	@HasMany(() => CompanyProductModel, {
		foreignKey: CompanyColumns.CompanyId,
		as: CompanyAlias.CompanyProduct
	})
	CompanyProduct: CompanyProductModel;
}

export { CompanyAlias, CompanyColumns, CompanyModel };
