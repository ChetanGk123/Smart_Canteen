import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import moment from 'moment';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/core/services/api/api.service';
import { PosService } from '../../../pos.service';

@Component({
    selector: 'app-time-constraints',
    templateUrl: './time-constraints.component.html',
    styleUrls: ['./time-constraints.component.scss'],
})
export class TimeConstraintsComponent implements OnInit {
    Data: any;
    posItemData: any;
    load_constraints_array: boolean = false;
    updateMode: boolean = false;
    constraints_array: any = [];
    commonForm: FormGroup = new FormGroup({
        start_time: new FormControl('', [Validators.required]),
        start_date: new FormControl(''),
        end_time: new FormControl('', [Validators.required]),
        end_date: new FormControl(''),
    });
    constructor(
        public apiService: ApiService,
        public posService: PosService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig
    ) {}

    ngOnInit(): void {
        this.posItemData = this.posService.getPosItemData();
        if (this.config.data) {
            console.log(this.config.data);
            this.updateMode = true;
            this.commonForm.patchValue(this.config.data);
            this.commonForm.controls['start_date'].setValue(
                moment(
                    this.commonForm.controls['start_date'].value,
                    'DD-MM-yyyy'
                ).toDate()
            );
            this.commonForm.controls['end_date'].setValue(
                moment(
                    this.commonForm.controls['end_date'].value,
                    'DD-MM-yyyy'
                ).toDate()
            );
        }
    }

    addToConstraintsArray() {
        if (this.commonForm.valid) {
            this.commonForm.controls['start_time'].setValue(
                moment(
                    this.commonForm.controls['start_time'].value,
                    'hh:mm:ss A'
                ).format('hh:mm:ss A')
            );
            this.commonForm.controls['start_date'].setValue(
                moment(
                    this.commonForm.controls['start_date'].value,
                    'DD:MM:yyyy'
                ).format('DD-MM-yyyy')
            );
            this.commonForm.controls['end_time'].setValue(
                moment(
                    this.commonForm.controls['end_time'].value,
                    'hh:mm:ss A'
                ).format('hh:mm:ss A')
            );
            this.commonForm.controls['end_date'].setValue(
                moment(
                    this.commonForm.controls['end_date'].value,
                    'DD:MM:yyyy'
                ).format('DD-MM-yyyy')
            );
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
                .postTypeRequest('pos_constraint_ops/insert', payload)
                .toPromise()
                .then((result: any) => {
                    if (result.result) {
                        this.ref.close(true);
                    }
                });
        }
    }

    updateConstraintsArray() {
        if (this.constraints_array) {
            var payload = {
                pos_constraint_id: this.config.data.pos_constraint_id,
                start_time: this.commonForm.controls['start_time'].value,
                start_date: this.commonForm.controls['start_date'].value,
                end_time: this.commonForm.controls['end_time'].value,
                end_date: this.commonForm.controls['end_date'].value,
            };
            this.apiService
                .postTypeRequest('pos_constraint_ops/update', payload)
                .toPromise()
                .then((result: any) => {
                    if (result.result) {
                        this.ref.close(true);
                    }
                });
        }
    }
}
