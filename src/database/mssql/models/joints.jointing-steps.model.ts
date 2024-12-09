import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, HasMany, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { TicketDocMappingColumn, TicketDocMappingModel } from './joints.ticket-doc-mapping.model';
import { ActivityFLowModel, ActivityFlowColumn } from './masters.activity-flow.model';
import { UserColumns, UserModel } from './security.user.model';
import { TicketColumns, TicketModel } from './ticket.ticket.model';

const enum JoiningStepsColumn {
	JointingStepGuid = 'JointingStepGuid',
	ActivityFlowGuid = 'ActivityFlowGuid',
	TicketGuid = 'TicketGuid',
	Comment = 'Comment',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum JointingStepsAlias {
	ActivityFlow = 'ActivityFlow',
	Ticket = 'Ticket',
	CreatedByUser = 'CreatedByUser',
	DocMapping = 'DocMapping'
}

@Table({ tableName: Tables.Tbl_JointingSteps, schema: Schema.Joints, timestamps: false })
class JointingStepsModel extends Model<JointingStepsModel> {
	@Column({ primaryKey: true, type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[JoiningStepsColumn.JointingStepGuid]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[JoiningStepsColumn.ActivityFlowGuid]: string;

	@Column({ type: `${DataType.VARCHAR}(16)`, allowNull: false })
	[JoiningStepsColumn.TicketGuid]: string;

	@Column({ type: `${DataType.VARCHAR}(200)`, allowNull: true })
	[JoiningStepsColumn.Comment]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[JoiningStepsColumn.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[JoiningStepsColumn.CreatedOnUTC]: string;

	@BelongsTo(() => ActivityFLowModel, {
		foreignKey: JoiningStepsColumn.ActivityFlowGuid,
		targetKey: ActivityFlowColumn.ActivityFlowGuid,
		as: JointingStepsAlias.ActivityFlow,
		onDelete: 'NO ACTION'
	})
	ActivityFlow: ActivityFLowModel;

	@BelongsTo(() => TicketModel, {
		foreignKey: JoiningStepsColumn.TicketGuid,
		targetKey: TicketColumns.TicketGuid,
		as: JointingStepsAlias.Ticket
	})
	Ticket: TicketModel;

	@BelongsTo(() => UserModel, {
		foreignKey: JoiningStepsColumn.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: JointingStepsAlias.CreatedByUser
	})
	CreatedByUser: UserModel;

	@HasMany(() => TicketDocMappingModel, {
		foreignKey: TicketDocMappingColumn.JointStepGuid,
		sourceKey: JoiningStepsColumn.JointingStepGuid,
		as: JointingStepsAlias.DocMapping
	})
	DocMapping: TicketDocMappingModel;
}

export { JoiningStepsColumn, JointingStepsAlias, JointingStepsModel };
