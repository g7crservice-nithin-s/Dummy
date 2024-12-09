import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { UserColumns, UserModel } from './security.user.model';
import { DivisionColumns, DivisionModel } from './masters.division.model'; // Assuming this model exists

const enum UnitColumns {
	UnitId = 'UnitId',
	DivisionId = 'DivisionId',
	UnitName = 'UnitName',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum UnitAlias {
	Division = 'Division',
	CreatedUser = 'CreatedUser'
}

@Table({ tableName: Tables.Tbl_Unit, schema: Schema.Masters, timestamps: false })
class UnitModel extends Model<UnitModel> {
	@Column({ primaryKey: true, type: DataType.SMALLINT, allowNull: false })
	[UnitColumns.UnitId]: number;

	@Column({ type: DataType.SMALLINT, allowNull: false })
	[UnitColumns.DivisionId]: number;

	@Column({ type: `${DataType.VARCHAR}(50)`, allowNull: false })
	[UnitColumns.UnitName]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[UnitColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[UnitColumns.CreatedOnUTC]: string;

	@BelongsTo(() => UserModel, {
		foreignKey: UnitColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: UnitAlias.CreatedUser
	})
	CreatedUser: UserModel;

	@BelongsTo(() => DivisionModel, {
		foreignKey: UnitColumns.DivisionId,
		targetKey: DivisionColumns.DivisionId,
		as: UnitAlias.Division
	})
	Division: DivisionModel;
}

export { UnitModel, UnitColumns, UnitAlias };
