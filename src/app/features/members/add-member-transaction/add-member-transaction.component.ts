import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import {
    DynamicDialogConfig,
    DialogService,
    DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MemberService } from '../member.service';

@Component({
    selector: 'app-add-member-transaction',
    templateUrl: './add-member-transaction.component.html',
    styleUrls: ['./add-member-transaction.component.scss'],
})
export class AddMemberTransactionComponent implements OnInit {
    loading: boolean = false;
    accountList: any[];
    commonForm: FormGroup = new FormGroup({
        member_id: new FormControl(this.config.data.member.member_id ?? '', [
            Validators.required,
        ]),
        full_name: new FormControl(this.config.data.member.full_name ?? '', [
            Validators.required,
        ]),
        balance: new FormControl(this.config.data.member.balance ?? '', [
            Validators.required,
        ]),
        card_number: new FormControl(
            this.config.data.member.card_number ?? '',
            [Validators.required]
        ),
        account_head_id: new FormControl('', [Validators.required]),
        txn_amount: new FormControl('', [Validators.required]),
        payment_mode: new FormControl('', [Validators.required]),
        payment_ref: new FormControl(''),
        user_comments: new FormControl(''),
        txn_date: new FormControl(new Date().toISOString().substring(0, 10), [
            Validators.required,
        ]),
    });
    constructor(
        public apiService: ApiService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public messageService: MessageService,
        public dialogService: DialogService
    ) {}

    ngOnInit(): void {
        this.apiService
            .getTypeRequest(`table_data/${this.config.data.accountUrl}`)
            .toPromise()
            .then((result: any) => {
                this.loading = false;
                if (result.result) {
                    this.accountList = result.data;
                }
            })
            .then(() => (this.loading = false));
    }

    submitClick() {
        if (this.commonForm.valid) {
            this.loading = true;
            this.apiService
                .postTypeRequest(
                    `transaction_ops/${this.config.data.transactionUrl}`,
                    this.commonForm.value
                )
                .toPromise()
                .then((resopnse: any) => {
                    if (resopnse.result) {
                        this.ref.close(true);
                        this.messageService.add({
                            severity: 'info',
                            summary: 'Added',
                            detail: resopnse.message,
                        });
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
