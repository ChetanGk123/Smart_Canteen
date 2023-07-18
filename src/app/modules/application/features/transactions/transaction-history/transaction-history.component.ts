import { DatePipe } from '@angular/common';
import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import * as XLSX from 'xlsx';
import moment from 'moment';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MemberService } from 'src/app/core/services/MemberService/member.service';
import { AccountTransferComponent } from '../../accounts/account-transfer/account-transfer.component';
import { CounterService } from '../../counters/counter.service';
// import { AccountTransferComponent } from '../../account/account-transfer/account-transfer.component';
import { ExpenseReceiptComponent } from '../../receipt/expense-receipt/expense-receipt.component';
import { TransactionReceiptComponent } from '../../receipt/transaction-receipt/transaction-receipt.component';
import { TransactionsListComponent } from '../../receipt/transactions-list/transactionsList.component';
import { AddEditTransactionComponent } from './add-edit-transaction/add-edit-transaction.component';
import { BulkRecharge } from '../../members/bulk-recharge';

@Component({
    selector: 'app-transaction-history',
    templateUrl: './transaction-history.component.html',
    styleUrls: ['./transaction-history.component.scss'],
})
export class TransactionHistoryComponent implements OnInit, OnDestroy {
    @ViewChild('bulkRecharge') bulkRecharge: ElementRef;
    // ngAfterViewInit() {
    // this.myInputField.nativeElement.focus();
    // }
    loading: boolean = false;
    bulkRechargeDataValid: boolean = true;
    displayTransaction: boolean = false;
    Data: any[] = [];
    incomeAccountList: any[] = [];
    bulkRechargeData: any[] = [];
    bulkRechargeLoading: boolean = false;
    bulkRechargeDialog: boolean = false;
    selectedProduct: any;
    items: MenuItem[];
    buttonMenu: MenuItem[];
    datePipe: DatePipe = new DatePipe('en-US');
    start_date: any;
    end_date: any;
    User: any;
    transaction_range: any;
    counter_id: any;
    account_head_id: any;

