import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CoreConfig } from 'src/app/core/interfaces/coreConfig';
import { ApiService } from 'src/app/core/services/api/api.service';
import { EnvService } from 'src/app/env.service';
import { MemberService } from '../../member.service';

import imageToBase64 from 'image-to-base64/browser';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-member-transactions',
  templateUrl: './member-transactions.component.html',
  styleUrls: ['./member-transactions.component.scss']
})
export class MemberTransactionsComponent implements OnInit {

    src: any;
    logo: any;
    name: any;
    loading: boolean = true;
    response: any;
    datePipe: DatePipe = new DatePipe('en-US');
    dateRange: any;
    public coreConfig: CoreConfig;
    constructor(
        protected _sanitizer: DomSanitizer,
        public ref: DynamicDialogRef,
        public apiService: ApiService,
        public config: DynamicDialogConfig,
        public messageService: MessageService,
        public _coreEnvService: EnvService,
        public memberService: MemberService
    ) {
        this.coreConfig = _coreEnvService.config;
    }
/**
 * TODO: Correct This print
 **/
    ngOnInit(): void {
        this.loading = true
        this.name = this.memberService.getUserData()?.full_name;
        let date = `${new Date().getDate()}/${
            +new Date().getMonth() + 1
        }/${+new Date().getFullYear()}`;
        this.logo = `${date} - $`;
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
        let totalCredit = this.config.data.reduce(
            (acc, cur) =>
                acc +
                Number(
                    cur.transaction_type == 'CREDIT'
                        ? cur.transaction_amount
                        : 0
                ),
            0
        );
        let totalDEBIT = this.config.data.reduce(
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
                                text: 'Transactions',
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
                            ...this.config.data.map((p) => [
                                // {
                                //     "id": "152",
                                //     "receipt_no": "ME-00078",
                                //     "member_id": "1",
                                //     "transaction_type": "DEBIT",
                                //     "transaction_category": "MEMBER_ACCOUNT_NEW_MEMBERSHIP",
                                //     "previous_balance": "0.00",
                                //     "discount": "0.00",
                                //     "transaction_amount": "4900.00",
                                //     "current_balance": "-4900.00",
                                //     "payment_mode": null,
                                //     "payment_ref": null,
                                //     "transaction_date": "25-05-2023",
                                //     "transaction_description": "Dr. For New Membership: Full Day Meals",
                                //     "user_comments": null
                                // },
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
                                    text: '₹' + totalDEBIT.toFixed(2),
                                    margin: [5, 5, 0, 5],
                                    alignment: 'right',
                                    border: [false, true, false, true],
                                },
                                {
                                    text: '₹' + totalCredit.toFixed(2),
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
