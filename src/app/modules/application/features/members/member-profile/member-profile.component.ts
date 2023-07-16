import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin, map, Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { AddMemberTransactionComponent } from '../add-member-transaction/add-member-transaction.component';
import { ManageMemberComponent } from '../manage-member/manage-member.component';
import { MemberCardHistoryComponent } from '../reports/member-card-history/member-card-history.component';
import { MemberLeaveHistoryComponent } from '../reports/member-leave-history/member-leave-history.component';
import { MemberMembershipHistoryComponent } from '../reports/member-membership-history/member-membership-history.component';
import { MemberTransactionsComponent } from '../reports/member-transactions/member-transactions.component';
import { MemberService } from 'src/app/core/services/MemberService/member.service';

@Component({
    selector: 'app-member-profile',
    templateUrl: './member-profile.component.html',
    styleUrls: ['./member-profile.component.scss'],
})
export class MemberProfileComponent implements OnInit {
    cardHistoryLoading: boolean = false;
    loading: boolean = false;
    cameraDialog: boolean = false;
    transactionLoading: boolean = false;
    membershipHistoryLoading: boolean = false;
    displayTransaction: boolean = false;
    cardHistory: Observable<Object>;
    membershipHistory: Observable<Object>;
    leaveHistory: Observable<Object>;
    memberData: any;
    meal_pack_id: any = -1;
    datePipe: DatePipe = new DatePipe('en-US');
    start_date: any;
    end_date: any;
    memberTransactions: any = [];
    membershipHistoryTransactions: any = [];
    memberCardHistory: any = [];
    memberLeaveHistory: any = [];
    membershipList: any = [];
    file_data: FormData;
    transactionData: Observable<Object>;
    form: FormGroup = new FormGroup({
        file: new FormControl(),
    });
    selectedProduct: any;
    transactionMenu: MenuItem[] = [
        // {
        //     label: 'View',
        //     icon: 'pi pi-fw pi-eye',
        //     command: () => this.viewDetails(),
        // },
        // {
        //     separator: true,
        // },
        // {
        //     label: 'Print',
        //     icon: 'pi pi-fw pi-print',
        //     command: () => this.printDetails(this.selectedProduct),
        // },
    ];
    constructor(
        public apiService: ApiService,
        public authService: AuthService,
        public ref: DynamicDialogRef,
        public router: Router,
        public route: ActivatedRoute,
        public dialogService: DialogService,
        public messageService: MessageService,
        public memberService: MemberService
    ) {}

    ngOnInit(): void {
        this.memberData = this.memberService.getMemberData();
        this.cardHistoryLoading = true;
        this.end_date = new Date().toISOString().substring(0, 10);
        this.start_date = this.datePipe.transform(
            new Date().setDate(new Date().getDate() - 30),
            'yyyy-MM-dd'
        );
        this.membershipList = [];
        this.membershipList.push({
            meal_pack_id: '-1',
            counter_id: '',
            meal_pack_name: 'All',
        });
        this.apiService
            .getTypeRequest(`table_data/MEAL_PACK_NAME`)
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
        if (this.memberData) {
            /* {
            "member_id": "1",
            "card_number": "744755373a90123",
            "counter_id": "3",
            "full_name": "Chetan",
            "gender": "Male",
            "phone_number": "9988776655",
            "parents_ph": "9988776655",
            "dob": "2020-12-12",
            "email": "ccc@ccc",
            "school_name": "dfgsf",
            "class_name": "10",
            "division_name": "A",
            "hostel_details": "sdrg",
            "photo_url": "",
            "profile_photo": "default_logo.png",
            "member_type_id": "3",
            "member_type": "STUDENT",
            "address": "sdfsdfsfsdf",
            "status": "1",
            "balance": "2.00"
        } */
            if (this.memberData?.gender) {
            } else {
                this.loadData();
            }
            this.cardHistory = this.apiService
                .getTypeRequest(
                    `table_data/CARD_UPDATE_DETAILS/${this.memberData.member_id}`
                )
                .pipe(
                    map((res: any) => {
                        this.cardHistoryLoading = false;
                        this.memberCardHistory = res.data;
                        return res.data;
                    })
                );
            this.fetchMemberTransactions();
            this.fetchLeaveTransactions();
            this.fetchMembershipHistory();
        } else {
            this.router.navigate(['../'], { relativeTo: this.route });
        }
    }

