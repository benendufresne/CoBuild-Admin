import { INCIDENTS_DAMAGE_DETAILS, USER_MANAGEMENT_DETAILS, VIEW_JOB_MANAGEMENT, VIEW_MANAGE_ROLES, VIEW_MANAGEMENT, VIEW_NOTIFICATION, VIEW_SUBADMIN } from "./routes";

/**
 * @USER_LISTING_CUSTOMERS_HEADING
 */
export const USER_LISTING_CUSTOMERS_HEADING = [
  {
    heading: "Name",
    key: "name",
    align: "center",
    sort: true,
    sortOrder: null,
    type: "formatLink",
    link: USER_MANAGEMENT_DETAILS.fullUrl,
  },
  {
    heading: "Mobile Number",
    key: "mobileNo",
    key1:'countryCode',
    align: "center",
    type:'mobileNumber'
  },
  {
    heading: "Email",
    key: "email",
    align: "center",
  },
  {
    heading: "Added On",
    key: "created",
    align: "center",
    sort: true,
    sortOrder:-1 ,
    type: "formatShortDateTime",
  },
  {
    heading: "Address",
    key: "location",
    align: "center",
    type:'formatAddress'

  },
  {
    heading: "Last Login",
    key: "lastLogin",
    align: "center",
    type: "formatShortDateTime",
  },
  {
    heading: "Status",
    key: "status",
    type: "formatStatus",
    align: "center",
    show: true,
  },
  { heading: "Actions", type: "route", action: [4, 8] },
];
/**
 * @BLOCKED_USER_LISTING_HEADING
 */
export const BLOCKED_USER_HEADING = [
  ...USER_LISTING_CUSTOMERS_HEADING.filter(
    (head) => head.key !== "status" && head.type !== "route"
  ),
  {
    heading: "Blocked Reason",
    key: "reason",
    align: "center",
    show: false,
  },
  { heading: "Actions", type: "route", action: [9, 8] },
];
/**
 * @JOB_LISTING_HEADING
 */
export const JOB_HEADING = [
  {
    heading: "Job ID",
    key: "jobIdString",
    align: "center",
    type: "formatLink",
    link: VIEW_JOB_MANAGEMENT.fullUrl,
  },
  {
    heading: "Job Title",
    key: "title",
    align: "center",
  },
  {
    heading: "Service Category",
    key: "categoryName",
    align: "center",
  },
  {
    heading: "Company Address",
    key: "companyLocation",
    align: "center",
    type:'formatAddress'

  },
  {
    heading: "Job Location",
    key: "location",
    align: "center",
    type:'formatAddress'

  },
  {
    heading: "Scheduled Date & Time",
    key: "schedule",
    align: "center",
    type: "formatDateWithTime",
  },
  {
    heading: "Priority Level",
    key: "priority",
    align: "center",
    type:'status'
  },
  {
    heading: "Status",
    key: "status",
    type: "dropdownStatus",
    align: "center",
  },
  { heading: "Actions", type: "route", action: [3, 8] },
];
/**
 * @REQUEST_LISTING_HEADING
 */
export const REQUEST_HEADING = [
  {
    heading: "Request ID",
    key: "requestIdString",
    align: "center",
    type: "formatLink",
    link: VIEW_MANAGEMENT.fullUrl,
  },
  {
    heading: "Customer Name",
    key: "name",
    align: "center",
  },
  {
    heading: "Location",
    key: "location",
    align: "center",
    type:'formatAddress'
  },
  {
    heading: "Requested On",
    key: "created",
    align: "center",
    type: "formatDateWithTime",
  },
  {
    heading: "Service Type",
    key: "serviceType",
    align: "center",
    type:"formatServiceType"
  },
  {
    heading: "Service Category",
    key: "categoryName",
    align: "center",
  },
  {
    heading: "Status",
    key: "status",
    align: "center",
    type:"formatStatus"
  },
  { heading: "Action", type: "route", action: [8] },
];
/**
 * @CATEGORY_LISTING_HEADING
 */
export const CATEGORY_HEADING = [
  {
    heading: "Category ID",
    key: "categoryIdString",
    align: "center",
    type:'dialog',
  },
  {
    heading: "Category Name",
    key: "categoryName",
    align: "center",
  },
  {
    heading: "Service Type",
    key: "serviceType",
    align: "center",
    type:"formatServiceType"
  },
  { heading: "Action", type: "route", action: [3,8] },
];
/**
 * @TYPE_LISTING_HEADING
 */
export const TYPE_HEADING = [
  {
    heading: "Type ID",
    key: "serviceIdString",
    align: "center",
    type:'dialog',
  },
  {
    heading: "Service Type",
    key: "name",
    align: "center",
  },
  {
    heading: "Service Category",
    key: "categoryName",
    align: "center",
  },
  { heading: "Action", type: "route", action: [3,8] },
];
/**
 * @SUB_ADMIN_LISTING_HEADING
 */
export const SUB_ADMIN_HEADING = [
      {
        heading: "Name",
        key: "name",
        align: "center",
        type:'link',
        sort: true,
        sortOrder:null ,
        link:`${VIEW_SUBADMIN.fullUrl}`
      },
      {
        heading: "Email",
        key: "email",
        align: "center",
        type: "mobileNumber",
      },
      {
        heading: "Role",
        key: "roleName",
        align: "center",
      },
      {
        heading: "Added On",
        key: "created",
        align: "center",
        sort: true,
        sortOrder:-1 ,
        type: "formatDateTime",
      },
      {
        heading: "Status",
        key: "status",
        type: "formatStatus",
        align: "center",
      },
      { heading: "Actions", type: "route", action: [3, 5, 4] },
];
/**
 * @MANAGE_ROLES_LISTING_HEADING
 */
export const MANAGE_ROLES_HEADING = [
 {
      heading: "Role",
      key: "name",
      align: "center",
      type:'link',
      link:VIEW_MANAGE_ROLES.fullUrl
    },
    {
      heading: "Added On",
      key: "created",
      align: "center",
      sort: true,
      sortOrder:-1 ,
      type: "formatDateTime",
    },
    {
      heading: "Status",
      key: "status",
      type: "formatStatus",
      align: "center",
    },
    { heading: "Actions", type: "route", action: [3, 5, 4] },
];
/**
 * @NOTIFICATION_LISTING_HEADING
 */
export const NOTIFICATION_LISTING_HEADING = [
  {
    heading: "Subject",
    key: "title",
    align: "center",
    type: "formatLink",
    link: VIEW_NOTIFICATION.fullUrl,
  },

  {
    heading: "Added On",
    key: "created",
    align: "center",
    type: "formatDateWithTime",
  },
  {
    heading: "Description",
    key: "description",
    align: "center",
  },
  {
    heading: "Users",
    key: "users",
    align: "center",
    type: "notificationUserType",
  },
  { heading: "Action", type: "route", action: [2,7, 5] },

];

/**
 * @REPORT_DAMAGE_LISTING_HEADING
 */
export const REPORT_DAMAGE_HEADING = [
  {
    heading: "Description",
    key: "description",
    align: "center",
    type: "formatLink",
    link: INCIDENTS_DAMAGE_DETAILS.fullUrl,
  },
  {
    heading: "Type",
    key: "type",
    align: "center",
  },
  {
    heading: "Reported By",
    key: "userName",
    align: "center",
  },
  {
    heading: "Location",
    key: "location",
    align: "center",
    type:'formatAddress'
  },
  {
    heading: "Reported On",
    key: "created",
    align: "center",
    type: "formatDateWithTime",
  },
  {
    heading: "Status",
    key: "status",
    type: "dropdownStatus",
    align: "center",
  },
];