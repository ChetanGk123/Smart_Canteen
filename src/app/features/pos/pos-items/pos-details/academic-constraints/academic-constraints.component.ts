import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/core/services/api/api.service';
import { PosService } from '../../../pos.service';

@Component({
    selector: 'app-academic-constraints',
    templateUrl: './academic-constraints.component.html',
    styleUrls: ['./academic-constraints.component.scss'],
})
export class AcademicConstraintsComponent implements OnInit {
    Data: any;
    classes: any;
    divisions: any;
    posItemData: any;
    load_constraints_array: boolean = false;
    updateMode: boolean = false;
    constraints_array: any = [];
    commonForm: FormGroup = new FormGroup({
        class_id: new FormControl('', [Validators.required]),
        division_id: new FormControl(''),
        rate: new FormControl('', [Validators.required]),
    });
    constructor(
        public apiService: ApiService,
        public posService: PosService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig
    ) {}

    ngOnInit(): void {
        this.posItemData = this.posService.getPosItemData();
        this.apiService
            .getTypeRequest(`table_data/CLASS`)
            .toPromise()
            .then((result: any) => {
                if (result.result) {
                    this.classes = result.data;
                } else {
                    this.classes = [];
                }
            });
        this.apiService
            .getTypeRequest(`table_data/DIVISION`)
            .toPromise()
            .then((result: any) => {
                if (result.result) {
                    this.divisions = result.data;
                } else {
                    this.divisions = [];
                }
            });
        if (this.config.data) {
            this.updateMode = true;
            this.commonForm.patchValue(this.config.data);
        }
    }

    getClass(product: any) {
        return this.classes.find((obj) => obj.id == product.class_id);
    }
    getDivision(product: any) {
        return this.divisions.find((obj) => obj.id == product.division_id);
    }

    addToConstraintsArray() {
        if (this.commonForm.valid) {
            if (this.updateMode) {
                this.updateConstraintsArray();
            } else {
                this.constraints_array.push(this.commonForm.value);
                this.commonForm.reset();
            }
        } else {
            var controls = this.commonForm.controls;
            for (const name in controls) {
                controls[name].markAsDirty();
                controls[name].markAllAsTouched();
            }
        }
    }
    insertConstraintsArray() {
        if (this.constraints_array) {
            var payload = {
                pos_particular_id: this.posItemData.id,
                constraints_array: this.constraints_array,
            };
            this.apiService
                .postTypeRequest('academic_constraint_ops/insert', payload)
                .toPromise()
                .then((result: any) => {
                    if (result.result) {
                        this.ref.close(true);
                    }
                });
        }
    }

    updateConstraintsArray() {
        var payload = {
            pos_academic_constraint_id:
                this.config.data.pos_academic_constraint_id,
            class_id: this.commonForm.controls['class_id'].value,
            division_id: this.commonForm.controls['division_id'].value,
            rate: this.commonForm.controls['rate'].value,
        };

        this.apiService
            .postTypeRequest('academic_constraint_ops/update', payload)
            .toPromise()
            .then((result: any) => {
                if (result.result) {
                    this.ref.close(true);
                }
            });
    }
}
