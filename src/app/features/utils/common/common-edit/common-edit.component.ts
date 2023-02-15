import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/core/services/api/api.service';

@Component({
    selector: 'app-common-edit',
    templateUrl: './common-edit.component.html',
    styleUrls: ['./common-edit.component.scss'],
})
export class CommonEditComponent implements OnInit {
    loading: boolean = false;
    list: any[] = [];
    commonForm: FormGroup = new FormGroup({
        item_id: new FormControl(this.config?.data?.data?.id ?? ''),
        counter_id: new FormControl(this.config?.data?.data?.counter_id ?? ''),
        item_name: new FormControl(this.config?.data?.data?.name ?? '', [
            Validators.required,
        ]),
    });
    constructor(
        public ref: DynamicDialogRef,
        public apiService: ApiService,
        public config: DynamicDialogConfig,
        public messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.list = this.config?.data?.list;
    }

    submitClick() {
        if (this.commonForm.valid) {
            var result: any[] = this.list.filter((ele: any) => {
                if (ele.name == this.commonForm.controls.item_name.value) {
                    return ele;
                } else {
                    return null;
                }
            });
            if (result.length > 0) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Duplicate',
                    detail: 'Duplicate Value Entered',
                });
            } else {
                this.commonForm.controls.item_id.value ? this.edit() : this.add();
            }
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
            .postTypeRequest(
                `item_ops/${this.config?.data?.Url}/insert`,
                this.commonForm.value
            )
            .toPromise()
            .then((resopnse: any) => {
                this.loading = false;
                if (resopnse.result) {
                    this.ref.close(true);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success.',
                        detail: resopnse.message,
                    });
                }
            });
    }

    edit() {
        this.loading = true;
        this.apiService
            .postTypeRequest(
                `item_ops/${this.config?.data?.Url}/update`,
                this.commonForm.value
            )
            .toPromise()
            .then((resopnse: any) => {
                this.loading = false;
                if (resopnse.result) {
                    this.ref.close(true);
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Success.',
                        detail: resopnse.message,
                    });
                }
            });
    }
}
