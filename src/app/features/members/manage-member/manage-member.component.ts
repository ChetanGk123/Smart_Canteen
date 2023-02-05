import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/core/services/api/api.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
    selector: 'app-manage-member',
    templateUrl: './manage-member.component.html',
    styleUrls: ['./manage-member.component.scss'],
})
export class ManageMemberComponent implements OnInit {
    /* {
        "member_id":4,
        "full_name" :"newfull_name",
        "gender" :"newgender",
        "phone_number" :"newphone_number", //non-madatory
        "parents_ph" :"newparents_ph",
        "dob" :"30-01-1998",
        "email" :"email@gmail.com", //non-madatory
        "class_name" :"new_class_name", //non-madatory
        "division_name" :"new_division_name", //non-madatory
        "hostel_details" :"new_hostel_details", //non-madatory
        "member_type_id" :1,
        "address" :"new address" //non-madatory
    } */

    loading: boolean = false;
    member_types: any = [{ id: 1, name: 'Student' }];
    genders: any = ['Male', 'Female'];
    commonForm: FormGroup = new FormGroup({
        member_id: new FormControl(
            this.config?.data?.member_id ?? this.config?.data?.id ?? ''
        ),
        full_name: new FormControl(this.config?.data?.full_name ?? '', [
            Validators.required,
        ]),
        gender: new FormControl(this.config?.data?.gender ?? '', [
            Validators.required,
        ]),
        phone_number: new FormControl(this.config?.data?.phone_number ?? ''),
        parents_ph: new FormControl(this.config?.data?.parents_ph ?? '', [
            Validators.required,
        ]),
        dob: new FormControl(this.config?.data?.dob ?? '', [
            Validators.required,
        ]),
        email: new FormControl(this.config?.data?.email ?? ''),
        class_name: new FormControl(this.config?.data?.class_name ?? '', [
            Validators.required,
        ]),
        division_name: new FormControl(this.config?.data?.division_name ?? '', [
            Validators.required,
        ]),
        hostel_details: new FormControl(
            this.config?.data?.hostel_details ?? '',
            [Validators.required]
        ),
        member_type_id: new FormControl(
            this.config?.data?.member_type_id ?? '',
            [Validators.required]
        ),
        address: new FormControl(this.config?.data?.address ?? '', [
            Validators.required,
        ]),
    });
    constructor(
        public ref: DynamicDialogRef,
        public apiService: ApiService,
        public authService: AuthService,
        public config: DynamicDialogConfig
    ) {}

    ngOnInit(): void {
        this.apiService
            .getTypeRequest(`table_data/MEMBER_TYPE`)
            .toPromise()
            .then((result: any) => {
                this.loading = false;
                this.member_types = result?.data;
            });
    }

    submitClick() {
        if (this.commonForm.valid) {
            var data = {
                counter_id: this.authService.getUser()?.counter_id,
                member_data: [this.commonForm.value],
            };
            this.loading = true;
            var operation = this.config?.data ? 'update' : 'insert';
            this.apiService
                .postTypeRequest(`member_ops/${operation}`, data)
                .toPromise()
                .then((result: any) => {
                    if (result.result) {
                        this.ref.close(true);
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
        }
    }
}
