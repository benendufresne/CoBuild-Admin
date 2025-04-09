import { Routes } from "@angular/router";
import { SupportComponent } from "./support.component";

export const SUPPORT_ROUTES: Routes = [
  {
    path: "",
    component: SupportComponent,
    children: [
      {
        path: "",
        loadComponent: () =>
          import("./pages/chat-list/chat-list.component").then(
            (c) => c.ChatListComponent
          ),
      },
      {
        path: "",
        loadComponent: () =>
          import("./pages/chat-body/chat-body.component").then(
            (c) => c.ChatBodyComponent
          ),
      },
    ],
  },
];
