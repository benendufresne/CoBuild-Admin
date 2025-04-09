import { FormArray, FormControl } from "@angular/forms";

export enum STATUS {
  "BLOCKED",
  "UN_BLOCKED",
  "ACTIVE",
  "DELETED",
}

export interface Iroute {
  path: string;
  fullUrl: string;
}

export interface IbreadcrumbRoute {
  path: string;
  label: string;
}

/*------ Api Interface ------*/
export interface ApiResponse<T = {}> {
  data?: T;
  message: string;
  statusCode: number;
  type: string;
  nextHit?: number;
}
/*------ IsTableFiltered Interface ------*/
export interface IsTableFiltered {
  isFiltered:boolean, 
  listName:string,
  values: any
}

export interface IRejectForm {
  message:any
  }

/*------ Login Form Interface ------*/
export interface ILoginForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  deviceToken: FormControl<string | null>;
  deviceId: FormControl<string | null>;
}

/*------ Forgot Form Interface ------*/
export interface IForgotForm {
  email: FormControl<string | null>;
}

/*------ Admin Name Form Interface ------*/
export interface IAdminNameForm {
  name: FormControl<string | null>;
}

/*------ Category Form Interface ------*/
export interface ICategoryForm {
  categoryName: FormControl<string | null>;
  serviceType:FormControl<string | null>;
  issueTypeName:FormControl<string | null>;
  // subIssueName:FormControl<string | null>;
  subIssueName: FormArray<any>;
}

/*------ Category Form Interface ------*/
export interface IServiceTypeForm {
  categoryId: FormControl<string | null>;
  name: FormControl<string | null>;
}
/*------ Reset password Form Interface ------*/
export interface IResetForm {
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
}

/*------ CMS Form Interface ------*/
export interface IEditorForm {
  data: FormControl<string | null>;
}

/*------ Sub-Admin Form Interface ------*/
export interface ISubAdminForm {
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  countryCode: FormControl<string | null>;
  mobileNo: FormControl<string | null>;
  role: FormControl<string | null>;
}
/*------ User Form Interface ------*/
export interface IUserForm {
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  countryCode: FormControl<string | null>;
  mobileNo: FormControl<string | null>;
  address:FormControl<string | null>;
  lat:FormControl<any | null>;
  lng:FormControl<any | null>;

}

/*------ FAQs Form Interface ------*/
export interface IFaqForm {
  question: FormControl<string | null>;
  answer: FormControl<string | null>;
}

export interface IStaticContent {
  contentType: string;
data:any;
  description: string;
  email?:string;
  _id: string;
}

export interface IFaqs {
  created: number;
  question?: string;
  answer?: string;
  _id: string;
}

export interface DialogData {
  title: string;
  message: string;
  btn1:string
}