import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseHandler implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
		const res = context.switchToHttp().getResponse<Response>();

		return next.handle().pipe(
			map((data) => {
				if (data.code) {
					res.status(data.code);
				}
				return data;
			})
		);
	}
}
