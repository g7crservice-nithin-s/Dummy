import { JCheckListResModel } from '../models/Joints.jointer-check-list-result.model';
import { UserModel } from '../models/security.user.model';
import { CommentModel } from '../models/joints.comments.model';
import { DocumentModel } from '../models/joints.document.model';
import { EscalationModel } from '../models/joints.escalation.model';
import { JointingStepsModel } from '../models/joints.jointing-steps.model';
import { JointingModel } from '../models/joints.jointing.model';
import { SiteConditionModel } from '../models/joints.site-condition.model';
import { EmailModel } from '../models/logs.emails.model';
import { SessionModel } from '../models/logs.session.model';
import { ActivityFLowModel } from '../models/masters.activity-flow.model';
import { CityModel } from '../models/masters.city.model';
import { CompanyModel } from '../models/company.company.model';
import { DivisionModel } from '../models/masters.division.model';
import { UnitModel } from '../models/masters.unit.model';
import { CategoryModel } from '../models/masters.user-category.model';
import { CommentTypeModel } from '../models/masters.comment-types.model';
import { CountryCodeModel } from '../models/masters.country-code.model';
import { DocumentTypeModel } from '../models/masters.document-type.model';
import { ExpertiseLevelModel } from '../models/masters.expertise-level.model';
import { ExpertiseTypeModel } from '../models/masters.expertise-type.model';
import { JobTypeModel } from '../models/masters.job-type.model';
import { JointModel } from '../models/masters.joint.model';
import { JointingCheckListModel } from '../models/masters.jointing-checklist.model';
import { RoleModel } from '../models/masters.roles.model';
import { SafetyCheckListModel } from '../models/masters.safety-checklist.model';
import { SiteStateModel } from '../models/masters.site-state.model';
import { JointerStatusModel } from '../models/masters.jointer-status.model';
import { SubJointModel } from '../models/masters.sub-joint.model';
import { VoltageModel } from '../models/masters.voltage.model';
import { JointerModel } from '../models/security.jointer-info.model';
import { UserRoleModel } from '../models/security.user-role.model';
import { TicketModel } from '../models/ticket.ticket.model';
import { TicketAssignModel } from '../models/tickets.ticket-assign.model';
import { MsSqlConstants } from './constants.mssql';
import { TicketStatusModel } from '../models/ticket.ticket-status.model';
import { TicketStageTrackerModel } from '../models/ticket.ticket-stagetracker.model';
import { CompanyGeographyInfoModel } from '../models/company.company-geography-info.model';
import { TicketTimeTrackerModel } from '../models/ticket.ticket-timetracker';
import { CompanyJointConfigModel } from '../models/company.company-Joint-config.model';
import { TicketStageModel } from '../models/master.ticket-stage.model';
import { MasterTicketStatusModel } from '../models/masters.ticket-status.model';
import { ExcavationConditionModel } from '../models/masters.excavation-condition.model';
import { ProjectModel } from '../models/masters.project.model';
import { ProductModel } from '../models/masters.product.model';
import { SubProductModel } from '../models/masters.sub-product.model';
import { CompanyProjectModel } from '../models/company.company-project.model';
import { CompanyProductModel } from '../models/company.company-product.model';
import { TicketDocMappingModel } from '../models/joints.ticket-doc-mapping.model';
import { TicketKitModel } from '../models/ticket.ticket-kit.model';
import { KitStatusModel } from '../models/master.kit-status.model';
import { JointerRatingModel } from '../models/security.jointer-rating.model';
import { PreInstallationModel } from '../models/master.pre-instalaltion.model';
import { JointerCategoryModel } from '../models/master.jointer-category.model';
import { JointerDocumentModel } from '../models/security.jointer-documen.model';
import { OTPModel } from '../models/security.otp-records.model';

