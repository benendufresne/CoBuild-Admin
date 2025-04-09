import { Routes } from "@angular/router";
import { CHANGE_PASSWORD, DETAILS, EDIT } from "src/app/constants/routes";
import { ProfileComponent } from "./profile.component";

export const ProfileRoutes: Routes = [
  {
    path: "",
    component: ProfileComponent,
    children: [
      { path: "", redirectTo: DETAILS.path, pathMatch: "full" },
      {
        path: DETAILS.path,
        loadChildren: () =>
          import("./pages/basic-details/basic-details.routes").then(
            (m) => m.basicRoutes
          ),
      },
      {
        path: EDIT.path,
        loadChildren: () =>
          import("./pages/edit-profile/edit-profile.routes").then(
            (m) => m.editRoutes
          ),
      },
      // {
      //   path: CHANGE_PASSWORD.path,
      //   loadChildren: () =>
      //     import("./pages/change-password/change-password.routes").then(
      //       (m) => m.changepasswordRoutes
      //     ),
      // },
      // {
      //   path: CHANGE_PASSWORD.path,
      //   loadComponent: () =>
      //     import("./pages/change-password/change-password.component").then(
      //       (c) =>c.ChangePasswordComponent          ),
      // },
    ],
  },
];
