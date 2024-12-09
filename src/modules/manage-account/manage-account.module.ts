import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ManageAccountAbstractSvc } from './manage-account.abstract';
import { ManageAccountController } from './manage-account.controller';
import { ManageAccountService } from './manage-account.service';

@Module({
	imports: [],
	controllers: [ManageAccountController],
	providers: [
		{
			provide: ManageAccountAbstractSvc,
			useClass: ManageAccountService
		},
		JwtService
	]
})
export class ManageAccountModule {}
