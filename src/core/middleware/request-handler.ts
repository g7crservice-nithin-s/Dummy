import { AppConfigService } from '@app/config/app-config.service';
import { createResponse } from '@app/shared/app-response.shared';
import { messages } from '@app/shared/messages.shared';
import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, of } from 'rxjs';

@Injectable()
export class RequestHandler implements NestInterceptor {
	constructor(private readonly _appConfigSvc: AppConfigService) {}
	intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
		const maintenance = this._appConfigSvc.get('maintenance').serverMaintenance;
		if (maintenance) return of(createResponse(HttpStatus.SERVICE_UNAVAILABLE, messages.E22));
		else return next.handle();
	}
}
