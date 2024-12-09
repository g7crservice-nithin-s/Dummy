import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { JointColumns, JointModel } from './masters.joint.model';
import { UserColumns, UserModel } from './security.user.model';

const enum SubJointColumns {
	SubJointId = 'SubJointId',
	SubJointName = 'SubJointName',
	JointId = 'JointId',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum subJointAlias {
	JointModel = 'JointModel',
	CreatedUser = 'CreatedUser'
}

@Table({ tableName: Tables.Tbl_SubJoint, schema: Schema.Masters, timestamps: false })
class SubJointModel extends Model<SubJointModel> {
	@Column({ primaryKey: true, type: DataType.SMALLINT, allowNull: false })
	[SubJointColumns.SubJointId]: number;

	@Column({ type: `${DataType.VARCHAR}(100)`, allowNull: false })
	[SubJointColumns.SubJointName]: string;

	@Column({ type: DataType.SMALLINT, allowNull: false })
	[SubJointColumns.JointId]: number;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[SubJointColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[SubJointColumns.CreatedOnUTC]: string;

	@BelongsTo(() => UserModel, {
		foreignKey: SubJointColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: subJointAlias.CreatedUser
	})
	CreatedUser: UserModel;

	@BelongsTo(() => JointModel, {
		foreignKey: SubJointColumns.JointId,
		targetKey: JointColumns.JointId,
		as: subJointAlias.JointModel
	})
	JointModels: JointModel;
}

export { SubJointModel, SubJointColumns, subJointAlias };
