import { Routes } from "@angular/router";
import { SubAdminComponent } from "./sub-admin.component";
import {
  ADD_MANAGE_ROLES,
  CREATE_SUBADMIN,
  EDIT_MANAGE_ROLES,
  EDIT_SUBADMIN,
  SUB_ADMIN_MANAGEMENT,
  VIEW_MANAGE_ROLES,
  VIEW_SUBADMIN,
} from "src/app/constants/routes";

export const SubAdminRoutes: Routes = [
  {
    path: "",
    component: SubAdminComponent,
    children: [
      // {
      //   path: "",
      //   loadChildren: () =>
      //     import("./pages/listing/listing.routes").then(
      //       (c) => c.Listing_Role_Routes
      //     ),
      // },
      // {
      //   path: `${VIEW_MANAGE_ROLES.path}/:adminId`,
      //   loadChildren: () =>
      //     import(
      //       "./pages/view-role/view-role.routes"
      //     ).then((c) => c.View_Role_Routes),
      // },
      // {
      //   path: ADD_MANAGE_ROLES.path,
      //   loadChildren: () =>
      //     import("./pages/add-role/add-role.routes").then(
      //       (c) => c.Add_Role_Routes
      //     ),
      // },
      // {
      //   path: `${EDIT_MANAGE_ROLES.path}/:adminId`,
      //   loadChildren: () =>
      //     import("./pages/add-role/add-role.routes").then(
      //       (m) => m.Add_Role_Routes
      //     ),
      // },
      // {
      //   path: CREATE_SUBADMIN.path,
      //   loadChildren: () =>
      //     import("./pages/sub-admin-view/sub-admin-view.routes").then(
      //       (c) => c.Sub_Admin_Routes
      //     ),
      // },
      // {
      //   path: `${EDIT_SUBADMIN.path}/:adminId`,
      //   loadChildren: () =>
      //     import("./pages/sub-admin-view/sub-admin-view.routes").then(
      //       (c) => c.Sub_Admin_Routes
      //     ),
      // },
      // {
      //   path: `${SUB_ADMIN_MANAGEMENT.path}/${VIEW_SUBADMIN.path}/:adminId`,
      //   loadComponent: () =>
      //     import("./pages/sub-admin-details/sub-admin-details.component").then(
      //       (c) => c.SubAdminDetailsComponent
      //     ),
      // },
    ],
  },
];
