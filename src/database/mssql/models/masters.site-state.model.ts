import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { UserColumns, UserModel } from './security.user.model';

const enum SiteStateColumns {
	SiteStateId = 'SiteStateId',
	SiteStateName = 'SiteStateName',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum SiteStateAlias {
	CreatedUser = 'CreatedUser'
}

@Table({ tableName: Tables.Tbl_SiteState, schema: Schema.Masters, timestamps: false })
class SiteStateModel extends Model<SiteStateModel> {
	@Column({ primaryKey: true, type: DataType.TINY_INT, allowNull: false })
	[SiteStateColumns.SiteStateId]: number;

	@Column({ type: `${DataType.VARCHAR}(50)`, allowNull: false })
	[SiteStateColumns.SiteStateName]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[SiteStateColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[SiteStateColumns.CreatedOnUTC]: string;

	@BelongsTo(() => UserModel, {
		foreignKey: SiteStateColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: SiteStateAlias.CreatedUser
	})
	CreatedUser: UserModel;
}

export { SiteStateModel, SiteStateColumns };
