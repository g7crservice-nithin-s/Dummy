import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { UserColumns, UserModel } from './security.user.model';

const enum JointerDocumentColumns {
	JointerDocGuid = 'JointerDocGuid',
	UserGuid = 'UserGuid',
	DocType = 'DocType',
	JointerDocName = 'JointerDocName',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum jointerDocumentAlias {
	User = 'User',
	CreatedUser = 'CreatedUser'
}

@Table({ tableName: Tables.Tbl_JointerDocument, schema: Schema.Security, timestamps: false })
class JointerDocumentModel extends Model<JointerDocumentModel> {
	@Column({ primaryKey: true, type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[JointerDocumentColumns.JointerDocGuid]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[JointerDocumentColumns.UserGuid]: string;

	@Column({ type: `${DataType.VARCHAR}(30)`, allowNull: false })
	[JointerDocumentColumns.DocType]: string;

	@Column({ type: `${DataType.VARCHAR}(200)`, allowNull: false })
	[JointerDocumentColumns.JointerDocName]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[JointerDocumentColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[JointerDocumentColumns.CreatedOnUTC]: string;

	@BelongsTo(() => UserModel, {
		foreignKey: JointerDocumentColumns.UserGuid,
		targetKey: UserColumns.UserGuid,
		as: jointerDocumentAlias.User
	})
	User: UserModel;

	@BelongsTo(() => UserModel, {
		foreignKey: JointerDocumentColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: jointerDocumentAlias.CreatedUser
	})
	CreatedUser: UserModel;
}

export { JointerDocumentModel, JointerDocumentColumns, jointerDocumentAlias };
