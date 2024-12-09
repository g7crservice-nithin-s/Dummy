import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { UserColumns, UserModel } from './security.user.model';

const enum ExpertiseTypeColumns {
	ExpertTypeId = 'ExpertTypeId',
	ExpertTypeName = 'ExpertTypeName',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum ExpertiseTypeAlias {
	CreatedUser = 'CreatedUser'
}

@Table({ tableName: Tables.Tbl_ExpertiseType, schema: Schema.Masters, timestamps: false })
class ExpertiseTypeModel extends Model<ExpertiseTypeModel> {
	@Column({ primaryKey: true, type: DataType.TINY_INT, allowNull: false })
	[ExpertiseTypeColumns.ExpertTypeId]: number;

	@Column({ type: `${DataType.VARCHAR}(50)`, allowNull: false })
	[ExpertiseTypeColumns.ExpertTypeName]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[ExpertiseTypeColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[ExpertiseTypeColumns.CreatedOnUTC]: string;

	@BelongsTo(() => UserModel, {
		foreignKey: ExpertiseTypeColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: ExpertiseTypeAlias.CreatedUser
	})
	CreatedUser: UserModel;
}

export { ExpertiseTypeModel, ExpertiseTypeColumns };
