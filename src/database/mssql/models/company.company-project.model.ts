import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { Schema } from '../connection/schemas.mssql';
import { Tables } from '../connection/tables.mssql';
import { DataType } from '@app/core/enums/data-type.enum';
import { UserColumns, UserModel } from './security.user.model';
import { ProjectColumns, ProjectModel } from './masters.project.model';
import { CompanyColumns, CompanyModel } from './company.company.model';

const enum CompanyProjectColumns {
	CustomerProjectId = 'CustomerProjectId',
	ProjectId = 'ProjectId',
	CompanyId = 'CompanyId',
	CreatedBy = 'CreatedBy',
	CreatedOnUTC = 'CreatedOnUTC'
}

const enum CompanyProjectAlias {
	CreatedUser = 'CreatedUser',
	Company = 'Company',
	Project = 'Project'
}

@Table({ tableName: Tables.Tbl_CompanyProject, schema: Schema.Company, timestamps: false })
class CompanyProjectModel extends Model<CompanyProjectModel> {
	@Column({ primaryKey: true, type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[CompanyProjectColumns.CustomerProjectId]: string;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[CompanyProjectColumns.ProjectId]: string;

	@Column({ type: DataType.TINY_INT, allowNull: false })
	[CompanyProjectColumns.CompanyId]: number;

	@Column({ type: DataType.UNIQUE_IDENTIFIER, allowNull: false })
	[CompanyProjectColumns.CreatedBy]: string;

	@Column({ type: DataType.DATE_TIME, allowNull: false })
	[CompanyProjectColumns.CreatedOnUTC]: string;

	@BelongsTo(() => UserModel, {
		foreignKey: CompanyProjectColumns.CreatedBy,
		targetKey: UserColumns.UserGuid,
		as: CompanyProjectAlias.CreatedUser
	})
	CreatedUser: UserModel;

	@BelongsTo(() => ProjectModel, {
		foreignKey: CompanyProjectColumns.ProjectId,
		targetKey: ProjectColumns.ProjectId,
		as: CompanyProjectAlias.Project
	})
	Project: ProjectModel;

	@BelongsTo(() => CompanyModel, {
		foreignKey: CompanyProjectColumns.CompanyId,
		targetKey: CompanyColumns.CompanyId,
		as: CompanyProjectAlias.Company
	})
	Company: CompanyModel;
}

export { CompanyProjectModel, CompanyProjectColumns, CompanyProjectAlias };
