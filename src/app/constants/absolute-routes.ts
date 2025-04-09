/**
 * @ABS === ABSOLUTE
 */

import * as routes from "./routes";
export const ABS_ACCOUNT_LOGIN = `/${routes.ACCOUNT}/${routes.LOGIN}`;
export const ABS_FORGOT_PASSWORD = `/${routes.ACCOUNT}/${routes.FORGOT_PASSWORD}`;
export const ABS_FORGOT_PASSWORD_SUCCESS = `/${routes.ACCOUNT}/${routes.FORGOT_PASSWORD_SUCCESSFULL}`;
export const ABS_RESET_PASSWORD = `/${routes.ACCOUNT}/${routes.RESET_PASSWORD}`;
export const ABS_DASHBOARD = `/${routes.DASHBOARD.path}`;

/**
 * @PROFILE_ABSOLUTE_ROUTE
*/
export const ABS_PROFILE = `/${routes.PROFILE.path}`;
export const ABS_CHANGE_PASSWORD = `/${routes.CHANGE_PASSWORD.path}`;

export const ABS_PROFILE_EDIT = `/${routes.PROFILE.path}/${routes.EDIT.path}`;

/**
 * @USERS_MODULE_ABSOLUTE_ROUTE
 */
export const ABS_USER_MANAGEMENT = `/${routes.USER_MANAGEMENT.path}`;
export const ABS_USER_DETAILS_MANAGEMENT = `/${routes.USER_MANAGEMENT_DETAILS.path}`;
export const ABS_ADD_USER_MANAGEMENT = `/${routes.CREATE_USER.path}`;
export const ABS_EDIT_USER_MANAGEMENT = `/${routes.EDIT_USER.path}`;


/**
 * @CMS_MODULE_ABSOLUTE_ROUTE
 */
export const ABS_STATIC_MANAGEMENT_CUSTOMER = `/${routes.STATIC_CONTENT_CUSTOMER.path}`;

/**
 * @SUBADMIN_MODULE_ABSOLUTE_ROUTE
 */
export const ABS_SUBADMIN = `/${routes.SUB_ADMIN_MANAGEMENT.path}`;
export const ABS_SUBADMIN_CREATE = `/${routes.CREATE_SUBADMIN.path}`;
export const ABS_SUBADMIN_EDIT = `/${routes.EDIT_SUBADMIN.path}`;
export const ABS_SUBADMIN_VIEW = `/${routes.VIEW_SUBADMIN.path}`;
export const ABS_MANAGE_ROLES = `/${routes.MANAGE_ROLES.path}`;
export const ABS_ROLES_CREATE = `/${routes.ADD_MANAGE_ROLES.path}`;
export const ABS_ROLES_EDIT = `/${routes.EDIT_MANAGE_ROLES.path}`;
export const ABS_ROLES_VIEW = `/${routes.VIEW_MANAGE_ROLES.path}`;
export const ABS_ROLES_ACCESS = `/${routes.ROLES_ACCESS.path}`;


/**
 * @NOTIFICATION_MANAGEMENT_MODULE_ABSOLUTE_ROUTE
 */
export const ABS_NOTIFICATION_MANAGEMENT = `/${routes.NOTIFICATION_MANAGEMENT.path}`;
export const ABS_ADD_NOTIFICATION_MANAGEMENT = `/${routes.ADD_NOTIFICATION.path}`;
export const ABS_VIEW_NOTIFICATION_MANAGEMENT = `/${routes.VIEW_NOTIFICATION.path}`;

/**
 * @REQUEST_MANAGEMENT_MODULE_ABSOLUTE_ROUTE
 */
export const ABS_REQUEST_MANAGEMENT = `/${routes.REQUEST_MANAGEMENT.path}`;
export const ABS_VIEW_REQUEST_MANAGEMENT = `/${routes.VIEW_MANAGEMENT.path}`;


/**
 * @JOB_MANAGEMENT_MODULE_ABSOLUTE_ROUTE
 */
export const ABS_JOB_MANAGEMENT = `/${routes.JOB_MANAGEMENT.path}`;
export const ABS_CREATE_JOB_MANAGEMENT = `/${routes.CREATE_JOB_MANAGEMENT.path}`;
export const ABS_VIEW_JOB_MANAGEMENT = `/${routes.VIEW_JOB_MANAGEMENT.path}`;

/**
 * @INCIDENT_DAMAGE_MODULE_ABSOLUTE_ROUTE
 */
export const ABS_INCIDENT_DAMAGE= `/${routes.INCIDENTS_DAMAGE.path}`;
export const ABS_VIEW_INCIDENT_DAMAGE = `/${routes.INCIDENTS_DAMAGE_DETAILS.path}`;

/**
 * @SUPPORT_MODULE_ABSOLUTE_ROUTE
 */
export const ABS_SUPPORT= `/${routes.SUPPORT.path}`;
