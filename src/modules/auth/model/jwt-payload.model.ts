interface AtPayload {
	readonly sub: string;
	readonly role: string;
	readonly sid: string;
	readonly username: string;
	readonly name: string;
	readonly ip_address: string;
	readonly category?: number;
	readonly company_id?: number;
	readonly city_id?: number;
}

interface RtPayload {
	readonly sub: string;
	readonly sid: string;
	readonly username: string;
	readonly name: string;
}

export { AtPayload, RtPayload };
