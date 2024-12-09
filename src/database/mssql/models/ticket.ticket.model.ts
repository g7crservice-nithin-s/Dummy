import { BelongsTo, Column, HasMany, HasOne, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { DataType } from '@app/core/enums/data-type.enum';
import { UserColumns, UserModel } from './security.user.model';
import { CountryCodeColumns, CountryCodeModel } from './masters.country-code.model';
import { CityColumns, CityModel } from './masters.city.model';
import { CompanyColumns, CompanyModel } from './company.company.model';
import { DivisionColumns, DivisionModel } from './masters.division.model';
import { UnitColumns, UnitModel } from './masters.unit.model';
import { CommentModel } from './joints.comments.model';
import { EscalationModel } from './joints.escalation.model';
import { SiteConditionModel } from './joints.site-condition.model';
import { TicketStatusModel } from './ticket.ticket-status.model';
import { TicketAssignModel } from './tickets.ticket-assign.model';
import { ProjectColumns, ProjectModel } from './masters.project.model';
import { SubProductColumns, SubProductModel } from './masters.sub-product.model';
import { JointColumns, JointModel } from './masters.joint.model';
import { SubJointColumns, SubJointModel } from './masters.sub-joint.model';
import { TicketTimeTrackerModel } from './ticket.ticket-timetracker';
import { JobTypeColumns, JobTypeModel } from './masters.job-type.model';
import { JointingStepsModel } from './joints.jointing-steps.model';
import { JointingModel } from './joints.jointing.model';
import { TicketKitColumns, TicketKitModel } from './ticket.ticket-kit.model';
import { ProductColumns, ProductModel } from './masters.product.model';

const enum TicketColumns {
	TicketGuid = 'TicketGuid',
	SiteGeoLocation = 'SiteGeoLocation',
	CityId = 'CityId',
	CompanyId = 'CompanyId',
	DivisionId = 'DivisionId',
	UnitId = 'UnitId',
	ProjectId = 'ProjectId',
	JobTypeId = 'JobTypeId',
	SiteName = 'SiteName',
	OrderNo = 'OrderNo',
	ProductCategoryId = 'ProductCategoryId',
	SubProductCategoryId = 'SubProductCategoryId',
	JointId = 'JointId',
	SubJointId = 'SubJointId',
	SiteCode = 'SiteCode',
	IntimationDateTimeUTC = 'IntimationDateTimeUTC',
	JReportingDateTimeUTC = 'JReportingDateTimeUTC',
	SiteLocation = 'SiteLocation',
	CountryCodeId = 'CountryCodeId',
	SupervisorMobileNumber = 'SupervisorMobileNumber',
	SupervisorName = 'SupervisorName',
	SubStation = 'SubStation',
	EngineerName = 'EngineerName',
	JointingDateTimeUTC = 'JointingDateTimeUTC',
	CurrentStatus = 'CurrentStatus',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC',
	ModifiedBy = 'ModifiedBy',
	ModifiedOnUTC = 'ModifiedOnUTC'
}

const enum TicketAlias {
	ModifiedByUser = 'ModifiedByUser',
	CreatedByUsers = 'CreatedByUsers',
	CountryCode = 'Country',
	City = 'City',
	Company = 'Company',
	Division = 'Division',
	Unit = 'Unit',
	Comment = 'Comment',
	Escalation = 'Escalation',
	SiteCondition = 'SiteCondition',
	TicketStatus = 'TicketStatus',
	TicketAssign = 'TicketAssign',
	Project = 'Project',
	ProductCategory = 'ProductCategory',
	SubProductCategory = 'SubProductCategory',
	Joint = 'Joint',
	SubJoint = 'SubJoint',
	TimeTracker = 'TimeTracker',
	JobType = 'JobType',
	JointingStep = 'JointingStep',
	Jointing = 'Jointing',
	KitInfo = 'KitInfo',
	PreInstallationResult = 'PreInstallationResult',
	JCheckListRes = 'JCheckListRes'
}

@Table({ tableName: Tables.Tbl_Ticket, schema: Schema.Tickets, timestamps: false })
class TicketModel extends Model<TicketModel> {
	@Column({ primaryKey: true, type: `${DataType.VARCHAR}(16)`, allowNull: false })
	[TicketColumns.TicketGuid]: string;

	@Column({ type: `${DataType.VARCHAR}(100)`, allowNull: false })
	[TicketColumns.SiteGeoLocation]: string;

	@Column({ type: DataType.TINY_INT, allowNull: false })
	[TicketColumns.CityId]: number;

	@Column({ type: `${DataType.VARCHAR}(500)`, allowNull: false })
	[TicketColumns.SiteLocation]: string;

	@Column({ type: DataType.TINY_INT, allowNull: false })
	[TicketColumns.CountryCodeId]: number;

	@Column({ type: `${DataType.VARCHAR}(15)`, allowNull: false })
	[TicketColumns.SupervisorMobileNumber]: string;

	@Column({ type: `${DataType.VARCHAR}(100)`, allowNull: false })
	[TicketColumns.SupervisorName]: string;

	@Column({ type: DataType.TINY_INT, allowNull: false })
	[TicketColumns.CompanyId]: number;

	@Column({ type: DataType.TINY_INT, allowNull: false })
	[TicketColumns.DivisionId]: number;

	@Column({ type: DataType.SMALLINT, allowNull: false })
	[TicketColumns.UnitId]: number;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: true })
	[TicketColumns.ProjectId]: string;

	@Column({ type: DataType.TINY_INT, allowNull: true })
	[TicketColumns.JobTypeId]: number;

	@Column({ type: `${DataType.VARCHAR}(100)`, allowNull: true })
	[TicketColumns.SiteName]: string;

	@Column({ type: `${DataType.VARCHAR}(30)`, allowNull: true })
	[TicketColumns.OrderNo]: string;

	@Column({ type: DataType.TINY_INT, allowNull: true })
	[TicketColumns.ProductCategoryId]: number;

	@Column({ type: DataType.TINY_INT, allowNull: true })
	[TicketColumns.SubProductCategoryId]: number;

	@Column({ type: DataType.TINY_INT, allowNull: true })
	[TicketColumns.JointId]: number;

	@Column({ type: DataType.TINY_INT, allowNull: true })
	[TicketColumns.SubJointId]: number;

	@Column({ type: `${DataType.VARCHAR}(20)`, allowNull: true })
	[TicketColumns.SiteCode]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: true })
	[TicketColumns.IntimationDateTimeUTC]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: true })
	[TicketColumns.JReportingDateTimeUTC]: string;

	@Column({ type: `${DataType.VARCHAR}(50)`, allowNull: true })
	[TicketColumns.SubStation]: string;

	@Column({ type: `${DataType.VARCHAR}(100)`, allowNull: true })
	[TicketColumns.EngineerName]: string;

	@Column({ type: `${DataType.VARCHAR}(50)`, allowNull: false })
	[TicketColumns.CurrentStatus]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: true })
	[TicketColumns.JointingDateTimeUTC]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[TicketColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[TicketColumns.CreatedOnUTC]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: true })
	[TicketColumns.ModifiedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: true })
	[TicketColumns.ModifiedOnUTC]: string;

	@BelongsTo(() => UserModel, {
		foreignKey: TicketColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: TicketAlias.CreatedByUsers
	})
	CreatedByUsers: UserModel;

	@BelongsTo(() => UserModel, {
		foreignKey: TicketColumns.ModifiedBy,
		targetKey: UserColumns.UserGuid,
		as: TicketAlias.ModifiedByUser
	})
	ModifiedByUsers: UserModel;

	@BelongsTo(() => CityModel, {
		foreignKey: TicketColumns.CityId,
		targetKey: CityColumns.CityId,
		as: TicketAlias.City
	})
	City: CityModel;

	@BelongsTo(() => CompanyModel, {
		foreignKey: TicketColumns.CompanyId,
		targetKey: CompanyColumns.CompanyId,
		as: TicketAlias.Company
	})
	CustomerCompany: CompanyModel;

	@BelongsTo(() => CountryCodeModel, {
		foreignKey: TicketColumns.CountryCodeId,
		targetKey: CountryCodeColumns.CountryCodeId,
		as: TicketAlias.CountryCode
	})
	CountryCodes: CountryCodeModel;

	@BelongsTo(() => DivisionModel, {
		foreignKey: TicketColumns.DivisionId,
		targetKey: DivisionColumns.DivisionId,
		as: TicketAlias.Division
	})
	Division: DivisionModel;

	@BelongsTo(() => UnitModel, {
		foreignKey: TicketColumns.UnitId,
		targetKey: UnitColumns.UnitId,
		as: TicketAlias.Unit
	})
	Unit: UnitModel;

	@BelongsTo(() => JobTypeModel, {
		foreignKey: TicketColumns.JobTypeId,
		targetKey: JobTypeColumns.JobTypeId,
		as: TicketAlias.JobType
	})
	JobType: JobTypeModel;

	@BelongsTo(() => ProjectModel, {
		foreignKey: TicketColumns.ProjectId,
		targetKey: ProjectColumns.ProjectId,
		as: TicketAlias.Project
	})
	Project: ProjectModel;

	@HasMany(() => CommentModel, {
		foreignKey: TicketColumns.TicketGuid,
		as: TicketAlias.Comment
	})
	Comment: CommentModel;

	@HasOne(() => EscalationModel, {
		foreignKey: TicketColumns.TicketGuid,
		as: TicketAlias.Escalation
	})
	Escalation: EscalationModel;

	@HasOne(() => SiteConditionModel, {
		foreignKey: TicketColumns.TicketGuid,
		as: TicketAlias.SiteCondition
	})
	SiteCondition: SiteConditionModel;

	@HasMany(() => JointingStepsModel, {
		foreignKey: TicketColumns.TicketGuid,
		as: TicketAlias.JointingStep
	})
	JointingStep: JointingStepsModel;

	@HasMany(() => TicketAssignModel, {
		foreignKey: TicketColumns.TicketGuid,
		as: TicketAlias.TicketAssign
	})
	TicketAssign: TicketAssignModel;

	@HasMany(() => TicketStatusModel, {
		foreignKey: TicketColumns.TicketGuid,
		as: TicketAlias.TicketStatus
	})
	TicketStatus: TicketStatusModel;

	@HasMany(() => TicketTimeTrackerModel, {
		foreignKey: TicketColumns.TicketGuid,
		as: TicketAlias.TimeTracker
	})
	TimeTracker: TicketTimeTrackerModel;

	@HasOne(() => JointingModel, {
		foreignKey: TicketColumns.TicketGuid,
		as: TicketAlias.Jointing
	})
	Jointing: JointingModel;

	@HasMany(() => TicketKitModel, {
		foreignKey: TicketColumns.TicketGuid,
		sourceKey: TicketKitColumns.TicketGuid,
		as: TicketAlias.KitInfo
	})
	KitStatus: TicketKitModel;

	@BelongsTo(() => ProductModel, {
		foreignKey: TicketColumns.ProductCategoryId,
		targetKey: ProductColumns.ProductId,
		as: TicketAlias.ProductCategory
	})
	ProductCategory: ProductModel;

	@BelongsTo(() => SubProductModel, {
		foreignKey: TicketColumns.SubProductCategoryId,
		targetKey: SubProductColumns.SubProductId,
		as: TicketAlias.SubProductCategory
	})
	SubProductCategory: ProductModel;

	@BelongsTo(() => JointModel, {
		foreignKey: TicketColumns.JointId,
		targetKey: JointColumns.JointId,
		as: TicketAlias.Joint
	})
	Joint: JointModel;

	@BelongsTo(() => SubJointModel, {
		foreignKey: TicketColumns.SubJointId,
		targetKey: SubJointColumns.SubJointId,
		as: TicketAlias.SubJoint
	})
	SubJoint: SubJointModel;
}

export { TicketModel, TicketColumns, TicketAlias };
