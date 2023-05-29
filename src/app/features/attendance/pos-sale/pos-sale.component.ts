import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/core/services/api/api.service';

@Component({
    selector: 'app-pos-sale',
    templateUrl: './pos-sale.component.html',
    styleUrls: ['./pos-sale.component.scss'],
})
export class PosSaleComponent implements OnInit {
    constructor(
        public apiService: ApiService,
        public ref: DynamicDialogRef,
        public messageService: MessageService,
        public config: DynamicDialogConfig
    ) {}

    ngOnInit(): void {
        console.log(this.config.data);
        var config = {
            memberData: {
                member_id: '1',
                card_number: '74475537390120',
                counter_id: '1',
                full_name: 'faaaaaull_name',
                gender: 'gender',
                phone_number: 'phone_number',
                parents_ph: 'parents_ph',
                dob: '00-00-0000',
                email: 'email',
                school_name: 'new school name',
                class_name: 'class_name',
                division_name: 'division_name',
                hostel_details: 'hostel_details',
                photo_url:
                    'https://thetechvaidya.com/cooksbook_new/uploads/member_docs/UKIP57UE.png',
                profile_photo: 'member_docs/UKIP57UE.png',
                member_type_id: '1',
                member_type: 'Studet',
                address: 'address',
                status: '1',
                balance: '955.00',
            },
            items: [
                {
                    id: '4',
                    counter_id: '1',
                    main_category_id: '1',
                    main_category_name: 'Veg',
                    name: 'naaame',
                    stock_qty: '-10.00',
                    uom_id: '1',
                    uom_name: 'Plate',
                    hsn_code: 'hsn_code',
                    gst_slab_id: null,
                    gst_slab: null,
                    discount_amt: '0.00',
                    discount_per: '1.00',
                    isExclusiveGst: '1',
                    rate: '15.00',
                    img_loc: null,
                },
                {
                    id: '2',
                    counter_id: '1',
                    main_category_id: '1',
                    main_category_name: 'Veg',
                    name: 'Vada',
                    stock_qty: '0.00',
                    uom_id: '1',
                    uom_name: 'Plate',
                    hsn_code: 'hsn_code',
                    gst_slab_id: null,
                    gst_slab: null,
                    discount_amt: '0.00',
                    discount_per: '1.00',
                    isExclusiveGst: '1',
                    rate: '12.00',
                    img_loc: null,
                },
            ],
        };
    }

    makePOSSale(item: any) {
        console.log(item);
        var payload = {
            sub_total: 30,
            member_id: this.config.data.memberData.member_id,
            total_amount: item.rate,
            packaging_amt: 0,
            total_discount: 0,
            total_tax: 0,
            account_head_id: null,
            payment_mode: '',
            payment_ref: '',
            customer_name: this.config.data.memberData.full_name,
            customer_ph: this.config.data.memberData.phone_number,
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
                    this.ref.close(true);
                }
            });
    }
}
