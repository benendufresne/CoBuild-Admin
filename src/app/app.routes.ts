import { Routes } from '@angular/router';
import { ACCOUNT, STATIC_CONTENT_PUBLIC  } from './constants/routes';
import { LogInGuard } from './services/guards/log-in/log-in.guard';
import { AuthGuard } from './services/guards/auth-guard/auth-guard.guard';
import { COMMON_KEYS } from './constants/constant';

export const ROUTES: Routes = [
  { path: "", redirectTo: ACCOUNT.path, pathMatch: "full" },
  {
    path: ACCOUNT.path,
    loadChildren: () => import("./features/accounts/accounts.routes").then((c) => c.ACCOUNT_ROUTES),
    canActivate: [LogInGuard],
  },
  {
    path: `${STATIC_CONTENT_PUBLIC.path}/:${COMMON_KEYS.CMS_PAGE}`,
    loadComponent: () => import("./components/public-cms/public-cms.component").then((c) => c.PublicCmsComponent)
  },
  {
    path: '',
    loadChildren: () => import("./layouts/layouts.routes").then((c) => c.LAYOUT_ROUTES),
    canActivate: [AuthGuard],
  },
  {
    path: "**",
    loadComponent: () => import("./features/not-found/not-found.component").then((c) => c.NotFoundComponent),
  },
];

