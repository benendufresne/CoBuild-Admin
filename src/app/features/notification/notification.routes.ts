import { Routes } from "@angular/router";
import { NotificationComponent } from "./notification.component";
import { ADD_NOTIFICATION, NOTIFICATIONS, VIEW_NOTIFICATION } from "src/app/constants/routes";
import { STRING_CONST } from "src/app/constants/string";

export const NotificationRoutes: Routes = [
  {
    path: "",
    component: NotificationComponent,
    children: [
      {
        path: "",
        loadComponent: () =>
          import(
            "./pages/notification-listing/notification-listing.component"
          ).then((c) => c.NotificationListingComponent),
      },

      {
        path: ADD_NOTIFICATION.path,
        loadComponent: () =>
          import("./pages/add-notification/add-notification.component").then(
            (c) => c.AddNotificationComponent
          ),
      },
      {
        path: NOTIFICATIONS.path,
        loadComponent: () =>
          import("./pages/header-notification-listing/header-notification-listing.component").then(
            (c) => c.HeaderNotificationListingComponent
          ),
      },
      {
        path: `${VIEW_NOTIFICATION.path}/:${STRING_CONST.NOTIFICATION_ID}`,
        loadComponent: () => import("./pages/view-notification/view-notification.component").then((c) => c.ViewNotificationComponent),
        data:{viewOnly: true}
      }
    ],
  },
];
