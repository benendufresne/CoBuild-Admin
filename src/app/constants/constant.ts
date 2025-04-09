import {
  ABOUT_US_CUSTOMER,
  FAQS_CUSTOMER,
  MANAGE_ROLES,
  PRIVACY_POLICY_CUSTOMER,
  SUB_ADMIN_MANAGEMENT,
  TERMS_CONDITIONS_CUSTOMER,
} from "./routes";

export const CMS_TAB_LINKS_CUSTOMERS = [
  { path: ABOUT_US_CUSTOMER.path, label: "About Us" },
  { path: PRIVACY_POLICY_CUSTOMER.path, label: "Privacy Policy" },
  { path: TERMS_CONDITIONS_CUSTOMER.path, label: "Terms of Use" },
  { path: FAQS_CUSTOMER.path, label: "FAQ'S" },
];
// export const SUB_ADMIN_TAB_LINKS_CUSTOMERS = [
//   { path: SUB_ADMIN_MANAGEMENT.path, label: "Sub Admin" },
//   { path: MANAGE_ROLES.path, label: "Manage Roles" },

// ];
export const SUB_ADMIN_TAB_LINKS_CUSTOMERS = [
  { path: SUB_ADMIN_MANAGEMENT.fullUrl, label: "Sub Admin" },
  { path: MANAGE_ROLES.fullUrl, label: "Manage Roles" },
];
export const CONTENT_TYPES = {
  ABOUT_US: "ABOUT_US",
  PRIVACY_POLICY: "PRIVACY_POLICY",
  TERMS_CONDITIONS: "TERMS_AND_CONDITIONS",
  FAQS: "FAQ",
};

export const THEME = {
  DARK: "dark",
  LIGHT: "light",
};

export const ONBOARDING_KEYS = {
  ID: "id",
  TOKEN: "token",
  DEVICE_TOKEN: "deviceToken",
  DEVICE_ID: "deviceId",
  PASSWORD: "password",
  ENCRYPTED_TOKEN: "token",
  STRING: "string",
  USER_ID: "userId",
  SUB_ADMIN: "subAdmin",
  NOTIFICATION_ID: "notificationId",
};

export const COMMON_KEYS = {
  LANGUAGE: "language",
  CMS_PAGE: "cmsPage",
  THEME: "theme",
  CMS_TYPE: "cmsType",
};

export const USER_TYPES = {
  USERS: "Blocked Users",
};

export const REQUEST_TYPES_TAB = {
  CATEGORY: "Service Category",
  TYPE: "Service Type",
};

/**
 * @SERVICE_TYPE_TYPES
 */

export const SERVICE_TYPE = {
  CATEGORY_SERVICE: "Category Service",
  CABLE_CONSULTING_SERVICE: "Cable Consulting Service",
  CUSTOM_SERVICE: "Custom Service",
};

export const SERVICE_TYPE_ARRAY = [
  { label: "Category Service" },
  { label: "Cable Consulting Service" },
];

/*** @NOTIFICATION_TYPES_ARRAY  */
export const NOTIFICATION_TYPE_ARRAY: any[] = [
  {
    label: "In-App",
    key: "IN_APP",
  },
  {
    label: "Push",
    key: "PUSH",
  },
];
export const JOB_STATUS_TYPE_ARRAY: any[] = [
  {
    label: "Scheduled",
    key: "SCHEDULED",
  },
  {
    label: "In Progress",
    key: "IN_PROGRESS",
  },
  {
    label: "Completed",
    key: "COMPLETED",
  },
  {
    label: "Canceled",
    key: "CANCELED",
  },
];

export const ADMIN_TYPE = {
  SUPER_ADMIN: "ADMIN",
  SUB_ADMIN: "SUB_ADMIN",
};
export const NOTIFICATION_USERS = [
  { label: "All", value: "4" },
  { label: "iOS Users", value: "2" },
  { label: "Android Users", value: "1" },
];
export const PRIORITY_LEVEL = [
  { label: "High", value: "HIGH" },
  { label: "Medium", value: "MEDIUM" },
  { label: "Low", value: "LOW" },
];

export const JOB_STATUS_TYPE = [
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELED", label: "Canceled" },
];
export const REPORT_DAMAGE_STATUS_TYPE = [
  { value: "PENDING", label: "Pending" },
  { value: "COMPLETED", label: "Completed" },
];
/*** @NOTIFICATION_USER_TYPES_ENUM  */
export const NOTIFICATION_USER_TYPE = {
  ALL: "4",
  IOS: "2",
  ANDROID: "1",
};

/*** @NOTIFICATION_USER_TYPES_ENUM  */
export const ACCOUNT_TYPE_ENUM = {
  BASIC_USER: "BASIC_USER",
  PRO_USER: "PRO_USER",
  PRO_BY_ADMIN: "PRO_BY_ADMIN",
  BUSINESS: "BUSINESS",
};

/*** @USER_STATUS_TYPES_ENUM  */
export const USER_STATUS_ENUM = {
  BLOCKED: "BLOCKED",
  UN_BLOCKED: "UN_BLOCKED",
  DELETED: "DELETED",
};
/*** @REQUEST_STATUS_TYPES_ENUM  */

export const REQUEST_TYPE = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  DELETED: "DELETED",
  IN_PROGRESS: "IN_PROGRESS",
  BID_AGAIN:"BIDAGAIN"
};

/*** @DASHBOARD_FILTER_TYPES_ENUM  */

export const DASHBOARD_FILTER_TYPE = {
  ALL: "All",
  YESTERDAY: "Yesterday",
  LAST_WEEK: "Last Week",
  LAST_MONTH: "Last Month",
  LAST_YEAR: "Last Year",
  CUSTOM: "Custom",
};

/*** @DASHBOARD_FILTER_TYPES_ENUM  */

export const DASHBOARD_FILTER_BUTTON_TYPE = [
  {
    label: "All",
    isCustom: false,
  },
  {
    label: "Yesterday",
    isCustom: false,
  },
  {
    label: "Last Week",
    isCustom: false,
  },
  {
    label: "Last Month",
    isCustom: false,
  },
  {
    label: "Last Year",
    isCustom: false,
  },
  {
    label: "Custom",
    isCustom: true,
  },
];
/**
 * @DASHBOARD_IMPORTANT_STATISTICS
 */

export const USER_STATISTICS = [
  {
    title: "Total Users",
    data: 0,
  },
  {
    title: "Active Users",
    data: 0,
  },
  {
    title: "Blocked Users",
    data: 0,
  },
];
/*** @JOB_TYPES_ENUM  */
export const JOB_STATISTICS = [
  {
    title: "Total Jobs",
    data: 0,
  },
  {
    title: "Active Jobs",
    data: 0,
  },
  {
    title: "Completed Jobs",
    data: 0,
  },
  {
    title: "Canceled Jobs",
    data: 0,
  },
];

/*** @REQUEST_STATUS_TYPES_ENUM  */

export const REQUEST_STATUS_TYPE = {
  ACCEPT: "ACCEPTED",
  REJECT: "REJECTED",
  BID_AGAIN: "BIDAGAIN",
};

/*** @SUPPORT_STATUS_TYPES_ENUM  */

export const SUPPORT_BUTTON = [
  { label: "Request", value: "REQUEST",showRedDot: false  },
  { label: "Report", value: "REPORT",showRedDot: false  },
  {label:'Job',value:'JOB',showRedDot: false },
];

export const SUPPORT_CHAT_MODE = {
  REQUEST: "REQUEST",
  REPORT: "REPORT",
  JOB: "JOB",
};