const msSqlDBModelsProvider = [
		{
			provide: MsSqlConstants.USER_ROLE,
			useValue: UserRoleModel
		},
		{
			provide: MsSqlConstants.TICKET,
			useValue: TicketModel
		},
		{
			provide: MsSqlConstants.JOB_ASSIGN,
			useValue: TicketAssignModel
		},
		{
			provide: MsSqlConstants.ROLE,
			useValue: RoleModel
		},
		{
			provide: MsSqlConstants.COUNTRY_CODE,
			useValue: CountryCodeModel
		},
		{
			provide: MsSqlConstants.JOINTER_RATING,
			useValue: JointerRatingModel
		},
		{
			provide: MsSqlConstants.SECURITY_OTP_RECORDS,
			useValue: OTPModel
		},
		{
			provide: MsSqlConstants.JOINT,
			useValue: JointModel
		},
		{
			provide: MsSqlConstants.SUB_JOINT,
			useValue: SubJointModel
		},
		{
			provide: MsSqlConstants.EXPERTISE_TYPE,
			useValue: ExpertiseTypeModel
		},
		{
			provide: MsSqlConstants.EXPERTISE_LEVEL,
			useValue: ExpertiseLevelModel
		},
		{
			provide: MsSqlConstants.STATUS,
			useValue: JointerStatusModel
		},
		{
			provide: MsSqlConstants.CITY,
			useValue: CityModel
		},
		{
			provide: MsSqlConstants.SITE_STATE,
			useValue: SiteStateModel
		},
		{
			provide: MsSqlConstants.SAFETY_CHECKLIST,
			useValue: SafetyCheckListModel
		},
		{
			provide: MsSqlConstants.USER,
			useValue: UserModel
		},
		{
			provide: MsSqlConstants.JOINTER,
			useValue: JointerModel
		},
		{
			provide: MsSqlConstants.COMMENTS,
			useValue: CommentModel
		},
		{
			provide: MsSqlConstants.DOCUMENT,
			useValue: DocumentModel
		},
		{
			provide: MsSqlConstants.SITE_CONDITION,
			useValue: SiteConditionModel
		},
		{
			provide: MsSqlConstants.SESSION,
			useValue: SessionModel
		},
		{
			provide: MsSqlConstants.EMAIL,
			useValue: EmailModel
		},
		{
			provide: MsSqlConstants.JOB_TYPE,
			useValue: JobTypeModel
		},
		{
			provide: MsSqlConstants.CUSTOMER_COMPANY,
			useValue: CompanyModel
		},
		{
			provide: MsSqlConstants.DIVISION,
			useValue: DivisionModel
		},
		{
			provide: MsSqlConstants.ACTIVITY_FLOW,
			useValue: ActivityFLowModel
		},
		{
			provide: MsSqlConstants.JOINTING_STEPS,
			useValue: JointingStepsModel
		},
		{
			provide: MsSqlConstants.VOLTAGE,
			useValue: VoltageModel
		},
		{
			provide: MsSqlConstants.JOINTING_PROCESS,
			useValue: JointingModel
		},
		{
			provide: MsSqlConstants.UNIT,
			useValue: UnitModel
		},
		{
			provide: MsSqlConstants.DOCUMENT_TYPE,
			useValue: DocumentTypeModel
		},
		{
			provide: MsSqlConstants.J_CHECK_LIST_RESULT,
			useValue: JCheckListResModel
		},
		{
			provide: MsSqlConstants.ESCALATION,
			useValue: EscalationModel
		},
		{
			provide: MsSqlConstants.JOINT_CHECK_LIST,
			useValue: JointingCheckListModel
		},
		{
			provide: MsSqlConstants.CATEGORY,
			useValue: CategoryModel
		},
		{
			provide: MsSqlConstants.COMMENT_TYPE,
			useValue: CommentTypeModel
		},
		{
			provide: MsSqlConstants.TICKET_STATUS,
			useValue: TicketStatusModel
		},
		{
			provide: MsSqlConstants.TICKET_STAGE_TRACKER,
			useValue: TicketStageTrackerModel
		},
		{
			provide: MsSqlConstants.COMPANY_GEOGRAPHY_INFO,
			useValue: CompanyGeographyInfoModel
		},
		{
			provide: MsSqlConstants.TICKET_TIME_TRACKER,
			useValue: TicketTimeTrackerModel
		},
		{
			provide: MsSqlConstants.COMPANY_PRODUCT,
			useValue: CompanyProductModel
		},
		{
			provide: MsSqlConstants.COMPANY_JOINT_CONFIG,
			useValue: CompanyJointConfigModel
		},
		{
			provide: MsSqlConstants.TICKET_DOC_MAPPING,
			useValue: TicketDocMappingModel
		},
		{
			provide: MsSqlConstants.TICKET_STAGE_MASTER,
			useValue: TicketStageModel
		},
		{
			provide: MsSqlConstants.TICKET_STATUS_MASTER,
			useValue: MasterTicketStatusModel
		},
		{
			provide: MsSqlConstants.TICKET_KIT,
			useValue: TicketKitModel
		},
		{
			provide: MsSqlConstants.KIT_STATUS,
			useValue: KitStatusModel
		},
		{
			provide: MsSqlConstants.EXCAVATION_CONDITION,
			useValue: ExcavationConditionModel
		},
		{
			provide: MsSqlConstants.PROJECT,
			useValue: ProjectModel
		},
		{
			provide: MsSqlConstants.PRODUCT_CATEGORY,
			useValue: ProductModel
		},
		{
			provide: MsSqlConstants.SUB_PRODUCT_CATEGORY,
			useValue: SubProductModel
		},
		{
			provide: MsSqlConstants.COMPANY_PROJECT,
			useValue: CompanyProjectModel
		},
		{
			provide: MsSqlConstants.PRE_INSTALLATION,
			useValue: PreInstallationModel
		},
		{
			provide: MsSqlConstants.JOINTER_CATEGORY,
			useValue: JointerCategoryModel
		},
		{
			provide: MsSqlConstants.JOINTER_DOCUMENT,
			useValue: JointerDocumentModel
		}
	],
	models: any = msSqlDBModelsProvider.map((providers) => providers.useValue);
export { models, msSqlDBModelsProvider };
