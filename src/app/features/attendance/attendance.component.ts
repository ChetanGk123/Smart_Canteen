import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MemberService } from '../members/member.service';

@Component({
    selector: 'app-attendance',
    templateUrl: './attendance.component.html',
    styleUrls: ['./attendance.component.scss'],
})
export class AttendanceComponent implements OnInit {
    loading: boolean = false;
    messages: Message[];
    Data: any;
    memberData: any;
    currentComponent: any;
    pos_sale_data: any;
    membershipData: any;
    commonForm: FormGroup = new FormGroup({
        card_number: new FormControl('', [Validators.required]),
    });
    constructor(
        public apiService: ApiService,
        public messageService: MessageService,
        public dialogService: DialogService,
        public router: Router,
        public route: ActivatedRoute,
        public member: MemberService
    ) {}

    ngOnInit(): void {
        this.deleteAttandance();
        this.commonForm.controls.card_number.setValue('74475537390120');
        this.loadData();
    }

    loadData() {
        if (this.commonForm.controls.card_number.value.length >= 14) {
            this.loading = true;
            const Data = this.commonForm.controls.card_number.value;
            this.commonForm.reset();
            this.messages = [];
            this.memberData = null;
            this.apiService
                .getTypeRequest(`mark_attendance/${Data}`)
                .toPromise()
                .then((result: any) => {
                    this.loading = false;
                    if (result.result) {
                        // {
                        //     "member_data": {
                        //         "member_id": "1",
                        //         "card_number": "74475537390120",
                        //         "counter_id": "1",
                        //         "full_name": "faaaaaull_name",
                        //         "gender": "gender",
                        //         "phone_number": "phone_number",
                        //         "parents_ph": "parents_ph",
                        //         "dob": "00-00-0000",
                        //         "email": "email",
                        //         "school_name": "new school name",
                        //         "class_name": "class_name",
                        //         "division_name": "division_name",
                        //         "hostel_details": "hostel_details",
                        //         "photo_url": "https://thetechvaidya.com/cooksbook_new/uploads/member_docs/Y5I8VSAX.png",
                        //         "profile_photo": "member_docs/Y5I8VSAX.png",
                        //         "member_type_id": "1",
                        //         "member_type": "Studet",
                        //         "address": "address",
                        //         "status": "1",
                        //         "balance": "-4900.00"
                        //     },
                        //     "membership_data": {
                        //         "isMembershipActive": true,
                        //         "isActiveLeave": false,
                        //         "active_membership_data": {
                        //             "membership_id": "5",
                        //             "member_id": "1",
                        //             "counter_id": "1",
                        //             "membership_number": "MT25052023000002",
                        //             "meal_pack_id": "11",
                        //             "meal_pack_name": "Full Day Meals",
                        //             "price_per_pack": "200.00",
                        //             "total_meal_packs": "30",
                        //             "total_amount": "6000.00",
                        //             "max_days": "30",
                        //             "start_date": "25-05-2023",
                        //             "end_date": "23-06-2023",
                        //             "is_active": "1",
                        //             "is_on_leave": "0",
                        //             "sale_date": "25-05-2023",
                        //             "membership_particulars": [
                        //                 {
                        //                     "membership_particular_id": "9",
                        //                     "meal_name": "BREAKFAST",
                        //                     "meal_pack_item_id": "19",
                        //                     "meal_id": "1",
                        //                     "price": "60.00",
                        //                     "total_meals": "30",
                        //                     "remaining_meals": "30"
                        //                 },
                        //                 {
                        //                     "membership_particular_id": "10",
                        //                     "meal_name": "LUNCH",
                        //                     "meal_pack_item_id": "20",
                        //                     "meal_id": "2",
                        //                     "price": "70.00",
                        //                     "total_meals": "30",
                        //                     "remaining_meals": "30"
                        //                 },
                        //                 {
                        //                     "membership_particular_id": "11",
                        //                     "meal_name": "DINNER",
                        //                     "meal_pack_item_id": "21",
                        //                     "meal_id": "4",
                        //                     "price": "70.00",
                        //                     "total_meals": "30",
                        //                     "remaining_meals": "30"
                        //                 }
                        //             ]
                        //         }
                        //     },
                        //     "attendance_data": {
                        //         "current_particular": {
                        //             "meal_pack_item_id": "21",
                        //             "meal_pack_id": "11",
                        //             "meal_id": "4",
                        //             "meal_name": "DINNER",
                        //             "meal_price": "70.00",
                        //             "meal_start_time": "08:00:00 PM",
                        //             "raw_meal_start_time": "20:00:00",
                        //             "meal_end_time": "10:30:00 PM",
                        //             "raw_meal_end_time": "22:30:00"
                        //         },
                        //         "attendanceEligibility": true,
                        //         "isAttendanceMarked": true
                        //     },
                        //     "pos_sale_data": {
                        //         "anyParticularsNow": false,
                        //         "isMultiplePOSItems": false,
                        //         "particularsNow": [],
                        //         "defaultSaleData": []
                        //     }
                        // }
                        this.Data = result.data;
                        this.memberData = result.data.member_data;
                        this.currentComponent = result.data.attendance_data;
                        this.membershipData = result.data.membership_data;
                        this.pos_sale_data = result.data.pos_sale_data;
                        this.messages = [
                            {
                                severity: 'success',
                                summary: 'success',
                                detail: result.message,
                            },
                        ];
                    } else {
                        this.messages = [
                            {
                                severity: 'error',
                                summary: 'Error',
                                detail: result.message,
                            },
                        ];
                    }
                })
                .finally(() => {
                    //this.commonForm.reset();
                    this.loading = false;
                });
        }
    }
    deleteAttandance() {
        this.apiService
            .getTypeRequest('clear_attendance')
            .toPromise()
            .then((result: any) => {
                this.messages = [
                    {
                        severity: 'success',
                        summary: 'success',
                        detail: result.message,
                    },
                ];
            });
    }
}
