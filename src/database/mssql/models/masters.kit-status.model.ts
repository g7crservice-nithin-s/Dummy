import { DataType } from '@app/core/enums/data-type.enum';
import { Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';

const enum KitStatusColumns {
	KitStatusId = 'KitStatusId',
	KitStatus = 'KitStatus',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum KitStatusAlias {
	CreatedUser = 'CreatedUser'
}

@Table({ tableName: Tables.Tbl_KitStatus, schema: Schema.Masters, timestamps: false })
class KitStatusModel extends Model<KitStatusModel> {
	@Column({ primaryKey: true, type: DataType.TINY_INT, allowNull: false })
	[KitStatusColumns.KitStatusId]: number;

	@Column({ type: `${DataType.VARCHAR}(20)`, allowNull: false })
	[KitStatusColumns.KitStatus]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[KitStatusColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[KitStatusColumns.CreatedOnUTC]: string;
}

export { KitStatusAlias, KitStatusColumns, KitStatusModel };
