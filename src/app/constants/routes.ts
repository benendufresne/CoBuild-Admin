import { Iroute } from './interface';

/**
 * @ABS === ACCOUNT
 */
export const ACCOUNT: Iroute = {
  path: 'account',
  get fullUrl(): string {
    return `/${this.path}`;
  },
};

export const LOGIN: Iroute = {
  path: 'login',
  get fullUrl(): string {
    return `${ACCOUNT.fullUrl}/${this.path}`;
  },
};
export const FORGOT_PASSWORD: Iroute = {
  path: 'forgot-password',
  get fullUrl(): string {
    return `${ACCOUNT.fullUrl}/${this.path}`;
  },
};
export const RESET_PASSWORD: Iroute = {
  path: 'reset-password',
  get fullUrl(): string {
    return `${ACCOUNT.fullUrl}/${this.path}`;
  },
};
export const FORGOT_PASSWORD_SUCCESSFULL: Iroute = {
  path: 'forgot-password-successfull',
  get fullUrl(): string {
    return `${ACCOUNT.fullUrl}/${this.path}`;
  },
};
export const RESET_PASSWORD_SUCCESSFULL: Iroute = {
  path: 'reset-password-successfull',
  get fullUrl(): string {
    return `${ACCOUNT.fullUrl}/${this.path}`;
  },
};
export const CHANGE_PASSWORD: Iroute = {
  path: 'change-password',
  get fullUrl(): string {
    return `/${this.path}`;
  },
};
export const ADD: Iroute = {
  path: 'add',
  get fullUrl(): string {
    return `${ACCOUNT.fullUrl}/${this.path}`;
  },
};
export const EDIT: Iroute = {
  path: 'edit',
  get fullUrl(): string {
    return `${ACCOUNT.fullUrl}/${this.path}`;
  },
};
export const DETAILS: Iroute = {
  path: 'detail',
  get fullUrl(): string {
    return `${ACCOUNT.fullUrl}/${this.path}`;
  },
};
/**
 * @ABS === LAYOUT
 */
export const LAYOUT: Iroute = {
  path: 'layout',
  get fullUrl(): string {
    return `/${this.path}`;
  },
};

/**
 * @ABS === DASHBOARD
 */
export const DASHBOARD: Iroute = {
  path: 'dashboard',
  get fullUrl(): string {
    return `/${this.path}`;
  },
};
export const USER_MANAGEMENT: Iroute = {
  path: 'user-management',
  get fullUrl(): string {
    return `/${this.path}`;
  },
};
export const CREATE_USER: Iroute = {
  path: 'add-user',
  get fullUrl(): string {
    return `${USER_MANAGEMENT.fullUrl}/${this.path}`;
  },
};

export const EDIT_USER: Iroute = {
  path: 'edit-user',
  get fullUrl(): string {
    return `${USER_MANAGEMENT.fullUrl}/${this.path}`;
  },
};

export const USER_MANAGEMENT_DETAILS: Iroute = {
  path: 'user-details',
  get fullUrl(): string {
    return `${USER_MANAGEMENT.fullUrl}/${this.path}`;
  },
};
/**
 * @ABS === SUB-ADMIN
 */
export const ROLES_ACCESS: Iroute = {
  path: 'manage',
  get fullUrl(): string {
    return `/${this.path}`;
  },
};
export const SUB_ADMIN_MANAGEMENT: Iroute = {
  path: 'subadmin',
  get fullUrl(): string {
    return `${ROLES_ACCESS.fullUrl}/${this.path}`;
  },
};

export const CREATE_SUBADMIN: Iroute = {
  path: 'create-subadmin',
  get fullUrl(): string {
    return `${SUB_ADMIN_MANAGEMENT.fullUrl}/${this.path}`;
  },
};

export const EDIT_SUBADMIN: Iroute = {
  path: 'edit-subadmin',
  get fullUrl(): string {
    return `${SUB_ADMIN_MANAGEMENT.fullUrl}/${this.path}`;
  },
};

