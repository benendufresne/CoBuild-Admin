import { Routes } from "@angular/router";
import { JobManagementComponent } from "./job-management.component";
import { CREATE_JOB_MANAGEMENT, EDIT_JOB_MANAGEMENT, VIEW_JOB_MANAGEMENT } from "src/app/constants/routes";
import { STRING_CONST } from "src/app/constants/string";

export const JOBRoutes: Routes = [
  {
    path: "",
    component: JobManagementComponent,
    children: [
        {
            path: "",
            loadComponent: () =>
              import("./pages/listing/listing.component").then((c) => c.ListingComponent),
          },
          {
            path: `${VIEW_JOB_MANAGEMENT.path}/:${STRING_CONST.JOB_ID}`,
            loadComponent: () =>
              import("./pages/view-job/view-job.component").then((c) => c.ViewJobComponent),
          },
          {
            path: CREATE_JOB_MANAGEMENT.path,
            loadComponent: () =>
              import("./pages/create-job/create-job.component").then((c) => c.CreateJobComponent),
          },
          {
            path:`${EDIT_JOB_MANAGEMENT.path}/:${STRING_CONST.JOB_ID}`,
            loadComponent: () =>
              import("./pages/create-job/create-job.component").then((c) => c.CreateJobComponent),
          },
    ],
  },
];
