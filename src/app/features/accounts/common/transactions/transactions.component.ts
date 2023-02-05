import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { map, Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MemberService } from 'src/app/core/services/MemberService/member.service';

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
    account_head_id: any;
    datePipe: DatePipe = new DatePipe('en-US');
    accountList: any = [];
    start_date: any;
    end_date: any;
    User : any;
    transaction_range: any;
    commonForm: FormGroup = new FormGroup({
        account_head_id: new FormControl('', [Validators.required]),
        start_date: new FormControl(
            '',
            [Validators.required]
        ),
        end_date: new FormControl(new Date().toISOString().substring(0, 10), [
            Validators.required,
        ]),
    });
    constructor(
        public apiService: ApiService,
        public dialogService: DialogService,
        public messageService: MessageService,
        public memberService: MemberService
    ) {}

    ngOnInit(): void {
        this.accountList = [];
        this.User = this.memberService.getUserData().user_role
        this.transaction_range = this.User == "OWNER"? this.memberService.getSettings().transaction_range:0
        this.commonForm.get('start_date').setValue(
            this.datePipe.transform(
                new Date().setDate(
                    new Date().getDate() -
                        this.transaction_range
                ),
                'yyyy-MM-dd'
            )
        );
        this.apiService
            .getTypeRequest(`table_data/EXPENSE_ACCOUNT_HEAD`)
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
            .getTypeRequest(`table_data/INCOME_ACCOUNT_HEAD`)
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
    }

    loadData() {
        this.loadAccountList = true;

        if (this.commonForm.valid) {
            this.loading = true;
            this.apiService
                .postTypeRequest(
                    `table_data/ACCOUNT_HEAD`,
                    this.commonForm.value
                )
                .toPromise()
                .then((result: any) => {
                    this.loading = false;
                    if (result.result) {
                        this.Data = result.data.transactions;
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Incomplete Details',
                detail: 'Enter all required details.',
            });
            var controls = this.commonForm.controls;
            for (const name in controls) {
                controls[name].markAsDirty();
                controls[name].markAllAsTouched();
            }
        }
    }
}
