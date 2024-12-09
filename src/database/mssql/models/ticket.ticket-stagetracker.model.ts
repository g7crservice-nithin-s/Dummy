import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { UserColumns, UserModel } from './security.user.model';
import { TicketColumns, TicketModel } from './ticket.ticket.model';
import { TicketStageColumns, TicketStageModel } from './master.ticket-stage.model';

const enum TicketStageTrackerColumns {
	TicketStateTrackerGuid = 'TicketStateTrackerGuid',
	TicketGuid = 'TicketGuid',
	TicketStageId = 'TicketStageId',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum TicketStageTrackerAlias {
	Ticket = 'Ticket',
	TicketStage = 'TicketStage',
	CreatedUser = 'CreatedUser'
}

@Table({ tableName: Tables.Tbl_TicketStageTracker, schema: Schema.Tickets, timestamps: false })
class TicketStageTrackerModel extends Model<TicketStageTrackerModel> {
	@Column({ primaryKey: true, type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[TicketStageTrackerColumns.TicketStateTrackerGuid]: string;

	@Column({ type: `${DataType.VARCHAR}(16)`, allowNull: false })
	[TicketStageTrackerColumns.TicketGuid]: string;

	@Column({ type: DataType.TINY_INT, allowNull: false })
	[TicketStageTrackerColumns.TicketStageId]: number;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[TicketStageTrackerColumns.CreatedOnUTC]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[TicketStageTrackerColumns.CreatedBy]: string;

	@BelongsTo(() => TicketModel, {
		foreignKey: TicketStageTrackerColumns.TicketGuid,
		targetKey: TicketColumns.TicketGuid,
		as: TicketStageTrackerAlias.Ticket
	})
	Ticket: TicketModel;

	@BelongsTo(() => TicketStageModel, {
		foreignKey: TicketStageTrackerColumns.TicketStageId,
		targetKey: TicketStageColumns.TicketStageId,
		as: TicketStageTrackerAlias.TicketStage
	})
	TicketStage: TicketStageModel;

	@BelongsTo(() => UserModel, {
		foreignKey: TicketStageTrackerColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: TicketStageTrackerAlias.CreatedUser
	})
	CreatedUser: UserModel;
}

export { TicketStageTrackerModel, TicketStageTrackerColumns, TicketStageTrackerAlias };
