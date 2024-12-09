import { AppConfigService } from 'src/config/app-config.service';
import AppLogger from './logger/app-logger';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/authorization.guard';
import { RolesGuard } from './guards/roles.guard';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database/database.module';
import { AuthService } from '@app/modules/auth/auth.service';
import { AuthAbstractSvc } from '@app/modules/auth/auth.abstract';
import { JwtService } from '@nestjs/jwt';
import { MailModule } from './mail/mail.module';

const getProviders = (): any[] => {
		return [
			AppConfigService,
			AppLogger,
			{ provide: APP_GUARD, useClass: AuthGuard },
			{ provide: APP_GUARD, useClass: RolesGuard },
			{ provide: AuthAbstractSvc, useClass: AuthService },
			JwtService
		];
	},
	importProviders = (): any[] => {
		return [ConfigModule.forRoot({ envFilePath: '.env.development' }), DatabaseModule, MailModule];
	},
	exportProviders = (): any[] => {
		return [AppConfigService, AppLogger, DatabaseModule, MailModule];
	};

export { exportProviders, getProviders, importProviders };