    fetchMemberTransactions() {
        this.transactionLoading = true;
        var Data = {
            member_id: this.memberData.member_id,
            counter_id: this.memberData?.counter_id,
            txn_id: '',
            account_id: '',
            start_date: this.start_date,
            end_date: this.end_date,
        };
        this.transactionData = this.apiService
            .postTypeRequest(`transaction_data/MEMBER_TRANSACTIONS`, Data)
            .pipe(
                map((res: any) => {
                    // res.data.sort((a,b)=>Number(a.id) - Number(b.id))
                    this.memberTransactions = res.data;
                    this.transactionLoading = false;
                    return res.data;
                })
            );
    }

    fetchMembershipHistory() {
        this.membershipHistoryLoading = true;
        var Data = {
            member_id: this.memberData.member_id,
            counter_id: this.memberData?.counter_id,
            txn_id: '',
            account_id: '',
            start_date: this.start_date,
            end_date: this.end_date,
        };
        this.membershipHistory = this.apiService
            .getTypeRequest(`membership_data?what=ALL_MEMBERSHIPS_BY_MEMBER&member_id=${this.memberData.member_id}`)
            .pipe(
                map((res: any) => {
                    // res.data.sort((a,b)=>Number(a.id) - Number(b.id))
                    this.membershipHistoryTransactions = res.data;

                    // [
                    //     {
                    //         "member_id": "1",
                    //         "card_number": "74475537390120",
                    //         "counter_id": "1",
                    //         "full_name": "Sanjeev",
                    //         "gender": "MALE",
                    //         "phone_number": "963254101",
                    //         "parents_ph": "963254101",
                    //         "dob": "00-00-0000",
                    //         "email": null,
                    //         "school_name": "Public School Bangalore",
                    //         "class_name": "3",
                    //         "division_name": null,
                    //         "hostel_details": null,
                    //         "photo_url": "https://thetechvaidya.com/cooksbook_new/uploads/member_docs/BH47RD79.png",
                    //         "profile_photo": "member_docs/BH47RD79.png",
                    //         "member_type_id": "1",
                    //         "member_type": "Student",
                    //         "address": "Public School Bangalore",
                    //         "status": "1",
                    //         "balance": "100.00",
                    //         "membership_data": {
                    //             "membership_id": "8",
                    //             "member_id": "1",
                    //             "counter_id": "1",
                    //             "membership_number": "MT01062023000005",
                    //             "meal_pack_id": "10",
                    //             "meal_pack_name": "Full Membership (1-4)",
                    //             "price_per_pack": "130.00",
                    //             "total_meal_packs": "30",
                    //             "total_amount": "3900.00",
                    //             "max_days": "30",
                    //             "start_date": "31-05-2023",
                    //             "raw_start_date": "2023-05-31",
                    //             "end_date": "04-07-2023",
                    //             "raw_end_date": "2023-07-04",
                    //             "is_active": "1",
                    //             "is_on_leave": "0",
                    //             "sale_date": "31-05-2023",
                    //             "membership_particulars": [
                    //                 {
                    //                     "membership_particular_id": "18",
                    //                     "meal_name": "BREAKFAST",
                    //                     "meal_pack_item_id": "17",
                    //                     "meal_id": "1",
                    //                     "price": "60.00",
                    //                     "total_meals": "30",
                    //                     "remaining_meals": "30",
                    //                     "meal_start_time": "08:00:00 AM",
                    //                     "raw_meal_start_time": "08:00:00",
                    //                     "meal_end_time": "09:00:00 AM",
                    //                     "raw_meal_end_time": "09:00:00"
                    //                 },
                    //                 {
                    //                     "membership_particular_id": "19",
                    //                     "meal_name": "LUNCH",
                    //                     "meal_pack_item_id": "18",
                    //                     "meal_id": "2",
                    //                     "price": "70.00",
                    //                     "total_meals": "30",
                    //                     "remaining_meals": "29",
                    //                     "meal_start_time": "01:00:00 PM",
                    //                     "raw_meal_start_time": "13:00:00",
                    //                     "meal_end_time": "02:30:00 PM",
                    //                     "raw_meal_end_time": "14:30:00"
                    //                 }
                    //             ]
                    //         }
                    //     }
                    // ]
                    this.membershipHistoryLoading = false;
                    return res.data;
                })
            );
    }

