import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { ApiService } from 'src/app/core/services/api/api.service';
import { UpdateImageComponent } from '../update-image/update-image.component';
import { EditMainCategoryComponent } from './edit-main-category/edit-main-category.component';

@Component({
    selector: 'app-main-category',
    templateUrl: './main-category.component.html',
    styleUrls: ['./main-category.component.scss'],
})
export class MainCategoryComponent implements OnInit {
    Url: string = 'POS_MAIN_CATEGORY';
    Title: string = 'Main Category';
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
        /* this.items = [
            {
                label: 'Update Image',
                icon: 'pi pi-fw pi-image',
                command: () => this.udateImage(),
            },
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
            .getTypeRequest(`table_data/POS_MAIN_CATEGORY`)
            .toPromise()
            .then((result: any) => {
                this.loading = false;
                if (result.result) {
                    this.Data = result.data;
                }
            }); */
    }

    clear(table: Table) {
        table.clear();
    }

    udateImage() {
        const ref = this.dialogService.open(UpdateImageComponent, {
            header: `Update ${this.selectedProduct.name} Image`,
            data: {
                Url: 'file_upload/POS_MAIN_CATEGORY',
                id: this.selectedProduct.id,
            },
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-8',
        });

        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.ngOnInit();
            }
        });
    }

    add() {
        const ref = this.dialogService.open(EditMainCategoryComponent, {
            header: `Add New Cateory`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-8',
        });

        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.ngOnInit();
            }
        });
    }

    edit() {
        const ref = this.dialogService.open(EditMainCategoryComponent, {
            header: `Edit Category`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-8',
            data: {
                data: this.selectedProduct,
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
        this.apiService
            .postTypeRequest(
                `item_ops/delete/${this.Url}`,
                this.selectedProduct
            )
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
