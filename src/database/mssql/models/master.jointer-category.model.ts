import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { UserColumns, UserModel } from './security.user.model';

const enum JointerCategoryColumns {
	JointerCategoryId = 'JointerCategoryId',
	JointerCategoryName = 'JointerCategoryName',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum jointerCategoryAlias {
	CreatedUser = 'CreatedUser'
}

@Table({ tableName: Tables.Tbl_JointerCategory, schema: Schema.Masters, timestamps: false })
class JointerCategoryModel extends Model<JointerCategoryModel> {
	@Column({ primaryKey: true, type: DataType.TINY_INT, allowNull: false })
	[JointerCategoryColumns.JointerCategoryId]: number;

	@Column({ type: `${DataType.VARCHAR}(50)`, allowNull: false })
	[JointerCategoryColumns.JointerCategoryName]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: true })
	[JointerCategoryColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: true })
	[JointerCategoryColumns.CreatedOnUTC]: string;

	@BelongsTo(() => UserModel, {
		foreignKey: JointerCategoryColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: jointerCategoryAlias.CreatedUser
	})
	CreatedUser: UserModel;
}

export { JointerCategoryModel, JointerCategoryColumns, jointerCategoryAlias };
