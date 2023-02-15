import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MemberService } from 'src/app/core/services/MemberService/member.service';
import { PosSaleComponent } from '../../receipt/pos-sale/pos-sale.component';

@Component({
    selector: 'app-pos-history',
    templateUrl: './pos-history.component.html',
    styleUrls: ['./pos-history.component.scss'],
})
export class PosHistoryComponent implements OnInit {
    Data: any[] = [];
    loading: boolean = false;
    displayTransaction: boolean = false;
    selectedProduct: any;
    items: MenuItem[];
    datePipe: DatePipe = new DatePipe('en-US');
    start_date: any;
    end_date: any;
    User:any;
    transaction_range:any;
    constructor(
        public apiService: ApiService,
        public dialogService: DialogService,
        public messageService: MessageService,
        public memberService: MemberService
    ) {}

    ngOnInit(): void {
        this.User = this.memberService.getUserData().user_role
        this.transaction_range = this.User == "OWNER"? this.memberService.getSettings().transaction_range:0
        this.end_date = new Date().toISOString().substring(0, 10);
        this.start_date = this.datePipe.transform(
            new Date().setDate(
                new Date().getDate() -
                    this.transaction_range
            ),
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
        this.loadData();
    }

    loadData() {
        this.loading = true;
        var Data = {
            start_date: this.start_date,
            end_date: this.end_date,
        };
        this.apiService
            .getTypeRequest(`table_data/POS_SALES`)
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
        this.displayTransaction = true;
    }

    printMembership2Inc() {
        //
        this.dialogService.open(PosSaleComponent, {
            data: this.selectedProduct,
            header: `POS Sale Details`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-6',
        });
    }
}
