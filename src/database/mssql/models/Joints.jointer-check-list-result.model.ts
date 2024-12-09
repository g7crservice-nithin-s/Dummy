import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { UserColumns, UserModel } from './security.user.model';
import { TicketColumns, TicketModel } from './ticket.ticket.model';
import { JointingCheckListColumns, JointingCheckListModel } from './masters.jointing-checklist.model';

const enum JCheckListResColumn {
	JCheckListResGuid = 'JCheckListResGuid',
	TicketGuid = 'TicketGuid',
	JointingCheckListGuid = 'JointingCheckListGuid',
	Answer = 'Answer',
	Remarks = 'Remarks',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC',
	ModifiedBy = 'ModifiedBy',
	ModifiedOnUTC = 'ModifiedOnUTC'
}

const enum JCheckListResAlias {
	Ticket = 'Ticket',
	CreatedByUser = 'CreatedByUser',
	ModifiedUser = 'ModifiedUser',
	JointCheckList = 'JointCheckList'
}

@Table({ tableName: Tables.Tbl_JCheckListResult, schema: Schema.Joints, timestamps: false })
class JCheckListResModel extends Model<JCheckListResModel> {
	@Column({ primaryKey: true, type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[JCheckListResColumn.JCheckListResGuid]: string;

	@Column({ type: `${DataType.VARCHAR}(16)`, allowNull: false })
	[JCheckListResColumn.TicketGuid]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[JCheckListResColumn.JointingCheckListGuid]: string;

	@Column({ type: `${DataType.VARCHAR}(5)`, allowNull: false })
	[JCheckListResColumn.Answer]: string;

	@Column({ type: `${DataType.VARCHAR}(150)`, allowNull: true })
	[JCheckListResColumn.Remarks]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[JCheckListResColumn.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[JCheckListResColumn.CreatedOnUTC]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: true })
	[JCheckListResColumn.ModifiedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: true })
	[JCheckListResColumn.ModifiedOnUTC]: string;

	@BelongsTo(() => TicketModel, {
		foreignKey: JCheckListResColumn.TicketGuid,
		targetKey: TicketColumns.TicketGuid,
		as: JCheckListResAlias.Ticket
	})
	Ticket: TicketModel;

	@BelongsTo(() => JointingCheckListModel, {
		foreignKey: JCheckListResColumn.JointingCheckListGuid,
		targetKey: JointingCheckListColumns.JointingCheckListGuid,
		as: JCheckListResAlias.JointCheckList
	})
	JointCheckList: JointingCheckListModel;

	@BelongsTo(() => UserModel, {
		foreignKey: JCheckListResColumn.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: JCheckListResAlias.CreatedByUser
	})
	CreatedByUser: UserModel;

	@BelongsTo(() => UserModel, {
		foreignKey: JCheckListResColumn.ModifiedBy,
		targetKey: UserColumns.UserGuid,
		as: JCheckListResAlias.ModifiedUser
	})
	ModifiedUser: UserModel;
}

export { JCheckListResAlias, JCheckListResColumn, JCheckListResModel };
