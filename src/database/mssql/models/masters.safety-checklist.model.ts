import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { UserColumns, UserModel } from './security.user.model';

const enum SafetyCheckListColumns {
	SCheckListId = 'SCheckListId',
	SCheckListName = 'SCheckListName',
	EffectiveFromUTC = 'EffectiveFromUTC',
	EffectiveTillUTC = 'EffectiveTillUTC',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum SafetyCheckListAlias {
	CreatedUser = 'CreatedUser'
}

@Table({ tableName: Tables.Tbl_SafetyCheckList, schema: Schema.Masters, timestamps: false })
class SafetyCheckListModel extends Model<SafetyCheckListModel> {
	@Column({ primaryKey: true, type: DataType.TINY_INT, allowNull: false })
	[SafetyCheckListColumns.SCheckListId]: number;

	@Column({ type: `${DataType.VARCHAR}(50)`, allowNull: false })
	[SafetyCheckListColumns.SCheckListName]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[SafetyCheckListColumns.EffectiveFromUTC]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[SafetyCheckListColumns.EffectiveTillUTC]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[SafetyCheckListColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[SafetyCheckListColumns.CreatedOnUTC]: string;

	@BelongsTo(() => UserModel, {
		foreignKey: SafetyCheckListColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: SafetyCheckListAlias.CreatedUser
	})
	CreatedUser: UserModel;
}

export { SafetyCheckListModel, SafetyCheckListColumns };
