import { Column, Model, Table, BelongsTo, HasMany } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { DataType } from '@app/core/enums/data-type.enum';
import { TicketColumns, TicketModel } from './ticket.ticket.model';
import { UserColumns, UserModel } from './security.user.model';
import { CountryCodeColumns, CountryCodeModel } from './masters.country-code.model';
import { SiteStateColumns, SiteStateModel } from './masters.site-state.model';
import { TicketDocMappingModel } from './joints.ticket-doc-mapping.model';

const enum SiteConditionColumns {
	SiteConditionGuid = 'SiteConditionGuid',
	TicketGuid = 'TicketGuid',
	JointerGPSLocation = 'JointerGPSLocation',
	SafetyCheckList = 'SafetyCheckList',
	IsOnline = 'IsOnline',
	SafetyComment = 'SafetyComment',
	SiteStateId = 'SiteStateId',
	CompanyId = 'CompanyId',
	CustomerRepresentativeName = 'CustomerRepresentativeName',
	CustomerCountryCodeId = 'CustomerCountryCodeId',
	CustomerMobileNumber = 'CustomerMobileNumber',
	CustomerTokenNo = 'CustomerTokenNo',
	OtpVerifiedOn = 'OtpVerifiedOn',
	OtpVerified = 'OtpVerified',
	ApprovedBy = 'ApprovedBy',
	ApprovedOn = 'ApprovedOn',
	ApprovedComment = 'ApprovedComment',
	IsApproved = 'IsApproved',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC',
	ModifiedBy = 'ModifiedBy',
	ModifiedOnUTC = 'ModifiedOnUTC'
}

const enum SiteConditionAlias {
	Ticket = 'Ticket',
	CreatedByUser = 'CreatedByUser',
	ModifiedByUser = 'ModifiedByUser',
	CustomerCountryCode = 'CustomerCountryCode',
	SiteState = 'SiteState',
	ApprovedUser = 'ApprovedUser',
	DocumentMapping = 'DocumentMapping'
}

@Table({ tableName: Tables.Tbl_SiteCondition, schema: Schema.Joints, timestamps: false })
class SiteConditionModel extends Model<SiteConditionModel> {
	@Column({ primaryKey: true, type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[SiteConditionColumns.SiteConditionGuid]: string;

	@Column({ type: `${DataType.VARCHAR}(16)`, allowNull: false })
	[SiteConditionColumns.TicketGuid]: string;

	@Column({ type: `${DataType.VARCHAR}(150)`, allowNull: false })
	[SiteConditionColumns.JointerGPSLocation]: string;

	@Column({ type: `${DataType.VARCHAR}(1000)`, allowNull: true })
	[SiteConditionColumns.SafetyCheckList]: string;

	@Column({ type: `${DataType.VARCHAR}(200)`, allowNull: true })
	[SiteConditionColumns.SafetyComment]: string;

	@Column({ type: DataType.BIT, allowNull: false })
	[SiteConditionColumns.IsOnline]: boolean;

	@Column({ type: DataType.TINY_INT, allowNull: true })
	[SiteConditionColumns.SiteStateId]: number;

	@Column({ type: DataType.TINY_INT, allowNull: false })
	[SiteConditionColumns.CompanyId]: number;

	@Column({ type: `${DataType.VARCHAR}(100)`, allowNull: false })
	[SiteConditionColumns.CustomerRepresentativeName]: string;

	@Column({ type: DataType.TINY_INT, allowNull: false })
	[SiteConditionColumns.CustomerCountryCodeId]: number;

	@Column({ type: `${DataType.VARCHAR}(15)`, allowNull: false })
	[SiteConditionColumns.CustomerMobileNumber]: string;

	@Column({ type: `${DataType.VARCHAR}(20)`, allowNull: false })
	[SiteConditionColumns.CustomerTokenNo]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: true })
	[SiteConditionColumns.OtpVerifiedOn]: string;

	@Column({ type: DataType.BIT, allowNull: true })
	[SiteConditionColumns.OtpVerified]: boolean;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: true })
	[SiteConditionColumns.ApprovedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: true })
	[SiteConditionColumns.ApprovedOn]: string;

	@Column({ type: `${DataType.VARCHAR}(200)`, allowNull: true })
	[SiteConditionColumns.ApprovedComment]: string;

	@Column({ type: DataType.BIT, allowNull: true })
	[SiteConditionColumns.IsApproved]: boolean;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[SiteConditionColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[SiteConditionColumns.CreatedOnUTC]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: true })
	[SiteConditionColumns.ModifiedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: true })
	[SiteConditionColumns.ModifiedOnUTC]: string;

	@BelongsTo(() => TicketModel, {
		foreignKey: SiteConditionColumns.TicketGuid,
		targetKey: TicketColumns.TicketGuid,
		as: SiteConditionAlias.Ticket
	})
	Ticket: TicketModel;

	@BelongsTo(() => SiteStateModel, {
		foreignKey: SiteConditionColumns.SiteStateId,
		targetKey: SiteStateColumns.SiteStateId,
		as: SiteConditionAlias.SiteState
	})
	SiteState: SiteStateModel;

	@BelongsTo(() => UserModel, {
		foreignKey: SiteConditionColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: SiteConditionAlias.CreatedByUser
	})
	CreatedByUser: UserModel;

	@BelongsTo(() => UserModel, {
		foreignKey: SiteConditionColumns.ApprovedBy,
		targetKey: UserColumns.UserGuid,
		as: SiteConditionAlias.ApprovedUser
	})
	ApprovedUser: UserModel;

	@BelongsTo(() => UserModel, {
		foreignKey: SiteConditionColumns.ModifiedBy,
		targetKey: UserColumns.UserGuid,
		as: SiteConditionAlias.ModifiedByUser
	})
	ModifiedByUser: UserModel;

	@BelongsTo(() => CountryCodeModel, {
		foreignKey: SiteConditionColumns.CustomerCountryCodeId,
		targetKey: CountryCodeColumns.CountryCodeId,
		as: SiteConditionAlias.CustomerCountryCode
	})
	CustomerCountryCode: CountryCodeModel;

	@HasMany(() => TicketDocMappingModel, {
		foreignKey: SiteConditionColumns.SiteConditionGuid,
		as: SiteConditionAlias.DocumentMapping
	})
	DocumentMapping: TicketDocMappingModel;
}

export { SiteConditionColumns, SiteConditionModel, SiteConditionAlias };
