import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { UserColumns, UserModel } from './security.user.model';
import { CompanyColumns, CompanyModel } from './company.company.model';
import { SubProductColumns, SubProductModel } from './masters.sub-product.model';
import { DataType } from '@app/core/enums/data-type.enum';
import { JointColumns, JointModel } from './masters.joint.model';
import { SubJointColumns, SubJointModel } from './masters.sub-joint.model';
import { ProductColumns, ProductModel } from './masters.product.model';

const enum CompanyProductColumns {
	CompanyProductGuid = 'CompanyProductGuid',
	CompanyId = 'CompanyId',
	ProductId = 'ProductId',
	JointId = 'JointId',
	SubJointId = 'SubJointId',
	SubProductId = 'SubProductId',
	EffectiveFromUTC = 'EffectiveFromUTC',
	EffectiveTillUTC = 'EffectiveTillUTC',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC',
	ModifiedBy = 'ModifiedBy',
	ModifiedOnUTC = 'ModifiedOnUTC'
}

const enum CompanyProductAlias {
	CompanyInfo = 'CompanyInfo',
	Product = 'Product',
	Joint = 'Joint',
	SubJoint = 'SubJoint',
	SubProductCategory = 'SubProductCategory',
	CreatedByUser = 'CreatedByUser',
	ModifiedByUser = 'ModifiedByUser'
}

@Table({ tableName: Tables.Tbl_CompanyProduct, schema: Schema.Company, timestamps: false })
class CompanyProductModel extends Model<CompanyProductModel> {
	@Column({ primaryKey: true, type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[CompanyProductColumns.CompanyProductGuid]: string;

	@Column({ type: DataType.TINY_INT, allowNull: false })
	[CompanyProductColumns.CompanyId]: number;

	@Column({ type: DataType.TINY_INT, allowNull: false })
	[CompanyProductColumns.ProductId]: number;

	@Column({ type: DataType.TINY_INT, allowNull: false })
	[CompanyProductColumns.JointId]: number;

	@Column({ type: DataType.TINY_INT, allowNull: false })
	[CompanyProductColumns.SubJointId]: number;

	@Column({ type: DataType.TINY_INT, allowNull: true })
	[CompanyProductColumns.SubProductId]: number;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[CompanyProductColumns.EffectiveFromUTC]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[CompanyProductColumns.EffectiveTillUTC]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[CompanyProductColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[CompanyProductColumns.CreatedOnUTC]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: true })
	[CompanyProductColumns.ModifiedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: true })
	[CompanyProductColumns.ModifiedOnUTC]: string;

	@BelongsTo(() => CompanyModel, {
		foreignKey: CompanyProductColumns.CompanyId,
		targetKey: CompanyColumns.CompanyId,
		as: CompanyProductAlias.CompanyInfo
	})
	CompanyInfo: CompanyModel;

	@BelongsTo(() => ProductModel, {
		foreignKey: CompanyProductColumns.ProductId,
		targetKey: ProductColumns.ProductId,
		as: CompanyProductAlias.Product
	})
	Product: ProductModel;

	@BelongsTo(() => JointModel, {
		foreignKey: CompanyProductColumns.JointId,
		targetKey: JointColumns.JointId,
		as: CompanyProductAlias.Joint
	})
	Joint: JointModel;

	@BelongsTo(() => SubJointModel, {
		foreignKey: CompanyProductColumns.SubJointId,
		targetKey: SubJointColumns.SubJointId,
		as: CompanyProductAlias.SubJoint
	})
	SubJoint: SubJointModel;

	@BelongsTo(() => SubProductModel, {
		foreignKey: CompanyProductColumns.SubProductId,
		targetKey: SubProductColumns.SubProductId,
		as: CompanyProductAlias.SubProductCategory
	})
	SubProductCategory: SubProductModel;

	@BelongsTo(() => UserModel, {
		foreignKey: CompanyProductColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: CompanyProductAlias.CreatedByUser
	})
	CreatedByUser: UserModel;

	@BelongsTo(() => UserModel, {
		foreignKey: CompanyProductColumns.ModifiedBy,
		targetKey: UserColumns.UserGuid,
		as: CompanyProductAlias.ModifiedByUser
	})
	ModifiedByUser: UserModel;
}

export { CompanyProductModel, CompanyProductColumns, CompanyProductAlias };
