import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import coreBootstrap from '@app/core/bootstrap';
import AppLogger from './core/logger/app-logger';
import { AppConfigService } from './config/app-config.service';
import { messageFactory, messages } from './shared/messages.shared';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configObj = app.get(AppConfigService),
		logger = app.get(AppLogger),
		appConfig = configObj.get('app'),
		port = appConfig.port;

	/*start the server*/
	try {
		/* core bootstrap config, environment, pipe, guards, intereceptors etc...*/
		coreBootstrap(app, configObj);
		await app.listen(port, () => {
			const successMsg = messageFactory(messages.S1, [port]);
			logger.log(successMsg, 200);
		});
	} catch (err) {
		const errMsg = messageFactory(messages.E1, [err.message]);
		logger.error(errMsg, 500);
	}
}
bootstrap();
