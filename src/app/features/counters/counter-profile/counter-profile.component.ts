import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/core/services/api/api.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { CounterService } from '../counter.service';
import { ManageCounterComponent } from '../manage-counter/manage-counter.component';

@Component({
    selector: 'app-counter-profile',
    templateUrl: './counter-profile.component.html',
    styleUrls: ['./counter-profile.component.scss'],
})
export class CounterProfileComponent implements OnInit {
    counterData: any;
    licenceData: any;
    loading: boolean = false;
    licenseDialog: boolean = false;
    user_role: any;
    constructor(
        public counterService: CounterService,
        public apiService: ApiService,
        public authService: AuthService,
        public router: Router,
        public route: ActivatedRoute,
        public dialogService: DialogService
    ) {}

    ngOnInit(): void {
        this.user_role = this.authService.getUser().user_role;
        this.counterData = this.counterService.getCounterProfileData();
        if (this.counterData) {
            this.apiService
                .getTypeRequest(
                    `specific_data/COUNTER_LICENSE/${this.counterData.id}`
                )
                .toPromise()
                .then((result: any) => {
                    this.loading = false;
                    this.licenceData = result?.data;
                    /* "data": {
                        "counter_id": "2",
                        "license_number": "K2PFP-8388Y-9ALV3-KCV79",
                        "start_date": "29-01-2023",
                        "end_date": "29-01-2024",
                        "license_plan": "365 plan",
                        "status": "1"
                    } */
                });
        } else {
            this.router.navigate(['../'], { relativeTo: this.route });
        }
        //this.updateLicenseData()
    }

    editCounterData() {
        const ref = this.dialogService.open(ManageCounterComponent, {
            header: `Update Counter`,
            data: this.counterData,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-6',
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.getCounterData();
            }
        });
    }

    getCounterData() {
        this.loading = true;
        this.apiService
            .getTypeRequest(`specific_data/COUNTER/${this.counterData.id}`)
            .toPromise()
            .then((result: any) => {
                this.loading = false;
                this.counterData = result?.data;
            });
    }

    updateLicenseData() {
        /*
    post: /api/v1/license_ops/insert
    payload: {
        "counter_id":1,
        "license_start_date":"29-01-2023",
        "no_of_days":365
        }
    */
        var data = {
            counter_id: this.counterData.id,
            license_start_date: '29-01-2023',
            no_of_days: 365,
        };
        this.apiService
            .postTypeRequest(`license_ops/insert`, data)
            .toPromise()
            .then((result: any) => {
                this.loading = false;
                this.licenceData = result?.data;
            });
    }
}
