import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MemberService } from 'src/app/core/services/MemberService/member.service';
import { PosSaleComponent } from './pos-sale/pos-sale.component';

@Component({
    selector: 'app-attendance',
    templateUrl: './attendance.component.html',
    styleUrls: ['./attendance.component.scss'],
})
export class AttendanceComponent implements OnInit {
    loading: boolean = false;
    messages: Message[];
    Data: any;
    memberData: any;
    attendance_data: any;
    pos_sale_data: any;
    pos_Marker_item: any;
    membershipData: any;
    successAudio = new Audio();
    failureAudio = new Audio();
    commonForm: FormGroup = new FormGroup({
        card_number: new FormControl('', [Validators.required]),
    });
    constructor(
        public apiService: ApiService,
        public messageService: MessageService,
        public dialogService: DialogService,
        public router: Router,
        public route: ActivatedRoute,
        public member: MemberService
    ) {}

    ngOnInit(): void {
        document.getElementById('card_number').focus();
        this.successAudio.src = '../../assets/Success.wav';
        this.successAudio.load();
        this.failureAudio.src = '../../assets/Failure.wav';
        this.failureAudio.load();
    }

    loadData() {
        if (this.commonForm.controls.card_number.value.length >= 14) {
            this.loading = true;
            const Data = this.commonForm.controls.card_number.value;
            this.commonForm.reset();
            this.messages = [];
            this.memberData = null;
            this.apiService
                .getTypeRequest(`mark_attendance/${Data}`)
                .toPromise()
                .then((result: any) => {
                    if (result.result) {
                        this.loading = false;
                        this.successAudio.play();
                        this.loadAttendanceData(result);
                    } else {
                        this.failureAudio.play();
                    }
                })
                .finally(() => {
                    //this.commonForm.reset();
                    this.loading = false;
                });
        }
    }

    loadAttendanceData(result: any) {
        if (result.result) {
            this.Data = result.data;
            this.memberData = result.data.member_data;
            this.attendance_data = result.data.attendance_data;
            this.membershipData = result.data.membership_data;
            this.pos_sale_data = result.data.pos_sale_data;
            this.messages = [
                {
                    severity: 'success',
                    summary: 'success',
                    detail: result.message,
                },
            ];
            if (
                this.attendance_data.isAttendanceMarked == false &&
                this.membershipData.isMembershipActive == false
            ) {
                if (this.pos_sale_data.anyParticularsNow) {
                    if (this.pos_sale_data.isMultiplePOSItems) {
                        this.openPOSDialog();
                    } else {
                        //this.makePOSSale(this.pos_sale_data.particularsNow[0])
                        this.pos_Marker_item =
                            this.pos_sale_data.particularsNow[0].name;
                    }
                }
            }
        } else {
            this.messages = [
                {
                    severity: 'error',
                    summary: 'Error',
                    detail: result.message,
                },
            ];
        }
    }

    openPOSDialog() {
        const ref = this.dialogService.open(PosSaleComponent, {
            data: {
                memberData: this.memberData,
                items: this.pos_sale_data.particularsNow,
            },
            header: `Current POS Items`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-5',
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.pos_Marker_item = result;
                this.ngOnInit();
            }
        });
    }

    makePOSSale(item: any) {
        var payload = {
            sub_total: 30,
            member_id: this.memberData.member_id,
            total_amount: item.rate,
            packaging_amt: 0,
            total_discount: 0,
            total_tax: 0,
            account_head_id: null,
            payment_mode: '',
            payment_ref: '',
            customer_name: this.memberData.full_name,
            customer_ph: this.memberData.phone_number,
            sale_date: new Date().toISOString().substring(0, 10),
            service_charge_per: 0,
            service_charge_amt: 0,
            sales_array: [
                {
                    id: item.id,
                    img: null,
                    name: item.name,
                    gst_slab: 0,
                    isExclusiveGst: item.isExclusiveGst,
                    main_category_name: item.main_category_name,
                    actual_discount_amt: item.discount_amt,
                    actual_discount_per: item.discount_per,
                    DiscountType: 'Percentage',
                    DiscountValue: 0,
                    sale_qty: 1,
                    sale_rate: item.rate,
                },
            ],
        };

        this.apiService
            .postTypeRequest('mark_pos_sales', payload)
            .toPromise()
            .then((resopnse: any) => {
                if (resopnse.result) {
                    //this.printMembership2Inc(resopnse.data);
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Added',
                        detail: resopnse.message,
                    });
                }
            });
    }

    deleteAttandance() {
        this.apiService
            .getTypeRequest('clear_attendance')
            .toPromise()
            .then((result: any) => {
                this.messages = [
                    {
                        severity: 'success',
                        summary: 'success',
                        detail: result.message,
                    },
                ];
            });
    }

    // playSuccessAudio(): void {
    //     const audio = new Audio();
    //     audio.src = '../../assets/success_notification.wav';
    //     audio.load();
    //     audio.play();
    //   }

    // playAlertAudio(): void {
    //     const audio = new Audio();
    //     audio.src = '../../assets/alert_sound_metal_gear.wav';
    //     audio.load();
    //     audio.play();
    //   }
}
