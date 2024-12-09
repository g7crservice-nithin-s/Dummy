import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { UserColumns, UserModel } from './security.user.model';
import { CityColumns, CityModel } from './masters.city.model';

const enum DivisionColumns {
	DivisionId = 'DivisionId',
	CityId = 'CityId',
	DivisionName = 'DivisionName',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum DivisionAlias {
	CreatedUser = 'CreatedUser',
	City = 'City'
}

@Table({ tableName: Tables.Tbl_Division, schema: Schema.Masters, timestamps: false })
class DivisionModel extends Model<DivisionModel> {
	@Column({ primaryKey: true, type: DataType.SMALLINT, allowNull: false })
	[DivisionColumns.DivisionId]: number;

	@Column({ type: DataType.SMALLINT, allowNull: true })
	[DivisionColumns.CityId]: number;

	@Column({ type: `${DataType.VARCHAR}(50)`, allowNull: false })
	[DivisionColumns.DivisionName]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[DivisionColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[DivisionColumns.CreatedOnUTC]: string;

	@BelongsTo(() => UserModel, {
		foreignKey: DivisionColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: DivisionAlias.CreatedUser
	})
	CreatedUser: UserModel;

	@BelongsTo(() => CityModel, {
		foreignKey: DivisionColumns.CityId,
		targetKey: CityColumns.CityId,
		as: DivisionAlias.City
	})
	City: CityModel;
}

export { DivisionModel, DivisionColumns, DivisionAlias };
