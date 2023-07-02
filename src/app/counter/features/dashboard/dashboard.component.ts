import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/services/api/api.service';
import { ConfigService } from '../../../core/services/app.config.service';
import { MemberService } from 'src/app/core/services/MemberService/member.service';
import { Router } from '@angular/router';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
    constructor(
        public configService: ConfigService,
        public apiService: ApiService,
        public member: MemberService,
        public router: Router
    ) {}

    ngOnInit() {
        this.apiService
            .getTypeRequest('dashboard_analytics')
            .toPromise()
            .then((result: any) => {
                console.log(result);
                // {
                //     "result": true,
                //     "message": "DATA RECEIVED",
                //     "data": {
                //         "count_analytics": {
                //             "total_members": "29",
                //             "active_members": "29",
                //             "inactive_members": "0",
                //             "total_memberships": "5",
                //             "active_memberships": "3",
                //             "inactive_memberships": "2",
                //             "active_leaves": "1"
                //         },
                //         "meals_list": [
                //             {
                //                 "meal_id": "1",
                //                 "meal_name": "BREAKFAST",
                //                 "meal_start_time": "12:00:00 AM",
                //                 "meal_end_time": "11:30:00 AM",
                //                 "raw_meal_start_time": "00:00:00",
                //                 "raw_meal_end_time": "11:30:00"
                //             },
                //             {
                //                 "meal_id": "1",
                //                 "meal_name": "BREAKFAST",
                //                 "meal_start_time": "08:00:00 AM",
                //                 "meal_end_time": "09:00:00 AM",
                //                 "raw_meal_start_time": "08:00:00",
                //                 "raw_meal_end_time": "09:00:00"
                //             },
                //             {
                //                 "meal_id": "1",
                //                 "meal_name": "BREAKFAST",
                //                 "meal_start_time": "09:00:00 AM",
                //                 "meal_end_time": "10:30:00 AM",
                //                 "raw_meal_start_time": "09:00:00",
                //                 "raw_meal_end_time": "10:30:00"
                //             },
                //             {
                //                 "meal_id": "2",
                //                 "meal_name": "LUNCH",
                //                 "meal_start_time": "11:31:00 AM",
                //                 "meal_end_time": "07:59:59 PM",
                //                 "raw_meal_start_time": "11:31:00",
                //                 "raw_meal_end_time": "19:59:59"
                //             },
                //             {
                //                 "meal_id": "2",
                //                 "meal_name": "LUNCH",
                //                 "meal_start_time": "12:00:00 PM",
                //                 "meal_end_time": "02:30:00 PM",
                //                 "raw_meal_start_time": "12:00:00",
                //                 "raw_meal_end_time": "14:30:00"
                //             },
                //             {
                //                 "meal_id": "2",
                //                 "meal_name": "LUNCH",
                //                 "meal_start_time": "01:00:00 PM",
                //                 "meal_end_time": "02:30:00 PM",
                //                 "raw_meal_start_time": "13:00:00",
                //                 "raw_meal_end_time": "14:30:00"
                //             },
                //             {
                //                 "meal_id": "4",
                //                 "meal_name": "DINNER",
                //                 "meal_start_time": "05:00:00 PM",
                //                 "meal_end_time": "04:59:59 PM",
                //                 "raw_meal_start_time": "17:00:00",
                //                 "raw_meal_end_time": "16:59:59"
                //             },
                //             {
                //                 "meal_id": "4",
                //                 "meal_name": "DINNER",
                //                 "meal_start_time": "09:00:00 PM",
                //                 "meal_end_time": "10:00:00 PM",
                //                 "raw_meal_start_time": "21:00:00",
                //                 "raw_meal_end_time": "22:00:00"
                //             }
                //         ]
                //     },
                //     "icon": "success",
                //     "status": "success"
                // }
            });
    }
}
