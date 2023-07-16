import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MemberService } from 'src/app/core/services/MemberService/member.service';
import { Router } from '@angular/router';
import { ConfigService } from 'src/app/core/services/app.config.service';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
    dashboardData: any;
    consumablesList: any;
    Data: any;
    loading:boolean = true
    consumablesListLoading:boolean = true
    constructor(
        public configService: ConfigService,
        public apiService: ApiService,
        public member: MemberService,
        public router: Router
    ) {}

    ngOnInit() {
        this.loading = true
        this.apiService
            .getTypeRequest('dashboard_analytics')
            .toPromise()
            .then((result: any) => {
                this.dashboardData = result.data;
                this.loading = false
            });

        this.consumablesListLoading = true
        this.apiService
            .getTypeRequest('consumables_data?meal_date=01-06-2023')
            .toPromise()
            .then((result: any) => {
                this.consumablesList  = result.data.consumables_list;
                this.consumablesListLoading = false
            });

    }
}
