import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { map, Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';

@Component({
    selector: 'app-pos-details',
    templateUrl: './pos-details.component.html',
    styleUrls: ['./pos-details.component.scss'],
})
export class PosDetailsComponent implements OnInit {
    Data: Observable<Object>;
    History: Observable<Object>;
    loading: boolean = false;
    cameraDialog: boolean = false;
    memberData;
    constructor(
        public datepipe: DatePipe,
        public ref: DynamicDialogRef,
        public apiService: ApiService,
        public config: DynamicDialogConfig,
        public messageService: MessageService
    ) {
        this.Data = this.apiService
            .getTypeRequest(`specific_data/POS_PARTICULAR/${this.config.data}`)
            .pipe(
                map((res: any) => {
                    return res.data;
                })
            );
    }

    ngOnInit(): void {
        this.loading = true;
        this.apiService
            .getTypeRequest(
                `specific_table_data/POS_STOCK_HISTORY/${this.config.data}`
            )
            .pipe(
                map((res: any) => {
                    return res.data;
                })
            )
            .toPromise()
            .then((result: any) => {
                this.History = result;
                this.loading = false;
            })
            .finally(() => {});
    }
}
