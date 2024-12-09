import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { UserColumns, UserModel } from './security.user.model';

const enum CityColumns {
	CityId = 'CityId',
	CityName = 'CityName',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum CityAlias {
	CreatedUser = 'CreatedUser'
}

@Table({ tableName: Tables.Tbl_City, schema: Schema.Masters, timestamps: false })
class CityModel extends Model<CityModel> {
	@Column({ primaryKey: true, type: DataType.SMALLINT, allowNull: false })
	[CityColumns.CityId]: number;

	@Column({ type: `${DataType.VARCHAR}(50)`, allowNull: false })
	[CityColumns.CityName]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[CityColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[CityColumns.CreatedOnUTC]: string;

	@BelongsTo(() => UserModel, {
		foreignKey: CityColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: CityAlias.CreatedUser
	})
	CreatedUser: UserModel;
}

export { CityModel, CityColumns, CityAlias };
