import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { UserColumns, UserModel } from './security.user.model';
import { ProductColumns, ProductModel } from './masters.product.model';

const enum JointColumns {
	JointId = 'JointId',
	JointName = 'JointName',
	ProductId = 'ProductId',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum JointAlias {
	CreatedUser = 'CreatedUser',
	Product = 'Product'
}

@Table({ tableName: Tables.Tbl_Joint, schema: Schema.Masters, timestamps: false })
class JointModel extends Model<JointModel> {
	@Column({ primaryKey: true, type: DataType.SMALLINT, allowNull: false })
	[JointColumns.JointId]: number;

	@Column({ primaryKey: true, type: DataType.SMALLINT, allowNull: false })
	[JointColumns.ProductId]: number;

	@Column({ type: `${DataType.VARCHAR}(100)`, allowNull: false })
	[JointColumns.JointName]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[JointColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[JointColumns.CreatedOnUTC]: string;

	@BelongsTo(() => ProductModel, {
		foreignKey: JointColumns.ProductId,
		targetKey: ProductColumns.ProductId,
		as: JointAlias.Product
	})
	Product: ProductModel;

	@BelongsTo(() => UserModel, {
		foreignKey: JointColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: JointAlias.CreatedUser
	})
	CreatedUser: UserModel;
}

export { JointModel, JointColumns };
