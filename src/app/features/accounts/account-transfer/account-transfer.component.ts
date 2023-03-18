import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MemberService } from 'src/app/core/services/MemberService/member.service';

@Component({
    selector: 'app-account-transfer',
    templateUrl: './account-transfer.component.html',
    styleUrls: ['./account-transfer.component.scss'],
})
export class AccountTransferComponent implements OnInit {
    sourceUrl: string;
    User: any;
    transaction_range: any;
    destinationUrl: string;
    public sourceAccounts = [];
    public destinationAccounts = [];
    loading: boolean = false;
    commonForm: FormGroup = new FormGroup({
        source_head_id: new FormControl('', [Validators.required]),
        source_balance: new FormControl(''),
        destination_balance: new FormControl(''),
        destination_head_id: new FormControl(
            this.config?.data?.wildCardEntry
                ? this.config?.data?.data?.account_id
                : '',
            [Validators.required]
        ),
        txn_amount: new FormControl('', [Validators.required]),
        payment_mode: new FormControl('', [Validators.required]),
        payment_ref: new FormControl('', [Validators.required]),
        user_comments: new FormControl('', [Validators.required]),
        txn_date: new FormControl(new Date().toISOString().substring(0, 10), [
            Validators.required,
        ]),
    });
    constructor(
        public ref: DynamicDialogRef,
        public apiService: ApiService,
        public config: DynamicDialogConfig,
        public messageService: MessageService,
        public memberService: MemberService
    ) {}

    ngOnInit(): void {
        if (this.config.data.sourceUrl) {
            this.sourceUrl = this.config.data.sourceUrl;
        } else {
            this.commonForm.controls.source_head_id.clearValidators();
        }
        this.destinationUrl = this.config.data.destinationUrl;
        this.loadData();
        this.updateBalance();

    }
    async loadData() {
        this.loading = true;
        if (this.config.data.sourceUrl) {
            await this.apiService
                .getTypeRequest(`table_data/${this.sourceUrl}`)
                .toPromise()
                .then((result: any) => {
                    this.loading = false;
                    if (result.result) {
                        this.sourceAccounts = result.data;
                    }
                });
        }
        if (this.sourceUrl != this.destinationUrl) {
            await this.apiService
                .getTypeRequest(`table_data/${this.destinationUrl}`)
                .toPromise()
                .then((result: any) => {
                    this.loading = false;
                    if (result.result) {
                        this.destinationAccounts = result.data;
                        if(this.config.data?.data){
                            this.commonForm.controls.destination_head_id.setValue(this.config.data?.data.account_head_id)
                            this.updateBalance()
                        }
                    }
                });
        } else {
            this.destinationAccounts = this.sourceAccounts;
        }
    }

    submitClick() {
        if (this.commonForm.valid) {
            this.updateData();
        } else {
            var controls = this.commonForm.controls;
            for (const name in controls) {
                controls[name].markAsDirty();
                controls[name].markAllAsTouched();
            }
            this.messageService.add({
                severity: 'error',
                summary: 'Invalid',
                detail: 'Enter Required Details',
            });
        }
    }
    updateData() {
        this.loading = true;
        var data ;
        if(this.config.data.wildCardEntry){
            data = {
                txn_amount: this.commonForm.controls.txn_amount.value,
                txn_date: this.commonForm.controls.txn_date.value,
                txn_discount: 0, //non-mandatory
                payment_mode: this.commonForm.controls.payment_mode.value,
                payment_ref: this.commonForm.controls.payment_ref.value,
                user_comments: this.commonForm.controls.user_comments.value,
                account_head_id: this.commonForm.controls.destination_head_id.value,
            };
        } else {
            data = {
                txn_amount: this.commonForm.controls.txn_amount.value,
                txn_date: this.commonForm.controls.txn_date.value,
                txn_discount: 0, //non-mandatory
                payment_mode: this.commonForm.controls.payment_mode.value,
                payment_ref: this.commonForm.controls.payment_ref.value,
                user_comments: this.commonForm.controls.user_comments.value,
                source_head_id:this.commonForm.controls.source_head_id.value,
                destination_head_id:this.commonForm.controls.destination_head_id.value,
            }
        }
        this.apiService
            .postTypeRequest(this.config.data.url, data)
            .toPromise()
            .then((resopnse: any) => {
                if (resopnse.result) {
                    this.ref.close(true);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success.',
                        detail: resopnse.message,
                    });
                }
            })
            .finally(() => (this.loading = false));
    }

    updateBalance() {
        if (this.commonForm.controls.source_head_id.value) {
            for (const key of this.sourceAccounts) {
                if (
                    key.account_head_id ==
                    this.commonForm.controls.source_head_id.value
                ) {
                    this.commonForm.controls.source_balance.setValue(
                        key.balance
                    );
                    break;
                }
            }
        }
        if (this.commonForm.controls.destination_head_id.value) {
            for (const key of this.destinationAccounts) {
                if (
                    key.account_head_id ==
                    this.commonForm.controls.destination_head_id.value
                ) {
                    this.commonForm.controls.destination_balance.setValue(
                        key.balance
                    );
                    return;
                }
            }
        }
    }
}
