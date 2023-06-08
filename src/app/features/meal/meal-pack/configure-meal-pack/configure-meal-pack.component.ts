import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import moment from 'moment';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/core/services/api/api.service';

@Component({
    selector: 'app-configure-meal-pack',
    templateUrl: './configure-meal-pack.component.html',
    styleUrls: ['./configure-meal-pack.component.scss'],
})
export class ConfigureMealPackComponent implements OnInit {
    loading: boolean;
    accordionState: boolean;
    load_mealsToInsert: boolean = true;
    counter_id: any;
    selectedProduct: any;
    items: MenuItem[];
    Data = [];
    mealTypes = [];
    mealsToInsert = [];
    commonForm: FormGroup = new FormGroup({
        meal_id: new FormControl('', [Validators.required]),
        meal_price: new FormControl('', [Validators.required]),
        meal_start_time: new FormControl('', [Validators.required]),
        meal_end_time: new FormControl('', [Validators.required]),
    });
    constructor(
        public ref: DynamicDialogRef,
        public apiService: ApiService,
        private confirmationService: ConfirmationService,
        public config: DynamicDialogConfig,
        public messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.counter_id = this.config.data?.counter_id;
        this.loadData();
        this.items = [
            {
                label: 'Edit',
                icon: 'pi pi-fw pi-pencil',
                //command: () => this.edit(),
            },
            {
                label: 'Delete',
                icon: 'pi pi-fw pi-trash',
                //command: () => this.confirm(),
            },
        ];
        this.apiService
            .getTypeRequest(`table_data/MEAL_TYPE`)
            .toPromise()
            .then((result: any) => {
                if (result.result) {
                    this.mealTypes = result.data;
                } else {
                    this.mealTypes = [];
                }
            });
    }

    loadData() {
        var url = '';
        if (this.counter_id != '') {
            url = `/BY_COUNTER/${this.counter_id}`;
        }
        this.loading = true;

        this.apiService
            .getTypeRequest(
                `table_data/MEAL_PACK_ITEMS/${
                    this.config.data?.meal_pack_id ?? this.config.data?.id
                }`
            )
            .toPromise()
            .then((result: any) => {
                this.loading = false;
                if (result.result) {
                    this.Data = result.data;
                    this.Data.map((item: any) => {
                        item.meal_start_time = moment(
                            item.meal_start_time,
                            'hh:mm:ss A'
                        ).format('HH:mm:ss');
                        item.meal_end_time = moment(
                            item.meal_end_time,
                            'hh:mm:ss A'
                        ).format('HH:mm:ss');
                    });
                } else {
                    this.Data = [];
                }
            });
    }

    updateMeal(product: any) {
        this.apiService
            .postTypeRequest('meal_pack_ops/update', this.getPayload(product))
            .toPromise()
            .then((result: any) => {
                if (result.result) {
                    this.loadData();
                }
            });
    }

    confirm(product: any) {
        this.confirmationService.confirm({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            accept: () => {
                this.deleteMeal(product);
            },
        });
    }

    deleteMeal(product: any) {
        /* var payload = {
            meal_pack_item_id: product.meal_pack_item_id,
            meal_price: product.meal_price,
            meal_start_time: moment(
                product.meal_start_time,
                'hh:mm:ss A'
            ).format('hh:mm:ss A'),
            meal_end_time: moment(product.meal_end_time, 'hh:mm:ss A').format(
                'hh:mm:ss A'
            ),
        };
        console.log(payload); */
        this.apiService
            .postTypeRequest('meal_pack_ops/delete', this.getPayload(product))
            .toPromise()
            .then((result: any) => {
                if (result.result) {
                    this.loadData();
                }
            });
    }

    getPayload(product: any) {
        return {
            meal_pack_item_id: product.meal_pack_item_id,
            meal_price: product.meal_price,
            meal_start_time: moment(
                product.meal_start_time,
                'hh:mm:ss A'
            ).format('hh:mm:ss A'),
            meal_end_time: moment(product.meal_end_time, 'hh:mm:ss A').format(
                'hh:mm:ss A'
            ),
        };
    }

    addToNewMeals() {
        this.load_mealsToInsert = false;
        if (this.commonForm.valid) {
            this.commonForm.controls['meal_start_time'].setValue(
                moment(
                    this.commonForm.controls['meal_start_time'].value,
                    'hh:mm:ss A'
                ).format('hh:mm:ss A')
            );
            this.commonForm.controls['meal_end_time'].setValue(
                moment(
                    this.commonForm.controls['meal_end_time'].value,
                    'hh:mm:ss A'
                ).format('hh:mm:ss A')
            );
            this.mealsToInsert.push(this.commonForm.value);
            this.commonForm.reset();
        } else {
            this.commonForm.markAllAsTouched();
        }
        this.load_mealsToInsert = true;
    }

    insertMeals() {
        var meals_array = [];
        this.mealsToInsert.map((item: any) => {
            var data = {
                meal_id: item.meal_id.meal_id,
                meal_price: item.meal_price,
                meal_start_time: item.meal_start_time,
                meal_end_time: item.meal_end_time,
            };
            meals_array.push(data);
        });
        var payload = {
            meal_pack_id:
                this.config.data?.meal_pack_id ?? this.config.data?.id,
            meals_array: meals_array,
        };
        this.apiService
            .postTypeRequest('meal_pack_ops/insert', payload)
            .toPromise()
            .then((result: any) => {
                if (result.result) {
                    this.mealsToInsert = [];
                    this.accordionState = false;
                    this.loadData();
                }
            });
    }
}
