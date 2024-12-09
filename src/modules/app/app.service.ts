import { MsSqlConstants } from '@app/database/mssql/connection/constants.mssql';
import { AppResponse, createResponse } from '@app/shared/app-response.shared';
import { messageFactory, messages } from '@app/shared/messages.shared';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class AppService {
	constructor(@Inject(MsSqlConstants.SEQUELIZE_PROVIDER) private _sequelize: Sequelize) {}

	getHello(): string {
		return 'Server is up and running!';
	}

	async healthz(checkDB?: boolean): Promise<AppResponse> {
		try {
			if (checkDB && checkDB.toString() !== 'true' && checkDB.toString() !== 'false') {
				return createResponse(HttpStatus.BAD_REQUEST, messageFactory(messages.W1, ['data']));
			}
			if (checkDB) {
				await this._sequelize.authenticate();
				return createResponse(HttpStatus.OK, messages.S17);
			}
			return createResponse(HttpStatus.OK, messages.S15);
		} catch (error) {
			return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E9);
		}
	}
}
