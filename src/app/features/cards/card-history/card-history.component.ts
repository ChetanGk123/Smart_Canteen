import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { map, Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MemberService } from 'src/app/core/services/MemberService/member.service';
import { CardHistoryReportComponent } from '../reports/card-history-report/card-history-report.component';
import { CardDetailsComponent } from './card-details/card-details.component';

@Component({
    selector: 'app-all-cards',
    templateUrl: './card-history.component.html',
    styleUrls: ['./card-history.component.scss'],
})
export class CardHistoryComponent implements OnInit {
    Data: any[] = [];
    loading: boolean = false;
    selectedProduct: any;
    items: MenuItem[];
    start_date: any;
    meal_pack_id: any = -1;
    end_date: any = new Date().toISOString().substring(0, 10);
    datePipe: DatePipe = new DatePipe('en-US');
    constructor(
        public apiService: ApiService,
        public dialogService: DialogService,
        public messageService: MessageService,
        public member: MemberService,
        public router: Router
    ) {}

    /**
     * TODO: Add date filter
     **/
    ngOnInit(): void {
        this.loadData();
        this.items = [];
    }

    loadData() {
        this.loading = true;
        this.apiService
            .getTypeRequest(`table_data/CARD_UPDATE_DETAILS`)
            .toPromise()
            .then((result: any) => {
                this.loading = false;
                if (result.result) {
                    this.Data = result.data;
                }
            });
    }

    getCardDetails() {
        this.dialogService.open(CardDetailsComponent, {
            header: `Card Details`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-5',
        });
    }

    openProfile() {
        this.member.setMemberData(this.selectedProduct);
        this.router.navigate(['mess/memberProfile']);
    }

    generatePDF() {
        const start_date = this.datePipe.transform(
            this.start_date??new Date(),
            'dd-MM-yyyy'
        );
        const end_date = this.datePipe.transform(this.end_date??new Date(), 'dd-MM-yyyy');
        const period = `${start_date} - ${end_date}`;
        this.dialogService.open(CardHistoryReportComponent, {
            data: {
                data: this.Data,
                period: period,
                title: 'Card History',
            },
            header: `Card History`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-6',
        });
    }
    generateExcel() {}
}
