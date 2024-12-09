import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { UserColumns, UserModel } from './security.user.model';
import { PreInstallationColumns, PreInstallationModel } from './master.pre-instalaltion.model';
import { TicketColumns, TicketModel } from './ticket.ticket.model';

const enum PreInstallationResultColumns {
	PreInstallationResGuid = 'PreInstallationResGuid',
	TicketGuid = 'TicketGuid',
	PreInstallationGuid = 'PreInstallationGuid',
	Answer = 'Answer',
	Remarks = 'Remarks',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC',
	ModifiedBy = 'ModifiedBy',
	ModifiedOnUTC = 'ModifiedOnUTC'
}

const enum PreInstallationResultAlias {
	PreInstallation = 'PreInstallation',
	Ticket = 'Ticket',
	CreatedUser = 'CreatedUser',
	ModifiedUser = 'ModifiedUser'
}

@Table({ tableName: Tables.Tbl_PreInstallationResult, schema: Schema.Joints, timestamps: false })
class PreInstallationResultModel extends Model<PreInstallationResultModel> {
	@Column({ primaryKey: true, type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[PreInstallationResultColumns.PreInstallationResGuid]: string;

	@Column({ type: `${DataType.VARCHAR}(16)`, allowNull: false })
	[PreInstallationResultColumns.TicketGuid]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[PreInstallationResultColumns.PreInstallationGuid]: string;

	@Column({ type: `${DataType.VARCHAR}(3)`, allowNull: false })
	[PreInstallationResultColumns.Answer]: string;

	@Column({ type: `${DataType.VARCHAR}(150)`, allowNull: true })
	[PreInstallationResultColumns.Remarks]?: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[PreInstallationResultColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[PreInstallationResultColumns.CreatedOnUTC]: Date;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: true })
	[PreInstallationResultColumns.ModifiedBy]?: string;

	@Column({ type: DataType.DATE_TIME, allowNull: true })
	[PreInstallationResultColumns.ModifiedOnUTC]?: Date;

	@BelongsTo(() => PreInstallationModel, {
		foreignKey: PreInstallationResultColumns.PreInstallationGuid,
		targetKey: PreInstallationColumns.PreInstallationGuid,
		as: PreInstallationResultAlias.PreInstallation
	})
	PreInstallation: PreInstallationModel;

	@BelongsTo(() => TicketModel, {
		foreignKey: PreInstallationResultColumns.TicketGuid,
		targetKey: TicketColumns.TicketGuid,
		as: PreInstallationResultAlias.Ticket
	})
	Ticket: TicketModel;

	@BelongsTo(() => UserModel, {
		foreignKey: PreInstallationResultColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: PreInstallationResultAlias.CreatedUser
	})
	CreatedUser: UserModel;

	@BelongsTo(() => UserModel, {
		foreignKey: PreInstallationResultColumns.ModifiedBy,
		targetKey: UserColumns.UserGuid,
		as: PreInstallationResultAlias.ModifiedUser
	})
	ModifiedUser: UserModel;
}

export { PreInstallationResultAlias, PreInstallationResultColumns, PreInstallationResultModel };
