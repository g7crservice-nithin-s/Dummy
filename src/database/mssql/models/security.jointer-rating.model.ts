import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { UserColumns, UserModel } from './security.user.model';
import { TicketColumns, TicketModel } from './ticket.ticket.model';

const enum JointerRatingColumns {
	RatingGuid = 'RatingGuid',
	TicketGuid = 'TicketGuid',
	UserGuid = 'UserGuid',
	Rating = 'Rating',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum JointerRatingAlias {
	Ticket = 'Ticket',
	CreatedUser = 'CreatedUser',
	User = 'User'
}

@Table({ tableName: Tables.Tbl_JointerRating, schema: Schema.Security, timestamps: false })
class JointerRatingModel extends Model<JointerRatingModel> {
	@Column({ primaryKey: true, type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[JointerRatingColumns.RatingGuid]: string;

	@Column({ type: `${DataType.VARCHAR}(16)`, allowNull: false })
	[JointerRatingColumns.TicketGuid]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[JointerRatingColumns.UserGuid]: string;

	@Column({ type: `${DataType.DECIMAL}(3, 1)`, allowNull: false })
	[JointerRatingColumns.Rating]: number;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[JointerRatingColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[JointerRatingColumns.CreatedOnUTC]: string;

	@BelongsTo(() => TicketModel, {
		foreignKey: JointerRatingColumns.TicketGuid,
		targetKey: TicketColumns.TicketGuid,
		as: JointerRatingAlias.Ticket
	})
	Ticket: TicketModel;

	@BelongsTo(() => UserModel, {
		foreignKey: JointerRatingColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: JointerRatingAlias.CreatedUser
	})
	CreatedUser: UserModel;

	@BelongsTo(() => UserModel, {
		foreignKey: JointerRatingColumns.UserGuid,
		targetKey: UserColumns.UserGuid,
		as: JointerRatingAlias.User
	})
	User: UserModel;
}

export { JointerRatingAlias, JointerRatingColumns, JointerRatingModel };
