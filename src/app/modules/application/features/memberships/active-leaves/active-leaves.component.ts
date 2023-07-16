import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { map, Observable } from 'rxjs';
import { MembershipType } from 'src/app/core/interfaces/appconfig';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MemberService } from 'src/app/core/services/MemberService/member.service';
import { MarkLeaveComponent } from '../mark-leave/mark-leave.component';
import { MassLeaveComponent } from '../mass-leave/mass-leave.component';
import { CommonReportComponent } from '../reports/common-report/common-report.component';
import { LeaveReportComponent } from '../reports/leave-report/leave-report.component';

@Component({
    selector: 'app-active-leaves',
    templateUrl: './active-leaves.component.html',
    styleUrls: ['./active-leaves.component.scss'],
})
export class ActiveLeavesComponent implements OnInit {
    loading: boolean = false;
    Data: Observable<Object>;
    meal_pack_id: any = -1;
    start_date: any;
    end_date: any;
    datePipe: DatePipe = new DatePipe('en-US');
    selectedStudents: any = [];
    allMemberships: any = [];
    selectedProduct: MembershipType;
    items: MenuItem[];
    constructor(
        public apiService: ApiService,
        public messageService: MessageService,
        public dialogService: DialogService,
        public router: Router,
        public member: MemberService
    ) {}

    ngOnInit(): void {
        this.items = [
            {
                label: 'End Leave',
                icon: 'pi pi-fw pi-calendar-minus',
                command: () => this.markLeave(),
            },
        ];

        this.fetchTransactions();
    }

    fetchTransactions() {
        this.loading = true;
        var url = `leave_data?what=ACTIVE_LEAVES`;
        var membershipFilter = ``;
        if (this.meal_pack_id != -1) {
            membershipFilter = `&membership_id=${this.meal_pack_id}`;
        }
        var dateFilter = ``;
        if (this.start_date != null && this.end_date != null) {
            const start_date = this.datePipe.transform(
                this.start_date,
                'dd-MM-yyyy'
            );
            const end_date = this.datePipe.transform(
                this.end_date,
                'dd-MM-yyyy'
            );
            dateFilter = `&leave_start_date=${start_date}&leave_end_date=${end_date}`;
        }
        this.Data = this.apiService
            .getTypeRequest(url + membershipFilter + dateFilter)
            .pipe(
                map((res: any) => {
                    this.loading = false;
                    this.allMemberships = res.data;
                    return res.data;
                    // {
                    //     "member_id": "1",
                    //     "card_number": "74475537390120",
                    //     "counter_id": "1",
                    //     "full_name": "faaaaaull_name",
                    //     "gender": "gender",
                    //     "phone_number": "phone_number",
                    //     "parents_ph": "parents_ph",
                    //     "dob": "00-00-0000",
                    //     "email": "email",
                    //     "school_name": "new school name",
                    //     "class_name": "class_name",
                    //     "division_name": "division_name",
                    //     "hostel_details": "hostel_details",
                    //     "photo_url": "https:\/\/thetechvaidya.com\/cooksbook_new\/uploads\/member_docs\/Y5I8VSAX.png",
                    //     "profile_photo": "member_docs\/Y5I8VSAX.png",
                    //     "member_type_id": "1",
                    //     "member_type": "Studet",
                    //     "address": "address",
                    //     "status": "1",
                    //     "balance": "-4900.00",
                    //     "membership_data": {
                    //         "leave_id": "1",
                    //         "member_id": "1",
                    //         "membership_id": "5",
                    //         "leave_start_date": "27-05-2023",
                    //         "raw_leave_start_date": "2023-05-27",
                    //         "leave_end_date": null,
                    //         "raw_leave_end_date": null,
                    //         "days_extended": "0",
                    //         "is_resumed": "0",
                    //         "membership_particulars": [
                    //             {
                    //                 "membership_particular_id": "9",
                    //                 "meal_name": "BREAKFAST",
                    //                 "meal_pack_item_id": "19",
                    //                 "meal_id": "1",
                    //                 "price": "60.00",
                    //                 "total_meals": "30",
                    //                 "remaining_meals": "30"
                    //             },
                    //             {
                    //                 "membership_particular_id": "10",
                    //                 "meal_name": "LUNCH",
                    //                 "meal_pack_item_id": "20",
                    //                 "meal_id": "2",
                    //                 "price": "70.00",
                    //                 "total_meals": "30",
                    //                 "remaining_meals": "30"
                    //             },
                    //             {
                    //                 "membership_particular_id": "11",
                    //                 "meal_name": "DINNER",
                    //                 "meal_pack_item_id": "21",
                    //                 "meal_id": "4",
                    //                 "price": "70.00",
                    //                 "total_meals": "30",
                    //                 "remaining_meals": "30"
                    //             }
                    //         ]
                    //     }
                    // }
                })
            );
    }

    clear(table: Table) {
        table.clear();
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

    add() {
        const ref = this.dialogService.open(MarkLeaveComponent, {
            header: `Add Leave`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-5',
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.ngOnInit();
            }
        });
    }

    showLeaveDialog() {
        const ref = this.dialogService.open(MassLeaveComponent, {
            data: {
                selectedStudents: this.selectedStudents,
                operation: 'end',
            },
            header: `End Leave`,
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
        this.router.navigate(['members/memberProfile']);
    }

    generatePDF() {
        const start_date = this.datePipe.transform(
            this.start_date,
            'dd-MM-yyyy'
        );
        const end_date = this.datePipe.transform(this.end_date, 'dd-MM-yyyy');
        const period = `${start_date} - ${end_date}`;
        this.dialogService.open(LeaveReportComponent, {
            data: {
                data: this.allMemberships,
                period: period,
                title: 'Active Membership Members On Leave',
            },
            header: `Active Membership Members On Leave`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-6',
        });
    }
    generateExcel() {}
}
