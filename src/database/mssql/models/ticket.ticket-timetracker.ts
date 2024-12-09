import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { UserColumns, UserModel } from './security.user.model';
import { TicketColumns, TicketModel } from './ticket.ticket.model';

const enum TicketTimeTrackerColumns {
	TicketTimeTrackerGuid = 'TicketTimeTrackerGuid',
	TicketGuid = 'TicketGuid',
	Name = 'Name',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum TicketTimeTrackerAlias {
	Ticket = 'Ticket',
	CreatedByUser = 'CreatedByUser'
}

@Table({ tableName: Tables.Tbl_TicketTimeTracker, schema: Schema.Tickets, timestamps: false })
class TicketTimeTrackerModel extends Model<TicketTimeTrackerModel> {
	@Column({ primaryKey: true, type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[TicketTimeTrackerColumns.TicketTimeTrackerGuid]: string;

	@Column({ type: `${DataType.VARCHAR}(16)`, allowNull: false })
	[TicketTimeTrackerColumns.TicketGuid]: string;

	@Column({ type: `${DataType.VARCHAR}(50)`, allowNull: false })
	[TicketTimeTrackerColumns.Name]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[TicketTimeTrackerColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[TicketTimeTrackerColumns.CreatedOnUTC]: string;

	@BelongsTo(() => TicketModel, {
		foreignKey: TicketTimeTrackerColumns.TicketGuid,
		targetKey: TicketColumns.TicketGuid,
		as: TicketTimeTrackerAlias.Ticket
	})
	Ticket: TicketModel;

	@BelongsTo(() => UserModel, {
		foreignKey: TicketTimeTrackerColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: TicketTimeTrackerAlias.CreatedByUser
	})
	CreatedByUser: UserModel;
}

export { TicketTimeTrackerColumns, TicketTimeTrackerModel, TicketTimeTrackerAlias };
