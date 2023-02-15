import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/core/services/api/api.service';

@Component({
    selector: 'app-update-pos',
    templateUrl: './update-pos.component.html',
    styleUrls: ['./update-pos.component.scss'],
})
export class UpdatePosComponent implements OnInit {
    constructor(
        public datepipe: DatePipe,
        public ref: DynamicDialogRef,
        public apiService: ApiService,
        public config: DynamicDialogConfig,
        public messageService: MessageService
    ) {}

    loading: boolean = false;
    commonForm: FormGroup = new FormGroup({
        id: new FormControl(this.config?.data?.id ?? ''),
        name: new FormControl(this.config?.data?.name ?? ''),
        quantity: new FormControl(0, [Validators.required]),
        stock_update_date: new FormControl(
            new Date().toISOString().substring(0, 10),
            [Validators.required]
        ),
        reason: new FormControl('', [Validators.required]),
        updateType: new FormControl('CREDIT'),
    });

    ngOnInit(): void {}

    submitClick() {
        // //
        if (this.commonForm.valid) {
            this.loading = true;
            this.apiService
                .postTypeRequest(
                    `pos_stock_update/${this.commonForm.controls.updateType.value}`,
                    this.commonForm.value
                )
                .toPromise()
                .then((resopnse: any) => {
                    if (resopnse.result) {
                        this.ref.close(true);
                        this.messageService.add({
                            severity: 'info',
                            summary: 'Updated',
                            detail: resopnse.message,
                        });
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        } else {
            this.messageService.add({
                severity: 'info',
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
