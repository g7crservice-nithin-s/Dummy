import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, HasMany, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { CountryCodeColumns, CountryCodeModel } from './masters.country-code.model';
import { UserRoleModel } from './security.user-role.model';
import { RoleColumns, RoleModel } from './masters.roles.model';
import { CategoryColumns, CategoryModel } from './masters.user-category.model';
import { JointerInfoColumns, JointerModel } from './security.jointer-info.model';
import { CityColumns, CityModel } from './masters.city.model';
import { CompanyColumns, CompanyModel } from './company.company.model';

const enum UserColumns {
	UserGuid = 'UserGuid',
	EmailId = 'EmailId',
	FullName = 'FullName',
	PrimaryCountryCodeId = 'PrimaryCountryCodeId',
	SecondaryCountryCodeId = 'SecondaryCountryCodeId',
	CityId = 'CityId',
	PrimaryMobileNo = 'PrimaryMobileNo',
	SecondaryMobileNo = 'SecondaryMobileNo',
	IsActive = 'IsActive',
	Avatar = 'Avatar',
	FirstLoggedInOnUTC = 'FirstLoggedInOnUTC',
	CreatedBy = 'CreatedBy',
	ModifiedBy = 'ModifiedBy',
	CreatedOnUTC = 'CreatedOnUTC',
	ModifiedOnUTC = 'ModifiedOnUTC',
	DefaultRole = 'DefaultRole',
	CategoryId = 'CategoryId',
	companyId = 'companyId'
}
const enum UserAlias {
	PrimaryCountryCodes = 'PrimaryCountryCodes',
	SecondaryCountryCode = 'SecondaryCountryCode',
	UserRoles = 'UserRoles',
	Role = 'Role',
	CreatedUser = 'CreatedUser',
	ModifiedUser = 'ModifiedUser',
	Category = 'Category',
	JointerInfo = 'JointerInfo',
	City = 'City',
	Company = 'Company'
}

@Table({ tableName: Tables.Tbl_User, schema: Schema.Security, timestamps: false })
class UserModel extends Model<UserModel> {
	@Column({ primaryKey: true, type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[UserColumns.UserGuid]: string;

	@Column({ type: `${DataType.VARCHAR}(150)`, allowNull: false })
	[UserColumns.EmailId]: string;

	@Column({ type: `${DataType.VARCHAR}(100)`, allowNull: false })
	[UserColumns.FullName]: string;

	@Column({ type: DataType.TINY_INT, allowNull: false })
	[UserColumns.PrimaryCountryCodeId]: number;

	@Column({ type: DataType.TINY_INT, allowNull: true })
	[UserColumns.SecondaryCountryCodeId]: number;

	@Column({ type: DataType.TINY_INT, allowNull: true })
	[UserColumns.CityId]: number;

	@Column({ type: `${DataType.VARCHAR}(15)`, allowNull: false })
	[UserColumns.PrimaryMobileNo]: string;

	@Column({ type: `${DataType.VARCHAR}(15)`, allowNull: true })
	[UserColumns.SecondaryMobileNo]: string;

	@Column({ type: DataType.BIT, allowNull: false })
	[UserColumns.IsActive]: boolean;

	@Column({ type: `${DataType.VARCHAR}(200)`, allowNull: true })
	[UserColumns.Avatar]: string;

	@Column({ type: DataType.TINY_INT, allowNull: false })
	[UserColumns.DefaultRole]: number;

	@Column({ type: DataType.DATE_TIME, allowNull: true })
	[UserColumns.FirstLoggedInOnUTC]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: true })
	[UserColumns.CreatedBy]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: true })
	[UserColumns.ModifiedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[UserColumns.CreatedOnUTC]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: true })
	[UserColumns.ModifiedOnUTC]: string;

	@Column({ type: DataType.TINY_INT, allowNull: false })
	[UserColumns.CategoryId]: number;

	@Column({ type: DataType.TINY_INT, allowNull: true })
	[UserColumns.companyId]: number;

	@BelongsTo(() => CountryCodeModel, {
		foreignKey: UserColumns.PrimaryCountryCodeId,
		targetKey: CountryCodeColumns.CountryCodeId,
		as: UserAlias.PrimaryCountryCodes
	})
	CountryCodes: CountryCodeModel;

	@BelongsTo(() => CountryCodeModel, {
		foreignKey: UserColumns.SecondaryCountryCodeId,
		targetKey: CountryCodeColumns.CountryCodeId,
		as: UserAlias.SecondaryCountryCode
	})
	SecondaryCountryCode: CountryCodeModel;

	@BelongsTo(() => CityModel, {
		foreignKey: UserColumns.CityId,
		targetKey: CityColumns.CityId,
		as: UserAlias.City
	})
	City: CityModel;

	@BelongsTo(() => RoleModel, {
		foreignKey: UserColumns.DefaultRole,
		targetKey: RoleColumns.RoleId,
		as: UserAlias.Role
	})
	Roles: RoleModel;

	@BelongsTo(() => UserModel, {
		foreignKey: UserColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: UserAlias.CreatedUser
	})
	CreatedUser: UserModel;

	@BelongsTo(() => UserModel, {
		foreignKey: UserColumns.ModifiedBy,
		targetKey: UserColumns.UserGuid,
		as: UserAlias.ModifiedUser
	})
	ModifiedUser: UserModel;

	@BelongsTo(() => JointerModel, {
		foreignKey: UserColumns.UserGuid,
		targetKey: JointerInfoColumns.UserGuid,
		as: UserAlias.JointerInfo
	})
	JointerInfo: JointerModel;

	@BelongsTo(() => CategoryModel, {
		foreignKey: UserColumns.CategoryId,
		targetKey: CategoryColumns.CategoryId,
		as: UserAlias.Category
	})
	Category: CategoryModel;

	@BelongsTo(() => CompanyModel, {
		foreignKey: UserColumns.companyId,
		targetKey: CompanyColumns.CompanyId,
		as: UserAlias.Company
	})
	Company: CompanyModel;

	@HasMany(() => UserRoleModel, { foreignKey: UserColumns.UserGuid, as: UserAlias.UserRoles })
	ReadonlyRoles: UserRoleModel[];
}

export { UserAlias, UserColumns, UserModel };
