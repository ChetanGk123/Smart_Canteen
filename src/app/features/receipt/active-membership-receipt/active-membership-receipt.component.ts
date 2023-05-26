import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MemberService } from 'src/app/core/services/MemberService/member.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
    selector: 'app-active-membership-receipt',
    templateUrl: './active-membership-receipt.component.html',
    styleUrls: ['./active-membership-receipt.component.scss'],
})
export class ActiveMembershipReceiptComponent implements OnInit {
    src: any;
    logo: any;
    name: any;
    loading: boolean = false;
    memberDate: any;
    membershipDetails: any;

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
        this.loading = true;
        console.log(this.memberService.getSettings());

        this.name = this.memberService.getSettings().mess_name;
        this.membershipDetails = this.config.data.membershipDetails;
        var card_number = this.membershipDetails.card_number;
        this.apiService
            .getTypeRequest(`get_member_info_by_card/${card_number}`)
            .toPromise()
            .then((result: any) => {
                if (result.result) {
                    this.memberDate = result.data;
                    this.logo = localStorage.getItem('logo');
                    this.generatePDF();
                }
            })
            .finally(() => {});
    }

    async generatePDF() {
        let docDefinition = {
            pageSize: 'A4',
            pageMargins: [0, 10, 0, 10],
            defaultStyle: {
                fontSize: 10,
            },
            content: [
                {
                    table: {
                        widths: ['*', '*', '*'],
                        body: [
                            [
                                {
                                    table: {
                                        widths: ['*'],
                                        body: [
                                            [
                                                {
                                                    columns: [
                                                        [
                                                            {
                                                                columns: [
                                                                    {
                                                                        image: 'logo',
                                                                        width: 50,
                                                                        height: 50,
                                                                        alignment:
                                                                            'left',
                                                                    },
                                                                    {
                                                                        columns:
                                                                            [
                                                                                [
                                                                                    {
                                                                                        text: `${this.name}`,
                                                                                        fontSize: 18,
                                                                                        margin: [
                                                                                            0,
                                                                                            0,
                                                                                            0,
                                                                                            0,
                                                                                        ],
                                                                                        bold: true,
                                                                                        alignment:
                                                                                            'center',
                                                                                    },
                                                                                ],
                                                                            ],
                                                                        alignment:
                                                                            'left',
                                                                        margin: [
                                                                            0,
                                                                            0,
                                                                        ],
                                                                    },
                                                                ],
                                                            },
                                                            {
                                                                columns: [
                                                                    [
                                                                        {
                                                                            text: 'Mob No : 9480644248',
                                                                            alignment:
                                                                                'center',
                                                                            fontSize: 10,
                                                                        },
                                                                    ],
                                                                ],
                                                                margin: [
                                                                    45, -10, 0,
                                                                    0,
                                                                ],
                                                                alignment:
                                                                    'center',
                                                            },
                                                        ],
                                                    ],
                                                    border: [
                                                        false,
                                                        false,
                                                        false,
                                                        false,
                                                    ],
                                                },
                                            ],
                                            [
                                                {
                                                    columns: [
                                                        [
                                                            {
                                                                text:
                                                                    'Date: ' +
                                                                    new Date().toDateString(),
                                                                alignment:
                                                                    'right',
                                                            },
                                                        ],
                                                    ],
                                                    lineHeight: 1.2,
                                                    border: [
                                                        false,
                                                        false,
                                                        false,
                                                        true,
                                                    ],
                                                },
                                            ],
                                            [
                                                {
                                                    columns: [
                                                        [
                                                            {
                                                                text: 'Member Details',
                                                                bold: true,
                                                                fontSize: 16,
                                                                decoration:
                                                                    'underline',
                                                                alignment:
                                                                    'center',
                                                                margin: [
                                                                    0, 2, 0, 2,
                                                                ],
                                                            },
                                                            {
                                                                text: `Name: ${this.memberDate.full_name}`,
                                                                fontSize: 12,
                                                                alignment:
                                                                    'center',
                                                                bold: true,
                                                            },
                                                            {
                                                                columns: [
                                                                    [
                                                                        {
                                                                            text: 'Phone No: ',
                                                                        },
                                                                    ],
                                                                    [
                                                                        {
                                                                            text: `${this.memberDate.phone_number}`,
                                                                        },
                                                                    ],
                                                                ],
                                                                margin: [
                                                                    0, 5, 0, 0,
                                                                ],
                                                            },
                                                            {
                                                                columns: [
                                                                    [
                                                                        {
                                                                            text: 'Card No:',
                                                                        },
                                                                    ],
                                                                    [
                                                                        {
                                                                            text: `${this.memberDate.card_number}`,
                                                                        },
                                                                    ],
                                                                ],
                                                                margin: [
                                                                    0, 5, 0, 0,
                                                                ],
                                                            },
                                                            {
                                                                columns: [
                                                                    [
                                                                        {
                                                                            text: 'Balance:',
                                                                        },
                                                                    ],
                                                                    [
                                                                        {
                                                                            text: `₹ ${this.memberDate.balance}`,
                                                                        },
                                                                    ],
                                                                ],
                                                                margin: [
                                                                    0, 5, 0, 0,
                                                                ],
                                                            },
                                                            {
                                                                columns: [
                                                                    [
                                                                        {
                                                                            text: 'Gender:',
                                                                        },
                                                                    ],
                                                                    [
                                                                        {
                                                                            text: `${this.memberDate.gender}`,
                                                                        },
                                                                    ],
                                                                ],
                                                                margin: [
                                                                    0, 5, 0, 0,
                                                                ],
                                                            },
                                                        ],
                                                    ],
                                                    // margin: [left, top, right, bottom]
                                                    margin: [10, 0, 10, 10],
                                                    border: [
                                                        false,
                                                        false,
                                                        false,
                                                        true,
                                                    ],
                                                },
                                            ],
                                            [
                                                {
                                                    columns: [
                                                        [
                                                            {
                                                                text: 'Membership Details',
                                                                bold: true,
                                                                fontSize: 16,
                                                                decoration:
                                                                    'underline',
                                                                alignment:
                                                                    'center',
                                                                margin: [
                                                                    0, 5, 0, 5,
                                                                ],
                                                            },
                                                            {
                                                                text: `Name: ${this.membershipDetails.membership_name}`,
                                                                fontSize: 12,
                                                                alignment:
                                                                    'center',
                                                                bold: true,
                                                            },
                                                            {
                                                                columns: [
                                                                    [
                                                                        {
                                                                            text: `No: ${this.membershipDetails.membership_number}`,
                                                                            alignment:
                                                                                'center',
                                                                        },
                                                                    ],
                                                                ],
                                                                margin: [
                                                                    0, 5, 0, 0,
                                                                ],
                                                            },
                                                            {
                                                                columns: [
                                                                    [
                                                                        {
                                                                            text: 'Contents: ',
                                                                        },
                                                                    ],
                                                                    [
                                                                        {
                                                                            text:
                                                                                `${
                                                                                    this
                                                                                        .membershipDetails
                                                                                        .isBreakfast ==
                                                                                    1
                                                                                        ? 'Breakfeast, '
                                                                                        : ''
                                                                                }` +
                                                                                `${
                                                                                    this
                                                                                        .membershipDetails
                                                                                        .isLunch ==
                                                                                    1
                                                                                        ? 'Lunch, '
                                                                                        : ''
                                                                                }` +
                                                                                `${
                                                                                    this
                                                                                        .membershipDetails
                                                                                        .isSnacks ==
                                                                                    1
                                                                                        ? 'Snacks, '
                                                                                        : ''
                                                                                }` +
                                                                                `${
                                                                                    this
                                                                                        .membershipDetails
                                                                                        .isDinner ==
                                                                                    1
                                                                                        ? 'Dinner, '
                                                                                        : ''
                                                                                }`,
                                                                        },
                                                                    ],
                                                                ],
                                                                margin: [
                                                                    0, 5, 0, 0,
                                                                ],
                                                            },
                                                            {
                                                                columns: [
                                                                    [
                                                                        {
                                                                            text: 'Days:',
                                                                        },
                                                                    ],
                                                                    [
                                                                        {
                                                                            text: `${this.membershipDetails.days}`,
                                                                        },
                                                                    ],
                                                                ],
                                                                margin: [
                                                                    0, 5, 0, 0,
                                                                ],
                                                            },
                                                            {
                                                                columns: [
                                                                    [
                                                                        {
                                                                            text: 'Start Date:',
                                                                        },
                                                                    ],
                                                                    [
                                                                        {
                                                                            text: `${this.membershipDetails.start_date}`,
                                                                        },
                                                                    ],
                                                                ],
                                                                margin: [
                                                                    0, 5, 0, 0,
                                                                ],
                                                            },
                                                            {
                                                                columns: [
                                                                    [
                                                                        {
                                                                            text: 'End Date:',
                                                                        },
                                                                    ],
                                                                    [
                                                                        {
                                                                            text: `${this.membershipDetails.end_date}`,
                                                                        },
                                                                    ],
                                                                ],
                                                                margin: [
                                                                    0, 5, 0, 0,
                                                                ],
                                                            },
                                                            {
                                                                columns: [
                                                                    [
                                                                        {
                                                                            text: 'Price:',
                                                                        },
                                                                    ],
                                                                    [
                                                                        {
                                                                            text: `₹ ${this.membershipDetails.total_amt}`,
                                                                        },
                                                                    ],
                                                                ],
                                                                margin: [
                                                                    0, 5, 0, 0,
                                                                ],
                                                            },
                                                        ],
                                                    ],
                                                    // margin: [left, top, right, bottom]
                                                    margin: [10, 0, 10, 0],
                                                    border: [
                                                        false,
                                                        false,
                                                        false,
                                                        true,
                                                    ],
                                                },
                                            ],
                                        ],
                                    },
                                    // margin: [left, top, right, bottom]
                                    margin: [5, 10, 5, 10],
                                },
                            ],
                        ],
                        borders: [true, false, false, false],
                    },
                    layout: {
                        vLineWidth: function (i, node) {
                            return i === 0 || i === node.table.widths.length
                                ? 0
                                : 1;
                        },
                        hLineWidth: function (i, node) {
                            return i === 0 || i === node.table.widths.length
                                ? 0
                                : 0;
                        },

                        vLineColor: function () {
                            return 'black';
                        },

                        vLineStyle: function (i, node) {
                            if (i === 0 || i === node.table.widths.length) {
                                return null;
                            }
                            return { dash: { length: 10 } };
                        },
                    },
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
