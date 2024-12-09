import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { UserColumns, UserModel } from './security.user.model';

const enum CategoryColumns {
	CategoryId = 'CategoryId',
	CategoryName = 'CategoryName',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum CategoryAlias {
	CreatedUser = 'CreatedUser'
}

@Table({ tableName: Tables.Tbl_UserCategory, schema: Schema.Masters, timestamps: false })
class CategoryModel extends Model<CategoryModel> {
	@Column({ primaryKey: true, type: DataType.TINY_INT, allowNull: false })
	[CategoryColumns.CategoryId]: number;

	@Column({ type: `${DataType.VARCHAR}(50)`, allowNull: false })
	[CategoryColumns.CategoryName]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[CategoryColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[CategoryColumns.CreatedOnUTC]: string;

	@BelongsTo(() => UserModel, {
		foreignKey: CategoryColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: CategoryAlias.CreatedUser
	})
	CreatedUser: UserModel;
}

export { CategoryColumns, CategoryModel };
