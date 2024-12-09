import { Global, Module } from '@nestjs/common';
import { exportProviders, getProviders, importProviders } from './providers';
import { MailModule } from './mail/mail.module';

@Global()
@Module({
	providers: [...getProviders(), MailModule],
	imports: [...importProviders()],
	exports: [...exportProviders()]
})
export class CoreModule {}
