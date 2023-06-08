import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/core/services/api/api.service';

@Component({
    selector: 'app-mark-leave',
    templateUrl: './mark-leave.component.html',
    styleUrls: ['./mark-leave.component.scss'],
})
export class MarkLeaveComponent implements OnInit {
    loading: boolean = false;
    showMemberData: boolean = false;
    cardNumber: any = null;
    memberData: any;
    datePipe: DatePipe = new DatePipe('en-US');
    memberIDs: Number[] = [];
    Data: any;
    commonForm: FormGroup = new FormGroup({
        leave_date: new FormControl(new Date().toISOString().substring(0, 10), [
            Validators.required,
        ]),
    });
    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public apiService: ApiService,
        public messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.cardNumber = this.config.data?.card_number ?? null;
        //
        if (this.cardNumber) {
            this.memberData = this.config?.data;
            this.showMemberData = true;
            this.loadData();
        }
    }

    loadData() {
        if (this.cardNumber != null && this.cardNumber.length >= 14) {
            this.loading = true;
            const cardNumber = this.cardNumber.trim();

            this.cardNumber = '';
            var url = '';
            this.apiService
                .getTypeRequest(
                    `leave_data?member_id=${this.memberData.member_id}`
                )
                .toPromise()
                .then((result: any) => {
                    this.loading = false;
                    if (result.result) {
                        this.Data = result.data;
                        this.memberData =
                            this.config?.data ??
                            this.Data.active_membership_data;
                        this.showMemberData = true;

                        this.config.header =
                            this.memberData?.membership_data.is_on_leave == 1
                                ? 'End Leave'
                                : 'Start Leave';
                    } else if (
                        result.message == 'No leave data for this combination'
                    ) {
                        this.config.header = 'Start Leave';
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }

    submitClick() {
        var operation =
            this.memberData?.membership_data.is_on_leave == 1 ? 'end' : 'start';
        var payload = {
            leave_array: [
                {
                    member_id: this.memberData.member_id,
                    leave_date: this.datePipe.transform(
                        this.commonForm.get('leave_date').value,
                        'dd-MM-yyyy'
                    ),
                },
            ],
        };

        if (this.commonForm.valid) {
            this.loading = true;
            this.apiService
                .postTypeRequest(`leave_ops/${operation}`, payload)
                .toPromise()
                .then((resopnse: any) => {
                    if (resopnse.result) {
                        this.ref.close(true);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: resopnse.message,
                        });

                        if (resopnse.data?.extended_days > 0) {
                            this.messageService.add({
                                severity: 'info',
                                summary: 'Success',
                                detail: `Mess is extended by ${resopnse.data?.extended_days} days`,
                            });
                        }
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
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

    convertToNum(data: string) {
        return Number(data);
    }
}
