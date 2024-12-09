import { Column, Model, Table, BelongsTo } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { UserColumns, UserModel } from './security.user.model';
import { DataType } from '@app/core/enums/data-type.enum';
import { SubJointColumns, SubJointModel } from './masters.sub-joint.model'; // Assuming this model exists

const enum SubProductColumns {
	SubProductId = 'SubProductId',
	SubJointId = 'SubJointId',
	SubProductName = 'SubProductName',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum SubProductAlias {
	CreatedUser = 'CreatedUser',
	SubJoint = 'SubJoint'
}

@Table({ tableName: Tables.Tbl_SubProduct, schema: Schema.Masters, timestamps: false })
class SubProductModel extends Model<SubProductModel> {
	@Column({ primaryKey: true, type: DataType.SMALLINT, allowNull: false })
	[SubProductColumns.SubProductId]: number;

	@Column({ type: DataType.SMALLINT, allowNull: false })
	[SubProductColumns.SubJointId]: number;

	@Column({ type: `${DataType.VARCHAR}(50)`, allowNull: false })
	[SubProductColumns.SubProductName]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[SubProductColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[SubProductColumns.CreatedOnUTC]: string;

	@BelongsTo(() => UserModel, {
		foreignKey: SubProductColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: SubProductAlias.CreatedUser
	})
	CreatedUser: UserModel;

	@BelongsTo(() => SubJointModel, {
		foreignKey: SubProductColumns.SubJointId,
		targetKey: SubJointColumns.SubJointId,
		as: SubProductAlias.SubJoint
	})
	SubJoint: SubJointModel;
}

export { SubProductAlias, SubProductColumns, SubProductModel };
