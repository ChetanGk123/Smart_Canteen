import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { forkJoin } from 'rxjs';
import { CoreConfig } from 'src/app/core/interfaces/coreConfig';
import { ApiService } from 'src/app/core/services/api/api.service';
import { AppMainComponent } from 'src/app/layout/app.main.component';
import { PosSaleComponent as receipt } from '../receipt/pos-sale/pos-sale.component';

export interface OrderDetails {
    member_id: number | null;
    account_head_id?: number;
    sales_array?: OrderItem[];
    customer_name?: string;
    customer_ph?: string;
    sale_date?: string;
    account_id?: number;
    account_name?: string;
    service_charge_per?: number;
    service_charge_amt?: number;
    packaging_amt?: number;
    sub_total?: number;
    total_discount?: number;
    total_tax?: number;
    total_amount?: number;
    payment_mode?: string;
    payment_ref?: string;
}

export interface OrderItem {
    id: number;
    img: string;
    name: string;
    main_category_name: string;
    main_cat_img_loc: string;
    DiscountType: string;
    DiscountValue: number;
    sale_rate: number;
    gst_slab: number | null;
    isExclusiveGst: number;
    actual_discount_per: number;
    actual_discount_amt: number;
    sale_qty: number;
}

@Component({
    selector: 'app-posSale',
    templateUrl: './posSale.component.html',
    styleUrls: ['./posSale.component.scss'],
})
export class PosSaleComponent implements OnInit {
    posItems: any;
    incomeAccounts: any;
    itemFilter: any;
    currentOrderItem: OrderItem;
    mainCategoryFilter: any;
    UserConfigDialog: boolean = true;
    fetchCustomerLoading: boolean = false;
    ItemConfig: boolean = false;
    mainCategories: any;
    filteredItems: any;
    currentOrder: OrderItem[] = [];
    OrderDetails: OrderDetails = {
        sub_total: 0,
        member_id: null,
        total_amount: 0,
        packaging_amt: 0,
        total_discount: 0,
        total_tax: 0,
        account_head_id: null,
        payment_mode: '',
        payment_ref: '',
        customer_name: '',
        customer_ph: '',
        sale_date: new Date().toISOString().substring(0, 10),
        service_charge_per: 0,
        service_charge_amt: 0,
    };

    commonForm: FormGroup = new FormGroup({
        card_no: new FormControl(''),
        member_id: new FormControl(''),
        customer_name: new FormControl(''),
        customer_ph: new FormControl(''),
        address: new FormControl(''),
        account_head_id: new FormControl('', Validators.required),
        account_head_name: new FormControl(''),
        account_balance: new FormControl(''),
    });
    Items: any;
    constructor(
        public appMain: AppMainComponent,
        public apiService: ApiService,
        // public coreConfig: CoreConfig,
        private confirmationService: ConfirmationService,
        public messageService: MessageService,
        public dialogService: DialogService
    ) {}

    ngOnInit() {
        this.appMain.hideMenu();
        forkJoin([
            this.apiService
                .getTypeRequest(`table_data/POS_MAIN_CATEGORY`)
                .toPromise()
                .then((result: any) => {
                    if (result.result) {
                        this.mainCategories = result.data;
                    }
                }),
            this.apiService
                .getTypeRequest(`table_data/POS_PARTICULAR`)
                .toPromise()
                .then((result: any) => {
                    if (result.result) {
                        this.posItems = result.data;
                        this.Items = result.data;
                        this.filteredItems = result.data;
                    }
                }),
            this.apiService
                .getTypeRequest(`table_data/INCOME_ACCOUNT_HEAD`)
                .toPromise()
                .then((result: any) => {
                    if (result.result) {
                        this.incomeAccounts = result.data;
                    }
                }),
        ]);
    }

    updateAccountStatus() {
        this.incomeAccounts.forEach((element) => {
            if (
                element.account_head_id ==
                this.commonForm.controls.account_head_id.value
            ) {
                this.commonForm.controls.account_head_name.setValue(
                    element.account_name
                );
            }
        });
    }

