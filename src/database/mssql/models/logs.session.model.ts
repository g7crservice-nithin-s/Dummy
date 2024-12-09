import { Column, Model, Table, BelongsTo } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { DataType } from '@app/core/enums/data-type.enum';
import { UserColumns, UserModel } from './security.user.model';
import { RoleColumns, RoleModel } from './masters.roles.model';

const enum SessionColumns {
	SessionGuid = 'SessionGuid',
	UserGuid = 'UserGuid',
	RoleId = 'RoleId',
	StartsAtUTC = 'StartsAtUTC',
	EndsAtUTC = 'EndsAtUTC',
	AgentType = 'AgentType',
	DeviceID = 'DeviceID',
	IpAddress = 'IpAddress',
	CreatedOnUTC = 'CreatedOnUTC',
	ModifiedOnUTC = 'ModifiedOnUTC'
}

const enum SessionAlias {
	User = 'User',
	Role = 'Role'
}

@Table({ tableName: Tables.Tbl_Session, schema: Schema.Logs, timestamps: false })
class SessionModel extends Model<SessionModel> {
	@Column({ primaryKey: true, type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[SessionColumns.SessionGuid]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[SessionColumns.UserGuid]: string;

	@Column({ type: DataType.TINY_INT, allowNull: false })
	[SessionColumns.RoleId]: number;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[SessionColumns.StartsAtUTC]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[SessionColumns.EndsAtUTC]: string;

	@Column({ type: `${DataType.VARCHAR}(50)`, allowNull: false })
	[SessionColumns.DeviceID]: string;

	@Column({ type: `${DataType.VARCHAR}(250)`, allowNull: false })
	[SessionColumns.AgentType]: string;

	@Column({ type: `${DataType.VARCHAR}(50)`, allowNull: false })
	[SessionColumns.IpAddress]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[SessionColumns.CreatedOnUTC]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: true })
	[SessionColumns.ModifiedOnUTC]: string;

	@BelongsTo(() => UserModel, {
		foreignKey: SessionColumns.UserGuid,
		targetKey: UserColumns.UserGuid,
		as: SessionAlias.User
	})
	User: UserModel;

	@BelongsTo(() => RoleModel, {
		foreignKey: SessionColumns.RoleId,
		targetKey: RoleColumns.RoleId,
		as: SessionAlias.Role
	})
	Role: RoleModel;
}

export { SessionColumns, SessionModel, SessionAlias };
