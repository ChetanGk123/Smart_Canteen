import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/core/services/api/api.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-manage-counter',
  templateUrl: './manage-counter.component.html',
  styleUrls: ['./manage-counter.component.scss']
})
export class ManageCounterComponent implements OnInit {

    loading:boolean = false;
    commonForm: FormGroup = new FormGroup({
        counter_id: new FormControl(this.config?.data?.counter_id ??this.config?.data?.id?? ''),
        role_id: new FormControl(''),
        school_name: new FormControl(this.config?.data?.school_name ?? '',[Validators.required]),
        counter_name: new FormControl(this.config?.data?.counter_name ?? '',[Validators.required]),
        counter_address: new FormControl(this.config?.data?.counter_address ?? '',[Validators.required]),
        contact_person: new FormControl(this.config?.data?.contact_person ?? '',[Validators.required]),
        contact_number: new FormControl(this.config?.data?.contact_number ?? '',[Validators.required]),
        email: new FormControl(this.config?.data?.email ?? '',[Validators.required,Validators.email]),
    })
constructor(
public ref: DynamicDialogRef,
public apiService: ApiService,
public authService: AuthService,
public config: DynamicDialogConfig,) {}

  ngOnInit(): void {
    console.log(this.authService.getUser());
    this.commonForm.controls.role_id.setValue(2)
  }

  submitClick(){
    if(this.commonForm.valid){
        this.loading = true;
        var operation = this.config?.data?"update":"insert";
            this.apiService
            .postTypeRequest(`counter_ops/${operation}`,this.commonForm.value)
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
