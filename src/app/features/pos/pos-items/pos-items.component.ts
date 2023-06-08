import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
// import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
import { CounterService } from '../../counters/counter.service';
import { ConfigureMealPackComponent } from '../../meal/meal-pack/configure-meal-pack/configure-meal-pack.component';
import { MemberService } from '../../members/member.service';
import { AddPosComponent } from '../add-pos/add-pos.component';
import { PosService } from '../pos.service';
import { PosItemsReportComponent } from '../Reports/pos-items/pos-items-report.component';
import { UpdateImageComponent } from '../update-image/update-image.component';
import { UpdatePosComponent } from '../update-pos/update-pos.component';
import { PosDetailsComponent } from './pos-details/pos-details.component';

@Component({
    selector: 'app-pos-items',
    templateUrl: './pos-items.component.html',
    styleUrls: ['./pos-items.component.scss'],
})
export class PosItemsComponent implements OnInit, OnDestroy {
    Data: any;
    title: any;
    loading: boolean = false;
    selectedProduct: any;
    items: MenuItem[];
    counter_id: any;
    // Private
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        public apiService: ApiService,
        private confirmationService: ConfirmationService,
        public messageService: MessageService,
        public dialogService: DialogService,
        public router: Router,
        public route: ActivatedRoute,
        public posService: PosService,
        public memberService: MemberService,
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
        var url = '';
        if (this.counter_id != '') {
            url = `/BY_COUNTER/${this.counter_id}`;
        }
        this.apiService
            .getTypeRequest(`table_data/POS_PARTICULAR${url}`)
            .toPromise()
            .then((result: any) => {
                this.loading = false;
                if (result.result) {
                    this.Data = result.data;
                } else {
                    this.Data = [];
                }
            });
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
        this.posService.setPosItemData(this.selectedProduct);
        this.router.navigate(['../posDetails'], { relativeTo: this.route });
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

    generatePDF() {
        //this.title = this.MembershipList.find((data:any)=> data.value == this.selectedMembership).label
        this.title = 'POS Items';
        this.dialogService.open(PosItemsReportComponent, {
            data: {
                data: this.Data,
                title: this.title,
            },
            header: this.title,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-6',
        });
    }
}
