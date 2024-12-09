import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { DataType } from '@app/core/enums/data-type.enum';
import { TicketColumns, TicketModel } from './ticket.ticket.model';
import { UserColumns, UserModel } from './security.user.model';
import { CommentTypeColumns, CommentTypeModel } from './masters.comment-types.model';

const enum CommentColumns {
	CommentGuid = 'CommentGuid',
	TicketGuid = 'TicketGuid',
	CreatedBy = 'CreatedBy',
	CommentTypeId = 'CommentTypeId',
	Comment = 'Comment',
	CreatedOnUTC = 'CreatedOnUTC',
	ModifiedBy = 'ModifiedBy',
	ModifiedOnUTC = 'ModifiedOnUTC'
}

const enum CommentAlias {
	Ticket = 'Ticket',
	User = 'User',
	CommentType = 'CommentType',
	ModifiedUser = 'ModifiedUser',
	CreatedByUser = 'CreatedByUser'
}

@Table({ tableName: Tables.Tbl_Comments, schema: Schema.Joints, timestamps: false })
class CommentModel extends Model<CommentModel> {
	@Column({ primaryKey: true, type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[CommentColumns.CommentGuid]: string;

	@Column({ type: `${DataType.VARCHAR}(16)`, allowNull: false })
	[CommentColumns.TicketGuid]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[CommentColumns.CreatedBy]: string;

	@Column({ type: DataType.TINY_INT, allowNull: true })
	[CommentColumns.CommentTypeId]: number;

	@Column({ type: `${DataType.VARCHAR}(200)`, allowNull: false })
	[CommentColumns.Comment]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[CommentColumns.CreatedOnUTC]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: true })
	[CommentColumns.ModifiedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: true })
	[CommentColumns.ModifiedOnUTC]: string;

	@BelongsTo(() => TicketModel, {
		foreignKey: CommentColumns.TicketGuid,
		targetKey: TicketColumns.TicketGuid,
		as: CommentAlias.Ticket
	})
	Ticket: TicketModel;

	@BelongsTo(() => UserModel, {
		foreignKey: CommentColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: CommentAlias.User
	})
	User: UserModel;

	@BelongsTo(() => CommentTypeModel, {
		foreignKey: CommentColumns.CommentTypeId,
		targetKey: CommentTypeColumns.CommentTypeId,
		as: CommentAlias.CommentType
	})
	CommentType: CommentTypeModel;

	@BelongsTo(() => UserModel, {
		foreignKey: CommentColumns.ModifiedBy,
		targetKey: UserColumns.UserGuid,
		as: CommentAlias.ModifiedUser
	})
	ModifiedUser: UserModel;

	@BelongsTo(() => UserModel, {
		foreignKey: CommentColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: CommentAlias.CreatedByUser
	})
	CreatedUser: UserModel;
}

export { CommentColumns, CommentModel, CommentAlias };