    fetchLeaveTransactions() {
        var url = `leave_data?what=ALL_LEAVES_BY_MEMBER&member_id=${this.memberData.member_id}`;
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
        this.leaveHistory = this.apiService
            .getTypeRequest(url + membershipFilter + dateFilter)
            .pipe(
                map((res: any) => {
                    // res.data.sort((a,b)=>Number(a.id) - Number(b.id))
                    this.memberLeaveHistory = res.data;
                    return res.data;
                    // {
                    //     "member_id": "1",
                    //     "card_number": "74475537390120",
                    //     "counter_id": "1",
                    //     "full_name": "faaaaaull_name",
                    //     "gender": "gender",
                    //     "phone_number": "phone_number",
                    //     "parents_ph": "parents_ph",
                    //     "dob": "00-00-0000",
                    //     "email": "email",
                    //     "school_name": "new school name",
                    //     "class_name": "class_name",
                    //     "division_name": "division_name",
                    //     "hostel_details": "hostel_details",
                    //     "photo_url": "https:\/\/thetechvaidya.com\/cooksbook_new\/uploads\/member_docs\/Y5I8VSAX.png",
                    //     "profile_photo": "member_docs\/Y5I8VSAX.png",
                    //     "member_type_id": "1",
                    //     "member_type": "Studet",
                    //     "address": "address",
                    //     "status": "1",
                    //     "balance": "-4900.00",
                    //     "leave_data": {
                    //         "leave_id": "5",
                    //         "member_id": "1",
                    //         "membership_id": "5",
                    //         "leave_start_date": "27-05-2023",
                    //         "raw_leave_start_date": "2023-05-27",
                    //         "leave_end_date": null,
                    //         "raw_leave_end_date": null,
                    //         "days_extended": "0",
                    //         "is_resumed": "0"
                    //     },
                    //     "membership_data": {
                    //         "membership_id": "5",
                    //         "member_id": "1",
                    //         "counter_id": "1",
                    //         "membership_number": "MT25052023000002",
                    //         "meal_pack_id": "11",
                    //         "meal_pack_name": "Full Day Meals",
                    //         "price_per_pack": "200.00",
                    //         "total_meal_packs": "30",
                    //         "total_amount": "6000.00",
                    //         "max_days": "30",
                    //         "start_date": "25-05-2023",
                    //         "raw_start_date": "2023-05-25",
                    //         "end_date": "23-06-2023",
                    //         "raw_end_date": "2023-06-23",
                    //         "is_active": "1",
                    //         "is_on_leave": "1",
                    //         "sale_date": "25-05-2023"
                    //     }
                    // },
                })
            );
    }

    loadData() {
        this.loading = true;
        var Data = {
            member_id: this.memberData.member_id,
            txn_id: '',
            account_id: '',
            start_date: this.start_date,
            end_date: this.end_date,
        };
        this.apiService
            .getTypeRequest(`specific_data/MEMBER/${this.memberData.member_id}`)
            .toPromise()
            .then((result: any) => {
                if (result) {
                    this.memberService.setMemberData(result.data);
                    this.ngOnInit();
                }
                this.loading = false;
            });
    }

