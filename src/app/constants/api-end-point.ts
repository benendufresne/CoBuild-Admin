const USER_BASE: string = 'api/v1';
const ADMIN_BASE:string='admin'
/**
 * @ACCOUNT_RELATED_END_POINTS
 */
export const LOGIN_API = `${USER_BASE}/${ADMIN_BASE}/login`;
export const LOGOUT_API = `${USER_BASE}/${ADMIN_BASE}/logout`;
export const FORGOT_PASSWORD_API = `${USER_BASE}/${ADMIN_BASE}/forgot-password`;
export const PROFILE = `${USER_BASE}/${ADMIN_BASE}/profile`;
export const RESET_PASSWORD_API = `${USER_BASE}/${ADMIN_BASE}/reset-password`;
export const CHANGE_PASSWORD_API = `${USER_BASE}/${ADMIN_BASE}/change-password`;

/**
 * @DASHBOARD_RELATED_END_POINTS
 */
export const GET_DASHBOARD_API = `${USER_BASE}/${ADMIN_BASE}/dashboard`;

/**
 * @CMS_RELATED_END_POINTS
 */
export const STATIC_CONTENT: string = `${USER_BASE}/contents`;
export const STATIC_CONTENT_FAQS: string = `${USER_BASE}/contents/faq`;
export const STATIC_CONTENT_FAQ_LIST: string = `${USER_BASE}/contents/faq-list`;


/**
 * @USER_MANAGEMENT_RELATED_END_POINTS
 */
export const USERS_API = `${USER_BASE}/user`;
export const USERS_LISTING=`${USERS_API}/listing`
export const USER_DETAIL_API = `${USERS_API}/user-details`;
export const ADD_USER_API = `${USERS_API}/add-user`;
export const EDIT_USER_API = `${USERS_API}/edit-user`;
export const ACTION_USER_API = `${USERS_API}/block-delete`;

/**
 * @JOB_MANAGEMENT_RELATED_END_POINTS
 */
export const JOBS_API = `${USER_BASE}/${ADMIN_BASE}/job-list`;
export const CREATE_JOBS_API = `${USER_BASE}/${ADMIN_BASE}/job`;
export const JOB_ID_JOBS_API = `${USER_BASE}/${ADMIN_BASE}/jobId-dropdown-list`;
export const SCHEDULE_JOBS_API = `${USER_BASE}/${ADMIN_BASE}/schedule-job`;
export const IMPORT_JOBS_API = `${USER_BASE}/${ADMIN_BASE}/import-jobs`;


/**
 * @REQUEST_MANAGEMENT_RELATED_END_POINTS
 */
export const REQUEST_API = `${USER_BASE}/${ADMIN_BASE}/request-list`;
export const REQUESTS_API = `${USER_BASE}/${ADMIN_BASE}/request`;


/**
 * @CATEGORY_MANAGEMENT_RELATED_END_POINTS
 */
export const SERVICE_CATEGORY_DROPDOWN_API = `${USER_BASE}/${ADMIN_BASE}/service-category-dropdown-list`;
export const SERVICE_CATEGORY_LIST_API = `${USER_BASE}/${ADMIN_BASE}/service-category-list`;
export const SERVICE_CATEGORY_API = `${USER_BASE}/${ADMIN_BASE}/service-category`;
export const SERVICE_TYPE_LIST_API = `${USER_BASE}/${ADMIN_BASE}/service-type-list`;
export const SERVICE_TYPE_DROPDOWN_LIST_API = `${USER_BASE}/${ADMIN_BASE}/service-typeId-list`;
export const SERVICE_TYPE_API = `${USER_BASE}/${ADMIN_BASE}/service-type`;

/**
 * @INCIDENT_DAMAGE_RELATED_END_POINTS
 */
export const INCIDENT_DAMAGE_LISTING_API= `${USER_BASE}/${ADMIN_BASE}/report-list`;
export const INCIDENT_DAMAGE_VIEW_API = `${USER_BASE}/${ADMIN_BASE}/report-damage`;

/**
 * @SUBADMIN_MANAGEMENT_RELATED_END_POINTS
 */
export const SUBADMIN_API = `${USER_BASE}/${ADMIN_BASE}/sub-admin`;
export const SUBADMIN_LIST_API = `${USER_BASE}/${ADMIN_BASE}/sub-admin-list`;
export const SUBADMIN_ROLES_LIST_API = `${USER_BASE}/${ADMIN_BASE}/roles-name-list`;
export const ROLES_LIST_API = `${USER_BASE}/${ADMIN_BASE}/roles-list`;
export const ROLES_API = `${USER_BASE}/${ADMIN_BASE}/role`;


/**
 * @MEDIA_RELATED_END_POINTS
 */
export const MEDIA_UPLOAD:string = `${USER_BASE}/media-upload`;
export const PRESIGNED_URL:string= `${USER_BASE}/${ADMIN_BASE}/preSignedUrl`;



/**
 * @NOTIFICATION_MANAGEMENT_RELATED_END_POINTS
 */
export const NOTIFICATION_API:string = `${USER_BASE}/${ADMIN_BASE}/notification-list`;
export const NOTIFICATION_DETAIL_API:string = `${USER_BASE}/${ADMIN_BASE}/notification`;
export const RESEND_NOTIFICATION_API:string = `${USER_BASE}/${ADMIN_BASE}/resend-notification`;
export const NOTIFICATION_LIST_API:string=`${USER_BASE}/${ADMIN_BASE}/received-notification-list`;
export const NOTIFICATION_READ_UPDATE_API:string=`${USER_BASE}/${ADMIN_BASE}/read-notification`;
export const NOTIFICATION_CLEAR_API:string=`${USER_BASE}/${ADMIN_BASE}/clear-notification`;




