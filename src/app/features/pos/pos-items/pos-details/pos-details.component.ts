import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { map, Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
import { AddPosComponent } from '../../add-pos/add-pos.component';
import { PosService } from '../../pos.service';
import { AcademicConstraintsComponent } from './academic-constraints/academic-constraints.component';
import { TimeConstraintsComponent } from './time-constraints/time-constraints.component';

@Component({
    selector: 'app-pos-details',
    templateUrl: './pos-details.component.html',
    styleUrls: ['./pos-details.component.scss'],
})
export class PosDetailsComponent implements OnInit, OnDestroy {
    academicConstraintsLoading: boolean = false;
    timeConstraintsLoading: boolean = false;
    loading: boolean = false;
    cameraDialog: boolean = false;
    transactionLoading: boolean = false;
    displayTransaction: boolean = false;
    academicConstraints: Observable<Object>;
    timeConstraints: Observable<Object>;
    posItemData: any;
    datePipe: DatePipe = new DatePipe('en-US');
    start_date: any;
    end_date: any;
    file_data: FormData;
    transactionData: Observable<Object>;
    form: FormGroup = new FormGroup({
        file: new FormControl(),
    });
    selectedProduct: any;
    transactionMenu: MenuItem[] = [
        // {
        //     label: 'View',
        //     icon: 'pi pi-fw pi-eye',
        //     command: () => this.viewDetails(),
        // },
        // {
        //     separator: true,
        // },
        // {
        //     label: 'Print',
        //     icon: 'pi pi-fw pi-print',
        //     command: () => this.printDetails(this.selectedProduct),
        // },
    ];

    Data: Observable<Object>;
    History: Observable<Object>;
    constructor(
        public datepipe: DatePipe,
        public apiService: ApiService,
        public dialogService: DialogService,
        public messageService: MessageService,
        private confirmationService: ConfirmationService,
        public posService: PosService,
        public router: Router,
        public route: ActivatedRoute
    ) {}
    ngOnDestroy(): void {
        this.posService.deletePosItemData();
    }

    ngOnInit(): void {
        this.posItemData = this.posService.getPosItemData();
        this.end_date = new Date().toISOString().substring(0, 10);
        this.start_date = this.datePipe.transform(
            new Date().setDate(new Date().getDate() - 30),
            'yyyy-MM-dd'
        );
        if (this.posItemData) {
            this.Data = this.apiService
                .getTypeRequest(
                    `specific_data/POS_PARTICULAR/${this.posItemData}`
                )
                .pipe(
                    map((res: any) => {
                        return res.data;
                    })
                );
            // {
            //     "id": "1",
            //     "counter_id": "1",
            //     "main_category_id": "1",
            //     "main_category_name": "Veg",
            //     "name": "naaaaaame",
            //     "stock_qty": "-27.00",
            //     "uom_id": "1",
            //     "uom_name": "Plate",
            //     "hsn_code": "hsn_code",
            //     "gst_slab_id": null,
            //     "gst_slab": "0.00",
            //     "discount_amt": "0.00",
            //     "discount_per": "1.00",
            //     "isExclusiveGst": "1",
            //     "rate": "15.00",
            //     "img_loc": null
            // }
            this.loading = true;
            // this.apiService
            //     .getTypeRequest(
            //         `specific_table_data/POS_STOCK_HISTORY/${this.posItemData.id}`
            //     )
            //     .pipe(
            //         map((res: any) => {
            //             return res.data;
            //         })
            //     )
            //     .toPromise()
            //     .then((result: any) => {
            //         this.History = result;
            //         this.loading = false;
            //     })
            //     .finally(() => {});
            this.getAcademicConstraints();
            this.getTimeConstraints();
        } else {
            this.router.navigate(['/pos/posItems']);
        }
    }

    getAcademicConstraints() {
        this.academicConstraintsLoading = true;
        this.academicConstraints = this.apiService
            .getTypeRequest(
                `table_data/ACADEMIC_POS_CONSTRAINTS/${this.posItemData.id}`
            )
            .pipe(
                map((res: any) => {
                    this.academicConstraintsLoading = false;
                    return res.data;
                })
            );
    }

    getTimeConstraints() {
        this.timeConstraintsLoading = true;
        this.timeConstraints = this.apiService
            .getTypeRequest(`table_data/POS_CONSTRAINTS/${this.posItemData.id}`)
            .pipe(
                map((res: any) => {
                    this.timeConstraintsLoading = false;
                    return res.data;
                })
            );
    }

    editPOSItem() {
        const ref = this.dialogService.open(AddPosComponent, {
            data: this.posItemData,
            header: `Update Item`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-5',
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.ngOnInit();
            }
        });
    }

    addTimeConstraints() {
        const ref = this.dialogService.open(TimeConstraintsComponent, {
            header: `Add Time Constraints`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-8',
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.ngOnInit();
            }
        });
    }

    addAcademicConstraints() {
        const ref = this.dialogService.open(AcademicConstraintsComponent, {
            header: `Add Academic Constraints`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-8',
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.ngOnInit();
            }
        });
    }

    updateTimeConstraints(product:any) {
        const ref = this.dialogService.open(TimeConstraintsComponent, {
            data: product,
            header: `Update Time Constraints`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-8',
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.ngOnInit();
            }
        });
    }

    updateAcademicConstraints(product:any) {
        const ref = this.dialogService.open(AcademicConstraintsComponent, {
            data: product,
            header: `Update Academic Constraints`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-8',
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.ngOnInit();
            }
        });
    }

    confirm(): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            this.confirmationService.confirm({
                message: 'Do you want to delete this record?',
                header: 'Delete Confirmation',
                icon: 'pi pi-exclamation-triangle',
                accept: () => resolve(true),
                reject: () => resolve(false),
            });
        });
    }

    async deleteAcademicConstraints(product: any) {
        const confirmed = await this.confirm();
        if (confirmed) {
            var payload = {
                pos_academic_constraint_id: product.pos_academic_constraint_id,
            };
            this.apiService
                .postTypeRequest('academic_constraint_ops/delete', payload)
                .toPromise()
                .then((result: any) => {
                    if (result.result) {
                        this.getAcademicConstraints();
                    }
                });
        }
    }

    async deleteTimeConstraints(product: any) {
        const confirmed = await this.confirm();
        if (confirmed) {
            var payload = {
                pos_constraint_id: product.pos_constraint_id,
            };
            this.apiService
                .postTypeRequest('pos_constraint_ops/delete', payload)
                .toPromise()
                .then((result: any) => {
                    if (result.result) {
                        this.getTimeConstraints();
                    }
                });
        }
    }

    handleImage(file: any) {
        this.cameraDialog = false;
        this.form.get('file').setValue(file);
        this.uploadProfilePhoto();
    }

    async uploadProfilePhoto() {
        const formData: FormData = new FormData();
        formData.append('file', this.form.get('file').value);
        formData.append('token', this.apiService.getTocken());
        formData.append('item_id', this.posItemData.id);
        this.file_data = formData;

        await this.apiService
            .postFileTypeRequest('file_upload/MEMBER_PHOTO', formData)
            .toPromise()
            .then((result: any) => {
                if (result.result) {
                    this.ngOnInit
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error!',
                        detail: result.message,
                    });
                }
            });
    }
}
