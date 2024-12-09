export enum Schema {
	Security = 'Security',
	Masters = 'Masters',
	Company = 'Company',
	Tickets = 'Tickets',
	Joints = 'Joints',
	Logs = 'Logs'
}
export class SchemaGrp {
	static readonly ALL_SCHEMAS: Schema[] = [Schema.Security, Schema.Masters, Schema.Tickets, Schema.Joints, Schema.Logs];
}
