import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsRoutingModule } from './accounts-routing.module';
import { AccountComponent } from './common/account/account.component';
import { AddEditAccountComponent } from './common/account/add-edit-account/add-edit-account.component';
import { TransactionsComponent } from './common/transactions/transactions.component';
import { ExpenseAccountComponent } from './expense-account/expense-account.component';
import { IncomeAccountComponent } from './income-account/income-account.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { PrimengModule } from 'src/app/shared/primeng/primeng.module';


@NgModule({
  declarations: [
    IncomeAccountComponent,
    ExpenseAccountComponent,
    AccountComponent,
    AddEditAccountComponent,
    TransactionsComponent,
  ],
  imports: [
    CommonModule,
    AccountsRoutingModule,
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
  ]
})
export class AccountsModule { }
