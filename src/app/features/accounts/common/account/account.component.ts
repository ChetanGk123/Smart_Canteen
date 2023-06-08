import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { map, Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
import { AccountTransferComponent } from '../../account-transfer/account-transfer.component';
import { AccountsReportComponent } from '../../reports/accounts-report/accounts-report.component';
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
    Data: any[];
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
            // {
            //     label: 'Transactions',
            //     icon: 'pi pi-fw pi-dollar',
            //     command: () => this.directAccountCredit(this.selectedProduct),
            // },
        ];

        if (this.Url != 'COMMODITY_ACCOUNT') {
            this.items.push(
                {
                    label: 'Update',
                    icon: 'pi pi-fw pi-pencil',
                    command: () => this.editData(this.selectedProduct),
                },
                {
                    label: 'Delete',
                    icon: 'pi pi-fw pi-trash',
                    command: () => this.confirm(this.selectedProduct),
                },
                {
                    separator: true,
                },
                {
                    label: 'Direct Credit',
                    icon: 'pi pi-fw pi-dollar',
                    command: () => this.directAccountCredit(this.selectedProduct),
                },
                {
                    label: 'Direct Debit',
                    icon: 'pi pi-fw pi-dollar',
                    command: () => this.directAccountDebit(this.selectedProduct),
                },
            );
        }
        this.accountsData = this.apiService
            .getTypeRequest(`table_data/${this.Url}`)
            .pipe(
                map((res: any) => {
                    this.loading = false;
                    this.Data = res.data;
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
            account_head_id: product.account_head_id,
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

    directAccountCredit(product: any) {
        var destinationUrl = this.Url;
        const ref = this.dialogService.open(AccountTransferComponent, {
            data: {
                data: product,
                destinationUrl: destinationUrl,
                wildCardEntry: true,
                url: 'transaction_ops/ACC_HEAD_CREDIT',
            },
            header: `Credit Account Balance`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-8',
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.ngOnInit();
            }
        });
    }

    directAccountDebit(product: any) {
        var destinationUrl = this.Url;
        const ref = this.dialogService.open(AccountTransferComponent, {
            data: {
                data: product,
                destinationUrl: destinationUrl,
                wildCardEntry: true,
                url: 'transaction_ops/ACC_HEAD_DEBIT',
            },
            header: `Debit Account Balance`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-8',
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.ngOnInit();
            }
        });
    }

    accountTransfer() {
        var sourceUrl = 'INCOME_ACCOUNT_HEAD';
        var destinationUrl = 'EXPENSE_ACCOUNT_HEAD';
        if (this.Url == 'EXPENSE_ACCOUNT_HEAD') {
            sourceUrl = 'EXPENSE_ACCOUNT_HEAD';
            destinationUrl = 'INCOME_ACCOUNT_HEAD';
        } else {
            sourceUrl = 'INCOME_ACCOUNT_HEAD';
            destinationUrl = 'EXPENSE_ACCOUNT_HEAD';
        }

        const ref = this.dialogService.open(AccountTransferComponent, {
            data: {
                sourceUrl: sourceUrl,
                destinationUrl: destinationUrl,
                url: 'transaction_ops/ACC_TRANSFER',
            },
            header: `Account Transfer`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-8',
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.ngOnInit();
            }
        });
    }

    generatePDF() {
        this.dialogService.open(AccountsReportComponent, {
            data: {
                data: this.Data,
                title: `${this.header}`,
            },
            header: `${this.header}`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-6',
        });
    }
    generateExcel() {}
}
