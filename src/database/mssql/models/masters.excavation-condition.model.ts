import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { UserColumns, UserModel } from './security.user.model';

const enum ExcavationConditionColumns {
	ExcavationConditionId = 'ExcavationConditionId',
	ExcavationConditionName = 'ExcavationConditionName',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum ExcavationConditionAlias {
	CreatedUser = 'CreatedUser'
}

@Table({ tableName: Tables.Tbl_ExcavationCondition, schema: Schema.Masters, timestamps: false })
class ExcavationConditionModel extends Model<ExcavationConditionModel> {
	@Column({ primaryKey: true, type: DataType.TINY_INT, allowNull: false })
	[ExcavationConditionColumns.ExcavationConditionId]: number;

	@Column({ type: `${DataType.VARCHAR}(50)`, allowNull: false })
	[ExcavationConditionColumns.ExcavationConditionName]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[ExcavationConditionColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[ExcavationConditionColumns.CreatedOnUTC]: string;

	@BelongsTo(() => UserModel, {
		foreignKey: ExcavationConditionColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: ExcavationConditionAlias.CreatedUser
	})
	CreatedUser: UserModel;
}

export { ExcavationConditionColumns, ExcavationConditionAlias, ExcavationConditionModel };
