import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { UserColumns, UserModel } from './security.user.model';

const enum JobTypeColumns {
	JobTypeId = 'JobTypeId',
	JobTypeName = 'JobTypeName',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum JobTypeAlias {
	CreatedUser = 'CreatedUser'
}

@Table({ tableName: Tables.Tbl_JobType, schema: Schema.Masters, timestamps: false })
class JobTypeModel extends Model<JobTypeModel> {
	@Column({ primaryKey: true, type: DataType.TINY_INT, allowNull: false })
	[JobTypeColumns.JobTypeId]: number;

	@Column({ type: `${DataType.VARCHAR}(50)`, allowNull: false })
	[JobTypeColumns.JobTypeName]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[JobTypeColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[JobTypeColumns.CreatedOnUTC]: string;

	@BelongsTo(() => UserModel, {
		foreignKey: JobTypeColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: JobTypeAlias.CreatedUser
	})
	CreatedUser: UserModel;
}

export { JobTypeModel, JobTypeColumns, JobTypeAlias };
