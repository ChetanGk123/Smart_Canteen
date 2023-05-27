import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { map, Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MemberService } from '../../members/member.service';
import { CommonReportComponent } from '../reports/common-report/common-report.component';

@Component({
    selector: 'app-inactive-memberships',
    templateUrl: './inactive-memberships.component.html',
    styleUrls: ['./inactive-memberships.component.scss'],
})
export class InactiveMembershipsComponent implements OnInit {
    loading: boolean = false;
    Data: Observable<Object>;
    selectedProduct: any;
    meal_pack_id: any = -1;
    start_date: any;
    end_date: any;
    datePipe: DatePipe = new DatePipe('en-US');
    selectedStudents: any = [];
    allMemberships: any = [];
    items: MenuItem[];
    constructor(
        public apiService: ApiService,
        private confirmationService: ConfirmationService,
        public messageService: MessageService,
        public dialogService: DialogService,
        public router: Router,
        public member: MemberService
    ) {}

    ngOnInit(): void {
        this.items = [];

        this.fetchTransactions();
    }

    fetchTransactions() {
        this.loading = true;
        var url = `membership_data?what=INACTIVE_MEMBERSHIPS`;
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
            dateFilter = `&membership_start_date=${start_date}&membership_end_date=${end_date}`;
        }
        this.Data = this.apiService
            .getTypeRequest(url + membershipFilter + dateFilter)
            .pipe(
                map((res: any) => {
                    this.loading = false;
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
    }

    generatePDF() {
        const start_date = this.datePipe.transform(
            this.start_date,
            'dd-MM-yyyy'
        );
        const end_date = this.datePipe.transform(this.end_date, 'dd-MM-yyyy');
        const period = `${start_date} - ${end_date}`;
        this.dialogService.open(CommonReportComponent, {
            data: {
                data: this.allMemberships,
                period: period,
                title: 'Inactive Memberships',
            },
            header: `Inactive MemberShips`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-6',
        });
    }
    generateExcel() {}
}
