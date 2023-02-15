import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
// import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { map, Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
import { AddPosComponent } from '../add-pos/add-pos.component';
import { UpdateImageComponent } from '../update-image/update-image.component';
import { UpdatePosComponent } from '../update-pos/update-pos.component';
import { PosDetailsComponent } from './pos-details/pos-details.component';

@Component({
    selector: 'app-pos-items',
    templateUrl: './pos-items.component.html',
    styleUrls: ['./pos-items.component.scss'],
})
export class PosItemsComponent implements OnInit {
    Data: Observable<Object>;
    loading: boolean = false;
    selectedProduct: any;
    items: MenuItem[];
    constructor(
        public apiService: ApiService,
        private confirmationService: ConfirmationService,
        public messageService: MessageService,
        public dialogService: DialogService
    ) {}

    ngOnInit(): void {
        this.loading = true;
        this.items = [
            {
                label: 'Update Image',
                icon: 'pi pi-fw pi-image',
                command: () => this.udateImage(),
            },
            {
                label: 'View',
                icon: 'pi pi-fw pi-eye',
                command: () => this.view(),
            },
            {
                label: 'Update',
                icon: 'pi pi-fw pi-pencil',
                command: () => this.update(),
            },
            {
                label: 'Delete',
                icon: 'pi pi-fw pi-trash',
                command: () => this.confirm(),
            },
            {
                label: 'Update Stock',
                icon: 'pi pi-fw pi-upload',
                command: () => this.updateStock(),
            },
        ];
        this.Data = this.apiService
            .getTypeRequest(`table_data/POS_PARTICULAR`)
            .pipe(
                map((res: any) => {
                    this.loading = false;
                    return res.data;
                })
            );
    }

    clear(table: Table) {
        table.clear();
    }

    add() {
        const ref = this.dialogService.open(AddPosComponent, {
            header: `Add Item`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-5',
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.ngOnInit();
            }
        });
    }

    udateImage() {
        const ref = this.dialogService.open(UpdateImageComponent, {
            header: `Update ${this.selectedProduct.name} Image`,
            data: {
                Url: 'file_upload/POS_IMAGE',
                id: this.selectedProduct.id,
            },
            width: '60%',
        });

        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.ngOnInit();
            }
        });
    }

    view() {
        const ref = this.dialogService.open(PosDetailsComponent, {
            data: this.selectedProduct.id,
            header: `View Item Details`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-8',
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.ngOnInit();
            }
        });
    }

    update() {
        const ref = this.dialogService.open(AddPosComponent, {
            data: this.selectedProduct,
            header: `Update Item`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-5',
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.ngOnInit();
            }
        });
    }

    updateStock() {
        const ref = this.dialogService.open(UpdatePosComponent, {
            data: this.selectedProduct,
            header: `Update Stock`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-5',
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
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.delete();
            },
        });
    }

    delete() {
        this.loading = true;
        var Data = {
            id: this.selectedProduct.id,
        };
        this.apiService
            .postTypeRequest(`pos_particular_ops/delete`, Data)
            .toPromise()
            .then((resopnse: any) => {
                if (resopnse.result) {
                    this.ngOnInit();
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Deleted!',
                        detail: resopnse.message,
                    });
                }
            })
            .finally(() => {
                this.loading = false;
            });
    }
}
