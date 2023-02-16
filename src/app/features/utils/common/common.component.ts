import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { ApiService } from 'src/app/core/services/api/api.service';
import { CommonEditComponent } from './common-edit/common-edit.component';

@Component({
    selector: 'app-common',
    templateUrl: './common.component.html',
    styleUrls: ['./common.component.scss'],
})
export class CommonComponent implements OnInit {
    @Input() Url;
    @Input() Title;
    loading: boolean;
    dialog: boolean = false;
    selectedProduct: any;
    items: MenuItem[];
    Data = [];

    constructor(
        public apiService: ApiService,
        private confirmationService: ConfirmationService,
        public messageService: MessageService,
        public dialogService: DialogService
    ) {}

    ngOnInit(): void {
        this.items = [
            {
                label: 'Edit',
                icon: 'pi pi-fw pi-pencil',
                command: () => this.edit(),
            },
            {
                label: 'Delete',
                icon: 'pi pi-fw pi-trash',
                command: () => this.confirm(),
            },
        ];
        this.loading = true;
        this.apiService
            .getTypeRequest(`table_data/${this.Url}`)
            .toPromise()
            .then((result: any) => {
                this.loading = false;
                if (result.result) {
                    this.Data = result.data;
                }
            });
    }

    clear(table: Table) {
        table.clear();
    }

    add() {
        const ref = this.dialogService.open(CommonEditComponent, {
            header: `Add New ${this.Title}`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-8',
            data: {
                Url: this.Url,
                list: this.Data,
            },
        });

        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.ngOnInit();
            }
        });
    }

    edit() {
        // //

        const ref = this.dialogService.open(CommonEditComponent, {
            header: `Edit ${this.Title}`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-8',
            data: {
                data: this.selectedProduct,
                Url: this.Url,
                list: this.Data,
            },
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.ngOnInit();
            }
        });
    }

    confirm() {
        this.confirmationService.confirm({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            accept: () => {
                this.delete();
            },
        });
    }

    delete() {
        this.loading = true;
        var data = {
            item_id: Number(this.selectedProduct.id),
            counter_id: Number(this.selectedProduct.counter_id),
            item_name: this.selectedProduct.name,
        };
        this.apiService
            .postTypeRequest(`item_ops/${this.Url}/delete`, data)
            .toPromise()
            .then((resopnse: any) => {
                if (resopnse.result) {
                    this.ngOnInit();
                    this.messageService.add({
                        severity: 'warn',
                        summary: resopnse.message,
                        detail: 'Via MessageService',
                    });
                } else {
                    this.loading = false;
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: resopnse.message,
                    });
                }
            })
            .catch((error: any) => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Operation Unsuccessful',
                    detail: error.message,
                });
            });
    }
}