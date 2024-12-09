export interface ISession {
	SessionGuid: string;
	UserGuid: string;
	RoleId: number;
	StartsAtUTC: any;
	EndsAtUTC: any;
	AgentType: string;
	DeviceID: string;
	IpAddress: string;
	CreatedOnUTC: any;
}
