import { Routes } from "@angular/router";
import { RequestManagementComponent } from "./request-management.component";
import { SERVICE_CATEGORY, SERVICE_TYPE, VIEW_MANAGEMENT } from "src/app/constants/routes";
import { STRING_CONST } from "src/app/constants/string";

export const REQUESTRoutes: Routes = [
  {
    path: "",
    component: RequestManagementComponent,
    children: [
        {
            path: "",
            loadComponent: () =>
              import("./pages/listing/listing.component").then((c) => c.ListingComponent),
          },
    
          {
            path: `${SERVICE_CATEGORY.path}`,
            loadChildren: () =>
              import("../request-management/pages/category/category.routes").then((r) => r.Category_Routes),
          },

          {
            path: `${SERVICE_TYPE.path}`,
            loadComponent: () =>
              import("./pages/service-type/service-type.component").then((c) => c.ServiceTypeComponent),
          },
          {
            path: `${VIEW_MANAGEMENT.path}/:${STRING_CONST.REQUEST_ID}`,
            loadComponent: () =>
              import("./pages/details/details.component").then((c) => c.DetailsComponent),
              data:{viewOnly: true}
          }
    ],
  },
];
