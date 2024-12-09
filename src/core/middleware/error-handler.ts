import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import AppLogger from '../logger/app-logger';

@Catch()
export class ErrorHandler implements ExceptionFilter {
	//Centralized error handling

	constructor(private readonly _logger: AppLogger) {}

	catch(exception: any, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const req = ctx.getRequest<any>();
		const res = ctx.getResponse<any>();

		let error_response: any, status: number;
		const err_desc: any = typeof exception.getResponse === 'function' ? exception.getResponse : undefined;

		if (exception instanceof HttpException) {
			status = exception.getStatus();
			error_response = {
				code: err_desc?.code ? err_desc?.code : exception.getStatus(),
				message: err_desc?.message ? err_desc?.message : exception.message,
				desc: err_desc?.description ? err_desc?.description : undefined
			};
		} else {
			status = HttpStatus.INTERNAL_SERVER_ERROR;
			error_response = {
				code: status,
				message: 'Something went wrong' //change it to dynamic message
			};
		}
		if (status === 500) this._logger.error(exception.stack, status, req.claims?.sid);
		else this._logger.log(exception.stack, status, req.claims?.sid);
		res.status(status).json(error_response);
	}
}
