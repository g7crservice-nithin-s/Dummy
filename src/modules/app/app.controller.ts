import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { AppResponse } from '@app/shared/app-response.shared';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}

	@Get('healthz')
	Healthz(@Query('checkDB') checkDB?: boolean): Promise<AppResponse> {
		return this.appService.healthz(checkDB);
	}
}
