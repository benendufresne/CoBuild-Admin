import { Routes } from "@angular/router";
import { UserManagementComponent } from "./user-management.component";
import { CREATE_USER, EDIT_USER, USER_MANAGEMENT, USER_MANAGEMENT_DETAILS } from "src/app/constants/routes";
import { STRING_CONST } from "src/app/constants/string";

export const UM_Routes: Routes = [
  {
    path: "",
    component: UserManagementComponent,
    children: [
      {
        path: "",
        loadComponent: () => import("./pages/listing/listing.component").then((c) => c.ListingComponent),
      },
      {
        path: CREATE_USER.path,
        loadComponent: () => import("./pages/add-edit/add-edit.component").then((c) => c.AddEditComponent),
      },
      {
        path: `${EDIT_USER.path}/:${STRING_CONST.USER_ID}`,
        loadComponent: () => import("./pages/add-edit/add-edit.component").then((c) => c.AddEditComponent),
      },
      {
        path: `${USER_MANAGEMENT_DETAILS.path}/:${STRING_CONST.USER_ID}`,
        loadComponent: () => import("./pages/add-edit/add-edit.component").then((c) => c.AddEditComponent),
        data:{viewOnly: true}

      },
    ],
  },
];
