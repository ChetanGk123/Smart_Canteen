import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
    providedIn: 'root',
})
export class ExcelService {
    constructor() {}

    public exportAsExcelFile(json: any[], excelFileName: string): void {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        console.log('worksheet', worksheet);
        const workbook: XLSX.WorkBook = {
            Sheets: { data: worksheet },
            SheetNames: ['data'],
        };
        const excelBuffer: any = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
        });
        //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE,
        });
        FileSaver.saveAs(
            data,
            fileName + EXCEL_EXTENSION
            //+ '_export_' + new Date().toLocaleString()
        );
    }

    public exportMemberTransactionsAsExcelFile(memberData:any[],transactionData:any[], fileName: string):void{
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(memberData ,{header: [], skipHeader: true});

    //     // Calculate the end cell position of table 1
    // const endCellPos = XLSX.utils.decode_range(worksheet['!ref']);
    // const startRowPos = endCellPos.e.r + 2; // Add 2 for an empty row and table 2 headers
    // const startCellPos = { r: startRowPos, c: 0 };

    // Add table 2 data
    XLSX.utils.sheet_add_json(worksheet, transactionData, {origin:"A13"});

    const workbook: XLSX.WorkBook = {
        Sheets: { data: worksheet },
        SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
    });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, fileName);

    }
}
