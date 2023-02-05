import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/core/services/api/api.service';

@Component({
    selector: 'app-managae-canteen',
    templateUrl: './managae-canteen.component.html',
    styleUrls: ['./managae-canteen.component.scss'],
})
export class ManagaeCanteenComponent implements OnInit {
    loading:boolean = false;
            commonForm: FormGroup = new FormGroup({
                canteen_id: new FormControl(this.config?.data?.canteen_id ?? ''),
                role_id: new FormControl(''),
                canteen_name: new FormControl(this.config?.data?.canteen_name ?? '',[Validators.required]),
                address: new FormControl(this.config?.data?.address ?? '',[Validators.required]),
                registered_on: new FormControl(this.config?.data?.registered_on ?? '',[Validators.required]),
                contact_person: new FormControl(this.config?.data?.contact_person ?? '',[Validators.required]),
                contact_number: new FormControl(this.config?.data?.contact_number ?? '',[Validators.required]),
                email: new FormControl(this.config?.data?.email ?? '',[Validators.required,Validators.email]),
                gst_no: new FormControl(this.config?.data?.gst_no ?? ''),
            })
    constructor(
        public datepipe: DatePipe,
        public ref: DynamicDialogRef,
        public apiService: ApiService,
        public config: DynamicDialogConfig,) {}

    ngOnInit(): void {
    this.commonForm.controls.role_id.setValue(1)
        if (this.config?.data?.registered_on) {
            var registered_on = this.config?.data?.registered_on.split('-');
            this.commonForm.controls.registered_on.setValue(
                this.datepipe.transform(
                    new Date(Number(registered_on[2]) + '/' + Number(registered_on[1]) + '/' + Number(registered_on[0])),
                    'yyyy-MM-dd'
                )
            );
        }
    }

    submitClick(){
        if(this.commonForm.valid){
            this.loading = true;
            var operation = this.config?.data?"update":"insert";
                this.apiService
                .postTypeRequest(`canteen_ops/${operation}`,this.commonForm.value)
                .toPromise()
                .then((result: any) => {
                    if(result.result){
                        this.ref.close(true)
                    }
                })
                .finally(()=>{
                    this.loading = false;
                });
        }
    }
}
