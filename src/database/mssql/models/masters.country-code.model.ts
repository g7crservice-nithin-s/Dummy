import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { UserColumns, UserModel } from './security.user.model';

const enum CountryCodeColumns {
	CountryCodeId = 'CountryCodeId',
	CountryCode = 'CountryCode',
	CountryName = 'CountryName',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum CountryCodeAlias {
	CreatedUser = 'CreatedUser'
}

@Table({ tableName: Tables.Tbl_CountryCode, schema: Schema.Masters, timestamps: false })
class CountryCodeModel extends Model<CountryCodeModel> {
	@Column({ primaryKey: true, type: DataType.TINY_INT, allowNull: false })
	[CountryCodeColumns.CountryCodeId]: number;

	@Column({ type: `${DataType.VARCHAR}(7)`, allowNull: false })
	[CountryCodeColumns.CountryCode]: string;

	@Column({ type: `${DataType.VARCHAR}(3)`, allowNull: false })
	[CountryCodeColumns.CountryName]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[CountryCodeColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[CountryCodeColumns.CreatedOnUTC]: string;

	@BelongsTo(() => UserModel, {
		foreignKey: CountryCodeColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: CountryCodeAlias.CreatedUser
	})
	CreatedUser: UserModel;
}

export { CountryCodeModel, CountryCodeColumns };
