import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
import { CounterService } from '../../counters/counter.service';
import { MemberService } from '../../members/member.service';
import { CommonEditComponent } from '../../utils/common/common-edit/common-edit.component';
import { EditMealTypeComponent } from './edit-meal-type/edit-meal-type.component';

@Component({
    selector: 'app-meal-type',
    templateUrl: './meal-type.component.html',
    styleUrls: ['./meal-type.component.scss'],
})
export class MealTypeComponent implements OnInit, OnDestroy {
    loading: boolean;
    dialog: boolean = false;
    selectedProduct: any;
    items: MenuItem[];
    Data = [];
    counter_id: any;
    Title:any = "Meal Type";
    Url:any = "MEAL_TYPE";
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

        const ref = this.dialogService.open(EditMealTypeComponent, {
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
            item_id: Number(this.selectedProduct.meal_id),
            counter_id: Number(this.selectedProduct.counter_id),
            item_name: this.selectedProduct.meal_name,
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
