/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { AuthAbstractSqlDao } from './mssql/abstract/auth.abstract';
import { sequelizeProvider } from './mssql/connection/connection.mssql';
import { msSqlDBModelsProvider } from './mssql/connection/models.connection.mssql';
import { AuthSqlDao } from './mssql/dao/auth.dao';
import { MasterAbstractSqlDao } from './mssql/abstract/master.abstract';
import { MasterSqlDao } from './mssql/dao/master.dao';
import { ManageAccountAbstractSqlDao } from './mssql/abstract/manage-account.abstract';
import { ManageAccountSqlDao } from './mssql/dao/manage-account.dao';

@Module({
	providers: [
		...sequelizeProvider,
		...msSqlDBModelsProvider,
		DatabaseService,
		{
			provide: AuthAbstractSqlDao,
			useClass: AuthSqlDao
		},
		{
			provide: MasterAbstractSqlDao,
			useClass: MasterSqlDao
		},
		{
			provide: ManageAccountAbstractSqlDao,
			useClass: ManageAccountSqlDao
		}
	],
	exports: [
		...sequelizeProvider,
		DatabaseService,
		...msSqlDBModelsProvider,
		{
			provide: AuthAbstractSqlDao,
			useClass: AuthSqlDao
		},
		{
			provide: MasterAbstractSqlDao,
			useClass: MasterSqlDao
		},
		{
			provide: ManageAccountAbstractSqlDao,
			useClass: ManageAccountSqlDao
		}
	]
})
export class DatabaseModule {}
