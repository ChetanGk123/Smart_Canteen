import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MemberService } from 'src/app/core/services/MemberService/member.service';
import { Router } from '@angular/router';
import { ConfigService } from 'src/app/core/services/app.config.service';
import { CounterService } from '../counters/counter.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
    dashboardData: any;
    consumablesList: any;
    Data: any;
    counter_id:any;
    loading: boolean = true;
    consumablesListLoading: boolean = true;
    // Private
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        public configService: ConfigService,
        public counterService: CounterService,
        public apiService: ApiService,
        public member: MemberService,
        public router: Router
    ) {}

    ngOnInit() {
        this.counterService.counterDate$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data:any) => {
                this.counter_id = data?.id ?? ''
            });
            this.loadData();
    }

    loadData() {
        var url = '';
        if(this.counter_id){
            url = `/BY_COUNTER/${this.counter_id}`
        }
        this.loading = true;
        this.apiService
            .getTypeRequest(`dashboard_analytics${url}`)
            .toPromise()
            .then((result: any) => {
                this.dashboardData = result.data;
                this.loading = false;
            });

        this.consumablesListLoading = true;
        this.apiService
            .getTypeRequest('consumables_data?meal_date=01-06-2023')
            .toPromise()
            .then((result: any) => {
                this.consumablesList = result.data.consumables_list;
                this.consumablesListLoading = false;
            });
    }
}
