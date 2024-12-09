import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DecoratorConstant } from '../constants/decorator.constant';
import AppLogger from '../logger/app-logger';
import { messages } from '@app/shared/messages.shared';
import { AuthAbstractSvc } from '@app/modules/auth/auth.abstract';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly _logger: AppLogger,
		private readonly _authSvc: AuthAbstractSvc
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		try {
			const secured = this.reflector.get<string>(DecoratorConstant.SECURED, context.getHandler());

			/*If API is not authorized return true always*/
			if (!secured) {
				return true;
			}

			/*Extract bearer token from header and validate*/
			const request = context.switchToHttp().getRequest();
			let bearerToken = request.headers['authorization'];

			if (!bearerToken) {
				throw new HttpException('', HttpStatus.UNAUTHORIZED);
			}

			bearerToken = bearerToken.replace('Bearer', '').trim();
			if (!bearerToken) {
				throw new HttpException('', HttpStatus.UNAUTHORIZED);
			}

			const svcRes: any = await this._authSvc.validateToken(bearerToken);
			if (svcRes.code !== 200) {
				throw new HttpException(messages.E3, HttpStatus.UNAUTHORIZED);
			}
			request.claims = svcRes.data;
			return true;
		} catch (error) {
			this._logger.error(error.stack, HttpStatus.UNAUTHORIZED);
			throw new HttpException(messages.E13, HttpStatus.UNAUTHORIZED);
		}
	}
}
