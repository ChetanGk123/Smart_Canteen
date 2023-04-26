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
    selector: 'app-account-transactions',
    templateUrl: './account-transactions.component.html',
    styleUrls: ['./account-transactions.component.scss'],
})
export class AccountTransactionsComponent implements OnInit {
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
        let date = `${new Date().getDate()}/${
            +new Date().getMonth() + 1
        }/${+new Date().getFullYear()}`;
        this.logo = `${date} - $`;
        this.dateRange = `${this.config.data.account_Data.start_date} - ${this.config.data.account_Data.end_date}`;

        this.logo = environment.production
            ? this.memberService.getUserData()?.dp_location
            : Logos.baseLogo;
        // this.logo = 'https://fastly.picsum.photos/id/1080/367/267.jpg?hmac=tUSNDSd12u94lQBRq7qu21g1mUcxNPSxXn5beLS4g_c';
        this.generatePDF();
    }

    async generatePDF() {
        let totalCredit = this.config.data?.transactions_Data.reduce(
            (acc, cur) =>
                acc +
                Number(
                    cur.transaction_type == 'CREDIT'
                        ? cur.transaction_amount
                        : 0
                ),
            0
        );
        let totalDEBIT = this.config.data?.transactions_Data.reduce(
            (acc, cur) =>
                acc +
                Number(
                    cur.transaction_type == 'DEBIT' ? cur.transaction_amount : 0
                ),
            0
        );
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
                title: 'Account Transactions',
                author: 'Smart Canteen',
                subject: 'Transactions',
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
                                // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
                                margin: [0, 5, 0, 0],
                                bold: true,
                                alignment: 'center',
                            },
                            {
                                text: 'Account Transactions',
                                decoration: 'underline',
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
                                text: `Account: ${this.config.data.account_Data.account_head_id.account_name}`,
                                alignment: 'left',
                            },
                        ],
                        [
                            {
                                width: 'auto',
                                text: `Balance on ${this.config.data.account_Data.start_date}: ₹ ${this.config.data.account_Data.account_head_id.balance}`,
                                alignment: 'right',
                            },
                        ],
                    ],
                    // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
                    margin: [-15, 0, -15, 5],
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
                                    text: 'Particulars',
                                    margin: [5, 5, 0, 5],
                                    border: [false, true, false, true],
                                },
                                {
                                    text: 'Receipt No',
                                    margin: [5, 5, 0, 5],
                                    border: [false, true, false, true],
                                },
                                {
                                    text: 'Dr Amount',
                                    margin: [5, 5, 0, 5],
                                    border: [false, true, false, true],
                                    alignment: 'right',
                                },
                                {
                                    text: 'Cr Amount',
                                    margin: [5, 5, 0, 5],
                                    border: [false, true, false, true],
                                    alignment: 'right',
                                },
                            ],
                            ...this.config.data?.transactions_Data.map((p) => [
                                {
                                    text: p.transaction_date,
                                    border: [false, false, false, false],
                                    margin: [5, 5, 0, -5],
                                },
                                {
                                    text: p.transaction_description,
                                    border: [false, false, false, false],
                                    margin: [5, 5, 0, -5],
                                },
                                {
                                    text: p.receipt_no,
                                    border: [false, false, false, false],
                                    margin: [5, 5, 0, -5],
                                },
                                {
                                    text:
                                        p.transaction_type == 'DEBIT'
                                            ? p.transaction_amount
                                            : '',
                                    border: [false, false, false, false],
                                    margin: [0, 5, 0, -5],
                                    alignment: 'right',
                                },
                                {
                                    text:
                                        p.transaction_type == 'CREDIT'
                                            ? p.transaction_amount
                                            : '',
                                    border: [false, false, false, false],
                                    margin: [0, 5, 0, -5],
                                    alignment: 'right',
                                },
                            ]),
                            [
                                {
                                    colSpan: 3,
                                    text: 'Total',
                                    margin: [5, 5, 0, 5],
                                    border: [false, true, false, true],
                                },
                                {},
                                {},
                                {
                                    text: totalDEBIT.toFixed(2),
                                    margin: [5, 5, 0, 5],
                                    alignment: 'right',
                                    border: [false, true, false, true],
                                },
                                {
                                    text: totalCredit.toFixed(2),
                                    margin: [5, 5, 0, 5],
                                    alignment: 'right',
                                    border: [false, true, false, true],
                                },
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
