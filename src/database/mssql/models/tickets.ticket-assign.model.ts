import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, HasOne, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { UserColumns, UserModel } from './security.user.model';
import { ExpertiseLevelColumns, ExpertiseLevelModel } from './masters.expertise-level.model';
import { ExpertiseTypeColumns, ExpertiseTypeModel } from './masters.expertise-type.model';
import { JointerInfoColumns, JointerModel } from './security.jointer-info.model';
import { TicketColumns, TicketModel } from './ticket.ticket.model';
import { SiteConditionColumns, SiteConditionModel } from './joints.site-condition.model';
import { JointerCategoryColumns, JointerCategoryModel } from './master.jointer-category.model';

const enum TicketAssignColumns {
	TicketAssignGuid = 'TicketAssignGuid',
	TicketGuid = 'TicketGuid',
	ExpertiseTypeId = 'ExpertiseTypeId',
	ExpertiseLevelId = 'ExpertiseLevelId',
	JointerCategoryId = 'JointerCategoryId',
	IsAccepted = 'IsAccepted',
	UserGuid = 'UserGuid',
	CreatedBy = 'CreatedBy',
	ModifiedBy = 'ModifiedBy',
	CreatedOnUTC = 'CreatedOnUTC',
	ModifiedOnUTC = 'ModifiedOnUTC'
}

const enum TicketAssignAlias {
	ModifiedByUser = 'ModifiedByUser',
	CreatedByUsers = 'CreatedByUsers',
	Ticket = 'Ticket',
	ExpertiseLevel = 'ExpertiseLevel',
	ExpertiseType = 'ExpertiseType',
	Jointer = 'Jointer',
	JointerInfo = 'JointerInfo',
	Joint = 'Joint',
	SubJoint = 'SubJoint',
	JobType = 'JobType',
	ProductCategory = 'ProductCategory',
	SubProductCategory = 'SubProductCategory',
	SiteCondition = 'SiteCondition',
	User = 'User',
	JointerCategory = 'JointerCategory'
}

@Table({ tableName: Tables.Tbl_TicketAssignment, schema: Schema.Tickets, timestamps: false })
class TicketAssignModel extends Model<TicketAssignModel> {
	@Column({ primaryKey: true, type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[TicketAssignColumns.TicketAssignGuid]: string;

	@Column({ type: `${DataType.VARCHAR}(16)`, allowNull: false })
	[TicketAssignColumns.TicketGuid]: string;

	@Column({ type: DataType.TINY_INT, allowNull: true })
	[TicketAssignColumns.ExpertiseTypeId]: number;

	@Column({ type: DataType.TINY_INT, allowNull: true })
	[TicketAssignColumns.ExpertiseLevelId]: number;

	@Column({ type: DataType.TINY_INT, allowNull: true })
	[TicketAssignColumns.JointerCategoryId]: number;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[TicketAssignColumns.UserGuid]: string;

	@Column({ type: DataType.BIT, allowNull: true })
	[TicketAssignColumns.IsAccepted]: boolean;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[TicketAssignColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[TicketAssignColumns.CreatedOnUTC]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: true })
	[TicketAssignColumns.ModifiedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: true })
	[TicketAssignColumns.ModifiedOnUTC]: string;

	@BelongsTo(() => UserModel, {
		foreignKey: TicketAssignColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: TicketAssignAlias.CreatedByUsers
	})
	CreatedByUsers: UserModel;

	@BelongsTo(() => UserModel, {
		foreignKey: TicketAssignColumns.ModifiedBy,
		targetKey: UserColumns.UserGuid,
		as: TicketAssignAlias.ModifiedByUser
	})
	ModifiedByUsers: UserModel;

	@BelongsTo(() => UserModel, {
		foreignKey: TicketAssignColumns.UserGuid,
		targetKey: UserColumns.UserGuid,
		as: TicketAssignAlias.Jointer
	})
	Jointers: UserModel;

	@BelongsTo(() => JointerModel, {
		foreignKey: TicketAssignColumns.UserGuid,
		targetKey: JointerInfoColumns.UserGuid,
		as: TicketAssignAlias.JointerInfo
	})
	JointerInfo: JointerModel;

	@BelongsTo(() => TicketModel, {
		foreignKey: TicketAssignColumns.TicketGuid,
		targetKey: TicketColumns.TicketGuid,
		as: TicketAssignAlias.Ticket
	})
	Tickets: TicketModel;

	@BelongsTo(() => ExpertiseTypeModel, {
		foreignKey: TicketAssignColumns.ExpertiseTypeId,
		targetKey: ExpertiseTypeColumns.ExpertTypeId,
		as: TicketAssignAlias.ExpertiseType
	})
	ExpertiseTypes: ExpertiseTypeModel;

	@BelongsTo(() => ExpertiseLevelModel, {
		foreignKey: TicketAssignColumns.ExpertiseLevelId,
		targetKey: ExpertiseLevelColumns.ExpertLevelId,
		as: TicketAssignAlias.ExpertiseLevel
	})
	ExpertiseLevels: ExpertiseLevelModel;

	@BelongsTo(() => JointerCategoryModel, {
		foreignKey: TicketAssignColumns.JointerCategoryId,
		targetKey: JointerCategoryColumns.JointerCategoryId,
		as: TicketAssignAlias.JointerCategory
	})
	JointerCategory: JointerCategoryModel;

	@HasOne(() => SiteConditionModel, {
		foreignKey: TicketAssignColumns.TicketGuid,
		sourceKey: SiteConditionColumns.TicketGuid,
		as: TicketAssignAlias.SiteCondition
	})
	SiteCondition: SiteConditionModel;

	@HasOne(() => UserModel, {
		foreignKey: TicketAssignColumns.UserGuid,
		sourceKey: UserColumns.UserGuid,
		as: TicketAssignAlias.User
	})
	User: UserModel;
}

export { TicketAssignAlias, TicketAssignColumns, TicketAssignModel };
