import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AppMainComponent } from './layout/app.main.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
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
                    ],
                },
                { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationRoutingModule { }
