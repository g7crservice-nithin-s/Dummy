import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { DataType } from '@app/core/enums/data-type.enum';
import { UserColumns, UserModel } from './security.user.model';
import { RoleColumns, RoleModel } from './masters.roles.model';

const enum UserRoleColumns {
	UserRoleGuid = 'UserRoleGuid',
	UserGuid = 'UserGuid',
	RoleId = 'RoleId',
	EffectiveFromUTC = 'EffectiveFromUTC',
	EffectiveTillUTC = 'EffectiveTillUTC',
	ModifiedBy = 'ModifiedBy',
	ModifiedOnUTC = 'ModifiedOnUTC',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}
const enum UserRoleAlias {
	ModifiedByUser = 'ModifiedByUser',
	User = 'User',
	Role = 'Role',
	CreatedUser = 'CreatedUser'
}

@Table({ tableName: Tables.Tbl_UserRole, schema: Schema.Security, timestamps: false })
class UserRoleModel extends Model<UserRoleModel> {
	@Column({ primaryKey: true, type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[UserRoleColumns.UserRoleGuid]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[UserRoleColumns.UserGuid]: string;

	@Column({ type: DataType.TINY_INT, allowNull: false })
	[UserRoleColumns.RoleId]: number;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[UserRoleColumns.EffectiveFromUTC]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[UserRoleColumns.EffectiveTillUTC]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: true })
	[UserRoleColumns.ModifiedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: true })
	[UserRoleColumns.ModifiedOnUTC]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[UserRoleColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[UserRoleColumns.CreatedOnUTC]: string;

	@BelongsTo(() => UserModel, {
		foreignKey: UserRoleColumns.ModifiedBy,
		targetKey: UserColumns.UserGuid,
		as: UserRoleAlias.ModifiedByUser
	})
	ModifiedByUsers: UserModel;

	@BelongsTo(() => UserModel, {
		foreignKey: UserRoleColumns.UserGuid,
		targetKey: UserColumns.UserGuid,
		as: UserRoleAlias.User
	})
	Users: UserModel;

	@BelongsTo(() => RoleModel, {
		foreignKey: UserRoleColumns.RoleId,
		targetKey: RoleColumns.RoleId,
		as: UserRoleAlias.Role
	})
	Roles: RoleModel;

	@BelongsTo(() => UserModel, {
		foreignKey: UserColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: UserRoleAlias.CreatedUser
	})
	CreatedUser: UserModel;
}

export { UserRoleModel, UserRoleColumns, UserRoleAlias };
