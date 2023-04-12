import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DatePipe } from '@angular/common';
import { MemberService } from 'src/app/core/services/MemberService/member.service';
import { environment } from 'src/environments/environment';
import { Logos } from 'src/assets/logo/base_logo';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: 'app-membership-summary-report',
    templateUrl: './membership-summary-report.component.html',
    styleUrls: ['./membership-summary-report.component.scss'],
})
export class MembershipSummaryReportComponent implements OnInit {
    pipe = new DatePipe('en-US');
    src: any;
    logo: any;
    name: any;
    loading: boolean = false;
    response: any;
    orderData: any;
    no_of_items: any;
    grand_total: any;

    constructor(
        protected _sanitizer: DomSanitizer,
        public ref: DynamicDialogRef,
        public apiService: ApiService,
        public config: DynamicDialogConfig,
        public messageService: MessageService,
        public memberService: MemberService
    ) {}

    ngOnInit(): void {
        this.name = this.memberService.getSettings().mess_name;
        this.logo = environment.production
            ? this.memberService.getUserData()?.dp_location
            : Logos.baseLogo;
        this.loading = true;
        this.grand_total = 0;
        this.no_of_items = 0;
        this.config.data.forEach((element) => {
            this.grand_total += element.total_amount;
            this.no_of_items += element.sale_qty;
        });
        this.generatePDF();
    }

    async generatePDF() {
        this.loading = false;
        let docDefinition = {
            pageSize: {
                width: 160,
                height: 'auto',
            },
            defaultStyle: {
                fontSize: 7,
            },
            pageMargins: [2, 10, 2, 10],
            content: [
                {
                    columns: [
                        [
                            {
                                columns: [
                                    {},
                                    {
                                        image: 'logo',
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
                                margin: [0, 5, 0, 0],
                                bold: true,
                                alignment: 'center',
                            },
                        ],
                    ],
                },
                {
                    columns: [
                        [
                            {
                                text: `Receipt No: `,
                                alignment: 'left',
                                fontSize: 7,
                            },
                        ],
                        [
                            {
                                width: 'auto',
                                text: `Date: ${new Date()}`,
                                alignment: 'right',
                                fontSize: 7,
                            },
                        ],
                    ],
                    margin: [5, 5, 0, 0],
                },
                // {
                //     columns: [
                //         [
                //             {
                //                 text: `Name: ${
                //                     membershipSummary.customer_name ?? ''
                //                 }`,
                //                 alignment: 'left',
                //             },
                //         ],
                //     ],
                //     margin: [5, 2, 0, 0],
                // },
                // {
                //     columns: [
                //         [
                //             {
                //                 text: `Phone No: ${
                //                     membershipSummary.customer_ph ?? ''
                //                 }`,
                //                 alignment: 'left',
                //             },
                //         ],
                //     ],
                //     margin: [5, 2, 0, 0],
                // },
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', 'auto', 'auto', 'auto'],
                        body: [
                            [
                                {
                                    text: 'Particular',
                                    border: [false, false, false, true],
                                },
                                {
                                    text: 'Quantity',
                                    border: [false, false, false, true],
                                },
                                {
                                    text: 'Amount',
                                    border: [false, false, false, true],
                                },
                                {
                                    text: 'Date',
                                    border: [false, false, false, true],
                                },
                            ],
                            ...this.config.data.map((p) => [
                                {
                                    text:
                                        this.config.data.indexOf(p) +
                                        1 +
                                        '. ' +
                                        p.mess_type_name,
                                    border: [true, false, true, false],
                                },
                                {
                                    text: p.sale_qty,
                                    border: [true, false, true, false],
                                },
                                {
                                    text: p.total_amount,
                                    border: [true, false, true, false],
                                    alignment: 'right',
                                },
                                {
                                    text: p.sale_date,
                                    border: [true, false, true, false],
                                    alignment: 'right',
                                },
                            ]),
                            [
                                {
                                    text: 'Total',
                                    border: [false, false, false, true],
                                },
                                {
                                    text: this.no_of_items + ' Nos',
                                    border: [false, false, false, true],
                                },
                                {
                                    text: this.no_of_items + ' Nos',
                                    border: [false, false, false, true],
                                },
                                {
                                    text: '₹ ' + this.grand_total,
                                    alignment: 'right',
                                    bold: true,
                                    border: [false, false, false, true],
                                },
                            ],
                        ],
                    },
                    layout: {
                        vLineWidth: function (i, node) {
                            return i === 0 || i === node.table.widths.length
                                ? 0
                                : 0;
                        },
                        vLineStyle: function () {
                            return { dash: { length: 0 } };
                        },
                        hLineWidth: function (i, node) {
                            return i === 0 || i === node.table.widths.length
                                ? 1
                                : 1;
                        },
                        hLineStyle: function () {
                            return { dash: { length: 2 } };
                        },
                    },
                },
                {
                    columns: [
                        [
                            {
                                text: 'Thank you, visit again!',
                                fontSize: 8,
                                margin: [0, 2, 0, 0],
                                alignment: 'center',
                            },
                            {
                                text: 'Software by: The Techvaidya 7447553739',
                                fontSize: 8,
                                margin: [0, 2, 0, 0],
                                alignment: 'center',
                            },
                        ],
                    ],
                },
            ],
            images: {
                logo: this.logo,
            },
        };
        // const pdfDocGenerator = pdfMake.createPdf(docDefinition);
        // pdfDocGenerator.getDataUrl((dataUrl) => {
        //     this.src = this._sanitizer.bypassSecurityTrustResourceUrl(dataUrl);
        //     this.loading = false;
        // });
        var win = window.open('', '_blank');
        pdfMake.createPdf(docDefinition).print({}, win);
        this.ref.close();
    }
}
