
export const MODULE = {
	DASHBOARD: "Dashboard",
	USER_MANAGEMENT: "Users Management",
	SUB_ADMIN_MANAGEMENT: "Sub Admin Management",
    JOB_MANAGEMENT:'Job Management',
    REQUEST_MANAGEMENT:'Requests Management',
	NOTIFICATION_MANAGEMENT: "Notifications Management",
	STATIC_CONTENT_MANAGEMENT: "CMS Management",
    REPORT_DAMAGE_MANAGEMENT:"Incidents/Damage",
    SUPPORT:'Support',
    VERSION_MANAGEMENT: "Version Management",
};

export const MODULE_ID = {
    1:"DASHBOARD",
	2:"USER_MANAGEMENT",
	3:"SUB_ADMIN_MANAGEMENT",
    4:"JOB_MANAGEMENT",
    5:"REQUEST_MANAGEMENT",
    6:"REPORT_DAMAGE_MANAGEMENT",
    7:"SUPPORT",
	8:"NOTIFICATION_MANAGEMENT",
    9:"STATIC_CONTENT_MANAGEMENT",
    10:"VERSION_MANAGEMENT",

}

export const ROLE = {
    DASHBOARD: {
        "module": "Dashboard",
        "moduleId": "1",
        "view": false,
        "edit": false
    },
	USER_MANAGEMENT: {
        "module": "Users Management",
        "moduleId": "2",
        "view": false,
        "edit": false
    },
	SUB_ADMIN_MANAGEMENT: {
        "module": "Sub-Admin Management",
        "moduleId": "3",
        "view": false,
        "edit": false
    },
    JOB_MANAGEMENT: {
        "module": "Job Management",
        "moduleId": "4",
        "view": false,
        "edit": false
    },
    REQUEST_MANAGEMENT: {
        "module": "Requests Management",
        "moduleId": "5",
        "view": false,
        "edit": false
    },
    REPORT_DAMAGE_MANAGEMENT: {
        "module": "Incidents/Damage",
        "moduleId": "6",
        "view": false,
        "edit": false
    },

    SUPPORT: {
        "module": "Support",
        "moduleId": "7",
        "view": false,
        "edit": false
    },
    NOTIFICATION_MANAGEMENT: {
        "module": "Notifications Management",
        "moduleId": "8",
        "view": false,
        "edit": false
    },
	STATIC_CONTENT_MANAGEMENT: {
        "module": "CMS Management",
        "moduleId": "9",
        "view": false,
        "edit": false
    },



    VERSION_MANAGEMENT: {
        "module": "Version Management",
        "moduleId": "10",
        "view": false,
        "edit": false
    },
}

export const PERMISSION_MODULE = {
    viewDashboard: 'DASHBOARD',
    editDashboard: 'DASHBOARD',
    viewUserMgmt: 'USER_MANAGEMENT',
    editUserMgmt: 'USER_MANAGEMENT',
    viewSubAdminMgmt: 'SUB_ADMIN_MANAGEMENT',
    editSubAdminMgmt: 'SUB_ADMIN_MANAGEMENT',
    viewJobMgmt:'JOB_MANAGEMENT',
    editJobMgmt:'JOB_MANAGEMENT',
    viewRequestMgmt:'REQUEST_MANAGEMENT',
    editRequestMgmt:'REQUEST_MANAGEMENT',
    viewDamageReport:'REPORT_DAMAGE_MANAGEMENT',
    editDamageReport:'REPORT_DAMAGE_MANAGEMENT',
    viewSupport:'SUPPORT',
    editSupport:'SUPPORT',
    viewNotificationMgmt: 'NOTIFICATION_MANAGEMENT',
    editNotificationMgmt: 'NOTIFICATION_MANAGEMENT',
    viewCMSMgmt: 'STATIC_CONTENT_MANAGEMENT',
    editCMSMgmt: 'STATIC_CONTENT_MANAGEMENT',
    viewVersionMgmt: 'VERSION_MANAGEMENT',
    editVersionMgmt: 'VERSION_MANAGEMENT',
}

export const FORM_CONTROL = {
    1: [
        {control: "viewDashboard", key: 'view'},
        {control: "editDashboard", key: 'edit'}
    ],
    2: [
        {control: "viewUserMgmt", key: 'view'},
        {control: "editUserMgmt", key: 'edit'}
    ],
    3: [
        {control: "viewSubAdminMgmt", key: 'view'},
        {control: "editSubAdminMgmt", key: 'edit'}
    ],
    4: [
        {control: "viewJobMgmt", key: 'view'},
        {control: "editJobMgmt", key: 'edit'}
    ],
    5: [
        {control: "viewRequestMgmt", key: 'view'},
        {control: "editRequestMgmt", key: 'edit'}
    ],
    6: [
        {control: "viewDamageReport", key: 'view'},
        {control: "editDamageReport", key: 'edit'}
    ],
 
    7: [
        {control: "viewSupport", key: 'view'},
        {control: "editSupport", key: 'edit'}
    ],
    8: [
        {control: "viewNotificationMgmt", key: 'view'},
        {control: "editNotificationMgmt", key: 'edit'}
    ],
    9: [
        {control: "viewCMSMgmt", key: 'view'},
        {control: "editCMSMgmt", key: 'edit'}
    ],

    10: [
        {control: "viewVersionMgmt", key: 'view'},
        {control: "editVersionMgmt", key: 'edit'}
    ], 
}

export const ADMIN_TYPES = {
    ADMIN: "ADMIN",
    SUB_ADMIN: "SUB_ADMIN",
  };