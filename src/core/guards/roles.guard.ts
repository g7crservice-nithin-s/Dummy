import { DecoratorConstant } from '@app/core/constants/decorator.constant';
import { messageFactory, messages } from '@app/shared/messages.shared';
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}
	canActivate(context: ExecutionContext): boolean {
		let roles = this.reflector.get<string[]>(DecoratorConstant.HAS_ROLES, context.getHandler());
		/*If API is not authorized return true always*/
		if (!roles?.length) {
			return true;
		}
		roles = roles?.map((r) => r.toLowerCase());

		const req = context.switchToHttp().getRequest();

		if (!req.claims.role || !roles.includes(req.claims.role.toLowerCase())) {
			throw new HttpException(messageFactory(messages.E7, [req.url]), HttpStatus.UNAUTHORIZED);
		}

		return true;
	}
}
