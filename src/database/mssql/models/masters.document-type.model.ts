import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { UserColumns, UserModel } from './security.user.model';

const enum DocumentTypeColumns {
	DocumentId = 'DocumentId',
	DocumentName = 'DocumentName',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum DocumentTypeAlias {
	CreatedUser = 'CreatedUser'
}

@Table({ tableName: Tables.Tbl_DocumentType, schema: Schema.Masters, timestamps: false })
class DocumentTypeModel extends Model<DocumentTypeModel> {
	@Column({ primaryKey: true, type: DataType.TINY_INT, allowNull: false })
	[DocumentTypeColumns.DocumentId]: string;

	@Column({ type: `${DataType.VARCHAR}(50)`, allowNull: false })
	[DocumentTypeColumns.DocumentName]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[DocumentTypeColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[DocumentTypeColumns.CreatedOnUTC]: string;

	@BelongsTo(() => UserModel, {
		foreignKey: DocumentTypeColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: DocumentTypeAlias.CreatedUser
	})
	CreatedUser: UserModel;
}

export { DocumentTypeColumns, DocumentTypeModel };
