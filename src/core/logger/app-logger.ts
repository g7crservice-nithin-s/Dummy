import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, Logger, format, transports } from 'winston';
import { unix_ts_now } from '../utils/timestamp-util';
import { extensions, winstonAzureBlob } from 'winston-azure-blob';
import { AppConfigService } from '@app/config/app-config.service';

enum WinstonLogLevel {
	ERROR = 'error',
	WARN = 'warn',
	INFO = 'info',
	HTTP = 'http',
	VERBOSE = 'verbose',
	DEBUG = 'debug',
	SILLY = 'silly'
}

@Injectable()
export default class AppLogger implements LoggerService {
	public logger: Logger;
	private readonly loggerChannels = [];
	constructor(_appConfigSvc: AppConfigService) {
		const blobCred = _appConfigSvc.get('blobStorage');
		const { combine, timestamp, label, json } = format,
			{ Console } = transports;

		this.loggerChannels.push(new Console());

		this.loggerChannels.push(
			winstonAzureBlob({
				account: {
					name: blobCred.blobAccountName,
					key: blobCred.blobAccountKey
				},
				containerName: blobCred.blobLoggerContainer,
				level: 'error',
				blobName: 'errors/raychem-api-errors',
				rotatePeriod: 'YYYY-MM-DD',
				bufferLogSize: 1,
				eol: '\n',
				extension: extensions.LOG,
				syncTimeout: 0
			})
		);

		const logFormat = combine(
			label({
				label: 'raychem-api'
			}),
			timestamp({
				format: () => unix_ts_now().toString()
			}),
			json()
		);

		this.logger = createLogger({
			level: 'info',
			format: logFormat,
			transports: this.loggerChannels
		});
	}

	log(message: any, status = 200, sid = '') {
		this.logger.log(WinstonLogLevel.INFO, { message, status, sid });
	}
	error(message: any, status = 500, sid = '') {
		this.logger.log(WinstonLogLevel.ERROR, { message, status, sid });
	}
	warn(message: any, route = '', status = 206, sid = '') {
		this.logger.log(WinstonLogLevel.WARN, { message, route, status, sid });
	}
	debug?(message: any, status = 200, sid = '') {
		this.logger.log(WinstonLogLevel.DEBUG, { message, status, sid });
	}
	verbose?(message: any, status = 200, sid = '') {
		this.logger.log(WinstonLogLevel.VERBOSE, { message, status, sid });
	}
}
