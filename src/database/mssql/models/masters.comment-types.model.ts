import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { UserColumns, UserModel } from './security.user.model';

const enum CommentTypeColumns {
	CommentTypeId = 'CommentTypeId',
	CommentTypeName = 'CommentTypeName',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum CommentTypeAlias {
	CreatedUser = 'CreatedUser'
}

@Table({ tableName: Tables.Tbl_CommentTypes, schema: Schema.Masters, timestamps: false })
class CommentTypeModel extends Model<CommentTypeModel> {
	@Column({ primaryKey: true, type: DataType.TINY_INT, allowNull: false })
	[CommentTypeColumns.CommentTypeId]: number;

	@Column({ type: `${DataType.VARCHAR}(50)`, allowNull: false })
	[CommentTypeColumns.CommentTypeName]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: true })
	[CommentTypeColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: true })
	[CommentTypeColumns.CreatedOnUTC]: string;

	@BelongsTo(() => UserModel, {
		foreignKey: CommentTypeColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: CommentTypeAlias.CreatedUser
	})
	CreatedUser: UserModel;
}

export { CommentTypeColumns, CommentTypeModel };
