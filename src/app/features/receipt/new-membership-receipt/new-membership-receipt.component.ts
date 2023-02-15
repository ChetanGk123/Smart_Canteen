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
    selector: 'app-new-membership-receipt',
    templateUrl: './new-membership-receipt.component.html',
    styleUrls: ['./new-membership-receipt.component.scss'],
})
export class NewMembershipReceiptComponent implements OnInit {
    pipe = new DatePipe('en-US');
    src: any;
    logo: any;
    name: any;
    loading: boolean = false;
    response: any;

    constructor(
        protected _sanitizer: DomSanitizer,
        public ref: DynamicDialogRef,
        public apiService: ApiService,
        public config: DynamicDialogConfig,
        public messageService: MessageService,
        public memberService: MemberService
    ) {}

    ngOnInit(): void {
        // //
        this.name = this.memberService.getSettings().mess_name;
        this.response = this.config.data;
        this.logo = localStorage.getItem('logo');
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
                                text: `Card No: ${this.response.card_number}`,
                                alignment: 'left',
                                fontSize: 7,
                            },
                        ],
                    ],
                    margin: [5, 10, 0, 0],
                },
                {
                    columns: [
                        [
                            {
                                text: `Bill No: ${this.response.membership_number}`,
                                alignment: 'left',
                                fontSize: 7,
                            },
                        ],
                    ],
                    margin: [5, 2, 0, 0],
                },
                {
                    columns: [
                        [
                            {
                                width: 'auto',
                                text: `Date: ${this.pipe.transform(
                                    Date.now(),
                                    'dd-MMM-y h:mm a'
                                )}`,
                                alignment: 'right',
                                fontSize: 7,
                            },
                        ],
                    ],
                    margin: [5, 2, 0, 0],
                },
                {
                    table: {
                        widths: ['auto', 28, 18, '*'],
                        body: [
                            [
                                {
                                    text: 'Particular',
                                },
                                {
                                    text: 'Rate',
                                },
                                {
                                    text: 'Days',
                                },
                                {
                                    text: 'Start',
                                },
                            ],
                            [
                                {
                                    text: `${this.response.membership_name}`,
                                },
                                {
                                    text: `${this.response.total_amt}`,
                                },
                                {
                                    text: `${this.response.days}`,
                                },
                                {
                                    text: `${this.response.start_date}`,
                                },
                            ],
                            [
                                {
                                    text:
                                        `${
                                            this.response.isBreakfast == 1
                                                ? 'Breakfeast, '
                                                : ''
                                        }` +
                                        `${
                                            this.response.isLunch == 1
                                                ? 'Lunch, '
                                                : ''
                                        }` +
                                        `${
                                            this.response.isSnacks == 1
                                                ? 'Snacks, '
                                                : ''
                                        }` +
                                        `${
                                            this.response.isDinner == 1
                                                ? 'Dinner, '
                                                : ''
                                        }`,
                                    colSpan: 4,
                                    fontSize: 7,
                                },
                                {},
                                {},
                                {},
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
        const pdfDocGenerator = pdfMake.createPdf(docDefinition);
        pdfDocGenerator.getDataUrl((dataUrl) => {
            this.src = this._sanitizer.bypassSecurityTrustResourceUrl(dataUrl);
            this.loading = false;
        });
    }
}
