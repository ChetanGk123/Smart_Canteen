import { Component, OnInit } from '@angular/core';

import imageToBase64 from 'image-to-base64/browser';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CoreConfig } from 'src/app/core/interfaces/coreConfig';
import { ApiService } from 'src/app/core/services/api/api.service';
import { EnvService } from 'src/app/env.service';
import { MemberService } from '../../member.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: 'app-member-list-report',
    templateUrl: './member-list-report.component.html',
    styleUrls: ['./member-list-report.component.scss'],
})
export class MemberListReportComponent implements OnInit {
    src: any;
    logo: any;
    name: any;
    loading: boolean = false;
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
                title: `${this.config.data.title}`,
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
                                fontSize: 15,
                                // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
                                margin: [0, 5, 0, 0],
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
                        headerRows: 1,
                        dontBreakRows: true,
                        keepWithHeaderRows: 1,
                        heights: 25,
                        widths: [53, '*', 118, 85, 85, 65],
                        body: [
                            [
                                {
                                    text: 'SlNo',
                                    margin: [5, 5, 0, 5],
                                    border: [false, true, false, true],
                                },
                                {
                                    text: 'Name',
                                    margin: [5, 5, 0, 5],
                                    border: [false, true, false, true],
                                },
                                {
                                    text: 'Card No',
                                    margin: [5, 5, 0, 5],
                                    border: [false, true, false, true],
                                },
                                {
                                    text: 'Phone Number',
                                    margin: [5, 5, 0, 5],
                                    border: [false, true, false, true],
                                },
                                {
                                    text: 'Member Type',
                                    margin: [5, 5, 0, 5],
                                    border: [false, true, false, true],
                                },
                                {
                                    text: 'Balance',
                                    margin: [5, 5, 0, 5],
                                    border: [false, true, false, true],
                                    alignment: 'right',
                                },
                            ],
                            ...this.config.data?.data.map((p, index) => [
                                // {
                                //     "member_id": "1",
                                //     "card_number": "74475537390120",
                                //     "counter_id": "1",
                                //     "full_name": "Sanjeev",
                                //     "gender": "MALE",
                                //     "phone_number": "963254101",
                                //     "parents_ph": "963254101",
                                //     "dob": "00-00-0000",
                                //     "email": null,
                                //     "school_name": "Public School Bangalore",
                                //     "class_name": "3",
                                //     "division_name": null,
                                //     "hostel_details": null,
                                //     "photo_url": "https://thetechvaidya.com/cooksbook_new/uploads/member_docs/BH47RD79.png",
                                //     "profile_photo": "member_docs/BH47RD79.png",
                                //     "member_type_id": "1",
                                //     "member_type": "Student",
                                //     "address": "Public School Bangalore",
                                //     "status": "1",
                                //     "balance": "-9060.86"
                                // }
                                {
                                    text: index + 1,
                                    border: [false, false, false, false],
                                    margin: [5, 5, 0, -5],
                                },
                                {
                                    text: p?.full_name,
                                    border: [false, false, false, false],
                                    margin: [5, 5, 0, -5],
                                },
                                {
                                    text: p?.card_number,
                                    border: [false, false, false, false],
                                    margin: [5, 5, 0, -5],
                                },
                                {
                                    text: p?.phone_number,
                                    border: [false, false, false, false],
                                    margin: [0, 5, 0, -5],
                                },
                                {
                                    text: p?.member_type,
                                    border: [false, false, false, false],
                                    margin: [0, 5, 0, -5],
                                },
                                {
                                    text: p?.balance,
                                    border: [false, false, false, false],
                                    margin: [0, 5, 0, -5],
                                    alignment: 'right',
                                },
                            ]),
                            [
                                {
                                    colSpan: 6,
                                    text: '',
                                    margin: [5, 5, 0, 5],
                                    border: [false, true, false, false],
                                },
                                {},
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
