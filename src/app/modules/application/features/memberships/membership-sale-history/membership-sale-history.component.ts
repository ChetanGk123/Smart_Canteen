import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { map, Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MemberService } from 'src/app/core/services/MemberService/member.service';
import { MembershipSaleHistoryReportComponent } from '../reports/membership-sale-history-report/membership-sale-history-report.component';

@Component({
    selector: 'app-membership-sale-history',
    templateUrl: './membership-sale-history.component.html',
    styleUrls: ['./membership-sale-history.component.scss'],
})
export class MembershipSaleHistoryComponent implements OnInit {
    loading: boolean = false;
    Data: Observable<Object>;
    selectedProduct: any;
    start_date: any;
    meal_pack_id: any = -1;
    transaction_range: any;
    end_date: any;
    datePipe: DatePipe = new DatePipe('en-US');
    selectedStudents: any = [];
    allMemberships: any = [];
    membershipList: any = [];
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
        this.transaction_range = 30;
        this.end_date = new Date().toISOString().substring(0, 10);
        this.start_date = this.datePipe.transform(
            new Date().setDate(new Date().getDate() - this.transaction_range),
            'yyyy-MM-dd'
        );
        this.selectedStudents = [];
        this.membershipList = [];
        this.membershipList.push({
            meal_pack_id: '-1',
            counter_id: '',
            meal_pack_name: 'All',
        });
        this.apiService
            .getTypeRequest(`table_data/MEAL_PACK_NAME`)
            .toPromise()
            .then((result: any) => {
                this.loading = false;
                if (result.result) {
                    result.data.forEach((element) => {
                        this.membershipList.push(element);
                    });
                } else {
                    this.membershipList = [];
                }
            });
        this.fetchTransactions();
    }

    fetchTransactions() {
        const start_date = this.datePipe.transform(
            this.start_date,
            'dd-MM-yyyy'
        );
        const end_date = this.datePipe.transform(this.end_date, 'dd-MM-yyyy');
        this.loading = true;
        var url = ``;
        if (this.meal_pack_id == -1) {
            url = `sales_history/MEMBERSHIP?what=DATEWISE_MEMBERSHIP_SALE_HISTORY`;
        } else {
            url = `sales_history/MEMBERSHIP?what=MEAL_PACK_NAMEWISE_MEMBERSHIP_SALE_HISTORY&meal_pack_id=${this.meal_pack_id}`;
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
            dateFilter = `&sale_start_date=${start_date}&sale_end_date=${end_date}`;
        }
        this.Data = this.apiService.getTypeRequest(url + dateFilter).pipe(
            map((res: any) => {
                this.loading = false;
                this.allMemberships = res.data;
                return res.data;
                // {
                //     "meal_pack_id": "10",
                //     "meal_pack_name": "Testing Meal Pack ",
                //     "price_per_pack": "130.00",
                //     "total_meal_packs": "25",
                //     "total_amount": "3250.00",
                //     "qty_sold": "1",
                //     "sale_date": "22-05-2023"
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
        this.dialogService.open(MembershipSaleHistoryReportComponent, {
            data: {
                data: this.allMemberships,
                period: period,
                title: 'Membership Sale History',
            },
            header: `MemberShip Sale History`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-6',
        });
    }
    generateExcel() {}
}
