import { Routes } from "@angular/router";
import { STRING_CONST } from "src/app/constants/string";
import { IncidentsDamageComponent } from "./incidents-damage.component";
import { INCIDENTS_DAMAGE_DETAILS } from "src/app/constants/routes";

export const REPORT_DAMAGE_ROUTES: Routes = [
  {
    path: "",
    component: IncidentsDamageComponent,
    children: [
        {
            path: "",
            loadComponent: () =>
              import("./_pages/listing/listing.component").then((c) => c.ListingComponent),
          },
          {
            path: `${INCIDENTS_DAMAGE_DETAILS.path}/:${STRING_CONST.DAMAGE_ID}`,
            loadComponent: () =>
              import("./_pages/damage-details/damage-details.component").then((c) => c.DamageDetailsComponent),
              data:{viewOnly: true}
          }
    ],
  },
];