    editMemberData() {
        const ref = this.dialogService.open(ManageMemberComponent, {
            header: `Update Member`,
            data: this.memberData,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-6',
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.loadData();
            }
        });
    }

    // add() {
    //     const ref = this.dialogService.open(AddMemberTransactionComponent, {
    //         data: {
    //             member: this.memberData,
    //             accountUrl: 'INCOME_ACCOUNT_HEAD',
    //             transactionUrl: 'MEMBER_WALLET_REFILL',
    //         },
    //         header: `Add Transaction`,
    //         styleClass: 'w-8  xs:w-12 sm:w-12 md:w-10 lg:w-5',
    //     });
    //     ref.onClose.subscribe((result: any) => {
    //         if (result) {
    //             this.ngOnInit();
    //             this.loadData();
    //         }
    //     });
    // }

    handleImage(file: any) {
        this.cameraDialog = false;
        this.form.get('file').setValue(file);
        this.uploadProfilePhoto();
    }

    async uploadProfilePhoto() {
        const formData: FormData = new FormData();
        formData.append('file', this.form.get('file').value);
        formData.append('token', this.apiService.getTocken());
        formData.append('item_id', this.memberData.member_id);
        this.file_data = formData;

        await this.apiService
            .postFileTypeRequest('file_upload/MEMBER_PHOTO', formData)
            .toPromise()
            .then((result: any) => {
                if (result.result) {
                    this.loadData();
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error!',
                        detail: result.message,
                    });
                }
            });
    }

    generateMemberTransactionsPDF() {
        const start_date = this.datePipe.transform(
            this.start_date,
            'dd-MM-yyyy'
        );
        const end_date = this.datePipe.transform(this.end_date, 'dd-MM-yyyy');
        const period = `${start_date} - ${end_date}`;
        this.dialogService.open(MemberTransactionsComponent, {
            data: {
                memberData: this.memberData,
                statement_date: this.datePipe.transform(
                    new Date(),
                    'dd-MM-yyyy'
                ),
                transactions_Data: this.memberTransactions,
                period: period,
                title: 'Member Transactions',
            },
            header: `Member Transactions`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-6',
        });
    }
    generateMemberTransactionsExcel() {}

    generateMemberCardHistoryPDF() {
        const start_date = this.datePipe.transform(
            this.start_date,
            'dd-MM-yyyy'
        );
        const end_date = this.datePipe.transform(this.end_date, 'dd-MM-yyyy');
        const period = `${start_date} - ${end_date}`;
        this.dialogService.open(MemberCardHistoryComponent, {
            data: {
                memberData: this.memberData,
                statement_date: this.datePipe.transform(
                    new Date(),
                    'dd-MM-yyyy'
                ),
                transactions_Data: this.memberCardHistory,
                title: 'Member Card History',
            },
            header: `Member Card History`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-6',
        });
    }
    generateMemberCardHistoryExcel() {}

    generateMembershipHistoryPDF() {
        this.dialogService.open(MemberMembershipHistoryComponent, {
            data: {
                memberData: this.memberData,
                statement_date: this.datePipe.transform(
                    new Date(),
                    'dd-MM-yyyy'
                ),
                transactions_Data: this.membershipHistoryTransactions,
                title: 'Member Membership History',
            },
            header: `Member Membership History`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-6',
        });
    }
    generateMembershipHistoryExcel() {}

    generateMemberLeaveHistoryPDF() {
        const start_date = this.datePipe.transform(
            this.start_date,
            'dd-MM-yyyy'
        );
        const end_date = this.datePipe.transform(this.end_date, 'dd-MM-yyyy');
        const period = `${start_date} - ${end_date}`;
        this.dialogService.open(MemberLeaveHistoryComponent, {
            data: {
                memberData: this.memberData,
                statement_date: this.datePipe.transform(
                    new Date(),
                    'dd-MM-yyyy'
                ),
                transactions_Data: this.memberLeaveHistory,
                title: 'Member Leave History',
            },
            header: `Member Leave History`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-6',
        });
    }
    generateMemberLeaveHistoryExcel() {}

    walletCredit() {
        // config.data = {
        //     "title": "Wallet Refill",
        //     "accountUrl": "INCOME_ACCOUNT_HEAD",
        //     "transactionUrl": "MEMBER_WALLET_REFILL"
        // }
        const ref = this.dialogService.open(AddMemberTransactionComponent, {
            data: {
                accountUrl: "INCOME_ACCOUNT_HEAD",
                title: "Wallet Refill",
                transactionUrl: "MEMBER_WALLET_REFILL",
                member: this.memberData,
            },
            header: `${"Wallet Refill"}`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-5',
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.loadData()
            }
        });
    }

    walletDebit() {
        // config.data = {
        //     "title": "Wallet Refill",
        //     "accountUrl": "INCOME_ACCOUNT_HEAD",
        //     "transactionUrl": "MEMBER_WALLET_REFILL"
        // }
        const ref = this.dialogService.open(AddMemberTransactionComponent, {
            data: {
                accountUrl: "INCOME_ACCOUNT_HEAD",
                title: "Wallet Debit",
                transactionUrl: "MEMBER_WALLET_DEBIT",
                member: this.memberData,
            },
            header: `${"Wallet Debit"}`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-5',
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.loadData()
            }
        });
    }
}
