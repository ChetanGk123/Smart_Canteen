import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { map, Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
import { ManagaeCanteenComponent } from './managae-canteen/managae-canteen.component';

@Component({
    selector: 'app-canteens',
    templateUrl: './canteens.component.html',
    styleUrls: ['./canteens.component.scss'],
})
export class CanteensComponent implements OnInit {
    tableData: any;
    loading: boolean = false;
    constructor(
        public apiService: ApiService,
        public dialogService: DialogService
    ) {}

    ngOnInit(): void {
        this.loadData();
    }

    loadData() {
        this.loading = true;
        this.apiService
            .getTypeRequest(`table_data/CANTEEN`)
            .toPromise()
            .then((result: any) => {
                this.loading = false;
                this.tableData = result?.data;
            });
    }

    addNewCanteen() {
        const ref = this.dialogService.open(ManagaeCanteenComponent, {
            header: `Add New Canteen`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-6',
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.loadData();
            }
        });
    }

    updateCanteen(data:any){
        const ref = this.dialogService.open(ManagaeCanteenComponent, {
            header: `Update Canteen`,
            data:data,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-6',
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.loadData();
            }
        });
    }

    deleteCanteen(){
        /* this.apiService
                .postTypeRequest(`canteen_ops/delete`,this.commonForm.value)
                .toPromise()
                .then((result: any) => {
                    if(result.result){
                        this.ref.close(true)
                    }
                })
                .finally(()=>{
                    this.loading = false;
                }); */
    }
}