    // Private
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        public apiService: ApiService,
        public messageService: MessageService,
        public dialogService: DialogService,
        public memberService: MemberService,
        public router: Router,
        public counterService: CounterService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.counterService.counterDate$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: any) => {
                this.counter_id = data?.id ?? '';
                this.loading = true;
                this.Data = [];
                this.loadData();
            });
        //this.User = this.memberService.getUserData().user_role
        this.transaction_range = 10;
        // this.transaction_range = this.memberService.getSettings()?.transaction_range??0

        this.end_date = new Date().toISOString().substring(0, 10);
        this.start_date = this.datePipe.transform(
            new Date().setDate(new Date().getDate() - this.transaction_range),
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
        this.buttonMenu = [
            {
                label: 'Bulk Recharge',
                icon: 'pi pi-fw pi-plus',
                command: () => this.bulkRecharge.nativeElement.click(),
            },
        ];
        this.getIncomeAccounts()
    }

    getIncomeAccounts(){
        this.apiService.getTypeRequest('table_data/INCOME_ACCOUNT_HEAD')
        .toPromise()
        .then((result:any)=>{
            if(result.result){
                this.incomeAccountList = result.data
            }
            else{
                this.displayErrorMessage(result.message)
            }
        })
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    ConvertStringToNumber(input: string) {
        var numeric = Number(input);
        return numeric;
    }

    loadData() {
        var url = '';
        if (this.counter_id != '') {
            url = `/BY_COUNTER/${this.counter_id}`;
        }
        this.loading = true;
        var Data = {
            start_date: this.start_date,
            end_date: this.end_date,
        };
        this.Data = [];
        this.apiService
            .postTypeRequest(`transaction_data/ALL_TRANSACTIONS${url}`, Data)
            .toPromise()
            .then((result: any) => {
                this.loading = false;
                if (result.result) {
                    this.Data = result.data;
                    // this.printList()
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
                wildCardEntry: false,
                destinationUrl: destinationUrl,
                url: 'transaction_ops/ACC_TRANSFER',
            },
            header: `Expense Entry`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-5',
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

    walletCredit() {
        const ref = this.dialogService.open(AddEditTransactionComponent, {
            data: {
                title: 'Wallet Refill',
                accountUrl: 'INCOME_ACCOUNT_HEAD',
                transactionUrl: 'MEMBER_WALLET_REFILL',
            },
            header: `Transaction Details`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-5',
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.ngOnInit();
            }
        });
    }
    walletDebit() {
        const ref = this.dialogService.open(AddEditTransactionComponent, {
            data: {
                title: 'Wallet Debit',
                accountUrl: 'INCOME_ACCOUNT_HEAD',
                transactionUrl: 'MEMBER_WALLET_DEBIT',
            },
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
                styleClass: 'w-10 sm:w-10 md:w-10 lg:w-5',
            });
        }
    }

    openProfile() {
        this.memberService.setMemberData(this.selectedProduct);
        this.router.navigate(['../../members/memberProfile'], { relativeTo: this.route });
    }

    generatePDF() {
        const start_date = this.datePipe.transform(
            this.start_date,
            'dd-MM-yyyy'
        );
        const end_date = this.datePipe.transform(this.end_date, 'dd-MM-yyyy');
        const period = `${start_date} - ${end_date}`;
        this.dialogService.open(TransactionsListComponent, {
            data: { data: this.Data, period: period },
            header: `Transactions`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-5',
        });
    }

    /**
     * This function reads an Excel file, extracts data from the first sheet, converts it to JSON
     * format, and performs some data manipulation before setting it to a variable and triggering a
     * dialog box.
     * @param {any} fileInputEvent - The parameter `fileInputEvent` is an event object that is
     * triggered when a file is selected using an HTML input element of type "file". It contains
     * information about the selected file, such as its name, size, and type. The function
     * `excelFileInputChange` uses this event object to read
     */
    excelFileInputChange(fileInputEvent: any) {
        /* wire up file reader */
        const target: DataTransfer = <DataTransfer>(
            (<unknown>fileInputEvent.target)
        );
        if (target.files.length !== 1) {
            throw new Error('Cannot use multiple files');
        }
        const reader: FileReader = new FileReader();
        reader.readAsBinaryString(target.files[0]);
        reader.onload = (e: any) => {
            /* create workbook */
            const binarystr: string = e.target.result;
            const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

            /* selected the first sheet */
            const wsname: string = wb.SheetNames[0];
            const ws: XLSX.WorkSheet = wb.Sheets[wsname];

            /* save data */
            const data = XLSX.utils.sheet_to_json(ws) as BulkRecharge[]; // to get 2d array pass 2nd parameter as object {header: 1}
            // Data will be logged in array format containing objects
            //this.convertArrayToJson(data);
            this.bulkRechargeData = data;
            this.bulkRechargeData.map((data: any) => {
                const baseDate = moment('1900-01-01');
                const numberOfDays = data.txn_date;
                const resultDate = baseDate.add(numberOfDays, 'days').toDate();
                data.txn_date = moment(resultDate).format('DD-MM-yyyy');
            });
            this.checkBulkRechargeData();
            this.bulkRechargeLoading = true;
            this.bulkRechargeDialog = true;
            this.bulkRecharge.nativeElement.value = '';
        };
    }

    checkBulkRechargeData() {
        if (this.bulkRechargeData.length > 0) {
            this.bulkRechargeData.forEach((data: any) => {
                this.validateData(data);
            });
        } else {
            this.displayErrorMessage('No Records Found');
            this.bulkRechargeDialog = false;
            this.bulkRechargeDataValid = false;
        }
    }

    validateData(data: any) {
        let valid = true;
        let message = '';

        if (data.card_number.toString().length !== 14) {
            message += 'Invalid card number';
            valid = false;
        }

        if (!data?.txn_date) {
            message +=
                (message.length > 0 ? ',\n' : '') + 'Invalid Transaction Date';
            valid = false;
        }

        if (!data?.txn_amount) {
            message +=
                (message.length > 0 ? ',\n' : '') + 'Invalid Transaction Amount';
            valid = false;
        }

        data.valid = valid;

        if (!valid) {
            this.displayErrorMessage(message);
        }
        this.checkBulkRechargeDataValid()
    }

    checkBulkRechargeDataValid(){
        const InvalidArray = this.bulkRechargeData.filter(data => data.valid == false)
        this.bulkRechargeDataValid = InvalidArray.length>0?false:true
    }

    displayErrorMessage(message: string) {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
        });
    }

    bulkRechargeSubmit() {
        if(this.account_head_id?.length >0){
            var payload = {
                account_head_id: this.account_head_id,
                transactions_array: this.bulkRechargeData
            }
            this.apiService.postTypeRequest('bulk_wallet_recharge',payload)
            .toPromise()
                .then((result: any) => {
                    this.loading = false;
                    if (result.result) {
                        this.bulkRechargeDialog = false
                        this.ngOnInit()
                    } else{
                        this.displayErrorMessage(result.message)
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        }else{
            this.displayErrorMessage("Select an account")
        }
        }
}
