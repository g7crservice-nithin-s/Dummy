import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { UserColumns, UserModel } from './security.user.model';

const enum VoltageColumn {
	VoltageId = 'VoltageId',
	VoltageName = 'VoltageName',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum VoltageAlias {
	CreatedUser = 'CreatedUser'
}

@Table({ tableName: Tables.Tbl_Voltage, schema: Schema.Masters, timestamps: false })
class VoltageModel extends Model<VoltageModel> {
	@Column({ primaryKey: true, type: DataType.TINY_INT, allowNull: false })
	[VoltageColumn.VoltageId]: number;

	@Column({ type: `${DataType.VARCHAR}(50)`, allowNull: false })
	[VoltageColumn.VoltageName]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[VoltageColumn.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[VoltageColumn.CreatedOnUTC]: string;

	@BelongsTo(() => UserModel, {
		foreignKey: VoltageColumn.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: VoltageAlias.CreatedUser
	})
	CreatedUser: UserModel;
}

export { VoltageModel, VoltageColumn };
