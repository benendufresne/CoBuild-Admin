import { Routes } from "@angular/router";
import {
  CREATE_SUBADMIN,
  EDIT_SUBADMIN,
  SUB_ADMIN_MANAGEMENT,
  VIEW_SUBADMIN,
} from "src/app/constants/routes";
import { SubAdminListingComponent } from "./sub-admin-listing.component";

export const SubAdminListingRoutes: Routes = [
  {
    path: "",
    component: SubAdminListingComponent,
    children: [
      // {
      //   path: CREATE_SUBADMIN.path,
      //   loadChildren: () =>
      //     import("../sub-admin-view/sub-admin-view.routes").then(
      //       (c) => c.Sub_Admin_Routes
      //     ),
      // },
      // {
      //   path: `${EDIT_SUBADMIN.path}/:adminId`,
      //   loadChildren: () =>
      //     import("../sub-admin-view/sub-admin-view.routes").then(
      //       (c) => c.Sub_Admin_Routes
      //     ),
      // },
      // {
      //   path: `${SUB_ADMIN_MANAGEMENT.path}/${VIEW_SUBADMIN.path}/:adminId`,
      //   loadComponent: () =>
      //     import("../sub-admin-details/sub-admin-details.component").then(
      //       (c) => c.SubAdminDetailsComponent
      //     ),
      // },
    ],
  },
];
