import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { UserModel } from './security.user.model';

const enum OTPColumns {
	TxnGuid = 'TxnGuid',
	UserGuid = 'UserGuid',
	OTPFor = 'OTPFor',
	OTPTo = 'OTPTo',
	OTPSecret = 'OTPSecret',
	OTP = 'OTP',
	IpAddress = 'IpAddress',
	IsVerified = 'IsVerified',
	OTPExpireInMin = 'OTPExpireInMin',
	Count = 'Count',
	Provider = 'Provider',
	Channel = 'Channel',
	MessageContent = 'MessageContent',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC',
	ModifiedBy = 'ModifiedBy',
	ModifiedOnUTC = 'ModifiedOnUTC'
}

const enum OTPAlias {
	User = 'User',
	CreatedUser = 'CreatedUser',
	ModifiedUser = 'ModifiedUser'
}

@Table({ tableName: Tables.Tbl_OTPRecords, schema: Schema.Security, timestamps: false })
class OTPModel extends Model<OTPModel> {
	@Column({ primaryKey: true, type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[OTPColumns.TxnGuid]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: true })
	[OTPColumns.UserGuid]: string;

	@Column({ type: `${DataType.VARCHAR}(50)`, allowNull: false })
	[OTPColumns.OTPFor]: string;

	@Column({ type: `${DataType.VARCHAR}(20)`, allowNull: false })
	[OTPColumns.OTPTo]: string;

	@Column({ primaryKey: true, type: `${DataType.VARCHAR}(250)`, allowNull: false })
	[OTPColumns.OTPSecret]: string;

	@Column({ type: `${DataType.VARCHAR}(6)`, allowNull: false })
	[OTPColumns.OTP]: string;

	@Column({ type: `${DataType.VARCHAR}(50)`, allowNull: false })
	[OTPColumns.IpAddress]: string;

	@Column({ type: DataType.BIT, allowNull: false })
	[OTPColumns.IsVerified]: boolean;

	@Column({ type: DataType.TINY_INT, allowNull: false })
	[OTPColumns.OTPExpireInMin]: number;

	@Column({ type: DataType.TINY_INT, allowNull: false })
	[OTPColumns.Count]: number;

	@Column({ type: `${DataType.VARCHAR}(50)`, allowNull: false })
	[OTPColumns.Provider]: string;

	@Column({ type: `${DataType.VARCHAR}(50)`, allowNull: false })
	[OTPColumns.Channel]: string;

	@Column({ type: `${DataType.VARCHAR}(500)`, allowNull: false })
	[OTPColumns.MessageContent]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[OTPColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[OTPColumns.CreatedOnUTC]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: true })
	[OTPColumns.ModifiedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: true })
	[OTPColumns.ModifiedOnUTC]: string;

	@BelongsTo(() => UserModel, {
		foreignKey: OTPColumns.UserGuid,
		targetKey: 'UserGuid',
		as: OTPAlias.User
	})
	User: UserModel;

	@BelongsTo(() => UserModel, {
		foreignKey: OTPColumns.CreatedBy,
		targetKey: 'UserGuid',
		as: OTPAlias.CreatedUser
	})
	CreatedUser: UserModel;

	@BelongsTo(() => UserModel, {
		foreignKey: OTPColumns.ModifiedBy,
		targetKey: 'UserGuid',
		as: OTPAlias.ModifiedUser
	})
	ModifiedUser: UserModel;
}

export { OTPAlias, OTPColumns, OTPModel };
