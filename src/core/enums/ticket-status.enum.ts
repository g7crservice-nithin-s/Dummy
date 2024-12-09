enum TicketStatusEnum {
	Queued = 'Queued',
	Assigned = 'Assigned',
	Delete = 'Delete',
	Cancelled = 'Cancelled',
	Site_In_Progress = 'Site In Progress',
	Site_Finalized = 'Site Finalized',
	Site_Approved = 'Site Approved',
	OnHold = 'On Hold',
	JointingProcessOnHold = 'Jointing Process On Hold',
	Jointing = 'Jointing',
	Jointed = 'Jointed',
	Escalated = 'Escalated',
	Kit_Missing = 'Kit Missing',
	Kit_Damage = 'Kit Damage',
	Completed = 'Completed',
	Rejected = 'Rejected'
}

export { TicketStatusEnum };
