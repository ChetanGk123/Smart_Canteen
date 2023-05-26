import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MemberService } from 'src/app/core/services/MemberService/member.service';
import { CounterService } from 'src/app/features/counters/counter.service';
import { AccountTransactionsComponent } from 'src/app/features/receipt/account-transactions/account-transactions.component';

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
    Data: any[] = [];
    loading: boolean = false;
    loadAccountList: boolean = false;
    selectedProduct: any;
    account_id: any;
    datePipe: DatePipe = new DatePipe('en-US');
    accountList: any = [];
    start_date: any;
    end_date: any;
    User: any;
    transaction_range: any;
    counter_id: any;

    // Private
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    commonForm: FormGroup = new FormGroup({
        account_head_id: new FormControl(''),
        start_date: new FormControl('', [Validators.required]),
        end_date: new FormControl(new Date().toISOString().substring(0, 10), [
            Validators.required,
        ]),
    });
    constructor(
        public apiService: ApiService,
        public dialogService: DialogService,
        public messageService: MessageService,
        public memberService: MemberService,
        public counterService: CounterService
    ) {}

    ngOnInit(): void {
        this.counterService.counterDate$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: any) => {
                this.counter_id = data?.id ?? '';
                this.loading = true;
                this.Data = [];
                this.loadAccountHeads();
                this.loadData();
            });
        this.accountList = [];
        this.User = this.memberService.getUserData().user_role;
        // this.transaction_range = this.User == "OWNER"? this.memberService.getSettings().transaction_range:0
        this.transaction_range = 10;
        this.commonForm
            .get('start_date')
            .setValue(
                this.datePipe.transform(
                    new Date().setDate(
                        new Date().getDate() - this.transaction_range
                    ),
                    'yyyy-MM-dd'
                )
            );
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    loadAccountHeads() {
        var url = '';
        if (this.counter_id != '') {
            url = `/BY_COUNTER/${this.counter_id}`;
        }
        this.loadAccountList = true;
        this.accountList = [];
        this.apiService
            .getTypeRequest(`table_data/EXPENSE_ACCOUNT_HEAD${url}`)
            .toPromise()
            .then((result: any) => {
                this.loading = false;
                if (result.result) {
                    var data = {
                        label: 'Expense Account',
                        value: 'de',
                        items: result.data,
                    };
                    this.accountList.push(data);
                }
            })
            .finally(() => {
                this.loading = false;
            });
        this.apiService
            .getTypeRequest(`table_data/INCOME_ACCOUNT_HEAD${url}`)
            .toPromise()
            .then((result: any) => {
                this.loading = false;
                if (result.result) {
                    var data = {
                        label: 'Income Account',
                        value: 'de',
                        items: result.data,
                    };
                    this.accountList.push(data);
                }
            })
            .finally(() => {
                this.loading = false;
            });
        this.apiService
            .getTypeRequest(`table_data/COMMODITY_ACCOUNT${url}`)
            .toPromise()
            .then((result: any) => {
                this.loading = false;
                if (result.result) {
                    var data = {
                        label: 'Commodity Account',
                        value: 'de',
                        items: result.data,
                    };
                    this.accountList.push(data);
                }
            })
            .finally(() => {
                this.loading = false;
            });
    }

    loadData() {
        var url = '';
        if (this.counter_id != '') {
            url = `/BY_COUNTER/${this.counter_id}`;
        }

        // if (this.commonForm.valid) {
        var data = {
            account_head_id:
                this.commonForm.controls.account_head_id.value?.account_head_id,
            start_date: this.commonForm.controls.start_date.value,
            end_date: this.commonForm.controls.end_date.value,
        };
        this.loading = true;
        this.apiService
            .postTypeRequest(
                `transaction_data/ACCOUNT_HEAD_TRANSACTIONS${url}`,
                data
            )
            .toPromise()
            .then((result: any) => {
                this.loading = false;
                if (result.result) {
                    this.Data = result.data;
                } else {
                    this.Data = [];
                }
            })
            .finally(() => {
                this.loading = false;
            });

        // } else {
        //     this.messageService.add({
        //         severity: 'warn',
        //         summary: 'Incomplete Details',
        //         detail: 'Enter all required details.',
        //     });
        //     var controls = this.commonForm.controls;
        //     for (const name in controls) {
        //         controls[name].markAsDirty();
        //         controls[name].markAllAsTouched();
        //     }
        // }
    }

    generatePDF() {
        this.dialogService.open(AccountTransactionsComponent, {
            data: {
                transactions_Data: this.Data,
                account_Data: this.commonForm.value,
            },
            header: `Transaction Details`,
            styleClass: 'w-8  xs:w-12 sm:w-12 md:w-10 lg:w-5',
        });
    }
    generateExcel() {}
}
