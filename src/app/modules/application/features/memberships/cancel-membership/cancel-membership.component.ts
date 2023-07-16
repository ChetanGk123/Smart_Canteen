import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/core/services/api/api.service';

@Component({
    selector: 'app-cancel-membership',
    templateUrl: './cancel-membership.component.html',
    styleUrls: ['./cancel-membership.component.scss'],
})
export class CancelMembershipComponent implements OnInit {
    accountList: any[];
    settleType: string = 'isSettleFromBalance';
    // commonForm: FormGroup = new FormGroup({
    //     member_id: new FormControl(this.config.data.member_id),
    //     returnable_amount: new FormControl('', [Validators.required]),
    //     txn_date: new FormControl(new Date().toISOString().substring(0, 10), [
    //         Validators.required,
    //     ]),
    //     account_head_id: new FormControl('', [Validators.required]),
    //     txn_comments: new FormControl('', [Validators.required]),
    //     payment_mode: new FormControl('', [Validators.required]),
    //     payment_ref: new FormControl('', [Validators.required]),
    //     cancellation_date: new FormControl(
    //         new Date().toISOString().substring(0, 10),
    //         [Validators.required]
    //     ),
    //     isSettleFromBalance: new FormControl(false),
    // });
    commonForm: FormGroup = new FormGroup({
        member_id: new FormControl(this.config.data.member_id, [
            Validators.required,
        ]),
        cancellation_comments: new FormControl('', [Validators.required]),
        cancellation_date: new FormControl(
            new Date().toISOString().substring(0, 10),
            [Validators.required]
        ),
        isSettleFromBalance: new FormControl(false),
        addRetunableAmountToWallet: new FormControl(false),
        account_head_id: new FormControl(''),
        counter_id: new FormControl(''),
        returnable_amount: new FormControl(),
        txn_date: new FormControl(new Date().toISOString().substring(0, 10)),
        txn_comments: new FormControl(),
        payment_mode: new FormControl(),
        payment_ref: new FormControl(),
    });
    loading: boolean = false;
    showSettleFromBalance: boolean = false;
    displayPaymentDetails: boolean = true;
    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public apiService: ApiService,
        public messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.apiService
            .getTypeRequest(`table_data/INCOME_ACCOUNT_HEAD`)
            .toPromise()
            .then((resopnse: any) => {
                if (resopnse.result) {
                    this.accountList = resopnse.data;
                }
            });
        this.updateFormStatus();
    }

    updateFormStatus() {
        var returnable_amount = Number(
            this.commonForm.get('returnable_amount').value ?? 0
        );
        this.showSettleFromBalance = returnable_amount <= 0 ? false : true;
        var isSettleFromBalance = this.commonForm.get(
            'isSettleFromBalance'
        ).value;
        var addRetunableAmountToWallet = this.commonForm.get(
            'addRetunableAmountToWallet'
        ).value;
        if (
            isSettleFromBalance == false &&
            addRetunableAmountToWallet == false
        ) {
            this.displayPaymentDetails = true;
        } else {
            this.displayPaymentDetails = false;
        }

        if (this.displayPaymentDetails) {
            this.commonForm
                .get('account_head_id')
                .setValidators(Validators.required);
            this.commonForm
                .get('payment_mode')
                .setValidators(Validators.required);
            this.commonForm
                .get('payment_ref')
                .setValidators(Validators.required);
            this.commonForm
                .get('txn_comments')
                .setValidators(Validators.required);
        } else {
            this.commonForm.get('account_head_id').clearValidators();
            this.commonForm.get('payment_mode').clearValidators();
            this.commonForm.get('payment_ref').clearValidators();
            this.commonForm.get('txn_comments').clearValidators();
            this.commonForm.updateValueAndValidity();
        }
    }

    submitClick() {
        if (this.commonForm.valid) {
            this.add();
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

    add() {
        this.loading = true;
        this.apiService
            .postTypeRequest(`membership_ops/cancel`, this.commonForm.value)
            .toPromise()
            .then((resopnse: any) => {
                if (resopnse.result) {
                    this.ref.close(true);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: resopnse.message,
                    });
                }
            })
            .finally(() => {
                this.loading = false;
            });
    }
}
