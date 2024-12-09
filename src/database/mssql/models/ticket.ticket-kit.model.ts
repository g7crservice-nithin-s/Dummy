import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, HasMany, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { UserColumns, UserModel } from './security.user.model';
import { KitStatusColumns, KitStatusModel } from './master.kit-status.model';
import { CommentColumns, CommentModel } from './joints.comments.model';
import { TicketDocMappingModel } from './joints.ticket-doc-mapping.model';

const enum TicketKitColumns {
	TicketKitGuid = 'TicketKitGuid',
	TicketGuid = 'TicketGuid',
	KitStatusId = 'KitStatusId',
	KitCode = 'KitCode',
	KitCommentGuid = 'KitCommentGuid',
	EffectiveFromUTC = 'EffectiveFromUTC',
	EffectiveTillUTC = 'EffectiveTillUTC',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC',
	ModifiedBy = 'ModifiedBy',
	ModifiedOnUTC = 'ModifiedOnUTC'
}

const enum TicketKitAlias {
	CreatedUser = 'CreatedUser',
	KitStatus = 'KitStatus',
	ModifiedByUser = 'ModifiedByUser',
	Comment = 'Comment',
	DocMapping = 'DocMapping'
}

@Table({ tableName: Tables.Tbl_TicketKit, schema: Schema.Tickets, timestamps: false })
class TicketKitModel extends Model<TicketKitModel> {
	@Column({ primaryKey: true, type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[TicketKitColumns.TicketKitGuid]: number;

	@Column({ type: `${DataType.VARCHAR}(16)`, allowNull: false })
	[TicketKitColumns.TicketGuid]: string;

	@Column({ type: DataType.TINY_INT, allowNull: false })
	[TicketKitColumns.KitStatusId]: number;

	@Column({ type: `${DataType.VARCHAR}(30)`, allowNull: false })
	[TicketKitColumns.KitCode]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[TicketKitColumns.EffectiveFromUTC]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[TicketKitColumns.EffectiveTillUTC]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[TicketKitColumns.KitCommentGuid]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[TicketKitColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[TicketKitColumns.CreatedOnUTC]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: true })
	[TicketKitColumns.ModifiedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: true })
	[TicketKitColumns.ModifiedOnUTC]: string;

	@BelongsTo(() => UserModel, {
		foreignKey: TicketKitColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: TicketKitAlias.CreatedUser
	})
	CreatedUser: UserModel;

	@BelongsTo(() => UserModel, {
		foreignKey: TicketKitColumns.ModifiedBy,
		targetKey: UserColumns.UserGuid,
		as: TicketKitAlias.ModifiedByUser
	})
	ModifiedByUsers: UserModel;

	@BelongsTo(() => CommentModel, {
		foreignKey: TicketKitColumns.KitCommentGuid,
		targetKey: CommentColumns.CommentGuid,
		as: TicketKitAlias.Comment
	})
	Comment: CommentModel;

	@BelongsTo(() => KitStatusModel, {
		foreignKey: TicketKitColumns.KitStatusId,
		targetKey: KitStatusColumns.KitStatusId,
		as: TicketKitAlias.KitStatus
	})
	KitStatus: KitStatusModel;

	@HasMany(() => TicketDocMappingModel, {
		foreignKey: TicketKitColumns.TicketKitGuid,
		as: TicketKitAlias.DocMapping
	})
	DocMapping: TicketDocMappingModel;
}

export { TicketKitAlias, TicketKitColumns, TicketKitModel };
