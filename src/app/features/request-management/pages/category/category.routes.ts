import { Routes } from "@angular/router";
import { CategoryComponent } from "./category.component";

export const Category_Routes: Routes = [
  {
    path: "",
    component: CategoryComponent,
    children: [
      {
        path: "",
        loadComponent: () => import("./pages/listing/listing.component").then((c) => c.ListingComponent),
      },
    ],
  },
];
