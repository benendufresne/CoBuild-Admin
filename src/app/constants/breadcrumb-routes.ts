/**
 * @BC === BREADCRUMB
 */
import * as route from "src/app/constants/absolute-routes";
/**
 * @DASHBOARD_MODULE_BREADCRUMB_ROUTE
 */
export const BC_DASHBOARD = [{ path: route.ABS_DASHBOARD, label: "Dashboard" }];

/**
 * @PROFILE_BREADCRUMB_ROUTE
 */
export const BC_PROFILE = [
  { path: route.ABS_PROFILE, label: "Super Admin Profile" },
];
export const BC_SUB_ADMIN_PROFILE = [
  { path: route.ABS_PROFILE, label: "Sub-Admin Profile" },
];
export const BC_CHANGE_PASSWORD = [
  { path: route.ABS_CHANGE_PASSWORD, label: "Change Password" },
]

/**
 * @USERS_MODULE_BREADCRUMB_ROUTE
 */
export const BC_USERS = [
  { path: route.ABS_USER_MANAGEMENT, label: "User Management" },
];

export const BC_ADD_USER = [
  ...BC_USERS,
  { path: route.ABS_ADD_USER_MANAGEMENT, label: "Add User" },
];
export const BC_EDIT_USER = [
  ...BC_USERS,
  { path: route.ABS_EDIT_USER_MANAGEMENT, label: "Edit User" },
];

export const BC_USERS_DETAILS = [
  ...BC_USERS,
  { path: route.ABS_USER_DETAILS_MANAGEMENT, label: "View Details" },
];
export const BC_USERS_BLOCKED_CUSTOMERS = [
  ...BC_USERS,
  { path: route.ABS_USER_MANAGEMENT, label: "Blocked Users" },
];

/**
 * @CMS_MODULE_CUSTOMER_BREADCRUMB_ROUTE
 */
export const BC_CMS_CUSTOMER = [
  {
    path: route.ABS_STATIC_MANAGEMENT_CUSTOMER,
    label: "CMS Management",
  },
];
export const BC_EDIT_PRIVACY_POLICY_CUSTOMER = [
  ...BC_CMS_CUSTOMER,
  { path: route.ABS_STATIC_MANAGEMENT_CUSTOMER, label: "Edit Privacy Policy" },
];
export const BC_EDIT_TERMS_CONDITION_CUSTOMER = [
  ...BC_CMS_CUSTOMER,
  {
    path: route.ABS_STATIC_MANAGEMENT_CUSTOMER,
    label: "Edit Terms and Conditions",
  },
];

export const BC_EDIT_ABOUT_US_CUSTOMER = [
  ...BC_CMS_CUSTOMER,
  { path: route.ABS_STATIC_MANAGEMENT_CUSTOMER, label: "Edit About Us" },
];
export const BC_EDIT_FAQS_CUSTOMER = [
  ...BC_CMS_CUSTOMER,
  { path: route.ABS_STATIC_MANAGEMENT_CUSTOMER, label: "Edit FAQ" },
];
export const BC_ADD_FAQS_CUSTOMER = [
  ...BC_CMS_CUSTOMER,
  { path: route.ABS_STATIC_MANAGEMENT_CUSTOMER, label: "Add FAQ" },
];

/**
 * @SUBADMIN_MODULE_BREADCRUMB_ROUTE
 */
/**
 * @ROLES_ACCESS_MODULE_BREADCRUMB_ROUTE
 */
 

