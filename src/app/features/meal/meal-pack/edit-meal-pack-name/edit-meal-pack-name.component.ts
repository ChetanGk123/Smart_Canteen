import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/core/services/api/api.service';

@Component({
  selector: 'app-edit-meal-pack-name',
  templateUrl: './edit-meal-pack-name.component.html',
  styleUrls: ['./edit-meal-pack-name.component.scss']
})
export class EditMealPackNameComponent implements OnInit {

    loading: boolean = false;
    list: any[] = [];
    commonForm: FormGroup = new FormGroup({
        meal_pack_id: new FormControl(this.config?.data?.data?.meal_pack_id ?? ''),
        counter_id: new FormControl(this.config?.data?.data?.counter_id ?? ''),
        meal_pack_name: new FormControl(this.config?.data?.data?.meal_pack_name ?? '', [
            Validators.required,
        ]),
    });
    constructor(
        public ref: DynamicDialogRef,
        public apiService: ApiService,
        public config: DynamicDialogConfig,
        public messageService: MessageService
    ) {}

  ngOnInit(): void {
  }

  submitClick() {
    if (this.commonForm.valid) {
        var result: any[] = this.list.filter((ele: any) => {
            if (ele.name == this.commonForm.controls.item_name.value) {
                return ele;
            } else {
                return null;
            }
        });
        if (result.length > 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Duplicate',
                detail: 'Duplicate Value Entered',
            });
        } else {
            this.commonForm.controls.meal_pack_id.value
                ? this.edit()
                : this.add();
        }
    } else {
        var controls = this.commonForm.controls;
        for (const name in controls) {
            controls[name].markAsDirty();
            controls[name].markAllAsTouched();
        }
        this.messageService.add({
            severity: 'error',
            summary: 'Invalid',
            detail: 'Enter Required Details',
        });
    }
}

    add() {
        this.loading = true;
        this.apiService
            .postTypeRequest(
                `${this.config?.data?.Url}`,
                this.commonForm.value
            )
            .toPromise()
            .then((resopnse: any) => {
                this.loading = false;
                if (resopnse.result) {
                    this.ref.close(true);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success.',
                        detail: resopnse.message,
                    });
                }
            });
    }

    edit() {
        this.loading = true;
        this.apiService
            .postTypeRequest(
                `${this.config?.data?.Url}`,
                this.commonForm.value
            )
            .toPromise()
            .then((resopnse: any) => {
                this.loading = false;
                if (resopnse.result) {
                    this.ref.close(true);
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Success.',
                        detail: resopnse.message,
                    });
                }
            });
    }
}
