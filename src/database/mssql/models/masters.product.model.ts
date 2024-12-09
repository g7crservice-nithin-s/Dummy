import { Column, Model, Table, BelongsTo } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { UserColumns, UserModel } from './security.user.model';
import { DataType } from '@app/core/enums/data-type.enum';

const enum ProductColumns {
	ProductId = 'ProductId',
	ProductName = 'ProductName',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum ProductAlias {
	CreatedUser = 'CreatedUser'
}

@Table({ tableName: Tables.Tbl_Product, schema: Schema.Masters, timestamps: false })
class ProductModel extends Model<ProductModel> {
	@Column({ primaryKey: true, type: DataType.SMALLINT, allowNull: false })
	[ProductColumns.ProductId]: number;

	@Column({ type: `${DataType.VARCHAR}(50)`, allowNull: false })
	[ProductColumns.ProductName]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[ProductColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[ProductColumns.CreatedOnUTC]: string;

	@BelongsTo(() => UserModel, {
		foreignKey: ProductColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: ProductAlias.CreatedUser
	})
	CreatedUser: UserModel;
}

export { ProductAlias, ProductColumns, ProductModel };
