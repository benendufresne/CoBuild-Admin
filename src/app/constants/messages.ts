export const OFFLINE = 'Connection lost! You are not connected to Internet';
export const SESSION_EXPIRED = 'Your session has been expired';
export const ONLINE = 'Back to online';
export const NO_INTERNET = 'No Internet Connection';
export const TIME_OUT = 'Connection timed out. Please retry';
export const INTERNAL_SERVER_ERROR =
  "Couldn't connect to the server. Please try again";
export const FAQ_DELETED = 'Faq deleted successfully';
export const FAQ_STATUS = 'Faq status updated successfully';
export const INVALID_ID_ERROR = 'Invalid ID';
export const VERIFICATION_CODE = 'Please enter verification code';
export const SOMETHING_WRONG = 'Something went wrong, Please try again later';
export const NO_ACTION = "You can't perform this action";
export const MAX_VIDEO_SIZE = 10000000;
export const VIDEO_FORMAT = 'video/mp4,video/gif';
const SEACRH_BASE = 'Search';
export const ACCOUNT_ERROR_MESSAGES = {
  NAME_REQ: 'Please enter name',
  FIRST_NAME_REQ: 'Please enter first name',
  LAST_NAME_REQ: 'Please enter last name',
  MIN_NAME_REQ: 'Please enter atleast 3 characters',
  MOBILE_REQ: 'Please enter phone number',
  INVALID_MOBILE: 'Please enter a valid phone number',
  MIN_MOBILE: 'Please enter atleast 10 digit phone number',
  PASSWORD_REQ: 'Please enter password',
  INVALID_PASSWORD:
    'Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character, minimum 8 and maximum 16 characters',
  NO_SPACE_PASSWORD: "Password can't start or end with a blank space",
  EMAIL_REQ: 'Please enter email address',
  INVALID_EMAIL: 'Please enter a valid email address',
  ONLY_ALPHABET: 'Only alphabets are allowed',
};
export const UPLOAD_THUMBNAIL = 'Please upload thumbnail';
export const UPLOAD_VIDEO = 'Please upload video';
export const UPLOAD_PDF = 'Please upload pdf';
export const EDUCATIONAL_MEDIA_UPDATED =
  'Educational media updated successfully';
export const EDUCATIONAL_MEDIA_ADDED = 'Educational media added successfully';
export const RECOMMENDATION_UPDATED = 'Recommendation updated successfully';
export const RECOMMENDATION_ADDED = 'Recommendation added successfully';
export const CATEGORY_UPDATED = 'Category updated successfully';
export const CATEGORY_ADDED = 'Category added successfully';
export const PASSWORD_ERROR_MESSAGES = {
  OLD_PASSWORD_REQ: 'Please enter old password',
  PASSWORD_INFO: 'Field must include at-least 7 characters, an uppercase letter, a lowercase letter and a number',
  INVALID_OLD_PASSWORD:
    'Old password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character, minimum 7 and maximum 16 characters',
  NO_SPACE_OLD_PASSWORD: "Old password can't start or end with a blank space",
  NEW_PASSWORD_REQ: 'Please enter new password',
  INVALID_NEW_PASSWORD:
    'New password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character, minimum 7 and maximum 16 characters',
  NO_SPACE_NEW_PASSWORD: "New password can't start or end with a blank space",
  C_PASSWORD_REQ: 'Please enter confirm new password',
  INVALID_C_PASSWORD:
    'Confirm new password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character, minimum 7 and maximum 16 characters',
  NO_SPACE_C_PASSWORD:
    "Confirm new password can't start or end with a blank space",
  CONFORM_PASSWORD_MATCH_ERR:
    'New password and confirm new password not matched',
  OLD_NEW_PASSWORD_MATCH_ERR: "Old & New password can't be the same",
  WRONG_OLD_PASSWORD: 'Entered old password was incorrect',
};

export const MEDIA_TYPE = [
  { label: 'Video', value: 'Video' },
  { label: 'Document', value: 'Document' },
  { label: 'Link', value: 'Link' },
];

const YEARS_OF_EXP = () => {
  let listData = [];
  for (let i = 2; i <= 60; i++) {
    listData.push({ name: `${i + ' Years'}`, value: i });
  }

  return listData;
};
export const YEARS_OF_EXP_LIST = [
  { name: '1 Year', value: 1 },
  ...YEARS_OF_EXP(),
];

export const LISTING_COMMON_MESSAGES = {
  ACTIVE_TITLE: "Active",
  ACTIVATE_TITLE: "Activate",
  UN_BLOCK_TITLE: "Unblock",
  BLOCK_TITLE: "Inactive",
  INACTIVATE_TITLE: "Inactivate",
  DELETE_TITLE: "Delete",
  REMOVE_TITLE: "Remove",
  CANCEL_TITLE:"Cancel",
   CANCEL_MSG: "Are you sure you want to cancel",
  ADD_TITLE: "Add",
  RESEND_TITLE:'Resend',
  APPROVE_TITLE:"Approve",
  REJECT_TITLE:"Reject",
  RESEND_MSG:'Are you sure you want to resend',
  ACTIVE_MSG: "Are you sure you want to active",
  ACTIVATE_MSG: "Are you sure you want to activate",
  UN_BLOCK_MSG: "Are you sure you want to unblock",
  BLOCK_MSG: "Are you sure you want to inactive",
  INACTIVATE_MSG: "Are you sure you want to inactivate",
  DELETE_MSG: "Are you sure you want to delete",
  REMOVE_MSG:'Are you sure you want to remove',
  SURE_MSG:'Are you sure you want to ',
  SUBMIT:'Submit'


};

export const BAN_MESSAGE = (listType: string): string => {
  return `Are you sure you want to ban this ${listType}?`;
}

