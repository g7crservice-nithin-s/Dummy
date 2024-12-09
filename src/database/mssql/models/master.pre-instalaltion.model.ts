import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { JointColumns, JointModel } from './masters.joint.model';
import { UserColumns, UserModel } from './security.user.model';

const enum PreInstallationColumns {
	PreInstallationGuid = 'PreInstallationGuid',
	JointId = 'JointId',
	PreInstallationName = 'PreInstallationName',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum PreInstallationAlias {
	Joint = 'Joint',
	CreatedUser = 'CreatedUser'
}

@Table({ tableName: Tables.Tbl_PreInstallation, schema: Schema.Masters, timestamps: false })
class PreInstallationModel extends Model<PreInstallationModel> {
	@Column({ primaryKey: true, type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[PreInstallationColumns.PreInstallationGuid]: string;

	@Column({ type: DataType.TINY_INT, allowNull: false })
	[PreInstallationColumns.JointId]: number;

	@Column({ type: `${DataType.VARCHAR}(200)`, allowNull: false })
	[PreInstallationColumns.PreInstallationName]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[PreInstallationColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[PreInstallationColumns.CreatedOnUTC]: string;

	@BelongsTo(() => JointModel, {
		foreignKey: PreInstallationColumns.JointId,
		targetKey: JointColumns.JointId,
		as: PreInstallationAlias.Joint
	})
	Joint: JointModel;

	@BelongsTo(() => UserModel, {
		foreignKey: PreInstallationColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: PreInstallationAlias.CreatedUser
	})
	CreatedUser: UserModel;
}

export { PreInstallationAlias, PreInstallationColumns, PreInstallationModel };
