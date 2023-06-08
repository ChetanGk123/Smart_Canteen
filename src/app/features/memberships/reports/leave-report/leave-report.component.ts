import { Component, OnInit } from '@angular/core';

import imageToBase64 from 'image-to-base64/browser';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CoreConfig } from 'src/app/core/interfaces/coreConfig';
import { ApiService } from 'src/app/core/services/api/api.service';
import { EnvService } from 'src/app/env.service';
import { MemberService } from 'src/app/features/members/member.service';

@Component({
    selector: 'app-leave-report',
    templateUrl: './leave-report.component.html',
    styleUrls: ['./leave-report.component.scss'],
})
export class LeaveReportComponent implements OnInit {
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
                        [
                            {
                                width: 'auto',
                                text: `Period: ${this.config.data.period}`,
                                alignment: 'left',
                            },
                        ],
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
                        widths: [33, '*', 100, 55, 55, 50, 63],
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
                                    text: 'Membership',
                                    margin: [5, 5, 0, 5],
                                    border: [false, true, false, true],
                                },
                                {
                                    text: 'Start Date',
                                    margin: [5, 5, 0, 5],
                                    border: [false, true, false, true],
                                },
                                {
                                    text: 'End Date',
                                    margin: [5, 5, 0, 5],
                                    border: [false, true, false, true],
                                },
                                {
                                    text: 'Extended',
                                    margin: [5, 5, 0, 5],
                                    border: [false, true, false, true],
                                },
                                {
                                    text: 'Leave Status',
                                    margin: [5, 5, 0, 5],
                                    border: [false, true, false, true],
                                },
                            ],
                            ...this.config.data?.data.map((p, index) => [
                                {
                                    text: index + 1,
                                    border: [false, false, false, false],
                                    margin: [5, 5, 0, -5],
                                },
                                {
                                    text: p.full_name,
                                    border: [false, false, false, false],
                                    margin: [5, 5, 0, -5],
                                },
                                {
                                    text: p.membership_data.meal_pack_name,
                                    border: [false, false, false, false],
                                    margin: [5, 5, 0, -5],
                                },
                                {
                                    text: p.leave_data.leave_start_date,
                                    border: [false, false, false, false],
                                    margin: [0, 5, 0, -5],
                                },
                                {
                                    text: p.leave_data.leave_end_date ?? '-',
                                    border: [false, false, false, false],
                                    margin: [0, 5, 0, -5],
                                },
                                {
                                    text: p.leave_data.days_extended ?? '-',
                                    border: [false, false, false, false],
                                    margin: [0, 5, 0, -5],
                                },
                                {
                                    text:
                                        p.membership_data.is_on_leave == 1
                                            ? 'Active'
                                            : 'Inactive' ?? '-',
                                    border: [false, false, false, false],
                                    margin: [0, 5, 0, -5],
                                },
                            ]),
                            [
                                {
                                    colSpan: 7,
                                    text: '',
                                    margin: [5, 5, 0, 5],
                                    border: [false, true, false, false],
                                },
                                {},
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
