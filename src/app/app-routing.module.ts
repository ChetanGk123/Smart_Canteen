import { PreloadAllModules, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AccessComponent } from './pages/access/access.component';
import { ErrorComponent } from './pages/error/error.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { LandingComponent } from './pages/landing/landing.component';
@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                { path: '', pathMatch: 'full', component: LandingComponent },
                {
                    path: 'member',
                    loadChildren: () =>
                        import('./modules/members/members.module').then(
                            (m) => m.MembersModule
                        ),
                },
                {
                    path: 'app',
                    loadChildren: () =>
                        import('./modules/application/application.module').then(
                            (m) => m.ApplicationModule
                        ),
                    // component: AppMainComponent,
                    // children: [
                    //     {
                    //         path: '',
                    //         pathMatch: 'full',
                    //         redirectTo: 'attendance',
                    //     },
                    //     {
                    //         path: 'dashboard',
                    //         canActivate: [AuthGuard],
                    //         component: DashboardComponent,
                    //     },
                    //     {
                    //         path: 'attendance',
                    //         canActivate: [AuthGuard],
                    //         loadChildren: () =>
                    //             import(
                    //                 './features/attendance/attendance.module'
                    //             ).then((m) => m.AttendanceModule),
                    //     },
                    //     {
                    //         path: 'canteens',
                    //         canActivate: [AuthGuard],
                    //         loadChildren: () =>
                    //             import(
                    //                 './features/canteens/canteens.module'
                    //             ).then((m) => m.CanteensModule),
                    //     },
                    //     {
                    //         path: 'counters',
                    //         canActivate: [AuthGuard],
                    //         loadChildren: () =>
                    //             import(
                    //                 './features/counters/counters.module'
                    //             ).then((m) => m.CountersModule),
                    //     },
                    //     {
                    //         path: 'cards',
                    //         canActivate: [AuthGuard],
                    //         loadChildren: () =>
                    //             import('./features/cards/cards.module').then(
                    //                 (m) => m.CardsModule
                    //             ),
                    //     },
                    //     {
                    //         path: 'members',
                    //         canActivate: [AuthGuard],
                    //         loadChildren: () =>
                    //             import(
                    //                 './features/members/members.module'
                    //             ).then((m) => m.MembersModule),
                    //     },
                    //     {
                    //         path: 'memberships',
                    //         canActivate: [AuthGuard],
                    //         loadChildren: () =>
                    //             import(
                    //                 './features/memberships/memberships.module'
                    //             ).then((m) => m.MembershipsModule),
                    //     },
                    //     {
                    //         path: 'accounts',
                    //         canActivate: [AuthGuard],
                    //         loadChildren: () =>
                    //             import(
                    //                 './features/accounts/accounts.module'
                    //             ).then((m) => m.AccountsModule),
                    //     },
                    //     {
                    //         path: 'receipt',
                    //         canActivate: [AuthGuard],
                    //         loadChildren: () =>
                    //             import(
                    //                 './features/receipt/receipt.module'
                    //             ).then((m) => m.ReceiptModule),
                    //     },
                    //     {
                    //         path: 'utils',
                    //         canActivate: [AuthGuard],
                    //         loadChildren: () =>
                    //             import('./features/utils/utils.module').then(
                    //                 (m) => m.UtilsModule
                    //             ),
                    //     },
                    //     {
                    //         path: 'pos',
                    //         canActivate: [AuthGuard],
                    //         loadChildren: () =>
                    //             import('./features/pos/pos.module').then(
                    //                 (m) => m.PosModule
                    //             ),
                    //     },
                    //     {
                    //         path: 'posSale',
                    //         canActivate: [AuthGuard],
                    //         loadChildren: () =>
                    //             import(
                    //                 './features/posSale/posSale.module'
                    //             ).then((m) => m.PosSaleModule),
                    //     },
                    //     {
                    //         path: 'transactions',
                    //         canActivate: [AuthGuard],
                    //         loadChildren: () =>
                    //             import(
                    //                 './features/transactions/transactions.module'
                    //             ).then((m) => m.TransactionsModule),
                    //     },
                    //     {
                    //         path: 'settings',
                    //         canActivate: [AuthGuard],
                    //         loadChildren: () =>
                    //             import(
                    //                 './features/settings/settings.module'
                    //             ).then((m) => m.SettingsModule),
                    //     },
                    //     {
                    //         path: 'meal',
                    //         canActivate: [AuthGuard],
                    //         loadChildren: () =>
                    //             import('./features/meal/meal.module').then(
                    //                 (m) => m.MealModule
                    //             ),
                    //     },
                    // ],
                },

                //{ path: 'login', component: LoginComponent },
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
