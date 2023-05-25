import { PreloadAllModules, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AppMainComponent } from './layout/app.main.component';
import { AccessComponent } from './pages/access/access.component';
import { ErrorComponent } from './pages/error/error.component';
import { LoginComponent } from './pages/login/login.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { LandingComponent } from './features/landing/landing.component';
@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: '',
                    component: AppMainComponent,
                    children: [
                        {
                            path: '',
                            pathMatch: 'full',
                            redirectTo: 'dashboard',
                        },
                        {
                            path: 'dashboard',
                            canActivate: [AuthGuard],
                            component: DashboardComponent,
                        },
                        {
                            path: 'canteens',
                            canActivate: [AuthGuard],
                            loadChildren: () =>
                                import(
                                    './features/canteens/canteens.module'
                                ).then((m) => m.CanteensModule),
                        },
                        {
                            path: 'counters',
                            canActivate: [AuthGuard],
                            loadChildren: () =>
                                import(
                                    './features/counters/counters.module'
                                ).then((m) => m.CountersModule),
                        },
                        {
                            path: 'cards',
                            canActivate: [AuthGuard],
                            loadChildren: () =>
                                import('./features/cards/cards.module').then(
                                    (m) => m.CardsModule
                                ),
                        },
                        {
                            path: 'members',
                            canActivate: [AuthGuard],
                            loadChildren: () =>
                                import(
                                    './features/members/members.module'
                                ).then((m) => m.MembersModule),
                        },
                        {
                            path: 'memberships',
                            canActivate: [AuthGuard],
                            loadChildren: () =>
                                import(
                                    './features/memberships/memberships.module'
                                ).then((m) => m.MembershipsModule),
                        },
                        {
                            path: 'accounts',
                            canActivate: [AuthGuard],
                            loadChildren: () =>
                                import(
                                    './features/accounts/accounts.module'
                                ).then((m) => m.AccountsModule),
                        },
                        {
                            path: 'receipt',
                            canActivate: [AuthGuard],
                            loadChildren: () =>
                                import(
                                    './features/receipt/receipt.module'
                                ).then((m) => m.ReceiptModule),
                        },
                        {
                            path: 'utils',
                            canActivate: [AuthGuard],
                            loadChildren: () =>
                                import('./features/utils/utils.module').then(
                                    (m) => m.UtilsModule
                                ),
                        },
                        {
                            path: 'pos',
                            canActivate: [AuthGuard],
                            loadChildren: () =>
                                import('./features/pos/pos.module').then(
                                    (m) => m.PosModule
                                ),
                        },
                        {
                            path: 'posSale',
                            canActivate: [AuthGuard],
                            loadChildren: () =>
                                import(
                                    './features/posSale/posSale.module'
                                ).then((m) => m.PosSaleModule),
                        },
                        {
                            path: 'transactions',
                            canActivate: [AuthGuard],
                            loadChildren: () =>
                                import(
                                    './features/transactions/transactions.module'
                                ).then((m) => m.TransactionsModule),
                        },
                        {
                            path: 'settings',
                            canActivate: [AuthGuard],
                            loadChildren: () =>
                                import(
                                    './features/settings/settings.module'
                                ).then((m) => m.SettingsModule),
                        },
                        {
                            path: 'meal',
                            canActivate: [AuthGuard],
                            loadChildren: () =>
                                import('./features/meal/meal.module').then(
                                    (m) => m.MealModule
                                ),
                        },
                    ],
                },
                { path: 'pages/landing', component: LandingComponent },
                { path: 'login', component: LoginComponent },
                { path: 'pages/error', component: ErrorComponent },
                { path: 'pages/notfound', component: NotfoundComponent },
                { path: 'pages/access', component: AccessComponent },
                { path: '**', redirectTo: 'pages/notfound' },
            ],
            {
                preloadingStrategy: PreloadAllModules,
                // scrollPositionRestoration: 'enabled',
                // anchorScrolling: 'enabled',
            }
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
