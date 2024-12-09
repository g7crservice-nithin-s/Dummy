/* eslint-disable prettier/prettier */
import { CoreModule } from '@app/core/core.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { MasterModule } from '../masters/master.module';
import { ManageAccountModule } from '../manage-account/manage-account.module';
@Module({
	imports: [CoreModule, AuthModule, MasterModule, ManageAccountModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
