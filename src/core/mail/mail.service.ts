import { AppConfigService } from '@app/config/app-config.service';
import AppLogger from '@app/core/logger/app-logger';
import { DatabaseService } from '@app/database/database.service';
import { ManageAccountAbstractSqlDao } from '@app/database/mssql/abstract/manage-account.abstract';
import { AtPayload } from '@app/modules/auth/model/jwt-payload.model';
import { AppResponse, createResponse } from '@app/shared/app-response.shared';
import { messages } from '@app/shared/messages.shared';
import { SendMailModel } from '@app/shared/shared.model';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { HttpStatus, Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { compile } from 'handlebars';
import { join } from 'path';
@Injectable()
export class AppMailService {
	private readonly _manageAccountTxn: ManageAccountAbstractSqlDao;
	constructor(
		readonly _dbSvc: DatabaseService,
		private readonly _appConfigSvc: AppConfigService,
		private mailerService: MailerService,
		readonly _loggerSvc: AppLogger
	) {
		this._manageAccountTxn = _dbSvc.manageAccountSqlTxn;
	}
	async sendEmail(emailInfo: SendMailModel, claims?: AtPayload): Promise<AppResponse> {
		const mailConfig = this._appConfigSvc.get('mailConfig'),
			emailNotificationEnabled = parseInt(mailConfig.emailNotificationEnabled, 10);
		if (!emailNotificationEnabled) {
			try {
				const file = join(__dirname, emailInfo?.filePath),
					// const file = '../mail/template/registration.template.html',
					source = readFileSync(file, 'utf-8'),
					template = compile(source),
					replacements = emailInfo?.replacements,
					htmlToSend = template(replacements);
				const mailOptions: ISendMailOptions = {
					from: mailConfig?.defaults?.from?.address,
					subject: emailInfo?.mailOptions?.subject,
					html: htmlToSend,
					text: emailInfo?.mailOptions?.text,
					attachments: emailInfo?.mailOptions?.attachments,
					to: emailInfo?.mailOptions?.to
				};
				if (emailInfo?.mailOptions?.cc) {
					mailOptions.cc = emailInfo?.mailOptions?.cc;
				}
				if (emailInfo?.mailOptions?.bcc) {
					mailOptions.bcc = emailInfo?.mailOptions?.bcc;
				}

				const res = await this.mailerService.sendMail(mailOptions);
				const isSuccess = res?.response?.startsWith('250') ?? false;
				await this._manageAccountTxn.createEmailLogs(mailOptions, isSuccess, claims);
			} catch (error) {
				this._loggerSvc.error(error.stack, HttpStatus.INTERNAL_SERVER_ERROR, claims?.sid);
				return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, messages.E2);
			}
		}
		return createResponse(HttpStatus.OK, messages.S4);
	}
}
