import { Routes } from "@angular/router";
import {
  CHANGE_PASSWORD,
  DASHBOARD,
  INCIDENTS_DAMAGE,
  JOB_MANAGEMENT,
  NOTIFICATION_MANAGEMENT,
  NOTIFICATIONS,
  PROFILE,
  REQUEST_MANAGEMENT,
  ROLES_ACCESS,
  STATIC_CONTENT_CUSTOMER,
  SUPPORT,
  USER_MANAGEMENT,
} from "src/app/constants/routes";
import { LayoutsComponent } from "./layouts.component";
import { ViewPermissionGuard } from "../services/guards/view-permission/view-permission.guard";
import { MODULE_ID_OF } from "../constants/messages";

export const LAYOUT_ROUTES: Routes = [
  {
    path: "",
    component: LayoutsComponent,
    children: [
      { path: "", redirectTo: DASHBOARD.path, pathMatch: "full" },
      {
        path: DASHBOARD.path,
        loadChildren: () => import("../features/dashboard/dashboard.routes").then((c) => c.DB_ROUTES),
        canActivate: [ViewPermissionGuard],
        data: { moduleId: MODULE_ID_OF.DASHBOARD },
      },
      {
        path: USER_MANAGEMENT.path,
        loadChildren: () => import("../features/user-management/user.routes").then((m) => m.UM_Routes),
        canActivate: [ViewPermissionGuard],
        data: { moduleId: MODULE_ID_OF.USER_MANAGEMENT },
      },
      {
        path: CHANGE_PASSWORD.path,
        loadComponent: () =>
          import("../features/profile/pages/change-password/change-password.component").then(
            (c) =>c.ChangePasswordComponent),
      },
      {
        path: STATIC_CONTENT_CUSTOMER.path,
        loadChildren: () => import("../features/cms/cms.routes").then((r) => r.CmsRoutes),
        canActivate: [ViewPermissionGuard],
        data: { moduleId: MODULE_ID_OF.STATIC_CONTENT_MANAGEMENT },
      },
      {
        path: PROFILE.path,
        loadChildren: () => import("../features/profile/profile.routes").then((r) => r.ProfileRoutes),
      },
      {
        path: JOB_MANAGEMENT.path,
        loadChildren: () => import("../features/job-management/job-management.routes").then((r) => r.JOBRoutes),
        canActivate: [ViewPermissionGuard],
        data: { moduleId: MODULE_ID_OF.JOB_MANAGEMENT },
      },
      {
        path: REQUEST_MANAGEMENT.path,
        loadChildren: () => import("../features/request-management/request-management.routes").then((r) => r.REQUESTRoutes),
        canActivate: [ViewPermissionGuard],
        data: { moduleId:  MODULE_ID_OF.REQUEST_MANAGEMENT },
      },
      {
        path: ROLES_ACCESS.path,
        loadChildren: () => import("../features/sub-admin/pages/listing/listing.routes").then((r) => r.Listing_Role_Routes),

        canActivate: [ViewPermissionGuard],
        data: { moduleId:MODULE_ID_OF.SUB_ADMIN_MANAGEMENT },
      },
      {
        path: INCIDENTS_DAMAGE.path,
        loadChildren: () => import("../features/incidents-damage/incidents-damage.routes").then((r) => r.REPORT_DAMAGE_ROUTES),

        canActivate: [ViewPermissionGuard],
        data: { moduleId: MODULE_ID_OF.REPORT_DAMAGE_MANAGEMENT },
      },
      {
        path: NOTIFICATION_MANAGEMENT.path,
        loadChildren: () => import("../features/notification/notification.routes").then((r) => r.NotificationRoutes),
        canActivate: [ViewPermissionGuard],
        data: { moduleId: MODULE_ID_OF.NOTIFICATION_MANAGEMENT },
      },
      {
        path: SUPPORT.path,
        loadChildren: () => import("../features/support/support.routes").then((r) => r.SUPPORT_ROUTES),
        canActivate: [ViewPermissionGuard],
        data: { moduleId: MODULE_ID_OF.SUPPORT },
      },
    ],
  },
];
