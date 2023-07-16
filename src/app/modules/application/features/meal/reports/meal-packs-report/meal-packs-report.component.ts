import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import imageToBase64 from 'image-to-base64/browser';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CoreConfig } from 'src/app/core/interfaces/coreConfig';
import { MemberService } from 'src/app/core/services/MemberService/member.service';
import { ApiService } from 'src/app/core/services/api/api.service';
import { EnvService } from 'src/app/env.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: 'app-meal-packs-report',
    templateUrl: './meal-packs-report.component.html',
    styleUrls: ['./meal-packs-report.component.scss'],
})
export class MealPacksReportComponent implements OnInit {
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

    ngOnInit(): void {
        // [
        //     {
        //         "meal_pack_id": "10",
        //         "meal_pack_name": "Full Membership (1-4)",
        //         "meal_pack_price": 130,
        //         "meal_pack_items": [
        //             {
        //                 "meal_pack_item_id": "17",
        //                 "meal_pack_id": "10",
        //                 "meal_id": "1",
        //                 "meal_name": "BREAKFAST",
        //                 "meal_price": "60.00",
        //                 "meal_start_time": "08:00:00 AM",
        //                 "raw_meal_start_time": "08:00:00",
        //                 "meal_end_time": "09:00:00 AM",
        //                 "raw_meal_end_time": "09:00:00"
        //             },
        //             {
        //                 "meal_pack_item_id": "18",
        //                 "meal_pack_id": "10",
        //                 "meal_id": "2",
        //                 "meal_name": "LUNCH",
        //                 "meal_price": "70.00",
        //                 "meal_start_time": "01:00:00 PM",
        //                 "raw_meal_start_time": "13:00:00",
        //                 "meal_end_time": "02:30:00 PM",
        //                 "raw_meal_end_time": "14:30:00"
        //             }
        //         ]
        //     },
        //     {
        //         "meal_pack_id": "11",
        //         "meal_pack_name": "Full Membership (6-7)",
        //         "meal_pack_price": 200,
        //         "meal_pack_items": [
        //             {
        //                 "meal_pack_item_id": "19",
        //                 "meal_pack_id": "11",
        //                 "meal_id": "1",
        //                 "meal_name": "BREAKFAST",
        //                 "meal_price": "60.00",
        //                 "meal_start_time": "12:00:00 AM",
        //                 "raw_meal_start_time": "00:00:00",
        //                 "meal_end_time": "11:30:00 AM",
        //                 "raw_meal_end_time": "11:30:00"
        //             },
        //             {
        //                 "meal_pack_item_id": "20",
        //                 "meal_pack_id": "11",
        //                 "meal_id": "2",
        //                 "meal_name": "LUNCH",
        //                 "meal_price": "70.00",
        //                 "meal_start_time": "11:31:00 AM",
        //                 "raw_meal_start_time": "11:31:00",
        //                 "meal_end_time": "07:59:59 PM",
        //                 "raw_meal_end_time": "19:59:59"
        //             },
        //             {
        //                 "meal_pack_item_id": "21",
        //                 "meal_pack_id": "11",
        //                 "meal_id": "4",
        //                 "meal_name": "DINNER",
        //                 "meal_price": "70.00",
        //                 "meal_start_time": "05:00:00 PM",
        //                 "raw_meal_start_time": "17:00:00",
        //                 "meal_end_time": "04:59:59 PM",
        //                 "raw_meal_end_time": "16:59:59"
        //             }
        //         ]
        //     },
        //     {
        //         "meal_pack_id": "12",
        //         "meal_pack_name": "Full Membership (8-9)",
        //         "meal_pack_price": 70,
        //         "meal_pack_items": [
        //             {
        //                 "meal_pack_item_id": "22",
        //                 "meal_pack_id": "12",
        //                 "meal_id": "1",
        //                 "meal_name": "BREAKFAST",
        //                 "meal_price": "70.00",
        //                 "meal_start_time": "09:00:00 AM",
        //                 "raw_meal_start_time": "09:00:00",
        //                 "meal_end_time": "10:30:00 AM",
        //                 "raw_meal_end_time": "10:30:00"
        //             }
        //         ]
        //     },
        //     {
        //         "meal_pack_id": "13",
        //         "meal_pack_name": "Full Membership (10)",
        //         "meal_pack_price": 80,
        //         "meal_pack_items": [
        //             {
        //                 "meal_pack_item_id": "23",
        //                 "meal_pack_id": "13",
        //                 "meal_id": "2",
        //                 "meal_name": "LUNCH",
        //                 "meal_price": "80.00",
        //                 "meal_start_time": "12:00:00 PM",
        //                 "raw_meal_start_time": "12:00:00",
        //                 "meal_end_time": "02:30:00 PM",
        //                 "raw_meal_end_time": "14:30:00"
        //             }
        //         ]
        //     },
        //     {
        //         "meal_pack_id": "14",
        //         "meal_pack_name": "Staff Pack",
        //         "meal_pack_price": 80,
        //         "meal_pack_items": [
        //             {
        //                 "meal_pack_item_id": "24",
        //                 "meal_pack_id": "14",
        //                 "meal_id": "4",
        //                 "meal_name": "DINNER",
        //                 "meal_price": "80.00",
        //                 "meal_start_time": "09:00:00 PM",
        //                 "raw_meal_start_time": "21:00:00",
        //                 "meal_end_time": "10:00:00 PM",
        //                 "raw_meal_end_time": "22:00:00"
        //             }
        //         ]
        //     }
        // ]
        this.loading = true;
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
                title: 'All Memberships',
                author: 'Smart Canteen',
                subject: 'Memberships',
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
                                // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
                                margin: [0, 5, 0, 0],
                                fontSize: 15,
                                bold: true,
                                alignment: 'center',
                            },
                            {
                                text: `${this.config.data.title}`,
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
                        [],
                        [
                            {
                                width: 'auto',
                                text: `Date: ${this.datePipe.transform(
                                    new Date(),
                                    'dd-MM-yyyy'
                                )}`,
                                alignment: 'right',
                            },
                        ],
                    ],
                    // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
                    margin: [-15, 0, -15, 5],
                },
                {
                    table: {
                        widths: ['*'],
                        dontBreakRows: true,
                        body: [
                            ...this.config.data?.data.map((item, itemIndex) => [
                                {
                                    stack: [
                                        {text:itemIndex+1+ '. ' + item.meal_pack_name,
                                        fontSize: 15,
                                        bold: true,},
                                        {
                                            // {
                                            table: {
                                                headerRows: 1,
                                                dontBreakRows: true,
                                                keepWithHeaderRows: 1,
                                                heights: 25,
                                                widths: [63, '*', 85, 85, 85],
                                                body: [
                                                    [
                                                        {
                                                            text: 'SlNo',
                                                            margin: [
                                                                5, 5, 0, 5,
                                                            ],
                                                            border: [
                                                                false,
                                                                true,
                                                                false,
                                                                true,
                                                            ],
                                                        },
                                                        {
                                                            text: 'Name',
                                                            margin: [
                                                                5, 5, 0, 5,
                                                            ],
                                                            border: [
                                                                false,
                                                                true,
                                                                false,
                                                                true,
                                                            ],
                                                        },
                                                        {
                                                            text: 'Price',
                                                            margin: [
                                                                5, 5, 0, 5,
                                                            ],
                                                            border: [
                                                                false,
                                                                true,
                                                                false,
                                                                true,
                                                            ],
                                                            alignment: 'right',
                                                        },
                                                        {
                                                            text: 'Start Time',
                                                            margin: [
                                                                5, 5, 0, 5,
                                                            ],
                                                            border: [
                                                                false,
                                                                true,
                                                                false,
                                                                true,
                                                            ],
                                                        },
                                                        {
                                                            text: 'End Time',
                                                            margin: [
                                                                5, 5, 0, 5,
                                                            ],
                                                            border: [
                                                                false,
                                                                true,
                                                                false,
                                                                true,
                                                            ],
                                                        },
                                                    ],
                                                    ...item.meal_pack_items.map(
                                                        (p, index) => [
                                                            //     {
                                                            //         "meal_pack_id": "13",
                                                            //         "meal_pack_name": "Full Membership (10)",
                                                            //         "meal_pack_price": 80,
                                                            //         "meal_pack_items": [
                                                            //             {
                                                            //                 "meal_pack_item_id": "23",
                                                            //                 "meal_pack_id": "13",
                                                            //                 "meal_id": "2",
                                                            //                 "meal_name": "LUNCH",
                                                            //                 "meal_price": "80.00",
                                                            //                 "meal_start_time": "12:00:00 PM",
                                                            //                 "raw_meal_start_time": "12:00:00",
                                                            //                 "meal_end_time": "02:30:00 PM",
                                                            //                 "raw_meal_end_time": "14:30:00"
                                                            //             }
                                                            //         ]
                                                            //     },
                                                            {
                                                                text: index + 1,
                                                                border: [
                                                                    false,
                                                                    false,
                                                                    false,
                                                                    false,
                                                                ],
                                                                margin: [
                                                                    5, 5, 0, -5,
                                                                ],
                                                            },
                                                            {
                                                                text: p.meal_name,
                                                                border: [
                                                                    false,
                                                                    false,
                                                                    false,
                                                                    false,
                                                                ],
                                                                margin: [
                                                                    5, 5, 0, -5,
                                                                ],
                                                            },
                                                            {
                                                                text: p.meal_price,
                                                                border: [
                                                                    false,
                                                                    false,
                                                                    false,
                                                                    false,
                                                                ],
                                                                margin: [
                                                                    0, 5, 0, -5,
                                                                ],
                                                                alignment:
                                                                    'right',
                                                            },
                                                            {
                                                                text: p.meal_start_time,
                                                                border: [
                                                                    false,
                                                                    false,
                                                                    false,
                                                                    false,
                                                                ],
                                                                margin: [
                                                                    0, 5, 0, -5,
                                                                ],

                                                            },
                                                            {
                                                                text: p.meal_end_time,
                                                                border: [
                                                                    false,
                                                                    false,
                                                                    false,
                                                                    false,
                                                                ],
                                                                margin: [
                                                                    0, 5, 0, -5,
                                                                ],

                                                            },
                                                        ]
                                                    ),
                                                    [
                                                        {
                                                            colSpan: 5,
                                                            text: '',
                                                            margin: [
                                                                5, 5, 0, 5,
                                                            ],
                                                            border: [
                                                                false,
                                                                true,
                                                                false,
                                                                false,
                                                            ],
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
                                                    return {
                                                        dash: {
                                                            length: 10,
                                                            space: 4,
                                                        },
                                                    };
                                                },
                                            },
                                            // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
                                            margin: [5, 10, 5, -25],
                                        },
                                    ],
                                    margin: [5, 5, 0, 5],
                                    border: [false, true, false, true],
                                },
                            ]),
                        ],
                    },
                    // layout: {
                    //     hLineStyle: function () {
                    //         return { dash: { length: 10, space: 4 } };
                    //     },
                    // },
                    // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
                    margin: [-15, 10, -15, -10],
                },
                // {
                //     table: {
                //         headerRows: 1,
                //         dontBreakRows: true,
                //         keepWithHeaderRows: 1,
                //         heights: 25,
                //         widths: [63, '*', 85],
                //         body: [
                //             [
                //                 {
                //                     text: 'SlNo',
                //                     margin: [5, 5, 0, 5],
                //                     border: [false, true, false, true],
                //                 },
                //                 {
                //                     text: 'Name',
                //                     margin: [5, 5, 0, 5],
                //                     border: [false, true, false, true],
                //                 },
                //                 {
                //                     text: 'Balance',
                //                     margin: [5, 5, 0, 5],
                //                     border: [false, true, false, true],
                //                     alignment: 'right',
                //                 },
                //             ],
                //             ...this.config.data?.data.map((p, index) => [
                //                 //     {
                //                 //         "meal_pack_id": "13",
                //                 //         "meal_pack_name": "Full Membership (10)",
                //                 //         "meal_pack_price": 80,
                //                 //         "meal_pack_items": [
                //                 //             {
                //                 //                 "meal_pack_item_id": "23",
                //                 //                 "meal_pack_id": "13",
                //                 //                 "meal_id": "2",
                //                 //                 "meal_name": "LUNCH",
                //                 //                 "meal_price": "80.00",
                //                 //                 "meal_start_time": "12:00:00 PM",
                //                 //                 "raw_meal_start_time": "12:00:00",
                //                 //                 "meal_end_time": "02:30:00 PM",
                //                 //                 "raw_meal_end_time": "14:30:00"
                //                 //             }
                //                 //         ]
                //                 //     },
                //                 {
                //                     text: index + 1,
                //                     border: [false, false, false, false],
                //                     margin: [5, 5, 0, -5],
                //                 },
                //                 {
                //                     text: p.meal_pack_name,
                //                     border: [false, false, false, false],
                //                     margin: [5, 5, 0, -5],
                //                 },
                //                 {
                //                     text: p.meal_pack_price,
                //                     border: [false, false, false, false],
                //                     margin: [0, 5, 0, -5],
                //                     alignment: 'right',
                //                 },
                //             ]),
                //             [
                //                 {
                //                     colSpan: 3,
                //                     text: '',
                //                     margin: [5, 5, 0, 5],
                //                     border: [false, true, false, false],
                //                 },
                //                 {},
                //                 {},
                //             ],
                //         ],
                //     },
                //     layout: {
                //         hLineStyle: function () {
                //             return { dash: { length: 10, space: 4 } };
                //         },
                //     },
                //     // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
                //     margin: [-15, 10, -15, -10],
                // },
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
