import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionsRoutingModule } from './transactions-routing.module';
import { PrimengModule } from 'src/app/shared/primeng/primeng.module';
import { AddEditTransactionComponent } from './transaction-history/add-edit-transaction/add-edit-transaction.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { CorePipesModule } from 'src/app/core/pipes/pipes.module';

@NgModule({
    declarations: [
        AddEditTransactionComponent,
        TransactionHistoryComponent,
    ],
    imports: [
        CommonModule,
        TransactionsRoutingModule,
        CorePipesModule,
        PrimengModule,
        FormsModule,
        ReactiveFormsModule,
    ],
})
export class TransactionsModule {}
