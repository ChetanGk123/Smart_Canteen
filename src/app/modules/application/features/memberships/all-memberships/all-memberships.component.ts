import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { Observable, map, Subject, takeUntil } from 'rxjs';
import { MembershipType } from 'src/app/core/interfaces/appconfig';
import { ApiService } from 'src/app/core/services/api/api.service';
import { CounterService } from '../../counters/counter.service';
import { MemberService } from 'src/app/core/services/MemberService/member.service';
import { ActiveMembershipReceiptComponent } from '../../receipt/active-membership-receipt/active-membership-receipt.component';
import { NewMembershipReceiptComponent } from '../../receipt/new-membership-receipt/new-membership-receipt.component';
import { AddMembershipsComponent } from '../add-memberships/add-memberships.component';
import { CancelMembershipComponent } from '../cancel-membership/cancel-membership.component';
import { MarkLeaveComponent } from '../mark-leave/mark-leave.component';
import { MassLeaveComponent } from '../mass-leave/mass-leave.component';
import { CommonReportComponent } from '../reports/common-report/common-report.component';

@Component({
    selector: 'app-all-memberships',
    templateUrl: './all-memberships.component.html',
    styleUrls: ['./all-memberships.component.scss'],
})
export class AllMembershipsComponent implements OnInit {
    loading: boolean = false;
    Data: Observable<Object>;
    selectedProduct: any;
    selectedMembership: any = 'ACTIVE_MEMBERSHIPS';
    meal_pack_id: any = -1;
    leave_date: any;
    start_date: any;
    end_date: any;
    title: any;
    datePipe: DatePipe = new DatePipe('en-US');
    selectedStudents: any = [];
    allMemberships: any = [];
    MembershipList: any = [];
    items: MenuItem[];
    commonForm: FormGroup = new FormGroup({
        leave_date: new FormControl(new Date().toISOString().substring(0, 10), [
            Validators.required,
        ]),
    });
    constructor(
        public apiService: ApiService,
        private confirmationService: ConfirmationService,
        public messageService: MessageService,
        public dialogService: DialogService,
        public route: ActivatedRoute,
        public router: Router,
        public member: MemberService
    ) {
        this.isRowSelectable = this.isOnLeave.bind(this);
    }

    ngOnInit(): void {
        this.selectedStudents = [];
        this.MembershipList = [
            {
                value: 'ALL_MEMBERSHIPS',
                label: 'All Memberships',
            },
            {
                value: 'ACTIVE_MEMBERSHIPS',
                label: 'Active Memberships',
            },
            {
                value: 'INACTIVE_MEMBERSHIPS',
                label: 'Inactive Memberships',
            },
        ];

        this.fetchTransactions();
    }

    fetchTransactions() {
        if (this.selectedMembership == 'ACTIVE_MEMBERSHIPS') {
            this.items = [
                {
                    label: 'View',
                    icon: 'pi pi-fw pi-eye',
                    command: () => this.openProfile(),
                },
                {
                    separator: true,
                },
                {
                    label: 'Cancel Membership',
                    icon: 'pi pi-fw pi-times',
                    command: () => this.cancelMembership(),
                },
                {
                    label: 'Mark Leave',
                    icon: 'pi pi-fw pi-calendar-minus',
                    command: () => this.markLeave(),
                },
            ];
        } else {
            this.items = [
                {
                    label: 'View',
                    icon: 'pi pi-fw pi-eye',
                    command: () => this.openProfile(),
                },
            ];
        }
        this.loading = true;
        var url = `membership_data?what=${this.selectedMembership}`;
        var membershipFilter = ``;
        if (this.meal_pack_id != -1) {
            membershipFilter = `&membership_id=${this.meal_pack_id}`;
        }
        var dateFilter = ``;
        if (
            this.start_date != null &&
            this.end_date != null &&
            this.start_date != '' &&
            this.end_date != ''
        ) {
            const start_date = this.datePipe.transform(
                this.start_date,
                'dd-MM-yyyy'
            );
            const end_date = this.datePipe.transform(
                this.end_date,
                'dd-MM-yyyy'
            );
            dateFilter = `&membership_start_date=${start_date}&membership_end_date=${end_date}`;
        }
        this.Data = this.apiService
            .getTypeRequest(url + membershipFilter + dateFilter)
            .pipe(
                map((res: any) => {
                    this.allMemberships = res.data;
                    return res.data;
                    // {
                    //     "member_id": "2",
                    //     "card_number": "74475537390124",
                    //     "counter_id": "1",
                    //     "full_name": "1full_ssaaaname",
                    //     "gender": "1gender",
                    //     "phone_number": "1phone_number",
                    //     "parents_ph": "1parents_ph",
                    //     "dob": "0000-00-00",
                    //     "email": "1email",
                    //     "school_name": "new school name",
                    //     "class_name": "1class_name",
                    //     "division_name": "1division_name",
                    //     "hostel_details": "1hostel_details",
                    //     "photo_url": "https:\/\/thetechvaidya.com\/cooksbook_new\/uploads\/default_logo.png",
                    //     "profile_photo": "default_logo.png",
                    //     "member_type_id": "1",
                    //     "member_type": "Studet",
                    //     "address": "1address",
                    //     "status": "1",
                    //     "balance": "-3120.00",
                    //     "membership_data": {
                    //         "membership_id": "4",
                    //         "member_id": "2",
                    //         "counter_id": "1",
                    //         "membership_number": "MT23052023000001",
                    //         "meal_pack_id": "10",
                    //         "meal_pack_name": "Testing Meal Pack ",
                    //         "price_per_pack": "130.00",
                    //         "total_meal_packs": "25",
                    //         "total_amount": "3250.00",
                    //         "max_days": "30",
                    //         "start_date": "22-05-2023",
                    //         "end_date": "20-06-2023",
                    //         "is_active": "1",
                    //         "is_on_leave": "0",
                    //         "sale_date": "22-05-2023",
                    //         "membership_particulars": [
                    //             {
                    //                 "membership_particular_id": "7",
                    //                 "meal_name": "BREAKFAST",
                    //                 "price": "60.00",
                    //                 "total_meals": "25",
                    //                 "remaining_meals": "25"
                    //             },
                    //             {
                    //                 "membership_particular_id": "8",
                    //                 "meal_name": "LUNCH",
                    //                 "price": "70.00",
                    //                 "total_meals": "25",
                    //                 "remaining_meals": "25"
                    //             }
                    //         ]
                    //     }
                    // }
                })
            );
        this.loading = false;
    }

