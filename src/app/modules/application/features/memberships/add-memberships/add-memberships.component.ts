import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { CoreConfig } from 'src/app/core/interfaces/coreConfig';
import { ApiService } from 'src/app/core/services/api/api.service';
import { EnvService } from 'src/app/env.service';
import { NewMembershipReceiptComponent } from 'src/app/features/receipt/new-membership-receipt/new-membership-receipt.component';

@Component({
    selector: 'app-add-memberships',
    templateUrl: './add-memberships.component.html',
    styleUrls: ['./add-memberships.component.scss'],
})
export class AddMembershipsComponent implements OnInit {
    loading: boolean = false;
    cardNumber: any;
    memberDetails: any;
    accounts = [];
    membershipTypeList: any[];
    selectedMembershipType: any[] = [];
    selectedMembershipAmount: any;
    payment_account_head_id_required: boolean = false;
    public coreConfig: CoreConfig;
    /* {
    "member_id":6,
    "meal_pack_id":1,
    "start_date":"09-03-2022",
    "payment_mode":"CASH", //existing parameter applicable for receiving payment as well
    "payment_ref":"NA", //existing parameter applicable for receiving payment as well
    "paid_amount":0, //new parameter
    "payment_account_head_id":1, //new parameter
    "payment_comments":"" //new parameter
} */
    commonForm: FormGroup = new FormGroup({
        member_id: new FormControl('', [Validators.required]),
        meal_pack_id: new FormControl('', [Validators.required]),
        total_meal_packs: new FormControl('', [Validators.required]),
        max_days: new FormControl('', [Validators.required]),
        start_date: new FormControl(new Date().toISOString().substring(0, 10), [
            Validators.required,
        ]),
        payment_date: new FormControl(
            new Date().toISOString().substring(0, 10),
            [Validators.required]
        ),
        payment_mode: new FormControl(''),
        payment_ref: new FormControl(''),
        payment_comments: new FormControl(''),
        paid_amount: new FormControl(),
        net_amount: new FormControl(),
        membership_amount: new FormControl(),
        payment_account_head_id: new FormControl(),
    });
    constructor(
        public ref: DynamicDialogRef,
        public apiService: ApiService,
        public dialogService: DialogService,
        public messageService: MessageService,
        public _coreEnvService: EnvService
    ) {
        this.coreConfig = _coreEnvService.config;
    }

    ngOnInit(): void {
        this.apiService
            .getTypeRequest(`table_data/INCOME_ACCOUNT_HEAD`)
            .toPromise()
            .then((result: any) => {
                this.loading = false;
                if (result.result) {
                    this.accounts = result.data;
                }
            });
    }

    addId(event: any) {
        if (event.value != null) {
            var data = this.membershipTypeList.filter((element) => {
                if (element.meal_pack_id == event.value) {
                    return element;
                } else {
                    return null;
                }
            });
            this.selectedMembershipAmount = 0;
            this.selectedMembershipType = data[0].meal_pack_items;
            this.selectedMembershipAmount = Number(data[0].meal_pack_price);
            if (this.selectedMembershipAmount > 0) {
                this.commonForm.controls.net_amount.setValue(
                    Number(this.selectedMembershipAmount) -
                        Number(this.memberDetails?.balance)
                );
            } else {
                this.commonForm.controls.net_amount.setValue(
                    Number(this.selectedMembershipAmount)
                );
            }
        } else {
            this.selectedMembershipType = [];
        }
    }
    getMemberDetails() {
        if (this.cardNumber.length == this.coreConfig.app.cardNumberLength) {
            const cardNumber = this.cardNumber;
            this.cardNumber = '';
            this.loading = true;
            this.commonForm.reset();
            this.apiService
                .getTypeRequest(`specific_data/MEMBER_DATA/${cardNumber}`)
                .toPromise()
                .then((resopnse: any) => {
                    if (resopnse.result) {
                        this.memberDetails = resopnse.data;
                        this.commonForm.controls.member_id.setValue(
                            this.memberDetails.member_id
                        );
                        // this.commonForm.controls.net_amount.setValue(this.memberDetails.balance);
                        this.messageService.add({
                            severity: 'success',
                            summary: resopnse.message,
                            detail: 'Found Card Details.',
                        });
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: resopnse.message,
                            detail: 'Card Details Not Found.',
                        });
                    }
                })
                .finally(() => {
                    this.loading = false;
                    this.selectedMembershipType = [];
                    this.commonForm.controls.start_date.setValue(
                        new Date().toISOString().substring(0, 10)
                    );
                    this.commonForm.controls.payment_date.setValue(
                        new Date().toISOString().substring(0, 10)
                    );
                    this.selectedMembershipAmount = '';
                });
            this.apiService
                .getTypeRequest(`meal_pack_data`)
                .toPromise()
                .then((resopnse: any) => {
                    if (resopnse.result) {
                        this.membershipTypeList = resopnse.data;
                    }
                });
        }
    }

    updateNetPayable() {
        var total_meal_packs = Number(
            this.commonForm.controls['total_meal_packs'].value
        );
        if (total_meal_packs > 0) {
            this.commonForm.controls['net_amount'].setValue(
                total_meal_packs * this.selectedMembershipAmount -
                    Number(this.memberDetails?.balance)
            );
            this.commonForm.controls['membership_amount'].setValue(
                total_meal_packs * this.selectedMembershipAmount
            );
        } else {
            this.commonForm.controls['net_amount'].setValue(
                this.selectedMembershipAmount -
                    Number(this.memberDetails?.balance)
            );
            this.commonForm.controls['membership_amount'].setValue(
                this.selectedMembershipAmount
            );
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
            .postTypeRequest(`membership_ops/new`, this.commonForm.value)
            .toPromise()
            .then((resopnse: any) => {
                if (resopnse.result) {
                    this.ref.close(true);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: resopnse.message,
                    });
                    // this.dialogService.open(NewMembershipReceiptComponent, {
                    //     data: resopnse.data.membership,
                    //     header: `New MemberShip`,
                    //     styleClass: 'w-8  xs:w-12 sm:w-12 md:w-10 lg:w-5',
                    // });
                }
            })
            .finally(() => (this.loading = false));
    }

    updateRequiredFields() {
        if (this.commonForm.controls.paid_amount.value) {
            this.commonForm.controls.payment_account_head_id.addValidators(
                Validators.required
            );
            this.payment_account_head_id_required = true;
        } else {
            this.commonForm.controls.payment_account_head_id.clearValidators();
            this.payment_account_head_id_required = false;
        }
    }
}
