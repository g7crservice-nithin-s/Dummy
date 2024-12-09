import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { CityColumns, CityModel } from './masters.city.model';
import { UserColumns, UserModel } from './security.user.model';
import { CompanyColumns, CompanyModel } from './company.company.model';
import { DivisionColumns, DivisionModel } from './masters.division.model';
import { UnitColumns, UnitModel } from './masters.unit.model';

const enum CompanyGeographyInfoColumns {
	CompanyGeographyGuid = 'CompanyGeographyGuid',
	CompanyId = 'CompanyId',
	CityId = 'CityId',
	DivisionId = 'DivisionId',
	UnitId = 'UnitId',
	EffectiveFromUTC = 'EffectiveFromUTC',
	EffectiveTillUTC = 'EffectiveTillUTC',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC',
	ModifiedBy = 'ModifiedBy',
	ModifiedOnUTC = 'ModifiedOnUTC'
}

const enum CompanyGeographyInfoAlias {
	CreatedUser = 'CreatedUser',
	ModifiedUser = 'ModifiedUser',
	Company = 'Company',
	City = 'City',
	Division = 'Division',
	Unit = 'Unit'
}

@Table({ tableName: Tables.Tbl_CompanyGeographyInfo, schema: Schema.Company, timestamps: false })
class CompanyGeographyInfoModel extends Model<CompanyGeographyInfoModel> {
	@Column({ primaryKey: true, type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[CompanyGeographyInfoColumns.CompanyGeographyGuid]: string;

	@Column({ type: DataType.TINY_INT, allowNull: false })
	[CompanyGeographyInfoColumns.CompanyId]: number;

	@Column({ type: DataType.TINY_INT, allowNull: false })
	[CompanyGeographyInfoColumns.CityId]: number;

	@Column({ type: DataType.TINY_INT, allowNull: false })
	[CompanyGeographyInfoColumns.DivisionId]: number;

	@Column({ type: DataType.SMALLINT, allowNull: false })
	[CompanyGeographyInfoColumns.UnitId]: number;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[CompanyGeographyInfoColumns.EffectiveFromUTC]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[CompanyGeographyInfoColumns.EffectiveTillUTC]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[CompanyGeographyInfoColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[CompanyGeographyInfoColumns.CreatedOnUTC]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: true })
	[CompanyGeographyInfoColumns.ModifiedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: true })
	[CompanyGeographyInfoColumns.ModifiedOnUTC]: string;

	@BelongsTo(() => CompanyModel, {
		foreignKey: CompanyGeographyInfoColumns.CompanyId,
		targetKey: CompanyColumns.CompanyId,
		as: CompanyGeographyInfoAlias.Company
	})
	Company: CompanyModel;

	@BelongsTo(() => CityModel, {
		foreignKey: CompanyGeographyInfoColumns.CityId,
		targetKey: CityColumns.CityId,
		as: CompanyGeographyInfoAlias.City
	})
	City: CityModel;

	@BelongsTo(() => DivisionModel, {
		foreignKey: CompanyGeographyInfoColumns.DivisionId,
		targetKey: DivisionColumns.DivisionId,
		as: CompanyGeographyInfoAlias.Division
	})
	Division: DivisionModel;

	@BelongsTo(() => UnitModel, {
		foreignKey: CompanyGeographyInfoColumns.UnitId,
		targetKey: UnitColumns.UnitId,
		as: CompanyGeographyInfoAlias.Unit
	})
	Unit: UnitModel;

	@BelongsTo(() => UserModel, {
		foreignKey: CompanyGeographyInfoColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: CompanyGeographyInfoAlias.CreatedUser
	})
	CreatedUser: UserModel;

	@BelongsTo(() => UserModel, {
		foreignKey: CompanyGeographyInfoColumns.ModifiedBy,
		targetKey: UserColumns.UserGuid,
		as: CompanyGeographyInfoAlias.ModifiedUser
	})
	ModifiedUser: UserModel;
}

export { CompanyGeographyInfoModel, CompanyGeographyInfoColumns, CompanyGeographyInfoAlias };
