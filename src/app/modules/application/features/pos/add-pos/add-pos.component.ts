import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { forkJoin, map, Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';

@Component({
    selector: 'app-add-pos',
    templateUrl: './add-pos.component.html',
    styleUrls: ['./add-pos.component.scss'],
})
export class AddPosComponent implements OnInit {
    constructor(
        public datepipe: DatePipe,
        public ref: DynamicDialogRef,
        public apiService: ApiService,
        public config: DynamicDialogConfig,
        public messageService: MessageService
    ) {}
    loading: boolean = false;
    MainCategories = [];
    Categories = [];
    SubCategories = [];
    uomList: Observable<object>;
    gstSlabList: Observable<object>;
    commonForm: FormGroup = new FormGroup({
        id: new FormControl(this.config?.data?.id ?? ''),
        name: new FormControl(this.config?.data?.name ?? '', [
            Validators.required,
        ]),
        uom_id: new FormControl(this.config?.data?.uom_id ?? '', [
            Validators.required,
        ]),
        hsn_code: new FormControl(this.config?.data?.hsn_code ?? ''),
        gst_slab_id: new FormControl(this.config?.data?.gst_slab_id ?? ''),
        discount_type: new FormControl(
            Number(this.config?.data?.discount_amt) > 0
                ? 'Amount'
                : 'Percentage' ?? ''
        ),
        discount_amt: new FormControl(this.config?.data?.discount_amt ?? ''),
        discount_per: new FormControl(this.config?.data?.discount_per ?? ''),
        main_category_id: new FormControl(
            this.config?.data?.main_category_id ?? '',
            [Validators.required]
        ),
        isExclusiveGst: new FormControl(
            this.config?.data?.isExclusiveGst ?? ''
        ),
        isExclusiveGstBinary: new FormControl(
            this.config?.data?.isExclusiveGst == 1 ? true : false
        ),
        rate: new FormControl(this.config?.data?.rate ?? '', [
            Validators.required,
        ]),
        counter_id: new FormControl(''),
    });

    ngOnInit(): void {
        //

        forkJoin([
            (this.uomList = this.apiService
                .getTypeRequest(`table_data/UOM`)
                .pipe(
                    map((res: any) => {
                        return res.data;
                    })
                )),
            (this.gstSlabList = this.apiService
                .getTypeRequest(`table_data/GST_SLAB`)
                .pipe(
                    map((res: any) => {
                        return res.data;
                    })
                )),
            this.apiService
                .getTypeRequest(`table_data/POS_MAIN_CATEGORY`)
                .pipe(
                    map((res: any) => {
                        return res.data;
                    })
                )
                .toPromise()
                .then((result: any) => {
                    this.MainCategories = result;
                }),
        ]);
    }
    toggleDiscountType() {
        this.commonForm.get('discount_amt').setValue('');
        this.commonForm.get('discount_per').setValue('');
        //this.commonForm.updateValueAndValidity();
    }

    changeCategory() {
        this.SubCategories = [];
        this.SubCategories = this.Categories.filter((value: any) => {
            if (
                value.main_category_id ==
                this.commonForm.controls.main_category_id.value
            ) {
                return value;
            }
        });
    }

    UpdateGST(event: any) {
        this.commonForm.controls.isExclusiveGst.setValue(event ? 1 : 0);
    }

    submitClick() {
        if (this.commonForm.valid) {
            this.loading = true;
            var operation = this.config?.data?.id ? 'update' : 'insert';
            this.apiService
                .postTypeRequest(
                    `pos_particular_ops/${operation}`,
                    this.commonForm.value
                )
                .toPromise()
                .then((resopnse: any) => {
                    if (resopnse.result) {
                        this.ref.close(true);
                        this.messageService.add({
                            severity: 'info',
                            summary:
                                operation == 'insert' ? 'Inserted.' : 'Updated',
                            detail: resopnse.message,
                        });
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        } else {
            this.messageService.add({
                severity: 'info',
                summary: 'Incomplete Details',
                detail: 'Enter all required details.',
            });
            var controls = this.commonForm.controls;
            for (const name in controls) {
                controls[name].markAsDirty();
                controls[name].markAllAsTouched();
            }
        }
    }
}