export const UN_BAN_MESSAGE = (listType: string): string => {
  return `Are you sure you want to unban this ${listType}?`;
}

export const BAN_TITLE = (listType: string): string => {
  return `Ban ${listType}?`;
}

export const UN_BAN_TITLE = (listType: string): string => {
  return `Unban ${listType}?`;
}

export const APPROVE_STATUS_MSG = (listType: string): string =>{
  return `Are you sure you want to approve this ${listType}?`
}

export const CANCEL_STATUS_MSG = (listType: string): string =>{
  return `Are you sure you want to cancel this ${listType}?`
}

export const REJECT_STATUS_MSG = (listType: string): string =>{
  return `Are you sure you want to reject this ${listType}?`
}

export const MAX_IMG_SELECTION = 4;
export const FILE_EXIST = 'Selected image is already exist';
export const MAX_IMG_SELECTION_ERR = (count = MAX_IMG_SELECTION) =>
  `You can select upto ${count} images only`;

export const BULK_EROR =
  'Please filter the athletes first on behalf of workout before performing the bulk operation';
export const ACTION_ERROR = (type: any) => `Please wait for ${type} action`;
export const TITLE_CONFIRMATION = (titleText: string) =>
  `${titleText}`;
export const MSSG_CONFIRMATION = (MssgText: string) =>
  `Are you sure you want to ${MssgText}?`;

export const EDITOR_COMMON_MESSAGES = {
  CONTENT_REQ: 'Content cannot be empty. Please enter valid text.',
  CMS_ACTION: (action: string) => `Content ${action} successfully`,
};

export const DATE_TYPES = {
  SHORT_TIME: 'h:mm a',
  SHORT_DATE: 'dd/MM/yyyy',
  MEDIUM_DATE: 'MMM d, yyyy',
  FULL_DATE: 'EE, MMM d, yyyy',
  VALIDITY_TIME: 'MMM d, y - hh:mm:ss a',
  DATE_WITH_TIME: 'dd/MM/YYYY hh:mm a',
  DATE_TIME_WITH_COMMA_SEP: 'MMM d, y hh:mm a',
  DATE_TIME_WITH_COMMA: 'd MMM y, hh:mm a',

};

export const USER_STATUS = { 
  ACTIVE: 'ACTIVE',
  INACTIVE:"INACTIVE"
};
export const APPROVAL_STATUS = {
  ACCEPT: "ACCEPTED",
  REJECT: "REJECTED",
  REQUEST: "REQUESTED",
  PAYMENT_FAILED:"paymentFailed",
  PENDING_APPROVAL:"PENDING_APPROVAL",
  ONGOING:"ONGOING",
  SCHEDULED:"SCHEDULED",
  COMPLETED:'COMPLETED'
}

export const TABLE_SEACRCH_PLACEHOLDER = {
  USER_MANAGEMENT_CUSTOMERS_SEACRCH:`${SEACRH_BASE} by Name, Email or Mobile No`,
  NOTIFICATION_LIST_B_PINS_PLACEHOLDER:`${SEACRH_BASE} by subject and description`,
  JOB_LIST_PLACEHOLDER:`${SEACRH_BASE} by Job Title or Location`,
  CATEGORY_SEARCH_PLACEHOLDER:`${SEACRH_BASE} by Category Name`,
  REQUEST_SEARCH_PLACEHOLDER:`${SEACRH_BASE} by Customer Name or Location`,
  REPORT_SEARCH_PLACEHOLDER:`${SEACRH_BASE} by description or Reported By`,
  TYPE_SEARCH_PLACEHOLDER:`${SEACRH_BASE} by Service Type or Service Category`,
  SUB_ADMIN_SEARCH_PLACEHOLDER:`${SEACRH_BASE} Name, Email`,
  ROLE_SEARCH_PLACEHOLDER:`${SEACRH_BASE} Role`,

}
export const TABLE_ADD_BUTTON_TEXT={
  NOTIFICATION:'Notification',
  CATEGORY:'New Category',
  ROLE:'Role',
  SUB_ADMIN:'Sub Admin',
  Version: "New Version",

}
/**
 * @ROLE_MANAGEMENT_RELATED_STUFF
 */
export const MODULE_ID_OF = {
  DASHBOARD: "1",
  USER_MANAGEMENT: "2",
  SUB_ADMIN_MANAGEMENT: "3",
  JOB_MANAGEMENT:"4",
  REQUEST_MANAGEMENT: "5",
  REPORT_DAMAGE_MANAGEMENT: "6",
  SUPPORT: "7",
  NOTIFICATION_MANAGEMENT: "8",
  STATIC_CONTENT_MANAGEMENT: "9",
  VERSION_MANAGEMENT: "10",
  ADMIN_PROFILE: "14",
};

export const SUCCESS_MESSAGE = {
ADD_NOTIFICATION: 'Notification added successfully',
SUB_COMMENT_DELETE: "Sub comment has been deleted successfully"
}

export const STATUS_MESSAGE = {
  ACTIVE:(list)=>`${list} has been activated successfully`,
  IN_ACTIVE:(list)=>`${list} has been inactivated successfully`,
  DELETED:(list)=>`${list} has been deleted successfully`,

}

export const SUB_ADMIN_ERROR_MESSAGES = {
  NAME_REQ: 'Please enter name',
  EMAIL_REQ: 'Please enter email address',
  INVALID_EMAIL: 'Please enter a valid email address',
  MOBILE_REQ: 'Please enter mobile number',
  MOBILE_INVALID: 'Please enter a valid mobile number',
  ROLE_REQ: 'Please select sub admin role',
  ONLY_ALPHABET: "Special characters and numbers are not allowed",

};