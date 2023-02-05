import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { map, Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
import { AddEditAccountComponent } from './add-edit-account/add-edit-account.component';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
    @Input() Url;
    @Input() header;
    public accountsData: Observable<Object>;
    selectedProduct: any;
    items: MenuItem[];
    loading: boolean = false;
    constructor(
        public apiService: ApiService,
        public dialogService: DialogService,
        public messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.loading = true;
        this.items = [
            {
                label: 'Update',
                icon: 'pi pi-fw pi-pencil',
                command: () => this.editData(this.selectedProduct),
            },
            /* {
                label: 'Direct Entry',
                icon: 'pi pi-fw pi-dollar',
                command: () => this.wildCardEntry(this.selectedProduct),
            }, */
            // {
            //     label: 'Transactions',
            //     icon: 'pi pi-fw pi-dollar',
            //     command: () => this.wildCardEntry(this.selectedProduct),
            // },
        ];
        this.accountsData = this.apiService
            .getTypeRequest(`table_data/${this.Url}`)
            .pipe(
                map((res: any) => {
                    this.loading = false;
                    return res.data;
                })
            );
        // .toPromise()
        // .then((result: any) => {
        //     this.loading = false;
        //     if (result.result) {
        //         this.accountsData = result.data;
        //     }
        // })
        // .then(() => (this.loading = false));
    }

    clear(table: Table) {
        table.clear();
    }

    add() {
        const ref = this.dialogService.open(AddEditAccountComponent, {
            data: {
                url: this.Url,
                wildCardEntry: false,
                isExpenseHead: this.Url === 'EXPENSE_ACCOUNT_HEAD' ? 1 : 0,
            },
            header: `Add ${this.header}`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-8',
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.ngOnInit();
            }
        });
    }

    editData(product: any) {
        const ref = this.dialogService.open(AddEditAccountComponent, {
            data: {
                data: product,
                wildCardEntry: false,
                url: this.Url,
                isExpenseHead: this.Url === 'EXPENSE_ACCOUNT_HEAD' ? 1 : 0,
            },
            header: `Edit Account Data`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-8',
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.ngOnInit();
            }
        });
    }

    confirm(product: any) {
        this.confirmationService.confirm({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            accept: () => {
                this.delete(product);
            },
        });
    }

    delete(product: any) {
        this.loading = true;
        var Data = {
            account_id: product.account_id,
        };
        this.apiService
            .postTypeRequest(`account_head_ops/delete`, Data)
            .toPromise()
            .then((resopnse: any) => {
                if (resopnse.result) {
                    this.ngOnInit();
                    this.messageService.add({
                        severity: 'warn',
                        summary: resopnse.message,
                        detail: 'Via MessageService',
                    });
                }
            })
            .finally(() => {
                this.loading = false;
            });
    }

    /* accountTransfer() {
        var sourceUrl = 'INCOME_ACCOUNT_HEAD';
        var destinationUrl = this.Url;

        const ref = this.dialogService.open(AccountTransferComponent, {
            data: {
                sourceUrl: sourceUrl,
                destinationUrl: destinationUrl,
                url: 'account_head_txn/ACC_HEAD_BALANCE_TRANSFER',
            },
            header: `Account Transfer`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-8',
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.ngOnInit();
            }
        });
    } */
}
