import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { UserColumns, UserModel } from './security.user.model';

const enum ExpertiseLevelColumns {
	ExpertLevelId = 'ExpertLevelId',
	ExpertLevelName = 'ExpertLevelName',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum ExpertiseLevelAlias {
	CreatedUser = 'CreatedUser'
}

@Table({ tableName: Tables.Tbl_ExpertiseLevel, schema: Schema.Masters, timestamps: false })
class ExpertiseLevelModel extends Model<ExpertiseLevelModel> {
	@Column({ primaryKey: true, type: DataType.TINY_INT, allowNull: false })
	[ExpertiseLevelColumns.ExpertLevelId]: number;

	@Column({ type: `${DataType.VARCHAR}(50)`, allowNull: false })
	[ExpertiseLevelColumns.ExpertLevelName]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[ExpertiseLevelColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[ExpertiseLevelColumns.CreatedOnUTC]: string;

	@BelongsTo(() => UserModel, {
		foreignKey: ExpertiseLevelColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: ExpertiseLevelAlias.CreatedUser
	})
	CreatedUser: UserModel;
}

export { ExpertiseLevelModel, ExpertiseLevelColumns };
