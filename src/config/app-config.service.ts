export class AppConfigService {
	private readonly envConfig: { [key: string]: any } = {};

	constructor() {
		/*app configurations*/
		this.envConfig.app = {
			port: parseInt(process.env.APP_PORT, 10) || 8080,
			environment: process.env.ENVIRONMENT,
			uiUrl: process.env.UI_URL
		};

		/*database*/
		this.envConfig.db = {
			mssql: {
				dialect: 'mssql',
				username: process.env.MSSQL_USERNAME,
				password: process.env.MSSQL_PASSWORD,
				host: process.env.MSSQL_SERVER,
				port: Number(process.env.MSSQL_PORT),
				database: process.env.MSSQL_DATABASE,
				dialectOptions: {
					encrypt: 'true'
				},
				pool: {
					max: 5, // maximum number of connections in the pool
					min: 0, // minimum number of connections in the pool
					acquire: 30000, // maximum time, in milliseconds, that the pool will try to get connection before throwing error
					idle: 10000 // maximum time, in milliseconds, that a connection can be idle before being released
				},
				trustServerCertificate: Boolean(process.env.MSSQL_TRUST_SERVER_CERTIFICATE)
			}
		};

		/*blob configuration*/
		this.envConfig.blobStorage = {
			blobAccountName: process.env.BLOB_AC_NAME,
			blobAccountKey: process.env.BLOB_AC_KEY,
			blobAccountConnectionString: process.env.BLOB_CONNECTION_STRING,
			blobLoggerContainer: process.env.BLOB_LOGGER_CONTAINER,
			blobTicketContainer: process.env.BLOB_TICKET_CONTAINER
		};

		/*Server Maintenance*/
		this.envConfig.maintenance = {
			serverMaintenance: parseInt(process.env.SERVER_MAINTENANCE, 10)
		};

		/*Application secretes & token settings*/
		this.envConfig.tokenMetadata = {
			appAtSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
			appTempAtSecret: process.env.JWT_TEMP_ACCESS_TOKEN_SECRET,
			appRtSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
			web: {
				at: {
					expiresIn: process.env.JWT_ACCESS_TOKEN_EXP_TIMEMIN_WEB
				},
				tempAt: {
					expiresIn: process.env.JWT_TEMP_ACCESS_TOKEN_EXP_TIMEMIN_WEB
				},
				rt: {
					expiresIn: process.env.JWT_REFRESH_TOKEN_EXP_TIMEMIN_WEB,
					maxTtl: process.env.JWT_REFRESH_TOKEN_TTL_DAY_WEB
				}
			}
		};

		/*Text local and OTP validity*/
		this.envConfig.otpSvc = {
			otpValidityInMin: process.env.OTP_VALIDITY_INMIN,
			otpResendLimit: process.env.OTP_RESEND_LIMIT
		};

		/*Dummy contact*/
		this.envConfig.dummyContact = {
			dummyOtp: process.env.DUMMY_OTP,
			dummyMobileNo: process.env.DUMMY_MOBILE_NO
		};

		/*Text local and OTP validity*/
		this.envConfig.messages = {
			otpTemplate: process.env.OTP_AUTHORIZATION_TEMPLATE_NAME,
			accessToken: process.env.WHATSAPP_ACCESS_TOKEN
		};

		/*Init mail credentials*/
		this.envConfig.mailConfig = {
			transport: {
				host: process.env.MAIL_SVC_HOST,
				port: process.env.MAIL_SVC_PORT,
				auth: {
					user: process.env.MAIL_SVC_USERNAME,
					pass: process.env.MAIL_SVC_PASSWORD
				},
				tls: {
					rejectUnauthorized: false
				}
			},
			defaults: {
				from: {
					name: process.env.MAIL_SVC_FROM_NAME,
					address: process.env.MAIL_SVC_FROM
				}
			}
		};

		/*log in account link*/
		this.envConfig.logInLink = {
			link: process.env.WEB_URL,
			contactMail: process.env.CONTACT_EMAIL
		};
		/*upload avatar size*/
		this.envConfig.uploadAvatar = {
			limit: process.env.FILE_SIZE
		};
	}
	get(key: string): any {
		return this.envConfig[key];
	}
}
