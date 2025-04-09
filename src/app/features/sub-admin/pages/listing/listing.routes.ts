import { Routes } from "@angular/router";
import { ListingComponent } from "./listing.component";
import {
  ADD_MANAGE_ROLES,
  CREATE_SUBADMIN,
  EDIT_MANAGE_ROLES,
  EDIT_SUBADMIN,
  MANAGE_ROLES,
  SUB_ADMIN_MANAGEMENT,
  VIEW_MANAGE_ROLES,
  VIEW_SUBADMIN,
} from "src/app/constants/routes";
export const Listing_Role_Routes: Routes = [
  {
    path: "",
    component: ListingComponent,
    children: [
      { path: "", redirectTo: SUB_ADMIN_MANAGEMENT.path, pathMatch: "full" },
      {
        path: SUB_ADMIN_MANAGEMENT.path,
        loadComponent: () =>
          import("../sub-admin-listing/sub-admin-listing.component").then(
            (m) => m.SubAdminListingComponent
          ),
      },
      {
        path: MANAGE_ROLES.path,
        loadComponent: () =>
          import("../role-listing/role-listing.component").then(
            (m) => m.RoleListingComponent
          ),
      },
      {
        path: `${SUB_ADMIN_MANAGEMENT.path}/${VIEW_SUBADMIN.path}/:adminId`,
        loadComponent: () =>
          import("../sub-admin-details/sub-admin-details.component").then(
            (c) => c.SubAdminDetailsComponent
          ),
      },
      {
        path: `${SUB_ADMIN_MANAGEMENT.path}/${CREATE_SUBADMIN.path}`,
        loadChildren: () =>
          import("../sub-admin-view/sub-admin-view.routes").then(
            (c) => c.Sub_Admin_Routes
          ),
      },
      {
        path: `${SUB_ADMIN_MANAGEMENT.path}/${EDIT_SUBADMIN.path}/:adminId`,
        loadChildren: () =>
          import("../sub-admin-view/sub-admin-view.routes").then(
            (c) => c.Sub_Admin_Routes
          ),
      },
      {
        path: `${MANAGE_ROLES.path}/${VIEW_MANAGE_ROLES.path}/:adminId`,
        loadChildren: () =>
          import("../view-role/view-role.routes").then(
            (c) => c.View_Role_Routes
          ),
      },
      {
        path: `${MANAGE_ROLES.path}/${ADD_MANAGE_ROLES.path}`,
        loadChildren: () =>
          import("../add-role/add-role.routes").then(
            (c) => c.Add_Role_Routes
          ),
      },
      {
        path: `${MANAGE_ROLES.path}/${EDIT_MANAGE_ROLES.path}/:adminId`,
        loadChildren: () =>
          import("../add-role/add-role.routes").then(
            (m) => m.Add_Role_Routes
          ),
      },
    ],
  },
];
