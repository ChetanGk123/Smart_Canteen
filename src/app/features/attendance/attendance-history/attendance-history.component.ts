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
        this.items = [
            // {
            //     label: 'View',
            //     icon: 'pi pi-fw pi-eye',
            //     // command: () => this.view(),
            // },
            // {
            //     label: 'Invalidate Card',
            //     icon: 'pi pi-fw pi-credit-card',
            //     // command: () => this.updateCard(),
            // },
            // {
            //     separator: true,
            // },
            // {
            //     label: 'Activate Member',
            //     icon: 'pi pi-fw pi-user-plus',
            //     // command: () => this.Activate(),
            // },
        ];
        this.loadData();
    }

    loadData() {
        this.loading = true;
        var Data = {
            start_date: this.start_date,
            end_date: this.end_date,
        };
        this.apiService
            .getTypeRequest(`attendance_data?what=ALL_ATTENDANCE`)
            .toPromise()
            .then((result: any) => {
                this.loading = false;
                if (result.result) {
                    this.Data = result.data;
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
