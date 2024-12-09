import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { AppMailService } from './mail.service';
import { AppConfigService } from '@app/config/app-config.service';

@Module({
	imports: [
		MailerModule.forRootAsync({
			useFactory: (configService: AppConfigService) => ({
				...configService.get('mailConfig')
			}),
			inject: [AppConfigService]
		})
	],
	providers: [AppMailService],
	exports: [AppMailService]
})
export class MailModule {}
