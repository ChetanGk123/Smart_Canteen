import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
import { CounterService } from '../../counters/counter.service';
import { PosItemHistoryReportComponent } from '../Reports/pos-item-history-report/pos-item-history-report.component';

@Component({
  selector: 'app-pos-item-history',
  templateUrl: './pos-item-history.component.html',
  styleUrls: ['./pos-item-history.component.scss']
})
export class PosItemHistoryComponent implements OnInit {

    Data: any[] = [];
    loading: boolean = false;
    displayTransaction: boolean = false;
    selectedProduct: any;
    title: any;
    items: MenuItem[];
    datePipe: DatePipe = new DatePipe('en-US');
    start_date: any;
    end_date: any;
    User: any;
    transactionData: Array<any> = [];
    transactionDataLoading: Boolean = false;
    transaction_range: any;
    counter_id: any;

    // Private
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        public apiService: ApiService,
        public dialogService: DialogService,
        public messageService: MessageService,
        public counterService: CounterService
    ) {}

    ngOnInit(): void {
        this.counterService.counterDate$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: any) => {
                this.counter_id = data?.id ?? '';
                this.loading = true;
                this.Data = [];
                this.loadData();
            });
        // this.User = this.memberService.getUserData()?.user_role
        // this.transaction_range = this.User == "OWNER"? this.memberService.getSettings()?.transaction_range:0
        this.transaction_range = 10;
        this.end_date = new Date().toISOString().substring(0, 10);
        this.start_date = this.datePipe.transform(
            new Date().setDate(new Date().getDate() - this.transaction_range),
            'yyyy-MM-dd'
        );
        this.items = [
            // {
            //     label: 'View',
            //     icon: 'pi pi-fw pi-eye',
            //     command: () => this.viewTransaction(),
            // },
            // {
            //     label: 'Print',
            //     icon: 'pi pi-fw pi-print',
            //     command: () => this.printMembership2Inc(),
            // },
        ];
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    loadData() {
        this.loading = true;
        var Data = {
            start_date: this.start_date,
            end_date: this.end_date,
        };
        var url = '';
        if (this.counter_id != '') {
            url = `/BY_COUNTER/${this.counter_id}`;
        }
        this.apiService
            .getTypeRequest(`sales_history/POS_SALES?what=DATEWISE_POS_SALE_HISTORY`)
            .toPromise()
            .then((result: any) => {
                this.loading = false;
                if (result.result) {
                    this.Data = result.data;
                    // {
                    //     "id": "36",
                    //     "master_id": "55",
                    //     "particular_id": "1",
                    //     "particular_name": "Idli",
                    //     "uom_name": "Plate",
                    //     "hsn_code": "hsn_code",
                    //     "pos_rate": "12.00",
                    //     "pos_discount_amt": "0.00",
                    //     "pos_discount_per": "1.00",
                    //     "sale_rate": "700.00",
                    //     "non_gst_sale_rate": "690.00",
                    //     "actual_discount_amt": "10.00",
                    //     "actual_discount_per": "0.00",
                    //     "sub_sale_rate": "700.00",
                    //     "rate_after_discount": "690.00",
                    //     "sale_qty": "1.00",
                    //     "item_sub_total": "690.00",
                    //     "gst_slab": null,
                    //     "isExclusiveGst": "1",
                    //     "gst_amount": "0.00",
                    //     "cgst_amount": "0.00",
                    //     "sgst_amount": "0.00",
                    //     "item_grand_total": "690.00",
                    //     "sale_date": "13-02-2023",
                    //     "total_sale_qty": "15"
                    // }
                }
            })
            .finally(() => {
                this.loading = false;
            });
    }

    generatePDF(){
        const start_date = this.datePipe.transform(
            this.start_date,
            'dd-MM-yyyy'
        );
        const end_date = this.datePipe.transform(this.end_date, 'dd-MM-yyyy');
        const period = `${start_date} - ${end_date}`;
            //this.title = this.MembershipList.find((data:any)=> data.value == this.selectedMembership).label

        this.dialogService.open(PosItemHistoryReportComponent, {
            data: {
                data: this.Data,
                period: period,
                title: this.title,
            },
            header: this.title,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-6',
        });
    }
}
