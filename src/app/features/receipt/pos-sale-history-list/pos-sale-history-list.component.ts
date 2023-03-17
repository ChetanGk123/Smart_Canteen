import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DatePipe } from '@angular/common';
import { MemberService } from 'src/app/core/services/MemberService/member.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-pos-sale-history-list',
  templateUrl: './pos-sale-history-list.component.html',
  styleUrls: ['./pos-sale-history-list.component.scss']
})
export class PosSaleHistoryListComponent implements OnInit {
    pipe = new DatePipe('en-US');
    src: any;
    logo: any;
    name: any;
    loading: boolean = false;
    response: any;
    dateRange: any;
    constructor(
        protected _sanitizer: DomSanitizer,
        public ref: DynamicDialogRef,
        public apiService: ApiService,
        public config: DynamicDialogConfig,
        public messageService: MessageService,
        public memberService: MemberService
    ) {}

  ngOnInit(): void {
    this.name = this.memberService.getUserData()?.full_name;
        console.log(this.config.data);
        let date = `${new Date().getDate()}/${
            +new Date().getMonth() + 1
        }/${+new Date().getFullYear()}`;
        this.logo = `${date} - $`;
        this.dateRange = `${date} - ${date}`;
        // this.logo = this.memberService.getUserData()?.dp_location
        this.logo =
            'https://fastly.picsum.photos/id/1080/367/267.jpg?hmac=tUSNDSd12u94lQBRq7qu21g1mUcxNPSxXn5beLS4g_c';
        this.generatePDF();
  }

  async generatePDF() {
    let docDefinition = {
        pageSize: 'A4',
        defaultStyle: {
            fontSize: 10,
        },
        // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
        //pageMargins: [2, 0, 2, 0],
        footer: function (currentPage, pageCount) {
            return {
                text: currentPage.toString() + ' of ' + pageCount,
                margin: [40, 0],
                alignment: 'right',
            };
        },
        info: {
            title: 'Sale History',
            author: 'Smart Canteen',
            subject: 'Sale History',
          },
        content: [
            {
                columns: [
                    [
                        {
                            columns: [
                                {},
                                {
                                    text: '',
                                    //image: this.logo,
                                    width: 60,
                                    height: 60,
                                    alignment: 'center',
                                },
                                {},
                            ],
                        },
                        {
                            text: `${this.name}`,
                            fontSize: 15,
                            // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
                            margin: [0, 5, 0, 0],
                            bold: true,
                            alignment: 'center',
                        },
                        {
                            text: 'Sale History',
                            decoration: "underline",
                            fontSize: 13,
                            // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
                            margin: [0, 5, 0, 0],
                            bold: false,
                            alignment: 'center',
                        },
                    ],
                ],
                margin: [-15, 15, -15, 10],
            },
            {
                columns: [
                    [
                        {
                            text: `Period: ${this.dateRange}`,
                            alignment: 'left',
                        },
                    ],
                    [
                        {
                            width: 'auto',
                            text: `Date: ${new Date().getDate()}/${
                                +new Date().getMonth() + 1
                            }/${+new Date().getFullYear()}`,
                            alignment: 'right',
                        },
                    ],
                ],
                // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
                margin: [-15, 0, -15, 5],
            },
            {
                table: {
                    headerRows: 1,
                    dontBreakRows: true,
                    keepWithHeaderRows: 1,
                    heights: 25,
                    widths: [63, '*', 80, 65, 65],
                    body: [
                        [
                            {
                                text: 'Date',
                                margin: [5, 5, 0, 5],
                                border: [false, true, false, true],
                            },
                            {
                                text: 'Name',
                                margin: [5, 5, 0, 5],
                                border: [false, true, false, true],
                            },
                            {
                                text: 'Receipt No',
                                margin: [5, 5, 0, 5],
                                border: [false, true, false, true],
                            },
                            {
                                text: 'No Of Items',
                                margin: [5, 5, 0, 5],
                                border: [false, true, false, true],
                                alignment: 'right',
                            },
                            {
                                text: 'Amount',
                                margin: [5, 5, 0, 5],
                                border: [false, true, false, true],
                                alignment: 'right',
                            },
                        ],
                        ...this.config.data.map((p) => [
                            {
                                text: p.sale_date,
                                border: [false, false, false, false],
                                margin: [5, 5,0, -5],
                            },
                            {
                                text: p.customer_name??"-",
                                border: [false, false, false, false],
                                margin: [5, 5,0, -5],
                            },
                            {
                                text: p.receipt_no,
                                border: [false, false, false, false],
                                margin: [5, 5,0, -5],
                            },
                            {
                                text:
                                    p.no_of_items,
                                border: [false, false, false, false],
                                margin: [0, 5,0, -5],
                                alignment: 'right',
                            },
                            {
                                text:
                                    p.grand_total,
                                border: [false, false, false, false],
                                margin: [0, 5,0, -5],
                                alignment: 'right',
                            },
                        ]),
                        [
                            {
                                colSpan: 5,
                                text: '',
                                margin: [5, 3, 0, 5],
                                border: [false, true, false, false],
                            },
                            {},
                            {},
                            {},
                            {},
                        ],
                    ],
                },
                layout: {
                    hLineStyle: function () {
                        return { dash: { length: 10, space: 4 } };
                    },
                },
                // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
                margin: [-15, 10, -15, -10],
            },
        ],
        images: {
            logo: this.logo,
        },
    };
    const pdfDocGenerator = pdfMake.createPdf(
        docDefinition,
        'Sale Receipt'
    );
    pdfDocGenerator.getDataUrl((dataUrl) => {
        this.src = this._sanitizer.bypassSecurityTrustResourceUrl(dataUrl);
        this.loading = false;
    });
}

}
