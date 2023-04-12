import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/core/services/api/api.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { CounterService } from './counter.service';
import { ManageCounterComponent } from './manage-counter/manage-counter.component';

@Component({
    selector: 'app-counters',
    templateUrl: './counters.component.html',
    styleUrls: ['./counters.component.scss'],
})
export class CountersComponent implements OnInit {
    tableData: any;
    user_role: any;
    loading: boolean = false;
    constructor(
        public counterService: CounterService,
        public apiService: ApiService,
        public authService: AuthService,
        public router: Router,
        public route: ActivatedRoute,
        public dialogService: DialogService
    ) {}

    ngOnInit(): void {
        this.loadData();
        this.counterService.counterProfileDate$.subscribe((data: any) => {
            console.log(data);
        });
    }

    loadData() {
        this.user_role = this.authService.getUser().user_role;
        this.loading = true;
        this.apiService
            .getTypeRequest(`table_data/COUNTER`)
            .toPromise()
            .then((result: any) => {
                this.loading = false;
                this.tableData = result?.data;
            });
    }

    addNewCounter() {
        const ref = this.dialogService.open(ManageCounterComponent, {
            header: `Add New Counter`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-6',
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.loadData();
            }
        });
    }

    updateCounter(data: any) {
        const ref = this.dialogService.open(ManageCounterComponent, {
            header: `Update Counter`,
            data: data,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-6',
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.loadData();
            }
        });
    }

    openCounterFrofile(data: any) {
        this.counterService.setCounterProfileData(data);
        this.router.navigate(['./counterProfile'], { relativeTo: this.route });
    }
}
