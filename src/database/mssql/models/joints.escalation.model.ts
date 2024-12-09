import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, HasOne, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { CommentColumns, CommentModel } from './joints.comments.model';
import { TicketDocMappingModel } from './joints.ticket-doc-mapping.model';
import { CountryCodeColumns, CountryCodeModel } from './masters.country-code.model';
import { UserColumns, UserModel } from './security.user.model';
import { TicketColumns, TicketModel } from './ticket.ticket.model';

const enum EscalationColumn {
	EscalationId = 'EscalationId',
	TicketGuid = 'TicketGuid',
	CommentGuid = 'CommentGuid',
	ConcernEmailId = 'ConcernEmailId',
	CountryCodeId = 'CountryCodeId',
	MobileNo = 'MobileNo',
	Designation = 'Designation',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum EscalationAlias {
	CountryCode = 'CountryCode',
	CreatedByUser = 'CreatedByUser',
	Ticket = 'Ticket',
	Comment = 'Comment',
	DocMapping = 'DocMapping'
}

@Table({ tableName: Tables.Tbl_Escalation, schema: Schema.Joints, timestamps: false })
class EscalationModel extends Model<EscalationModel> {
	@Column({ primaryKey: true, type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[EscalationColumn.EscalationId]: string;

	@Column({ type: `${DataType.VARCHAR}(16)`, allowNull: false })
	[EscalationColumn.TicketGuid]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[EscalationColumn.CommentGuid]: string;

	@Column({ type: `${DataType.VARCHAR}(150)`, allowNull: false })
	[EscalationColumn.ConcernEmailId]: string;

	@Column({ type: DataType.TINY_INT, allowNull: false })
	[EscalationColumn.CountryCodeId]: number;

	@Column({ type: `${DataType.VARCHAR}(15)`, allowNull: false })
	[EscalationColumn.MobileNo]: string;

	@Column({ type: `${DataType.VARCHAR}(50)`, allowNull: false })
	[EscalationColumn.Designation]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[EscalationColumn.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[EscalationColumn.CreatedOnUTC]: string;

	@BelongsTo(() => UserModel, {
		foreignKey: EscalationColumn.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: EscalationAlias.CreatedByUser
	})
	CreatedByUser: UserModel;

	@BelongsTo(() => CountryCodeModel, {
		foreignKey: EscalationColumn.CountryCodeId,
		targetKey: CountryCodeColumns.CountryCodeId,
		as: EscalationAlias.CountryCode
	})
	CountryCode: CountryCodeModel;

	@BelongsTo(() => TicketModel, {
		foreignKey: EscalationColumn.TicketGuid,
		targetKey: TicketColumns.TicketGuid,
		as: EscalationAlias.Ticket
	})
	Ticket: TicketModel;

	@BelongsTo(() => CommentModel, {
		foreignKey: EscalationColumn.CommentGuid,
		targetKey: CommentColumns.CommentGuid,
		as: EscalationAlias.Comment
	})
	Comment: CommentModel;

	@HasOne(() => TicketDocMappingModel, {
		foreignKey: EscalationColumn.EscalationId,
		as: EscalationAlias.DocMapping
	})
	DocMapping: TicketDocMappingModel;
}

export { EscalationAlias, EscalationColumn, EscalationModel };
