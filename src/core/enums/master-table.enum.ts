enum MasterTableEnum {
	ExpertiseLevel = 'ExpertiseLevel',
	ExpertiseType = 'ExpertiseType',
	JobType = 'JobType',
	SiteState = 'SiteState',
	Voltage = 'Voltage',
	City = 'City',
	SafetyCheckList = 'SafetyCheckList',
	Product = 'Product'
}
enum HierarchyMasterTableEnum {
	ActivityFlow = 'ActivityFlow',
	SubJoint = 'SubJoint',
	SubExpertiseType = 'SubExpertiseType',
	SubProduct = 'SubProduct',
	JointingCheckList = 'JointingCheckList',
	Division = 'Division',
	Unit = 'Unit',
	Joint = 'Joint',
	PreInstallation = 'PreInstallation'
}

export { MasterTableEnum, HierarchyMasterTableEnum };
