import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/core/services/api/api.service';

@Component({
    selector: 'app-add-edit-account',
    templateUrl: './add-edit-account.component.html',
    styleUrls: ['./add-edit-account.component.scss'],
})
export class AddEditAccountComponent implements OnInit {
    loading: boolean = false;
    /* {
    "data": {
        "data": {
            "account_id": 14,
            "account_name": "45646456456",
            "balance": "0.00",
            "isEditable": 1
        },
        "wildCardEntry": false,
        "url": "EXPENSE_ACCOUNT_HEAD"
    },
    "header": "Edit Account Data",
    "styleClass": "w-10 sm:w-10 md:w-10 lg:w-8"
    } */
    commonForm: FormGroup = new FormGroup({
        account_head_id: new FormControl(this.config?.data?.data?.account_head_id ?? ''),
        account_name: new FormControl(
            this.config?.data?.data?.account_name ?? '',
            [Validators.required]
        ),
        isExpenseHead: new FormControl(
            this.config?.data?.data?.isExpenseHead ??
                this.config?.data?.isExpenseHead
        ),
        opening_balance: new FormControl({
            value: this.config?.data?.data?.balance ?? '',
            disabled: this.config?.data?.data ? true : false,
        }),
    });
    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public apiService: ApiService,
        public messageService: MessageService
    ) {}

    ngOnInit(): void {}

    submitClick() {
        if (this.commonForm.valid) {
            this.loading = true;
            if (this.config?.data?.wildCardEntry) {
            } else {
                if (this.commonForm.get('account_head_id').value) {
                    this.update();
                } else {
                    this.insert();
                }
            }
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Invalid Details',
                detail: `Enter Correct Details`,
            });
            var controls = this.commonForm.controls;
            for (const name in controls) {
                controls[name].markAsDirty();
                controls[name].markAllAsTouched();
            }
        }
    }

    update() {
        this.apiService
            .postTypeRequest('account_head_ops/update', this.commonForm.value)
            .toPromise()
            .then((resopnse: any) => {
                this.loading = false;
                if (resopnse.result) {
                    this.ref.close(true);
                    this.messageService.add({
                        severity: 'info',
                        summary: resopnse.message,
                        detail: 'Via MessageService',
                    });
                }
            });
    }

    insert() {
        this.apiService
            .postTypeRequest('account_head_ops/insert', this.commonForm.value)
            .toPromise()
            .then((resopnse: any) => {
                this.loading = false;
                if (resopnse.result) {
                    this.ref.close(true);
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Added',
                        detail: resopnse.message,
                    });
                }
            });
    }
}
