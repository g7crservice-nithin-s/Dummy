import { DataType } from '@app/core/enums/data-type.enum';
import { Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';

const enum TicketStageColumns {
	TicketStageId = 'TicketStageId',
	TicketStageName = 'TicketStageName'
}

@Table({ tableName: Tables.Tbl_TicketStage, schema: Schema.Masters, timestamps: false })
class TicketStageModel extends Model<TicketStageModel> {
	@Column({ primaryKey: true, type: DataType.TINY_INT, allowNull: false })
	[TicketStageColumns.TicketStageId]: number;

	@Column({ type: `${DataType.VARCHAR}(100)`, allowNull: false })
	[TicketStageColumns.TicketStageName]: string;
}

export { TicketStageColumns, TicketStageModel };
