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
import { AccountTransferComponent } from './account-transfer/account-transfer.component';
import { CommodityAccountComponent } from './commodity-account/commodity-account.component';

@NgModule({
    declarations: [
        IncomeAccountComponent,
        ExpenseAccountComponent,
        AccountTransferComponent,
        AccountComponent,
        AddEditAccountComponent,
        TransactionsComponent,
        CommodityAccountComponent,
    ],
    imports: [
        CommonModule,
        AccountsRoutingModule,
        PrimengModule,
        FormsModule,
        ReactiveFormsModule,
        NgxMaskModule.forRoot(),
    ],
})
export class AccountsModule {}
