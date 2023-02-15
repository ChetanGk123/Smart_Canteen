
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MemberService } from 'src/app/core/services/MemberService/member.service';
import { AccountTransferComponent } from '../../accounts/account-transfer/account-transfer.component';
// import { AccountTransferComponent } from '../../account/account-transfer/account-transfer.component';
import { ExpenseReceiptComponent } from '../../receipt/expense-receipt/expense-receipt.component';
import { TransactionReceiptComponent } from '../../receipt/transaction-receipt/transaction-receipt.component';
import { AddEditTransactionComponent } from './add-edit-transaction/add-edit-transaction.component';

@Component({
    selector: 'app-transaction-history',
    templateUrl: './transaction-history.component.html',
    styleUrls: ['./transaction-history.component.scss']
  })
  export class TransactionHistoryComponent implements OnInit {
    //     @ViewChild("myinput") myInputField: ElementRef;
    // ngAfterViewInit() {
    // this.myInputField.nativeElement.focus();
    // }
    loading: boolean = false;
    displayTransaction: boolean = false;
    Data: any[] = [];
    selectedProduct: any;
    items: MenuItem[];
    datePipe: DatePipe = new DatePipe('en-US');
    start_date: any;
    end_date: any;
    User:any
    transaction_range:any

    constructor(
        public apiService: ApiService,
        public messageService: MessageService,
        public dialogService: DialogService,
        public memberService: MemberService,
        public router: Router,
    ) {}

    ngOnInit() {

        //this.User = this.memberService.getUserData().user_role
        this.transaction_range = 0
        // this.transaction_range = this.memberService.getSettings()?.transaction_range??0

        this.end_date = new Date().toISOString().substring(0, 10);
        this.start_date = this.datePipe.transform(
            new Date().setDate(
                new Date().getDate() -
                    this.transaction_range
            ),
            'yyyy-MM-dd'
        );
        this.items = [
            {
                label: 'View',
                icon: 'pi pi-fw pi-eye',
                command: () => this.view(),
            },
            {
                label: 'Print',
                icon: 'pi pi-fw pi-print',
                command: () => this.print(),
            },
        ];

        this.loadData();
    }

    ConvertStringToNumber(input: string) {
        var numeric = Number(input);
        return numeric;
    }

    loadData() {
        this.loading = true;
        var Data = {
            start_date: this.start_date,
            end_date: this.end_date,
        };
        this.apiService
            .postTypeRequest(`transaction_data/ALL_TRANSACTIONS`, Data)
            .toPromise()
            .then((result: any) => {
                this.loading = false;
                if (result.result) {
                    this.Data = result.data;
                }
            })
            .finally(() => {
                this.loading = false;
            });
    }

    accountTransfer() {
        var sourceUrl = 'INCOME_ACCOUNT_HEAD';
        var destinationUrl = 'EXPENSE_ACCOUNT_HEAD';

        const ref = this.dialogService.open(AccountTransferComponent, {
            data: {
                sourceUrl: sourceUrl,
                destinationUrl: destinationUrl,
                url: 'transaction_ops/EXPENSE_ENTRY',
            },
            header: `Expense Entry`,
            width: '60%',
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.ngOnInit();
            }
        });
    }

    clear(table: Table) {
        table.clear();
    }

    add() {
        var newMembershipType: any;
        const ref = this.dialogService.open(AddEditTransactionComponent, {
            data: newMembershipType,
            header: `Transaction Details`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-5',
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.ngOnInit();
            }
        });
    }

    view() {
        //
        this.displayTransaction = true;
    }

    print() {
        var Data = {
            full_name: this.selectedProduct.full_name,
            card_number: this.selectedProduct.card_number,
        };
        if (Data.card_number) {
            this.dialogService.open(TransactionReceiptComponent, {
                data: { txnData: this.selectedProduct, memberData: Data },
                header: `Transaction Details`,
                styleClass: 'w-8  xs:w-12 sm:w-12 md:w-10 lg:w-5',
            });
        } else {
            this.dialogService.open(ExpenseReceiptComponent, {
                data: { txnData: this.selectedProduct },
                header: `Transaction Details`,
                styleClass: 'w-8  xs:w-12 sm:w-12 md:w-10 lg:w-5',
            });
        }
    }

    openProfile() {
        this.memberService.setMemberData(this.selectedProduct);
        this.router.navigate(['members/memberProfile']);
    }
}
