import { Column, Model, Table, BelongsTo } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { DataType } from '@app/core/enums/data-type.enum';
import { UserColumns, UserModel } from './security.user.model';

const enum EmailColumns {
	EmailGuid = 'EmailGuid',
	FromEmailAddressComma = 'FromEmailAddressComma',
	ToEmailAddressComma = 'ToEmailAddressComma',
	CCEmailAddressComma = 'CCEmailAddressComma',
	BCCEmailAddressComma = 'BCCEmailAddressComma',
	EmailSubject = 'EmailSubject',
	EmailBody = 'EmailBody',
	Status = 'Status',
	CreatedOnUTC = 'CreatedOnUTC',
	CreatedBy = 'CreatedBy'
}

const enum EmailAlias {
	CreatedUser = 'CreatedUser'
}

@Table({ tableName: Tables.Tbl_Email, schema: Schema.Logs, timestamps: false })
class EmailModel extends Model<EmailModel> {
	@Column({ primaryKey: true, type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[EmailColumns.EmailGuid]: string;

	@Column({ type: `${DataType.VARCHAR}(150)`, allowNull: false })
	[EmailColumns.FromEmailAddressComma]: string;

	@Column({ type: `${DataType.VARCHAR}(300)`, allowNull: false })
	[EmailColumns.ToEmailAddressComma]: string;

	@Column({ type: `${DataType.VARCHAR}(300)`, allowNull: true })
	[EmailColumns.CCEmailAddressComma]: string;

	@Column({ type: `${DataType.VARCHAR}(300)`, allowNull: true })
	[EmailColumns.BCCEmailAddressComma]: string;

	@Column({ type: `${DataType.VARCHAR}(1000)`, allowNull: false })
	[EmailColumns.EmailSubject]: string;

	@Column({ type: `${DataType.VARCHAR}(max)`, allowNull: false })
	[EmailColumns.EmailBody]: string;

	@Column({ type: `${DataType.VARCHAR}(10)`, allowNull: false })
	[EmailColumns.Status]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[EmailColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[EmailColumns.CreatedOnUTC]: string;

	@BelongsTo(() => UserModel, {
		foreignKey: EmailColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: EmailAlias.CreatedUser
	})
	CreatedUser: UserModel;
}

export { EmailColumns, EmailModel, EmailAlias };
