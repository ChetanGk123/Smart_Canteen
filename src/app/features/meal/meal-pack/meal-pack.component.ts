import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
import { CounterService } from '../../counters/counter.service';
import { MemberService } from '../../members/member.service';
import { ConfigureMealPackComponent } from './configure-meal-pack/configure-meal-pack.component';
import { EditMealPackNameComponent } from './edit-meal-pack-name/edit-meal-pack-name.component';

@Component({
    selector: 'app-meal-pack',
    templateUrl: './meal-pack.component.html',
    styleUrls: ['./meal-pack.component.scss'],
})
export class MealPackComponent implements OnInit, OnDestroy {
    loading: boolean;
    dialog: boolean = false;
    selectedProduct: any;
    items: MenuItem[];
    Data = [];
    counter_id: any;
    Title: any = 'Meal Pack';
    Url: any = 'MEAL_PACK_NAME';
    // Private
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        public apiService: ApiService,
        private confirmationService: ConfirmationService,
        public messageService: MessageService,
        public dialogService: DialogService,
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
                label: 'Edit',
                icon: 'pi pi-fw pi-pencil',
                command: () => this.edit(),
            },
            {
                label: 'Delete',
                icon: 'pi pi-fw pi-trash',
                command: () => this.confirm(),
            },
            {
                separator: true,
            },
            {
                label: 'Configure',
                icon: 'pi pi-fw pi-cog',
                command: () => this.configure(),
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
            .getTypeRequest(`table_data/${this.Url}${url}`)
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
        const ref = this.dialogService.open(EditMealPackNameComponent, {
            header: `Add New ${this.Title}`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-8',
            data: {
                Url: 'meal_pack_name_ops/insert',
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

        const ref = this.dialogService.open(EditMealPackNameComponent, {
            header: `Edit ${this.Title}`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-8',
            data: {
                data: this.selectedProduct,
                Url: 'meal_pack_name_ops/update',
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
            meal_pack_id: Number(this.selectedProduct.meal_pack_id),
            counter_id: Number(this.selectedProduct.counter_id),
        };
        this.apiService
            .postTypeRequest(`meal_pack_name_ops/delete`, data)
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

    configure() {
        const ref = this.dialogService.open(ConfigureMealPackComponent, {
            header: `Configure ${this.Title} - ${this.selectedProduct.meal_pack_name}`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-8',
            data: this.selectedProduct,
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.ngOnInit();
            }
        });
    }
}
