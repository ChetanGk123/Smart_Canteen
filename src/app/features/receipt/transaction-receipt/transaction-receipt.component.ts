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
import { environment } from 'src/environments/environment';
import { Logos } from 'src/assets/logo/base_logo';
import imageToBase64 from 'image-to-base64/browser';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: 'app-transaction-receipt',
    templateUrl: './transaction-receipt.component.html',
    styleUrls: ['./transaction-receipt.component.scss'],
})
export class TransactionReceiptComponent implements OnInit {
    pipe = new DatePipe('en-US');
    src: any;
    logo: any;
    name: any;
    loading: boolean = false;
    response: any;
    memberData: any;
    public coreConfig: CoreConfig;

    constructor(
        protected _sanitizer: DomSanitizer,
        public ref: DynamicDialogRef,
        public apiService: ApiService,
        public config: DynamicDialogConfig,
        public messageService: MessageService,
        public memberService: MemberService,
        public _coreEnvService: EnvService
    ) {
        this.coreConfig = _coreEnvService.config;
    }

    ngOnInit(): void {
        // //
        this.name = this.memberService.getUserData()?.full_name;
        this.response = this.config.data.txnData;
        this.memberData = this.config.data.memberData;

        this.logo = environment.production
            ? this.memberService.getUserData()?.dp_location
            : Logos.baseLogo;
        // this.logo = "https://picsum.photos/id/1080/367/267.jpg"
        imageToBase64(this.coreConfig.app.appLogoImage) // Path to the image
            .then((response) => {
                //console.log('data:image/png;base64,'+response); // "cGF0aC90by9maWxlLmpwZw=="
                this.logo = 'data:image/png;base64,' + response;
                this.generatePDF();
            })
            .catch((error) => {
                console.log(error); // Logs an error if there was one
            });
    }

    async generatePDF() {
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
                                        image: this.logo,
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
                                text: `Receipt No: ${this.response.receipt_no}`,
                                alignment: 'left',
                                fontSize: 7,
                            },
                        ],
                        [
                            {
                                width: 'auto',
                                text: `Date: ${this.response.transaction_date}`,
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
                                text: `Name: ${this.memberData.full_name}`,
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
                                text: `Card Number: ${this.memberData.card_number}`,
                                alignment: 'left',
                            },
                        ],
                    ],
                    margin: [5, 2, 0, 0],
                },
                {
                    table: {
                        widths: ['*', '*'],
                        body: [
                            [
                                {
                                    text: 'Payment Mode',
                                    border: [false, false, false, true],
                                },
                                {
                                    text: 'Payment Ref No',
                                    border: [false, false, false, true],
                                },
                            ],
                            [
                                {
                                    text: `${
                                        this.response.payment_mode ?? '-'
                                    }`,
                                    border: [false],
                                },
                                {
                                    text: `${this.response.payment_ref ?? '-'}`,
                                    border: [false],
                                },
                            ],
                        ],
                    },
                    margin: [5, 2, 5, 0],
                },
                {
                    table: {
                        widths: [100, '*'],
                        body: [
                            [
                                {
                                    text: 'Particular',
                                    border: [false, false, false, true],
                                },
                                {
                                    text: 'Amount',
                                    border: [false, false, false, true],
                                },
                            ],
                            [
                                {
                                    text: `Previous Amount`,
                                    border: [false],
                                },
                                {
                                    text: `${this.response.previous_balance}`,
                                    alignment: 'right',
                                    border: [false],
                                },
                            ],
                            [
                                {
                                    text: `Transaction Amount`,
                                    border: [false, false, false, true],
                                },
                                {
                                    text: `${this.response.transaction_amount}`,
                                    alignment: 'right',
                                    border: [false, false, false, true],
                                },
                            ],
                            [
                                {
                                    text: `Balance Amount`,
                                },
                                {
                                    text: `${this.response.current_balance}`,
                                    alignment: 'right',
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
                    text: `Comments: ${this.response.user_comments ?? '-'}`,

                    margin: [5, 5, 0, 0],
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
        this.loading = false;
        var win = window.open('', '_blank');
        pdfMake.createPdf(docDefinition).print({}, win);
        this.ref.close();
    }
}
