import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { CounterService } from '../../counters/counter.service';
import { MemberService } from 'src/app/core/services/MemberService/member.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-manage-member',
    templateUrl: './manage-member.component.html',
    styleUrls: ['./manage-member.component.scss'],
})
export class ManageMemberComponent implements OnInit, OnDestroy {
    loading: boolean = false;
    member_types: any = [];
    errorMessage: any;
    Unsuccessful_registration: any;
    counterList: any[];
    classList: any[];
    divisionList: any[];
    commonForm: FormGroup = new FormGroup({
        counter_id: new FormControl(this.config.data?.counter_id ?? ''),
        member_id: new FormControl(
            this.config?.data?.member_id ?? this.config?.data?.id ?? ''
        ),
        card_number: new FormControl(this.config?.data?.card_number ?? '', [
            Validators.required,
        ]),
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
        opening_balance: new FormControl(
            this.config?.data?.opening_balance ?? '0',
            [Validators.required]
        ),
    });
    // Private
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        public ref: DynamicDialogRef,
        public apiService: ApiService,
        public authService: AuthService,
        public memberService: MemberService,
        private messageService: MessageService,
        public counterService: CounterService,
        public config: DynamicDialogConfig
    ) {}

    ngOnInit(): void {
        this.apiService
            .getTypeRequest(`table_data/MEMBER_TYPE`)
            .toPromise()
            .then((result: any) => {
                this.loading = false;
                this.member_types = result?.data;
                if (this.config?.data) {
                    this.commonForm.controls.card_number.disable();
                    this.commonForm.controls.counter_id.disable();
                    this.commonForm.controls.opening_balance.disable();
                } /* else {
                    this.commonForm.patchValue({
                        card_number: '744755373a90123',
                        full_name: 'Chetan',
                        gender: 'Male',
                        phone_number: 9988776655,
                        parents_ph: 9988776655,
                        dob: '2020-12-12',
                        email: 'ccc@ccc',
                        class_name: '10',
                        division_name: 'A',
                        hostel_details: 'sdrg',
                        member_type_id: 3,
                        address: 'sdfsdfsfsdf',
                        opening_balance: 2,
                    });
                } */
            });
        if (this.memberService.getUserData().user_role == 'OWNER') {
            this.counterService.counterDate$
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((data: any) => {
                    this.commonForm.controls.counter_id.setValue(
                        data?.id ?? ''
                    );
                });
            this.apiService
                .getTypeRequest(`table_data/COUNTER`)
                .toPromise()
                .then((result: any) => {
                    this.counterList = result?.data;
                });
        }
        this.apiService
            .getTypeRequest(`table_data/CLASS`)
            .toPromise()
            .then((result: any) => {
                this.classList = result?.data;
            });
        this.apiService
            .getTypeRequest(`table_data/DIVISION`)
            .toPromise()
            .then((result: any) => {
                this.divisionList = result?.data;
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    submitClick() {
        if (this.commonForm.valid) {
            var data;
            this.loading = true;
            var operation = this.config?.data ? 'update' : 'insert';
            if (operation == 'insert') {
                var id =
                    this.counterService.getCounterData()?.id ??
                    this.authService.getUser()?.counter_id ??
                    this.commonForm.controls.counter_id.value;
                data = {
                    counter_id: id,
                    member_data: [this.commonForm.value],
                };
            } else {
                data = this.commonForm.value;
            }
            this.apiService
                .postTypeRequest(`member_ops/${operation}`, data)
                .toPromise()
                .then((result: any) => {
                    if (result.result) {


                        this.ref.close(true);
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Unsuccessful registration',
                            detail: "Invalid member details",
                        });
                        if (
                            result.data.duplicate_members.length > 0 ||
                            result.data.incomplete_data > 0 ||
                            result.data.invalid_member_type.length > 0 ||
                            result.data.duplicate_members.length > 0 ||
                            result.data.duplicate_cardnumber.length > 0
                        ) {
                            this.errorMessage = result.data;
                            this.Unsuccessful_registration = true;
                            
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
        }
    }
}
