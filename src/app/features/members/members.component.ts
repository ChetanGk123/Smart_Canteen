import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/core/services/api/api.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import * as XLSX from 'xlsx';
import { MembersData } from './members-details.model';

@Component({
    selector: 'app-members',
    templateUrl: './members.component.html',
    styleUrls: ['./members.component.scss'],
})
export class MembersComponent implements OnInit {

    tableData: any;
    loading: boolean = false;
    constructor(
        public apiService: ApiService,
        public authService: AuthService,
        public router: Router,
        public route: ActivatedRoute,
        public dialogService: DialogService
    ) {}

    ngOnInit(): void {
        this.loadData();
    }

    loadData() {
        this.loading = true;
        this.apiService
            .getTypeRequest(`table_data/MEMBER`)
            .toPromise()
            .then((result: any) => {
                this.loading = false;
                this.tableData = result?.data;
            });
    }

    excelFileInputChange(fileInputEvent: any) {
        /* wire up file reader */
        const target: DataTransfer = <DataTransfer>(
            (<unknown>fileInputEvent.target)
        );
        if (target.files.length !== 1) {
            throw new Error('Cannot use multiple files');
        }
        const reader: FileReader = new FileReader();
        reader.readAsBinaryString(target.files[0]);
        reader.onload = (e: any) => {
            /* create workbook */
            const binarystr: string = e.target.result;
            const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

            /* selected the first sheet */
            const wsname: string = wb.SheetNames[0];
            const ws: XLSX.WorkSheet = wb.Sheets[wsname];

            /* save data */
            const data = XLSX.utils.sheet_to_json(ws) as MembersData[]; // to get 2d array pass 2nd parameter as object {header: 1}
            // Data will be logged in array format containing objects
            //this.convertArrayToJson(data);
            console.log('data', data);
        };

        //this.loadComponents();
    }
}
