import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, HasMany, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { JointerCategoryColumns, JointerCategoryModel } from './master.jointer-category.model';
import { ExpertiseLevelColumns, ExpertiseLevelModel } from './masters.expertise-level.model';
import { ExpertiseTypeColumns, ExpertiseTypeModel } from './masters.expertise-type.model';
import { JointerStatusColumns, JointerStatusModel } from './masters.jointer-status.model';
import { JointerDocumentColumns, JointerDocumentModel } from './security.jointer-documen.model';
import { UserColumns, UserModel } from './security.user.model';

const enum JointerInfoColumns {
	JointerGuid = 'JointerGuid',
	UserGuid = 'UserGuid',
	Designation = 'Designation',
	VendorName = 'VendorName',
	JointerCategoryId = 'JointerCategoryId',
	RaychemId = 'RaychemId',
	ExpertiseTypeId = 'ExpertiseTypeId',
	EffectiveFromUTC = 'EffectiveFromUTC',
	EffectiveTillUTC = 'EffectiveTillUTC',
	ExpertiseLevelId = 'ExpertiseLevelId',
	CreatedBy = 'CreatedBy',
	ModifiedBy = 'ModifiedBy',
	CreatedOnUTC = 'CreatedOnUTC',
	ModifiedOnUTC = 'ModifiedOnUTC',
	StatusId = 'StatusId',
	Rating = 'Rating',
	TotalRating = 'TotalRating'
}

const enum JointerAlias {
	ModifiedByUser = 'ModifiedByUser',
	CreatedByUsers = 'CreatedByUsers',
	ExpertiseLevel = 'ExpertiseLevel',
	ExpertiseType = 'ExpertiseType',
	User = 'User',
	JointerStatus = 'JointerStatus',
	JointerCategory = 'JointerCategory',
	JointerDocument = 'JointerDocument'
}

@Table({ tableName: Tables.Tbl_JointerInfo, schema: Schema.Security, timestamps: false })
class JointerModel extends Model<JointerModel> {
	@Column({ primaryKey: true, type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[JointerInfoColumns.JointerGuid]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[JointerInfoColumns.UserGuid]: string;

	@Column({ type: `${DataType.VARCHAR}(150)`, allowNull: false })
	[JointerInfoColumns.Designation]: string;

	@Column({ type: `${DataType.VARCHAR}(150)`, allowNull: false })
	[JointerInfoColumns.VendorName]: string;

	@Column({ type: DataType.TINY_INT, allowNull: false })
	[JointerInfoColumns.JointerCategoryId]: number;

	@Column({ type: `${DataType.VARCHAR}(20)`, allowNull: false })
	[JointerInfoColumns.RaychemId]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[JointerInfoColumns.EffectiveFromUTC]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[JointerInfoColumns.EffectiveTillUTC]: string;

	@Column({ type: DataType.TINY_INT, allowNull: false })
	[JointerInfoColumns.ExpertiseTypeId]: number;

	@Column({ type: DataType.TINY_INT, allowNull: false })
	[JointerInfoColumns.ExpertiseLevelId]: number;

	@Column({ type: DataType.TINY_INT, allowNull: false })
	[JointerInfoColumns.StatusId]: number;

	@Column({ type: `${DataType.DECIMAL}(3,1)`, allowNull: true })
	[JointerInfoColumns.Rating]: number;

	@Column({ type: DataType.SMALLINT, allowNull: true })
	[JointerInfoColumns.TotalRating]: number;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: true })
	[JointerInfoColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: true })
	[JointerInfoColumns.CreatedOnUTC]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: true })
	[JointerInfoColumns.ModifiedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: true })
	[JointerInfoColumns.ModifiedOnUTC]: string;

	@BelongsTo(() => UserModel, {
		foreignKey: JointerInfoColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: JointerAlias.CreatedByUsers
	})
	CreatedByUsers: UserModel;

	@BelongsTo(() => UserModel, {
		foreignKey: JointerInfoColumns.ModifiedBy,
		targetKey: UserColumns.UserGuid,
		as: JointerAlias.ModifiedByUser
	})
	ModifiedByUsers: UserModel;

	@BelongsTo(() => UserModel, {
		foreignKey: JointerInfoColumns.UserGuid,
		targetKey: UserColumns.UserGuid,
		as: JointerAlias.User
	})
	Users: UserModel;

	@BelongsTo(() => ExpertiseLevelModel, {
		foreignKey: JointerInfoColumns.ExpertiseLevelId,
		targetKey: ExpertiseLevelColumns.ExpertLevelId,
		as: JointerAlias.ExpertiseLevel
	})
	ExpertiseLevels: ExpertiseLevelModel;

	@BelongsTo(() => ExpertiseTypeModel, {
		foreignKey: JointerInfoColumns.ExpertiseTypeId,
		targetKey: ExpertiseTypeColumns.ExpertTypeId,
		as: JointerAlias.ExpertiseType
	})
	ExpertiseTypes: ExpertiseTypeModel;

	@BelongsTo(() => JointerStatusModel, {
		foreignKey: JointerInfoColumns.StatusId,
		targetKey: JointerStatusColumns.JStatusId,
		as: JointerAlias.JointerStatus
	})
	JointerStatusTypes: JointerStatusModel;

	@BelongsTo(() => JointerCategoryModel, {
		foreignKey: JointerInfoColumns.JointerCategoryId,
		targetKey: JointerCategoryColumns.JointerCategoryId,
		as: JointerAlias.JointerCategory
	})
	JointerCategory: JointerCategoryModel;

	@HasMany(() => JointerDocumentModel, {
		foreignKey: JointerInfoColumns.UserGuid,
		sourceKey: JointerDocumentColumns.UserGuid,
		as: JointerAlias.JointerDocument
	})
	JointerDocument: JointerDocumentModel;
}

export { JointerAlias, JointerInfoColumns, JointerModel };