export const VIEW_SUBADMIN: Iroute = {
  path: 'view-subadmin',
  get fullUrl(): string {
    return `${SUB_ADMIN_MANAGEMENT.fullUrl}/${this.path}`;
  },
};

export const MANAGE_ROLES: Iroute = {
  path: 'roles',
  get fullUrl(): string {
    return `${ROLES_ACCESS.fullUrl}/${this.path}`;
  },
};
export const ADD_MANAGE_ROLES: Iroute = {
  path: 'add-roles',
  get fullUrl(): string {
    return `${MANAGE_ROLES.fullUrl}/${this.path}`;
  },
};
export const VIEW_MANAGE_ROLES: Iroute = {
  path: 'view-roles',
  get fullUrl(): string {
    return `${MANAGE_ROLES.fullUrl}/${this.path}`;
  },
};
export const EDIT_MANAGE_ROLES: Iroute = {
  path: 'edit-roles',
  get fullUrl(): string {
    return `${MANAGE_ROLES.fullUrl}/${this.path}`;
  },
};


/**
 * @ABS === CONTENT
 */
export const CONTENT_MANAGEMENT: Iroute = {
  path: 'content',
  get fullUrl(): string {
    return `/${this.path}`;
  },
};

export const POST_DETAILS: Iroute = {
  path: 'post-details',
  get fullUrl(): string {
    return `${CONTENT_MANAGEMENT.fullUrl}/${this.path}`;
  },
};

/**
 * @ABS === STATIC_CONTENT_CUSTOMER
 */
export const STATIC_CONTENT_CUSTOMER: Iroute = {
  path: 'cms-management-customer',
  get fullUrl(): string {
    return `/${this.path}`;
  },
};

export const STATIC_CONTENT_PUBLIC: Iroute = {
  path: 'cms-management-public',
  get fullUrl(): string {
    return `/${this.path}`;
  },
};

export const PRIVACY_POLICY_CUSTOMER: Iroute = {
  path: 'privacy-policy',
  get fullUrl(): string {
    return `${STATIC_CONTENT_CUSTOMER.fullUrl}/${this.path}`;
  },
};
export const PRIVACY_POLICY_CUSTOMER_PUBLIC: Iroute = {
  path: 'privacy-policy',
  get fullUrl(): string {
    return `${STATIC_CONTENT_PUBLIC.fullUrl}/${this.path}`;
  },
};

export const TERMS_CONDITIONS_CUSTOMER: Iroute = {
  path: 'terms-condition',
  get fullUrl(): string {
    return `${STATIC_CONTENT_CUSTOMER.fullUrl}/${this.path}`;
  },
};
export const TERMS_CONDITIONS_CUSTOMER_PUBLIC: Iroute = {
  path: 'terms-condition',
  get fullUrl(): string {
    return `${STATIC_CONTENT_PUBLIC.fullUrl}/${this.path}`;
  },
};
export const ABOUT_US_CUSTOMER: Iroute = {
  path: 'about-us',
  get fullUrl(): string {
    return `${STATIC_CONTENT_CUSTOMER.fullUrl}/${this.path}`;
  },
};
export const ABOUT_US_CUSTOMER_PUBLIC: Iroute = {
  path: 'about-us',
  get fullUrl(): string {
    return `${STATIC_CONTENT_PUBLIC.fullUrl}/${this.path}`;
  },
};
export const FAQS_CUSTOMER: Iroute = {
  path: 'faqs',
  get fullUrl(): string {
    return `${STATIC_CONTENT_CUSTOMER.fullUrl}/${this.path}`;
  },
};

export const FAQS_CUSTOMER_PUBLIC: Iroute = {
  path: 'faqs',
  get fullUrl(): string {
    return `${STATIC_CONTENT_PUBLIC.fullUrl}/${this.path}`;
  },
};

export const ADD_CUSTOMER_FAQ: Iroute = {
  path: 'add',
  get fullUrl(): string {
    return `${STATIC_CONTENT_CUSTOMER.fullUrl}/${this.path}`;
  },
};

