import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { DataType } from '@app/core/enums/data-type.enum';
import { TicketColumns, TicketModel } from './ticket.ticket.model';
import { UserColumns, UserModel } from './security.user.model';
import { VoltageColumn, VoltageModel } from './masters.voltage.model';
import { CommentColumns, CommentModel } from './joints.comments.model';
import { ExcavationConditionColumns, ExcavationConditionModel } from './masters.excavation-condition.model';

const enum JointingColumn {
	JointingGuid = 'JointingGuid',
	TicketGuid = 'TicketGuid',
	ExcavationConditionId = 'ExcavationConditionId',
	DigitalSignature = 'DigitalSignature',
	ExcavationCommentGuid = 'ExcavationCommentGuid',
	VoltageId = 'VoltageId',
	FinalVerification = 'FinalVerification',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC',
	ModifiedBy = 'ModifiedBy',
	ModifiedOnUTC = 'ModifiedOnUTC'
}
const enum JointingAlias {
	Ticket = 'Ticket',
	CreatedByUser = 'CreatedByUser',
	ModifiedByUser = 'ModifiedByUser',
	Voltage = 'Voltage',
	ExcavationComment = 'ExcavationComment',
	ExcavationCondition = 'ExcavationCondition'
}

@Table({ tableName: Tables.Tbl_Jointing, schema: Schema.Joints, timestamps: false })
class JointingModel extends Model<JointingModel> {
	@Column({ primaryKey: true, type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[JointingColumn.JointingGuid]: string;

	@Column({ primaryKey: true, type: `${DataType.VARCHAR}(16)`, allowNull: false })
	[JointingColumn.TicketGuid]: string;

	@Column({ type: `${DataType.VARCHAR}(200)`, allowNull: true })
	[JointingColumn.DigitalSignature]: string;

	@Column({ type: DataType.TINY_INT, allowNull: false })
	[JointingColumn.ExcavationConditionId]: number;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: true })
	[JointingColumn.ExcavationCommentGuid]: string;

	@Column({ type: DataType.TINY_INT, allowNull: true })
	[JointingColumn.VoltageId]: number;

	@Column({ type: DataType.BIT, allowNull: true })
	[JointingColumn.FinalVerification]: boolean;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[JointingColumn.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[JointingColumn.CreatedOnUTC]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: true })
	[JointingColumn.ModifiedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: true })
	[JointingColumn.ModifiedOnUTC]: string;

	@BelongsTo(() => UserModel, {
		foreignKey: JointingColumn.ModifiedBy,
		targetKey: UserColumns.UserGuid,
		as: JointingAlias.ModifiedByUser
	})
	ModifiedByUsers: UserModel;

	@BelongsTo(() => VoltageModel, {
		foreignKey: JointingColumn.VoltageId,
		targetKey: VoltageColumn.VoltageId,
		as: JointingAlias.Voltage
	})
	Voltages: VoltageModel;

	@BelongsTo(() => UserModel, {
		foreignKey: JointingColumn.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: JointingAlias.CreatedByUser
	})
	CreatedByUser: UserModel;

	@BelongsTo(() => CommentModel, {
		foreignKey: JointingColumn.ExcavationCommentGuid,
		targetKey: CommentColumns.CommentGuid,
		as: JointingAlias.ExcavationComment
	})
	ExcavationComment: CommentModel;

	@BelongsTo(() => ExcavationConditionModel, {
		foreignKey: JointingColumn.ExcavationConditionId,
		targetKey: ExcavationConditionColumns.ExcavationConditionId,
		as: JointingAlias.ExcavationCondition
	})
	ExcavationCondition: ExcavationConditionModel;

	@BelongsTo(() => TicketModel, {
		foreignKey: JointingColumn.TicketGuid,
		targetKey: TicketColumns.TicketGuid,
		as: JointingAlias.Ticket
	})
	Tickets: TicketModel;
}

export { JointingModel, JointingColumn, JointingAlias };
