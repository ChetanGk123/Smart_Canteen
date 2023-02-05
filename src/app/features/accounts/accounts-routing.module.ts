import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsComponent } from './common/transactions/transactions.component';
import { ExpenseAccountComponent } from './expense-account/expense-account.component';
import { IncomeAccountComponent } from './income-account/income-account.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'incomeAccount',
        pathMatch: 'full',
    },
    {
        path: 'incomeAccount',
        component: IncomeAccountComponent,
    },
    {
        path: 'expenseAccount',
        component: ExpenseAccountComponent,
    },
    {
        path: 'accountTransactions',
        component: TransactionsComponent,
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule { }
