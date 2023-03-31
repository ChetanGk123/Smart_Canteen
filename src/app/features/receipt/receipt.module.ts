import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReceiptRoutingModule } from './receipt-routing.module';
import { ReceiptComponent } from './receipt.component';
import { NewMembershipReceiptComponent } from './new-membership-receipt/new-membership-receipt.component';
import { TransactionReceiptComponent } from './transaction-receipt/transaction-receipt.component';
import { ActiveMembershipReceiptComponent } from './active-membership-receipt/active-membership-receipt.component';
import { PrimengModule } from 'src/app/shared/primeng/primeng.module';
import { ExpenseReceiptComponent } from './expense-receipt/expense-receipt.component';
import { PosSaleComponent } from './pos-sale/pos-sale.component';
import { PosSummaryComponent } from './pos-summary/pos-summary.component';
import { MembershipSummaryReportComponent } from './membership-summary-report/membership-summary-report.component';
import { TransactionsListComponent } from './transactions-list/transactionsList.component';
import { PosSaleHistoryListComponent } from './pos-sale-history-list/pos-sale-history-list.component';
import { AccountTransactionsComponent } from './account-transactions/account-transactions.component';

@NgModule({
    declarations: [
        ReceiptComponent,
        NewMembershipReceiptComponent,
        TransactionReceiptComponent,
        ActiveMembershipReceiptComponent,
        ExpenseReceiptComponent,
        PosSaleComponent,
        PosSummaryComponent,
        MembershipSummaryReportComponent,
        TransactionsListComponent,
        PosSaleHistoryListComponent,
        AccountTransactionsComponent,
    ],
    imports: [CommonModule, ReceiptRoutingModule, PrimengModule],
    exports: [NewMembershipReceiptComponent],
})
export class ReceiptModule {}
