import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { UserColumns, UserModel } from './security.user.model';
import { TicketColumns, TicketModel } from './ticket.ticket.model';
import { CommentColumns, CommentModel } from './joints.comments.model';
import { MasterTicketStatusColumns, MasterTicketStatusModel } from './masters.ticket-status.model';

const enum TicketStatusColumns {
	TicketStatusGuid = 'TicketStatusGuid',
	TicketGuid = 'TicketGuid',
	TicketStatusId = 'TicketStatusId',
	EffectiveFrom = 'EffectiveFrom',
	EffectiveTill = 'EffectiveTill',
	CommentGuid = 'CommentGuid',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum TicketStatusAlias {
	Ticket = 'Ticket',
	MasterTicketStatus = 'MasterTicketStatus',
	CreatedByUser = 'CreatedByUser',
	Comment = 'Comment'
}

@Table({ tableName: Tables.Tbl_TicketStatus, schema: Schema.Tickets, timestamps: false })
class TicketStatusModel extends Model<TicketStatusModel> {
	@Column({ primaryKey: true, type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[TicketStatusColumns.TicketStatusGuid]: string;

	@Column({ type: `${DataType.VARCHAR}(16)`, allowNull: false })
	[TicketStatusColumns.TicketGuid]: string;

	@Column({ type: DataType.TINY_INT, allowNull: false })
	[TicketStatusColumns.TicketStatusId]: number;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[TicketStatusColumns.EffectiveFrom]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[TicketStatusColumns.EffectiveTill]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: true })
	[TicketStatusColumns.CommentGuid]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[TicketStatusColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[TicketStatusColumns.CreatedOnUTC]: string;

	@BelongsTo(() => TicketModel, {
		foreignKey: TicketStatusColumns.TicketGuid,
		targetKey: TicketColumns.TicketGuid,
		as: TicketStatusAlias.Ticket
	})
	Ticket: TicketModel;

	@BelongsTo(() => MasterTicketStatusModel, {
		foreignKey: TicketStatusColumns.TicketStatusId,
		targetKey: MasterTicketStatusColumns.TicketStatusId,
		as: TicketStatusAlias.MasterTicketStatus
	})
	MasterTicketStatus: MasterTicketStatusModel;

	@BelongsTo(() => UserModel, {
		foreignKey: TicketStatusColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: TicketStatusAlias.CreatedByUser
	})
	CreatedUser: UserModel;

	@BelongsTo(() => CommentModel, {
		foreignKey: TicketStatusColumns.CommentGuid,
		targetKey: CommentColumns.CommentGuid,
		as: TicketStatusAlias.Comment
	})
	Comment: CommentModel;
}

export { TicketStatusModel, TicketStatusColumns, TicketStatusAlias };