    CloseUserConfigDialog() {
        if (this.commonForm.valid) {
            this.UserConfigDialog = false;
            if (this.commonForm.controls.member_id.value) {
                this.OrderDetails.member_id =
                    this.commonForm.controls.member_id.value;
                this.OrderDetails.customer_name =
                    this.commonForm.controls.customer_name.value;
                this.OrderDetails.customer_ph =
                    this.commonForm.controls.customer_ph.value;
                    this.OrderDetails.account_head_id = null
            } else {
                this.OrderDetails.account_head_id =
                    this.commonForm.controls.account_head_id.value;
            }
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Incomplete Details',
                detail: 'Select an account.',
            });
            this.commonForm.controls.account_head_id.markAsTouched();
        }
    }

    ChangeMainCategoryFilter() {
        if(this.mainCategoryFilter != null){
            var TempItems = this.posItems.filter((item: any) => {
                if (item.main_category_id == this.mainCategoryFilter.id) {
                    return item;
                }
            });
            this.Items = TempItems;
        } else {
            this.Items = this.posItems;
        }
    }

    ChangeFilter() {
        if (this.itemFilter.length > 0) {
            var TempItems = this.posItems.filter((item: any) => {
                if (item.name.toLowerCase().includes(this.itemFilter.toLowerCase())) {
                    return item;
                }
            });
            this.Items = TempItems;
        } else {
            this.Items = this.posItems;
        }
    }

    fetchCustomer() {
        if (this.commonForm.controls.card_no.value.length == 14) {
            this.fetchCustomerLoading = true;
            this.apiService
                .getTypeRequest(
                    `specific_data/MEMBER_DATA/${this.commonForm.controls.card_no.value}`
                )
                .toPromise()
                .then((resopnse: any) => {
                    if (resopnse.result) {
                        this.commonForm.controls.account_head_id.disable();
                        this.commonForm.controls.account_head_id.setValue('');
                        this.commonForm.controls.account_head_name.setValue('');
                        this.commonForm.controls.account_balance.setValue(
                            resopnse.data.balance
                        );
                        this.messageService.add({
                            severity: 'success',
                            summary: resopnse.message,
                            detail: 'Found Card Details.',
                        });

                        this.commonForm.patchValue({
                            member_id: resopnse.data.member_id,
                            customer_name: resopnse.data.full_name,
                            customer_ph: resopnse.data.phone_number,
                        });
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: resopnse.message,
                            detail: 'Card Details Not Found.',
                        });
                    }
                })
                .finally(() => (this.fetchCustomerLoading = false));
        }
    }

    AddToOrderList(item: any) {
        var existingItem = this.currentOrder.filter((i: any) => {
            if (i.id == item.id) {
                return i;
            }
        });

        if (existingItem.length > 0) {
            var currentItemIndex = this.currentOrder.indexOf(existingItem[0]);
            this.currentOrder[currentItemIndex].sale_qty++;
        } else {
            var Item: OrderItem = {
                id: item.id,
                img: item.img_loc,
                name: item.name,
                gst_slab: Number(item.gst_slab),
                isExclusiveGst: item.isExclusiveGst,
                main_category_name: item.main_category_name,
                main_cat_img_loc: item.main_cat_img_loc,
                actual_discount_amt: item.discount_amt,
                actual_discount_per: item.discount_per,
                DiscountType:
                    Number(item.discount_amt) > 0 ? 'Amount' : 'Percentage',
                DiscountValue:
                    Number(item.discount_amt) > 0
                        ? Number(item.discount_amt)
                        : Number(item.discount_per),
                sale_qty: 1,
                sale_rate: Number(item.rate),
            };
            this.currentOrder.push(Item);
        }
        this.calculateBill();
    }

    increaseSaleQty(index: any) {
        this.currentOrder[index].sale_qty++;
        this.calculateBill();
    }

    decreaseSaleQty(index: any) {
        var sale_qty = this.currentOrder[index].sale_qty;
        if (sale_qty > 1) {
            this.currentOrder[index].sale_qty--;
        } else {
            this.currentOrder.splice(index, 1);
        }
        this.calculateBill();
    }

    calculateBill() {
        (this.OrderDetails.sub_total = 0),
            (this.OrderDetails.total_amount = 0),
            (this.OrderDetails.total_discount = 0),
            (this.OrderDetails.total_tax = 0),
            (this.OrderDetails.sales_array = this.currentOrder),
            //
            this.OrderDetails.sales_array.forEach((OrderDetails: OrderItem) => {
                var SaleRate = Number(OrderDetails.sale_rate);
                var GST = Number(OrderDetails?.gst_slab);
                var SaleQty = OrderDetails.sale_qty;
                var NetSaleRate = 0;
                var GSTOnSaleRate = 0;
                var DiscountValue = 0;
                var DiscountAmount = 0;
                var NetSaleRatePerItem = 0;
                var ReCalculatedGST = 0;
                var ItemsTotalGST = 0;
                var FinalSaleRatePerItemWithGST = 0;
                var ItemGrandTotal = 0;
                if (OrderDetails.isExclusiveGst == 0) {
                    var div = (100 + GST) / 100;
                    NetSaleRate = SaleRate / div;
                } else {
                    NetSaleRate = SaleRate + SaleRate * (GST / 100);
                }
                GSTOnSaleRate = SaleRate - NetSaleRate;

                if (Number(OrderDetails.actual_discount_per) > 0) {
                    DiscountAmount =
                        NetSaleRate *
                        (Number(OrderDetails.actual_discount_per) / 100);
                } else {
                    DiscountAmount = Number(OrderDetails.actual_discount_amt);
                }
                this.OrderDetails.sub_total += NetSaleRate * SaleQty;
                NetSaleRatePerItem = NetSaleRate - DiscountAmount;
                ReCalculatedGST = NetSaleRatePerItem * (GST / 100);
                ItemsTotalGST = ReCalculatedGST * SaleQty;
                FinalSaleRatePerItemWithGST =
                    NetSaleRatePerItem + ReCalculatedGST;
                ItemGrandTotal = FinalSaleRatePerItemWithGST * SaleQty;
                this.OrderDetails.total_tax += ItemsTotalGST;
                this.OrderDetails.total_amount += ItemGrandTotal;

                this.OrderDetails.total_discount += DiscountAmount;
            });

        this.OrderDetails.total_amount +=
            Number(this.OrderDetails.packaging_amt) ?? 0;
    }

    reset() {
        this.currentOrder = [];
        this.calculateBill();
        this.commonForm.reset();
        this.UserConfigDialog = true;
        this.commonForm.controls.account_head_id.enable();
    }

    submit() {
        console.log(this.OrderDetails);
        if (this.OrderDetails.member_id) {
            if (
                Number(this.commonForm.controls.account_balance.value) <
                this.OrderDetails.total_amount
            ) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Insufficient Balance',
                    detail: 'Order amount is greater than balance.',
                });
                return;
            }
        }
        this.apiService
            .postTypeRequest('mark_pos_sales', this.OrderDetails)
            .toPromise()
            .then((resopnse: any) => {
                if (resopnse.result) {
                    //this.printMembership2Inc(resopnse.data);
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Added',
                        detail: resopnse.message,
                    });
                    this.reset();
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: resopnse.message,
                        detail: 'Error.',
                    });
                }
            });
    }
}