export const BC_ROLES_ACCESS = [
  { path: `${route.ABS_ROLES_ACCESS}/${route.ABS_MANAGE_ROLES}`, label: "Roles & Access Management" },
];
export const BC_ROLES_ACCESS_ADD = [
  ...BC_ROLES_ACCESS,
  { path: route.ABS_ROLES_CREATE, label: "Add New Role" },
];
export const BC_ROLES_ACCESS_EDIT = [
  ...BC_ROLES_ACCESS,
  { path: route.ABS_ROLES_EDIT, label: "Edit Role" },
];
export const BC_ROLES_ACCESS_DETAILS = [
  ...BC_ROLES_ACCESS,
  { path: route.ABS_ROLES_VIEW, label: "Details" },
];
export const BC_SUBADMIN = [{ path: `${route.ABS_ROLES_ACCESS}/${route.ABS_SUBADMIN}`, label: "Sub-Admins" }];
export const BC_ADD_SUBADMIN = [
  ...BC_SUBADMIN,
  { path: route.ABS_SUBADMIN_CREATE, label: "Add Sub-Admin" },
];
export const BC_EDIT_SUBADMIN = [
  ...BC_SUBADMIN,
  { path: route.ABS_SUBADMIN_EDIT, label: "Edit Sub-Admin" },
];
export const BC_VIEW_SUBADMIN = [
  ...BC_SUBADMIN,
  { path: route.ABS_SUBADMIN_EDIT, label: "View Sub-Admin" },
];

/**
 * @NOTIFICATION_MODULE_BREADCRUMB_ROUTE
 */
export const BC_NOTIFICATION = [
  { path: route.ABS_NOTIFICATION_MANAGEMENT, label: "Notification Management" },
];
export const BC_NOTIFICATION_ADD = [
  ...BC_NOTIFICATION,
  { path: route.ABS_ADD_NOTIFICATION_MANAGEMENT, label: "Add Notification" },
];
export const BC_NOTIFICATION_VIEW = [
  ...BC_NOTIFICATION,
  { path: route.ABS_VIEW_NOTIFICATION_MANAGEMENT, label: "View Notification" },
];

/**
 * @REQUEST_MANAGEMENT_BREADCRUMB_ROUTE
 */
export const BC_REQUEST = [
  { path: route.ABS_REQUEST_MANAGEMENT, label: "Request Management" },
];

export const BC_REQUEST_DETAILS = (reqID:any) => {
  return [...BC_REQUEST,{path: route.ABS_VIEW_REQUEST_MANAGEMENT, label: `${reqID}` }];
}
export const BC_CATEGORY = [
  ...BC_REQUEST,
  { path: route.ABS_VIEW_REQUEST_MANAGEMENT, label: "Service Category Management" },
];
export const BC_TYPE = [
  ...BC_REQUEST,
  { path: route.ABS_VIEW_REQUEST_MANAGEMENT, label: "Service Type Management" },
];
/**
 * @JOB_MANAGEMENT_BREADCRUMB_ROUTE
 */
export const BC_JOB = [
  { path: route.ABS_JOB_MANAGEMENT, label: "Job Management" },
];
export const BC_JOB_ADD = [
  ...BC_JOB,
  { path: route.ABS_CREATE_JOB_MANAGEMENT, label: "Add Job" },
];
export const BC_JOB_EDIT = [
  ...BC_JOB,
  { path: route.ABS_CREATE_JOB_MANAGEMENT, label: "Edit Job" },
];
export const BC_JOB_VIEW = [
  ...BC_JOB,
  { path: route.ABS_VIEW_JOB_MANAGEMENT, label: "View Job" },
];

/**
 * @INCIDENT_DAMAGE_BREADCRUMB_ROUTE
 */
export const BC_INCIDENT_DAMAGE = [
  { path: route.ABS_INCIDENT_DAMAGE, label: "Incidents/Damage" },
];

export const BC_INCIDENT_DAMAGE_DETAILS = (damageType) => {
  return [...BC_INCIDENT_DAMAGE,{path: route.ABS_VIEW_INCIDENT_DAMAGE, label: `${damageType}` }];
}

/**
 * @SUPPORT_BREADCRUMB_ROUTE
 */
export const BC_SUPPORT = [
  { path: route.ABS_INCIDENT_DAMAGE, label: "Support" },
];