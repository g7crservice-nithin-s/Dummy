import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { VoltageColumn, VoltageModel } from './masters.voltage.model';
import { UserColumns, UserModel } from './security.user.model';

const enum JointingCheckListColumns {
	JointingCheckListGuid = 'JointingCheckListGuid',
	JointingCheckListName = 'JointingCheckListName',
	VoltageId = 'VoltageId',
	EffectiveFromUTC = 'EffectiveFromUTC',
	EffectiveTillUTC = 'EffectiveTillUTC',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum JointingCheckListAlias {
	Voltage = 'Voltage',
	CreatedUser = 'CreatedUser'
}

@Table({ tableName: Tables.Tbl_JointingCheckList, schema: Schema.Masters, timestamps: false })
class JointingCheckListModel extends Model<JointingCheckListModel> {
	@Column({ primaryKey: true, type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[JointingCheckListColumns.JointingCheckListGuid]: number;

	@Column({ type: `${DataType.VARCHAR}(200)`, allowNull: false })
	[JointingCheckListColumns.JointingCheckListName]: string;

	@Column({ type: DataType.TINY_INT, allowNull: false })
	[JointingCheckListColumns.VoltageId]: number;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[JointingCheckListColumns.EffectiveFromUTC]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[JointingCheckListColumns.EffectiveTillUTC]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[JointingCheckListColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[JointingCheckListColumns.CreatedOnUTC]: string;

	@BelongsTo(() => VoltageModel, {
		foreignKey: JointingCheckListColumns.VoltageId,
		targetKey: VoltageColumn.VoltageId,
		as: JointingCheckListAlias.Voltage
	})
	Voltage: VoltageModel;

	@BelongsTo(() => UserModel, {
		foreignKey: JointingCheckListColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: JointingCheckListAlias.CreatedUser
	})
	CreatedUser: UserModel;
}

export { JointingCheckListModel, JointingCheckListColumns, JointingCheckListAlias };
