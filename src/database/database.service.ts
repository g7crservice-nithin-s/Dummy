/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { AuthAbstractSqlDao } from './mssql/abstract/auth.abstract';
import { MasterAbstractSqlDao } from './mssql/abstract/master.abstract';
import { ManageAccountAbstractSqlDao } from './mssql/abstract/manage-account.abstract';

@Injectable()
export class DatabaseService {
	constructor(
		public authSqlTxn: AuthAbstractSqlDao,
		public masterSqlTxn: MasterAbstractSqlDao,
		public manageAccountSqlTxn: ManageAccountAbstractSqlDao
	) {}
}
