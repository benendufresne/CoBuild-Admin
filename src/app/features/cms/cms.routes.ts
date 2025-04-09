import { Routes } from "@angular/router";
import { CmsComponent } from "./cms.component";
import { ABOUT_US_CUSTOMER, FAQS_CUSTOMER, PRIVACY_POLICY_CUSTOMER, TERMS_CONDITIONS_CUSTOMER } from "src/app/constants/routes";

export const CmsRoutes: Routes = [
  {
    path: "",
    component: CmsComponent,
    children: [
      { path: "", redirectTo: ABOUT_US_CUSTOMER.path, pathMatch: "full" },
      /**
       * @CUSTOMER_CMS_ROUTES
      */
      {
        path: PRIVACY_POLICY_CUSTOMER.path,
        loadComponent: () =>
          import("./pages/privacy-policy/privacy-policy.component").then(
            (c) => c.PrivacyPolicyComponent
          ),
      },
      {
        path: TERMS_CONDITIONS_CUSTOMER.path,
        loadComponent: () =>
          import("./pages/terms-conditions/terms-conditions.component").then(
            (c) => c.TermsConditionsComponent
          ),
      },

      {
        path: FAQS_CUSTOMER.path,
        loadComponent: () =>
          import("./pages/faqs/faqs.component").then((c) => c.FaqsComponent),
      },
      {
        path: ABOUT_US_CUSTOMER.path,
        loadComponent: () =>
          import("./pages/about-us/about-us.component").then((c) => c.AboutUsComponent),
      },
    ],
  },
];
