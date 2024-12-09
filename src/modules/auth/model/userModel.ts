interface IUserModel {
	UserGuid: string;
	EmailId: string;
	FullName: string;
	CountryCodeId: number;
	MobileNo: string;
	EffectiveFrom: string;
	EffectiveTill: string;
	IsActive: boolean;
	CreatedBy: string;
	ModifiedBy: string;
	CreatedAt: number;
	ModifiedAt: number;
}

interface IOTPRecord {
	TxnGuid: string;
	UserGuid: string;
	OTPSecret: string;
	OTP: string;
	OTPFor: string;
	OTPTo: string;
	IpAddress: string;
	IsVerified: boolean;
	OTPExpireInMin: number;
	Count: number;
	Provider: string;
	Channel: string;
	MessageContent: string;
	CreatedBy: string;
	CreatedOnUTC: string;
	ModifiedBy?: string;
	ModifiedOnUTC?: string;
}
export { IUserModel, IOTPRecord };
