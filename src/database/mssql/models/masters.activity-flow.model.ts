import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { SubJointColumns, SubJointModel } from './masters.sub-joint.model';
import { UserColumns, UserModel } from './security.user.model';
import { SubProductColumns, SubProductModel } from './masters.sub-product.model';

const enum ActivityFlowColumn {
	ActivityFlowGuid = 'ActivityFlowGuid',
	SubJointId = 'SubJointId',
	SubProductId = 'SubProductId',
	ActivityName = 'ActivityName',
	EffectiveFromUTC = 'EffectiveFromUTC',
	EffectiveTillUTC = 'EffectiveTillUTC',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum ActivityFlowAlias {
	CreatedByUser = 'CreatedByUser',
	SubJoint = 'SubJoint',
	SubProduct = 'SubProduct'
}

@Table({ tableName: Tables.Tbl_ActivityFlow, schema: Schema.Masters, timestamps: false })
class ActivityFLowModel extends Model<ActivityFLowModel> {
	@Column({ primaryKey: true, type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[ActivityFlowColumn.ActivityFlowGuid]: string;

	@Column({ type: DataType.TINY_INT, allowNull: true })
	[ActivityFlowColumn.SubJointId]: number;

	@Column({ type: DataType.TINY_INT, allowNull: true })
	[ActivityFlowColumn.SubProductId]: number;

	@Column({ type: `${DataType.VARCHAR}(100)`, allowNull: false })
	[ActivityFlowColumn.ActivityName]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[ActivityFlowColumn.EffectiveFromUTC]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[ActivityFlowColumn.EffectiveTillUTC]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[ActivityFlowColumn.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[ActivityFlowColumn.CreatedOnUTC]: string;

	@BelongsTo(() => UserModel, {
		foreignKey: ActivityFlowColumn.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: ActivityFlowAlias.CreatedByUser
	})
	CreatedUser: UserModel;

	@BelongsTo(() => SubJointModel, {
		foreignKey: ActivityFlowColumn.SubJointId,
		targetKey: SubJointColumns.SubJointId,
		as: ActivityFlowAlias.SubJoint
	})
	SubJoint: SubJointModel;

	@BelongsTo(() => SubProductModel, {
		foreignKey: ActivityFlowColumn.SubProductId,
		targetKey: SubProductColumns.SubProductId,
		as: ActivityFlowAlias.SubProduct
	})
	SubProduct: SubProductModel;
}

export { ActivityFLowModel, ActivityFlowColumn, ActivityFlowAlias as ActivityAlias };
