import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { Observable, map, Subject, takeUntil } from 'rxjs';
import { MembershipType } from 'src/app/core/interfaces/appconfig';
import { ApiService } from 'src/app/core/services/api/api.service';
import { CounterService } from '../../counters/counter.service';
import { MemberService } from '../../members/member.service';
import { ActiveMembershipReceiptComponent } from '../../receipt/active-membership-receipt/active-membership-receipt.component';
import { NewMembershipReceiptComponent } from '../../receipt/new-membership-receipt/new-membership-receipt.component';
import { AddMembershipsComponent } from '../add-memberships/add-memberships.component';
import { CommonReportComponent } from '../reports/common-report/common-report.component';

@Component({
    selector: 'app-all-memberships',
    templateUrl: './all-memberships.component.html',
    styleUrls: ['./all-memberships.component.scss'],
})
export class AllMembershipsComponent implements OnInit {
    loading: boolean = false;
    Data: Observable<Object>;
    selectedProduct: any;
    start_date: any;
    meal_pack_id: any = -1;
    end_date: any;
    datePipe: DatePipe = new DatePipe('en-US');
    selectedStudents: any = [];
    allMemberships: any = [];
    membershipList: any = [];
    items: MenuItem[];
    counter_id: any;
    // Private
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        public apiService: ApiService,
        private confirmationService: ConfirmationService,
        public messageService: MessageService,
        public dialogService: DialogService,
        public router: Router,
        public member: MemberService,
        public counterService: CounterService
    ) {
        this.isRowSelectable = this.isOnLeave.bind(this);
    }

    ngOnInit(): void {
        this.counterService.counterDate$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: any) => {
                this.counter_id = data?.id ?? '';
            });

        this.selectedStudents = [];
        this.items = [
            {
                label: 'Print Details (A4)',
                icon: 'pi pi-fw pi-print',
                command: () => this.printMembership(),
            },
            {
                label: 'Print Details (2")',
                icon: 'pi pi-fw pi-print',
                command: () => this.printMembership2Inc(),
            },
        ];
        var url = '';
        if (this.counter_id != '') {
            url = `/BY_COUNTER/${this.counter_id}`;
        }
        this.membershipList = [];
        this.membershipList.push({
            meal_pack_id: '-1',
            counter_id: '',
            meal_pack_name: 'All',
        });
        this.apiService
            .getTypeRequest(`table_data/MEAL_PACK_NAME${url}`)
            .toPromise()
            .then((result: any) => {
                this.loading = false;
                if (result.result) {
                    result.data.forEach((element) => {
                        this.membershipList.push(element);
                    });
                } else {
                    this.membershipList = [];
                }
            });
        this.fetchTransactions();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    fetchTransactions() {
        this.loading = true;
        var url = `membership_data?what=ALL_MEMBERSHIPS`;
        var membershipFilter = ``;
        if (this.meal_pack_id != -1) {
            membershipFilter = `&membership_id=${this.meal_pack_id}`;
        }
        var dateFilter = ``;
        if (this.start_date != null && this.end_date != null) {
            const start_date = this.datePipe.transform(
                this.start_date,
                'dd-MM-yyyy'
            );
            const end_date = this.datePipe.transform(
                this.end_date,
                'dd-MM-yyyy'
            );
            dateFilter = `&membership_start_date=${start_date}&membership_end_date=${end_date}`;
        }
        this.Data = this.apiService
            .getTypeRequest(url + membershipFilter + dateFilter)
            .pipe(
                map((res: any) => {
                    this.loading = false;
                    this.allMemberships = res.data;
                    return res.data;
                    // {
                    //     "member_id": "2",
                    //     "card_number": "74475537390124",
                    //     "counter_id": "1",
                    //     "full_name": "1full_ssaaaname",
                    //     "gender": "1gender",
                    //     "phone_number": "1phone_number",
                    //     "parents_ph": "1parents_ph",
                    //     "dob": "0000-00-00",
                    //     "email": "1email",
                    //     "school_name": "new school name",
                    //     "class_name": "1class_name",
                    //     "division_name": "1division_name",
                    //     "hostel_details": "1hostel_details",
                    //     "photo_url": "https:\/\/thetechvaidya.com\/cooksbook_new\/uploads\/default_logo.png",
                    //     "profile_photo": "default_logo.png",
                    //     "member_type_id": "1",
                    //     "member_type": "Studet",
                    //     "address": "1address",
                    //     "status": "1",
                    //     "balance": "-3120.00",
                    //     "membership_data": {
                    //         "membership_id": "4",
                    //         "member_id": "2",
                    //         "counter_id": "1",
                    //         "membership_number": "MT23052023000001",
                    //         "meal_pack_id": "10",
                    //         "meal_pack_name": "Testing Meal Pack ",
                    //         "price_per_pack": "130.00",
                    //         "total_meal_packs": "25",
                    //         "total_amount": "3250.00",
                    //         "max_days": "30",
                    //         "start_date": "22-05-2023",
                    //         "end_date": "20-06-2023",
                    //         "is_active": "1",
                    //         "is_on_leave": "0",
                    //         "sale_date": "22-05-2023",
                    //         "membership_particulars": [
                    //             {
                    //                 "membership_particular_id": "7",
                    //                 "meal_name": "BREAKFAST",
                    //                 "price": "60.00",
                    //                 "total_meals": "25",
                    //                 "remaining_meals": "25"
                    //             },
                    //             {
                    //                 "membership_particular_id": "8",
                    //                 "meal_name": "LUNCH",
                    //                 "price": "70.00",
                    //                 "total_meals": "25",
                    //                 "remaining_meals": "25"
                    //             }
                    //         ]
                    //     }
                    // }
                })
            );
    }

    clear(table: Table) {
        table.clear();
    }

    isRowSelectable(event) {
        return !this.isOnLeave(event.data);
    }

    isOnLeave(product) {
        return product.isOnLeave == 0 ? false : true;
    }

    add() {
        var newMembershipType: MembershipType;
        const ref = this.dialogService.open(AddMembershipsComponent, {
            data: newMembershipType,
            header: `Add New MemberShip`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-5',
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.ngOnInit();
            }
        });
    }

    openProfile() {
        this.member.setMemberData(this.selectedProduct);
        this.router.navigate(['members/memberProfile']);
    }

    printMembership() {
        // //
        this.dialogService.open(ActiveMembershipReceiptComponent, {
            data: {
                membershipDetails: this.selectedProduct,
            },
            header: `MemberShip Details`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-6',
        });
    }

    printMembership2Inc() {
        // //
        this.dialogService.open(NewMembershipReceiptComponent, {
            data: this.selectedProduct,
            header: `MemberShip Details`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-6',
        });
    }

    confirm() {
        this.confirmationService.confirm({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            accept: () => {
                this.delete();
            },
        });
    }

    delete() {
        this.loading = true;
        var Data = {
            membership_type_id: this.selectedProduct.membership_type_id,
        };
        this.apiService
            .postTypeRequest(`membership_type_ops/delete`, Data)
            .toPromise()
            .then((resopnse: any) => {
                if (resopnse.result) {
                    this.ngOnInit();
                    this.messageService.add({
                        severity: 'warn',
                        summary: resopnse.message,
                        detail: 'Via MessageService',
                    });
                }
            })
            .finally(() => {
                this.loading = false;
            });
    }

    generatePDF() {
        const start_date = this.datePipe.transform(
            this.start_date,
            'dd-MM-yyyy'
        );
        const end_date = this.datePipe.transform(this.end_date, 'dd-MM-yyyy');
        const period = `${start_date} - ${end_date}`;
        this.dialogService.open(CommonReportComponent, {
            data: {
                data: this.allMemberships,
                period: period,
                title: 'All Memberships',
            },
            header: `All MemberShips`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-6',
        });
    }
    generateExcel() {}
}
