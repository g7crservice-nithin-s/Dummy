import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { UserColumns, UserModel } from './security.user.model';

const enum JointerStatusColumns {
	JStatusId = 'JStatusId',
	JStatusName = 'JStatusName',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum StatusAlias {
	CreatedUser = 'CreatedUser'
}

@Table({ tableName: Tables.Tbl_JointerStatus, schema: Schema.Masters, timestamps: false })
class JointerStatusModel extends Model<JointerStatusModel> {
	@Column({ primaryKey: true, type: DataType.TINY_INT, allowNull: false })
	[JointerStatusColumns.JStatusId]: number;

	@Column({ type: `${DataType.VARCHAR}(50)`, allowNull: false })
	[JointerStatusColumns.JStatusName]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[JointerStatusColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[JointerStatusColumns.CreatedOnUTC]: string;

	@BelongsTo(() => UserModel, {
		foreignKey: JointerStatusColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: StatusAlias.CreatedUser
	})
	CreatedUser: UserModel;
}

export { JointerStatusModel, JointerStatusColumns, StatusAlias };
