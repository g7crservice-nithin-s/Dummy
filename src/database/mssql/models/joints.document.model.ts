import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { DocumentTypeColumns, DocumentTypeModel } from './masters.document-type.model';
import { UserColumns, UserModel } from './security.user.model';

const enum DocumentColumns {
	DocGuid = 'DocGuid',
	DocumentTypeId = 'DocumentTypeId',
	DocName = 'DocName',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC',
	ModifiedBy = 'ModifiedBy',
	ModifiedOnUTC = 'ModifiedOnUTC'
}

const enum DocumentAlias {
	CreatedByUser = 'CreatedByUser',
	ModifiedUser = 'ModifiedUser',
	DocumentType = 'DocumentType'
}

@Table({ tableName: Tables.Tbl_Document, schema: Schema.Joints, timestamps: false })
class DocumentModel extends Model<DocumentModel> {
	@Column({ primaryKey: true, type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[DocumentColumns.DocGuid]: string;

	@Column({ type: DataType.TINY_INT, allowNull: false })
	[DocumentColumns.DocumentTypeId]: string;

	@Column({ type: `${DataType.VARCHAR}(200)`, allowNull: false })
	[DocumentColumns.DocName]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[DocumentColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[DocumentColumns.CreatedOnUTC]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: true })
	[DocumentColumns.ModifiedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: true })
	[DocumentColumns.ModifiedOnUTC]: string;

	@BelongsTo(() => DocumentTypeModel, {
		foreignKey: DocumentColumns.DocumentTypeId,
		targetKey: DocumentTypeColumns.DocumentId,
		as: DocumentAlias.DocumentType
	})
	DocumentType: DocumentTypeModel;

	@BelongsTo(() => UserModel, {
		foreignKey: DocumentColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: DocumentAlias.CreatedByUser
	})
	CreatedByUser: UserModel;

	@BelongsTo(() => UserModel, {
		foreignKey: DocumentColumns.ModifiedBy,
		targetKey: UserColumns.UserGuid,
		as: DocumentAlias.ModifiedUser
	})
	ModifiedUser: UserModel;
}

export { DocumentAlias, DocumentColumns, DocumentModel };
