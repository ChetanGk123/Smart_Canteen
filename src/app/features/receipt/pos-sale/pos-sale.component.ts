import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DatePipe } from '@angular/common';
import { MemberService } from 'src/app/core/services/MemberService/member.service';
import { EnvService } from 'src/app/env.service';
import { CoreConfig } from 'src/app/core/interfaces/coreConfig';
import { ConfigService } from 'src/app/core/services/app.config.service';
import { AppConfig } from 'src/app/core/interfaces/appconfig';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: 'app-pos-sale',
    templateUrl: './pos-sale.component.html',
    styleUrls: ['./pos-sale.component.scss'],
})
export class PosSaleComponent implements OnInit {
    pipe = new DatePipe('en-US');
    src: any;
    logo: any;
    name: any;
    loading: boolean = false;
    response: any;
    orderData: any;
    public coreConfig:CoreConfig
    appConfig: AppConfig;

    constructor(
        protected _sanitizer: DomSanitizer,
        public ref: DynamicDialogRef,
        public apiService: ApiService,
        public config: DynamicDialogConfig,
        public messageService: MessageService,
        public memberService: MemberService,
        public configService: ConfigService,
        public _coreEnvService: EnvService,
    ) {
        this.coreConfig =  _coreEnvService.config
     }

    ngOnInit(): void {
        this.appConfig = this.configService.config;

        this.name = this.memberService.getUserData()?.full_name;
        // this.logo = this.memberService.getUserData()?.dp_location
        this.logo = "https://picsum.photos/id/1080/367/267"
        this.loading = true;
        var id = this.config.data?.id ?? this.config.data?.receipt_id;
        this.apiService
            .getTypeRequest(`pos_sale_data/${id}`)
            .toPromise()
            .then((result: any) => {
                if (result.result) {
                    this.orderData = result.data;
                    this.generatePDF();
                }
            })
            .finally(() => { });
    }

    async generatePDF() {
        var orderDetails = this.orderData.master_data;
        var orderItems = this.orderData.slave_data;
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
            info: {
                title: 'awesome Document',
                author: 'john doe',
                subject: 'subject of document',
                keywords: 'keywords for document',
              },
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
                                text: `Receipt No: ${orderDetails.receipt_no}`,
                                alignment: 'left',
                                fontSize: 7,
                            },
                        ],
                        [
                            {
                                width: 'auto',
                                text: `Date: ${orderDetails.sale_date}`,
                                alignment: 'right',
                                fontSize: 7,
                            },
                        ],
                    ],
                    margin: [5, 5, 0, 0],
                },
                {
                    columns: [
                        [
                            {
                                text: `Name: ${orderDetails.customer_name ?? ''
                                    }`,
                                alignment: 'left',
                            },
                        ],
                    ],
                    margin: [5, 2, 0, 0],
                },
                {
                    columns: [
                        [
                            {
                                text: `Phone No: ${orderDetails.customer_ph ?? ''
                                    }`,
                                alignment: 'left',
                            },
                        ],
                    ],
                    margin: [5, 2, 0, 0],
                },
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', 'auto', 'auto'],
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
                            ],
                            ...orderItems.map((p) => [
                                {
                                    text:
                                        orderItems.indexOf(p) +
                                        1 +
                                        '. ' +
                                        p.particular_name,
                                    border: [true, false, true, false],
                                },
                                {
                                    text: p.sale_qty,
                                    border: [true, false, true, false],
                                },
                                {
                                    text: p.item_grand_total,
                                    border: [true, false, true, false],
                                    alignment: 'right',
                                },
                            ]),
                            [
                                {
                                    text: 'Sub Total',
                                    colSpan: 2,
                                    border: [false, true, false, false],
                                },
                                {},
                                {
                                    text: '₹ ' + orderDetails.base_total,
                                    alignment: 'right',
                                    border: [false, true, false, false],
                                },
                            ],
                            [
                                {
                                    text: 'CGST',
                                    colSpan: 2,
                                    alignment: 'right',
                                    border: [false, true, false, false],
                                },
                                {},
                                {
                                    text: orderDetails.total_cgst,
                                    alignment: 'right',
                                    border: [false, true, false, false],
                                },
                            ],
                            [
                                {
                                    text: 'SGST',
                                    colSpan: 2,
                                    margin: [0, -4, 0, 0],
                                    alignment: 'right',
                                    border: [false, false, false, false],
                                },
                                {},
                                {
                                    text: orderDetails.total_sgst,
                                    alignment: 'right',
                                    margin: [0, -4, 0, 0],
                                    border: [false, false, false, false],
                                },
                            ],
                            [
                                {
                                    text: 'Packing Charge',
                                    colSpan: 2,
                                    margin: [0, -4, 0, 0],
                                    alignment: 'right',
                                    border: [false, false, false, true],
                                },
                                {},
                                {
                                    text: orderDetails.packaging_amt,
                                    alignment: 'right',
                                    margin: [0, -4, 0, 0],
                                    border: [false, false, false, true],
                                },
                            ],
                            [
                                {
                                    text: 'Total',
                                    border: [false, false, false, true],
                                },
                                {
                                    text: orderDetails.no_of_items + ' Nos',
                                    border: [false, false, false, true],
                                },
                                {
                                    text: '₹ ' + orderDetails.grand_total,
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
        const pdfDocGenerator = pdfMake.createPdf(docDefinition,"Sale Receipt");
        pdfDocGenerator.getDataUrl((dataUrl) => {
            this.src = this._sanitizer.bypassSecurityTrustResourceUrl(dataUrl);
            this.loading = false;
        });
        // var win = window.open('', '_blank');
        // pdfMake.createPdf(docDefinition).print({}, win);
        // this.ref.close();
    }
}
