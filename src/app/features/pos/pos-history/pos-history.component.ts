import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
import { CounterService } from '../../counters/counter.service';
import { PosSaleHistoryListComponent } from '../../receipt/pos-sale-history-list/pos-sale-history-list.component';
import { PosSaleComponent } from '../../receipt/pos-sale/pos-sale.component';

@Component({
    selector: 'app-pos-history',
    templateUrl: './pos-history.component.html',
    styleUrls: ['./pos-history.component.scss'],
})
export class PosHistoryComponent implements OnInit, OnDestroy {
    Data: any[] = [];
    loading: boolean = false;
    displayTransaction: boolean = false;
    selectedProduct: any;
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
            {
                label: 'View',
                icon: 'pi pi-fw pi-eye',
                command: () => this.viewTransaction(),
            },
            {
                label: 'Print',
                icon: 'pi pi-fw pi-print',
                command: () => this.printMembership2Inc(),
            },
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
            .getTypeRequest(`table_data/POS_SALES${url}`)
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

    viewTransaction() {
        this.transactionDataLoading = true;
        this.apiService
            .getTypeRequest(`pos_sale_data/${this.selectedProduct.id}`)
            .toPromise()
            .then((result: any) => {
                if (result.result) {
                    this.transactionData = [];
                    result.data.slave_data.forEach((element) => {
                        this.transactionData.push(element);
                    });
                    this.transactionDataLoading = false;
                    this.displayTransaction = true;
                }
            });
    }

    printMembership2Inc() {
        //
        this.dialogService.open(PosSaleComponent, {
            data: this.selectedProduct,
            header: `POS Sale Details`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-6',
        });
    }

    printList() {
        this.dialogService.open(PosSaleHistoryListComponent, {
            data: this.Data,
            header: `Sales History`,
            styleClass: 'w-8  xs:w-12 sm:w-12 md:w-10 lg:w-9',
        });
    }
}
