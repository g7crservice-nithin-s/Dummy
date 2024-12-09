import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { UserColumns, UserModel } from './security.user.model';

const enum MasterTicketStatusColumns {
	TicketStatusId = 'TicketStatusId',
	TicketStatus = 'TicketStatus',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum MasterTicketStatusAlias {
	CreatedUser = 'CreatedUser'
}

@Table({ tableName: Tables.Tbl_TicketStatus, schema: Schema.Masters, timestamps: false })
class MasterTicketStatusModel extends Model<MasterTicketStatusModel> {
	@Column({ primaryKey: true, type: DataType.TINY_INT, allowNull: false })
	[MasterTicketStatusColumns.TicketStatusId]: number;

	@Column({ type: `${DataType.VARCHAR}(50)`, allowNull: false })
	[MasterTicketStatusColumns.TicketStatus]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[MasterTicketStatusColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[MasterTicketStatusColumns.CreatedOnUTC]: string;

	@BelongsTo(() => UserModel, {
		foreignKey: MasterTicketStatusColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: MasterTicketStatusAlias.CreatedUser
	})
	CreatedUser: UserModel;
}

export { MasterTicketStatusModel, MasterTicketStatusAlias, MasterTicketStatusColumns };