export const EDIT_CUSTOMER_FAQ: Iroute = {
  path: 'edit',
  get fullUrl(): string {
    return `${STATIC_CONTENT_CUSTOMER.fullUrl}/${this.path}`;
  },
};

/**
 * @ABS === PROFILE
 */
export const PROFILE: Iroute = {
  path: 'profile',
  get fullUrl(): string {
    return `/${this.path}`;
  },
};
export const PROFILE_EDIT: Iroute = {
  path: 'edit',
  get fullUrl(): string {
    return `${PROFILE.fullUrl}/${this.path}`;
  },
};

export const PROFILE_DETAILS: Iroute = {
  path: 'detail',
  get fullUrl(): string {
    return `${PROFILE.fullUrl}/${this.path}`;
  },
};
export const NOTIFICATION_MANAGEMENT: Iroute = {
  path: 'notification',
  get fullUrl(): string {
    return `/${this.path}`;
  },
};

export const ADD_NOTIFICATION: Iroute = {
  path: 'add-notification',
  get fullUrl(): string {
    return `${NOTIFICATION_MANAGEMENT.fullUrl}/${this.path}`;
  },
};
export const VIEW_NOTIFICATION: Iroute = {
  path: 'view-notification',
  get fullUrl(): string {
    return `${NOTIFICATION_MANAGEMENT.fullUrl}/${this.path}`;
  },
};
export const NOTIFICATIONS: Iroute = {
  path: 'notifications',
  get fullUrl(): string {
    return `${NOTIFICATION_MANAGEMENT.fullUrl}/${this.path}`;
  },
};

/**
 * @ABS === JOB_MANAGEMENT
 */
export const JOB_MANAGEMENT: Iroute = {
  path: 'job-management',
  get fullUrl(): string {
    return `/${this.path}`;
  },
};
export const CREATE_JOB_MANAGEMENT: Iroute = {
  path: 'create-job',
  get fullUrl(): string {
    return `${JOB_MANAGEMENT.fullUrl}/${this.path}`;
  },
};
export const VIEW_JOB_MANAGEMENT: Iroute = {
  path: 'view-job',
  get fullUrl(): string {
    return `${JOB_MANAGEMENT.fullUrl}/${this.path}`;
  },
};
export const EDIT_JOB_MANAGEMENT: Iroute = {
  path: 'edit-job',
  get fullUrl(): string {
    return `${JOB_MANAGEMENT.fullUrl}/${this.path}`;
  },
};
/**
 * @ABS === REQUEST_MANAGEMENT
 */
export const REQUEST_MANAGEMENT: Iroute = {
  path: 'request-management',
  get fullUrl(): string {
    return `/${this.path}`;
  },
};
export const VIEW_MANAGEMENT: Iroute = {
  path: 'details',
  get fullUrl(): string {
    return `${REQUEST_MANAGEMENT.fullUrl}/${this.path}`;

  },
};
export const SERVICE_CATEGORY: Iroute = {
  path: 'category',
  get fullUrl(): string {
    return `${REQUEST_MANAGEMENT.fullUrl}/${this.path}`;

  },
}
export const SERVICE_TYPE: Iroute = {
  path: 'type',
  get fullUrl(): string {
    return `${REQUEST_MANAGEMENT.fullUrl}/${this.path}`;

  },
}

/**
 * @ABS === INCIDENTS_DAMAGE
 */
export const INCIDENTS_DAMAGE: Iroute = {
  path: 'damage',
  get fullUrl(): string {
    return `/${this.path}`;
  },
};
export const INCIDENTS_DAMAGE_DETAILS: Iroute = {
  path: 'details',
  get fullUrl(): string {
    return `${INCIDENTS_DAMAGE.fullUrl}/${this.path}`;
  },
};

/**
 * @ABS === SUPPORT
 */
export const SUPPORT: Iroute = {
  path: 'support',
  get fullUrl(): string {
    return `/${this.path}`;
  },
};