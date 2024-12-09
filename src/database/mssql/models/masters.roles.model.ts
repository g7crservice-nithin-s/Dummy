import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { CategoryColumns, CategoryModel } from './masters.user-category.model';
import { UserColumns, UserModel } from './security.user.model';

const enum RoleColumns {
	RoleId = 'RoleId',
	RoleName = 'RoleName',
	CategoryId = 'CategoryId',
	EffectiveFromUTC = 'EffectiveFromUTC',
	EffectiveTillUTC = 'EffectiveTillUTC',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum CategoryAlias {
	Category = 'Category',
	CreatedUser = 'CreatedUser'
}

@Table({ tableName: Tables.Tbl_Role, schema: Schema.Masters, timestamps: false })
class RoleModel extends Model<RoleModel> {
	@Column({ primaryKey: true, type: DataType.TINY_INT, allowNull: false })
	[RoleColumns.RoleId]: number;

	@Column({ type: `${DataType.VARCHAR}(50)`, allowNull: false })
	[RoleColumns.RoleName]: string;

	@Column({ type: DataType.TINY_INT, allowNull: false })
	[RoleColumns.CategoryId]: number;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[RoleColumns.EffectiveFromUTC]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[RoleColumns.EffectiveTillUTC]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[RoleColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[RoleColumns.CreatedOnUTC]: string;

	@BelongsTo(() => CategoryModel, {
		foreignKey: RoleColumns.CategoryId,
		targetKey: CategoryColumns.CategoryId,
		as: CategoryAlias.Category
	})
	Category: CategoryModel;

	@BelongsTo(() => UserModel, {
		foreignKey: RoleColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: CategoryAlias.CreatedUser
	})
	CreatedUser: UserModel;
}

export { RoleModel, RoleColumns, CategoryAlias };
