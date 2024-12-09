import { DataType } from '@app/core/enums/data-type.enum';
import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { UserColumns, UserModel } from './security.user.model';

const enum ProjectColumns {
	ProjectId = 'ProjectId',
	ProjectName = 'ProjectName',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum ProjectAlias {
	CreatedUser = 'CreatedUser'
}

@Table({ tableName: Tables.Tbl_Project, schema: Schema.Masters, timestamps: false })
class ProjectModel extends Model<ProjectModel> {
	@Column({ primaryKey: true, type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[ProjectColumns.ProjectId]: number;

	@Column({ type: `${DataType.VARCHAR}(150)`, allowNull: false })
	[ProjectColumns.ProjectName]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[ProjectColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[ProjectColumns.CreatedOnUTC]: string;

	@BelongsTo(() => UserModel, {
		foreignKey: ProjectColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: ProjectAlias.CreatedUser
	})
	CreatedUser: UserModel;
}

export { ProjectColumns, ProjectAlias, ProjectModel };
