import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/core/services/api/api.service';

@Component({
    selector: 'app-mass-leave',
    templateUrl: './mass-leave.component.html',
    styleUrls: ['./mass-leave.component.scss'],
})
export class MassLeaveComponent implements OnInit {
    loading: boolean = false;
    leave_date: any;
    selectedProduct: any = [];
    datePipe: DatePipe = new DatePipe('en-US');
    commonForm: FormGroup = new FormGroup({
        leave_date: new FormControl(new Date().toISOString().substring(0, 10), [
            Validators.required,
        ]),
    });
    constructor(
        public ref: DynamicDialogRef,
        public apiService: ApiService,
        public config: DynamicDialogConfig,
        public messageService: MessageService,
        private sanitizer: DomSanitizer
    ) {}

    ngOnInit(): void {
        console.log(this.config.data);

        this.selectedProduct = this.config.data.selectedStudents;
    }
    sanitizeImageUrl(imageUrl: string): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    }

    submitClick() {
        if (this.commonForm.valid) {
            var leave_array: any[] = [];
            this.selectedProduct.forEach((member) => {
                leave_array.push({
                    member_id: member.member_id,
                    leave_date: this.datePipe.transform(
                        this.commonForm.get('leave_date').value,
                        'dd-MM-yyyy'
                    ),
                });
            });
            var payload = {
                leave_array:leave_array
            }
            this.loading = true;
            this.apiService
                .postTypeRequest(
                    `leave_ops/${this.config.data.operation}`,
                    payload
                )
                .toPromise()
                .then((resopnse: any) => {
                    if (resopnse.result) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: resopnse.message,
                        });

                        this.ref.close(true);
                    } else {
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
}
