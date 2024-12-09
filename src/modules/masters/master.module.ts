import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MasterAbstractSvc } from './master.abstract';
import { MasterController } from './master.controller';
import { MasterService } from './master.service';

@Module({
	imports: [],
	controllers: [MasterController],
	providers: [
		{
			provide: MasterAbstractSvc,
			useClass: MasterService
		},
		JwtService
	]
})
export class MasterModule {}
