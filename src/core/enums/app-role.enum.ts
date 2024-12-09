export enum RolesEnum {
	Raychem_Super_Admin = 'Raychem Super Admin',
	Raychem_Regional_Admin = 'Raychem Regional Admin',
	Raychem_Supervisor = 'Raychem Supervisor',
	Raychem_Regional_Planner = 'Raychem Regional  Planner',
	Raychem_Jointer = 'Raychem Jointer',
	Raychem_Quality_Supervisor = 'Raychem Quality Supervisor',
	Raychem_Safety_Supervisor = 'Raychem Safety Supervisor',
	Raychem_Management = 'Raychem Management',
	Customer_Admin = 'Customer Admin',
	Customer_Regional_Planners = 'Customer Regional Planners',
	Customer_Regional_Supervisors = 'Customer Regional Supervisors',
	Customer_Management = 'Customer Management'
}

export class RoleGroup {
	static readonly SA_RRA_CA_RRP_ROLE: RolesEnum[] = [
		RolesEnum.Raychem_Super_Admin,
		RolesEnum.Raychem_Regional_Admin,
		RolesEnum.Customer_Admin,
		RolesEnum.Raychem_Regional_Planner
	];
	static readonly SA_RA_RP_ROLE: RolesEnum[] = [RolesEnum.Raychem_Super_Admin, RolesEnum.Raychem_Regional_Admin, RolesEnum.Raychem_Regional_Planner];
	static readonly SA_RRP_ROLE: RolesEnum[] = [RolesEnum.Raychem_Super_Admin, RolesEnum.Raychem_Regional_Planner];
	static readonly SA_CA_ROLE: RolesEnum[] = [RolesEnum.Raychem_Super_Admin, RolesEnum.Customer_Admin];
	static readonly SA_RRP_CA_ROLE: RolesEnum[] = [RolesEnum.Raychem_Super_Admin, RolesEnum.Raychem_Regional_Planner, RolesEnum.Customer_Admin];
	static readonly SA_RRA_RP_CA_ROLE: RolesEnum[] = [
		RolesEnum.Raychem_Super_Admin,
		RolesEnum.Raychem_Regional_Admin,
		RolesEnum.Raychem_Regional_Planner,
		RolesEnum.Customer_Admin
	];
	static readonly RSS_RQS_CRS_RS_RRP: RolesEnum[] = [
		RolesEnum.Raychem_Safety_Supervisor,
		RolesEnum.Raychem_Quality_Supervisor,
		RolesEnum.Customer_Regional_Supervisors,
		RolesEnum.Raychem_Supervisor,
		RolesEnum.Raychem_Regional_Planner
	];
	static readonly ALL_ROLE: RolesEnum[] = [
		RolesEnum.Raychem_Super_Admin,
		RolesEnum.Raychem_Regional_Admin,
		RolesEnum.Raychem_Supervisor,
		RolesEnum.Raychem_Regional_Planner,
		RolesEnum.Raychem_Jointer,
		RolesEnum.Raychem_Quality_Supervisor,
		RolesEnum.Raychem_Safety_Supervisor,
		RolesEnum.Raychem_Management,
		RolesEnum.Customer_Admin,
		RolesEnum.Customer_Regional_Planners,
		RolesEnum.Customer_Regional_Supervisors,
		RolesEnum.Customer_Management
	];
}
