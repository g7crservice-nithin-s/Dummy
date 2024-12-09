import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { DocumentColumns, DocumentModel } from './joints.document.model';
import { JoiningStepsColumn, JointingStepsModel } from './joints.jointing-steps.model';
import { JointingColumn, JointingModel } from './joints.jointing.model';
import { SiteConditionColumns, SiteConditionModel } from './joints.site-condition.model';
import { TicketColumns, TicketModel } from './ticket.ticket.model';
import { UserColumns, UserModel } from './security.user.model';
import { EscalationColumn, EscalationModel } from './joints.escalation.model';

const enum TicketDocMappingColumn {
	DocumentMappingGuid = 'DocumentMappingGuid',
	TicketGuid = 'TicketGuid',
	JointingGuid = 'JointingGuid',
	JointStepGuid = 'JointStepGuid',
	EscalationId = 'EscalationId',
	TicketKitGuid = 'TicketKitGuid',
	SiteConditionGuid = 'SiteConditionGuid',
	DocumentGuid = 'DocumentGuid',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum TicketDocMappingAlias {
	Ticket = 'Ticket',
	Jointing = 'Jointing',
	JointingStep = 'JointingStep',
	SiteCondition = 'SiteCondition',
	Document = 'Document',
	CreatedByUser = 'CreatedByUser',
	Escalation = 'Escalation'
}

@Table({ tableName: Tables.Tbl_TicketDocMapping, schema: Schema.Joints, timestamps: false })
class TicketDocMappingModel extends Model<TicketDocMappingModel> {
	@Column({ primaryKey: true, type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[TicketDocMappingColumn.DocumentMappingGuid]: string;

	@Column({ type: `${DataType.VARCHAR}(16)`, allowNull: false })
	[TicketDocMappingColumn.TicketGuid]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: true })
	[TicketDocMappingColumn.JointingGuid]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: true })
	[TicketDocMappingColumn.JointStepGuid]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: true })
	[TicketDocMappingColumn.EscalationId]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: true })
	[TicketDocMappingColumn.TicketKitGuid]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: true })
	[TicketDocMappingColumn.SiteConditionGuid]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[TicketDocMappingColumn.DocumentGuid]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[SiteConditionColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[SiteConditionColumns.CreatedOnUTC]: string;

	@BelongsTo(() => TicketModel, {
		foreignKey: TicketDocMappingColumn.TicketGuid,
		targetKey: TicketColumns.TicketGuid,
		as: TicketDocMappingAlias.Ticket
	})
	Ticket: TicketModel;

	@BelongsTo(() => DocumentModel, {
		foreignKey: TicketDocMappingColumn.DocumentGuid,
		targetKey: DocumentColumns.DocGuid,
		as: TicketDocMappingAlias.Document
	})
	Document: DocumentModel;

	@BelongsTo(() => JointingModel, {
		foreignKey: TicketDocMappingColumn.DocumentGuid,
		targetKey: JointingColumn.JointingGuid,
		as: TicketDocMappingAlias.Jointing
	})
	Jointing: JointingModel;

	@BelongsTo(() => EscalationModel, {
		foreignKey: TicketDocMappingColumn.EscalationId,
		targetKey: EscalationColumn.EscalationId,
		as: TicketDocMappingAlias.Escalation
	})
	Escalation: EscalationModel;

	@BelongsTo(() => SiteConditionModel, {
		foreignKey: TicketDocMappingColumn.SiteConditionGuid,
		targetKey: SiteConditionColumns.SiteConditionGuid,
		as: TicketDocMappingAlias.SiteCondition
	})
	SiteCondition: SiteConditionModel;

	@BelongsTo(() => JointingStepsModel, {
		foreignKey: TicketDocMappingColumn.JointStepGuid,
		targetKey: JoiningStepsColumn.JointingStepGuid,
		as: TicketDocMappingAlias.JointingStep
	})
	JointingStep: JointingStepsModel;

	@BelongsTo(() => UserModel, {
		foreignKey: TicketDocMappingColumn.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: TicketDocMappingAlias.CreatedByUser
	})
	CreatedByUser: UserModel;
}
export { TicketDocMappingAlias, TicketDocMappingColumn, TicketDocMappingModel };