    showLeaveDialog() {
        const ref = this.dialogService.open(MassLeaveComponent, {
            data: {
                selectedStudents: this.selectedStudents,
                operation: 'start',
            },
            header: `Start Leave`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-5',
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.ngOnInit();
            }
        });
    }

    clear(table: Table) {
        table.clear();
    }

    isRowSelectable(event) {
        return !this.isOnLeave(event.data);
    }

    isOnLeave(product) {
        return product?.membership_data?.is_on_leave == 0 ? false : true;
    }

    add() {
        var newMembershipType: MembershipType;
        const ref = this.dialogService.open(AddMembershipsComponent, {
            data: newMembershipType,
            header: `Add MemberShip`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-5',
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.ngOnInit();
            }
        });
    }

    openProfile() {
        this.member.setMemberData(this.selectedProduct);
        this.router.navigate(['../../members/memberProfile'], { relativeTo: this.route });
    }

    markLeave() {
        const ref = this.dialogService.open(MarkLeaveComponent, {
            data: this.selectedProduct,
            header: `Leave Details`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-5',
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.ngOnInit();
            }
        });
    }

    printMembership() {
        // //
        this.dialogService.open(ActiveMembershipReceiptComponent, {
            data: {
                membershipDetails: this.selectedProduct,
            },
            header: `MemberShip Details`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-6',
        });
    }

    printMembership2Inc() {
        // //
        this.dialogService.open(NewMembershipReceiptComponent, {
            data: this.selectedProduct,
            header: `MemberShip Details`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-6',
        });
    }

    cancelMembership() {
        const ref = this.dialogService.open(CancelMembershipComponent, {
            data: this.selectedProduct,
            header: `Cancel MemberShip`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-6',
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.ngOnInit();
            }
        });
    }

    confirm() {
        this.confirmationService.confirm({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            accept: () => {
                this.delete();
            },
        });
    }

    delete() {
        this.loading = true;
        var Data = {
            membership_type_id: this.selectedProduct.membership_type_id,
        };
        this.apiService
            .postTypeRequest(`membership_type_ops/delete`, Data)
            .toPromise()
            .then((resopnse: any) => {
                if (resopnse.result) {
                    this.ngOnInit();
                    this.messageService.add({
                        severity: 'warn',
                        summary: resopnse.message,
                        detail: 'Via MessageService',
                    });
                }
            })
            .finally(() => {
                this.loading = false;
            });
    }

    generatePDF() {
        const start_date = this.datePipe.transform(
            this.start_date,
            'dd-MM-yyyy'
        );
        const end_date = this.datePipe.transform(this.end_date, 'dd-MM-yyyy');
        const period = `${start_date} - ${end_date}`;
        this.title = this.MembershipList.find(
            (data: any) => data.value == this.selectedMembership
        ).label;

        this.dialogService.open(CommonReportComponent, {
            data: {
                data: this.allMemberships,
                period: period,
                title: this.title,
            },
            header: this.title,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-6',
        });
    }
    generateExcel() {}
}
