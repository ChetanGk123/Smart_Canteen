import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MemberService } from '../../members/member.service';

@Component({
    selector: 'app-attendance-history',
    templateUrl: './attendance-history.component.html',
    styleUrls: ['./attendance-history.component.scss'],
})
export class AttendanceHistoryComponent implements OnInit {
    Data: any[] = [];
    loading: boolean = false;
    selectedProduct: any;
    items: MenuItem[];
    datePipe: DatePipe = new DatePipe('en-US');
    start_date: any;
    end_date: any;
    transaction_range: any;
    User: any;
    constructor(
        public apiService: ApiService,
        public dialogService: DialogService,
        public messageService: MessageService,
        public memberService: MemberService,
        public router: Router
    ) {}

    ngOnInit(): void {
        this.User = this.memberService.getUserData().user_role;
        this.transaction_range = 30;
        this.end_date = new Date().toISOString().substring(0, 10);
        this.start_date = this.datePipe.transform(
            new Date().setDate(new Date().getDate() - this.transaction_range),
            'yyyy-MM-dd'
        );
        this.loadData();
    }

    loadData() {
        this.loading = true;
        var url = `attendance_data?what=ALL_ATTENDANCE`;
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
            dateFilter = `&attendance_start_date=${start_date}&attendance_end_date=${end_date}`;
        }
        this.apiService
            .getTypeRequest(url + dateFilter)
            .toPromise()
            .then((result: any) => {
                this.loading = false;
                if (result.result) {
                    this.Data = result.data;
                    // {
                    //     "attendance_id": "8",
                    //     "counter_id": "1",
                    //     "member_id": "1",
                    //     "card_number": "74475537390120",
                    //     "phone_number": "963254101",
                    //     "parents_ph": "963254101",
                    //     "dob": "00-00-0000",
                    //     "email": null,
                    //     "school_name": "Public School Bangalore",
                    //     "class_name": "3",
                    //     "division_name": null,
                    //     "hostel_details": null,
                    //     "photo_url": "https:\/\/thetechvaidya.com\/cooksbook_new\/uploads\/member_docs\/BH47RD79.png",
                    //     "profile_photo": "member_docs\/BH47RD79.png",
                    //     "membership_id": "6",
                    //     "meal_name": "LUNCH",
                    //     "attendance_date_time": "29-05-2023 06:17:52 PM",
                    //     "raw_attendance_date_time": "2023-05-29 18:17:52",
                    //     "meal_pack_id": "11",
                    //     "meal_pack_name": "Full Day Meals"
                    // },
                }
            })
            .finally(() => {
                this.loading = false;
            });
    }

    openProfile() {
        this.memberService.setMemberData(this.selectedProduct);
        this.router.navigate(['members/memberProfile']);
    }
}
