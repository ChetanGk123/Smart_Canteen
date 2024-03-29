import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import * as XLSX from 'xlsx';
import { CounterService } from '../counters/counter.service';
import { ManageMemberComponent } from './manage-member/manage-member.component';
import { MembersData } from './members-details.model';
import { MemberListReportComponent } from './reports/member-list-report/member-list-report.component';
import { ExcelService } from 'src/app/core/services/excel/excel.service';
import { MemberService } from 'src/app/core/services/MemberService/member.service';

@Component({
    selector: 'app-members',
    templateUrl: './members.component.html',
    styleUrls: ['./members.component.scss'],
})
export class MembersComponent implements OnInit, OnDestroy {
    @ViewChild('excelFile')
    myInputVariable: ElementRef;
    tableData: any;
    title: any;
    bulkAddData: any = [];
    loading: boolean = false;
    CardDetailsSubmitLoading: boolean = false;
    cardUpdate: boolean = false;
    dataLoaded: boolean = false;
    bulkAddloading: boolean = false;
    bulkAdd: boolean = false;
    Unsuccessful_registration: boolean = false;
    selectedProduct: any;
    errorMessage: any;
    items: MenuItem[];

    // Private
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    commonForm: FormGroup = new FormGroup({
        counter_id: new FormControl(''),
        member_id: new FormControl('', [Validators.required]),
        card_number: new FormControl('', [Validators.required]),
        reason: new FormControl('', [Validators.required]),
    });
    constructor(
        public apiService: ApiService,
        public authService: AuthService,
        public router: Router,
        public route: ActivatedRoute,
        public dialogService: DialogService,
        private messageService: MessageService,
        public memberService: MemberService,
        private confirmationService: ConfirmationService,
        public counterService: CounterService,
        public excelService: ExcelService
    ) {}

    ngOnInit(): void {
        this.counterService.counterDate$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: any) => {
                this.commonForm.controls.counter_id.setValue(data?.id ?? '');
                this.loadData();
            });
        this.items = [
            {
                label: 'View',
                icon: 'pi pi-fw pi-eye',
                command: () => this.openMemberProfile(),
            },
            {
                label: 'Update Card',
                icon: 'pi pi-fw pi-credit-card',
                command: () => this.openCardDetailsDialog(),
            },
            {
                separator: true,
            },
            {
                label: 'Edit',
                icon: 'pi pi-fw pi-pencil',
                command: () => this.updateMember(),
            },
            {
                label: 'Delete',
                icon: 'pi pi-fw pi-trash',
                command: () => this.confirm(),
            },
        ];
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    loadData() {
        this.loading = true;
        var url = '';
        if (this.commonForm.controls.counter_id.value != '') {
            url = `/BY_COUNTER/${this.commonForm.controls.counter_id.value}`;
        }
        this.apiService
            .getTypeRequest(`table_data/MEMBER${url}`)
            .toPromise()
            .then((result: any) => {
                this.loading = false;
                if (result.result) {
                    this.tableData = result?.data;
                } else {
                    this.tableData = [];
                }
            });
    }

    excelFileInputChange(fileInputEvent: any) {
        /* wire up file reader */
        const target: DataTransfer = <DataTransfer>(
            (<unknown>fileInputEvent.target)
        );
        if (target.files.length !== 1) {
            throw new Error('Cannot use multiple files');
        }
        const reader: FileReader = new FileReader();
        reader.readAsBinaryString(target.files[0]);
        reader.onload = (e: any) => {
            /* create workbook */
            const binarystr: string = e.target.result;
            const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

            /* selected the first sheet */
            const wsname: string = wb.SheetNames[0];
            const ws: XLSX.WorkSheet = wb.Sheets[wsname];

            /* save data */
            const data = XLSX.utils.sheet_to_json(ws) as MembersData[]; // to get 2d array pass 2nd parameter as object {header: 1}
            // Data will be logged in array format containing objects
            //this.convertArrayToJson(data);
            this.bulkAddData = data;
            this.bulkAdd = true;
            this.myInputVariable.nativeElement.value = '';
        };

        //this.loadComponents();
    }

    addNewMember() {
        const ref = this.dialogService.open(ManageMemberComponent, {
            header: `Add New Member`,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-6',
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.loadData();
            }
        });
    }

    openMemberProfile() {
        this.memberService.setMemberData(this.selectedProduct);
        this.router.navigate(['./memberProfile'], { relativeTo: this.route });
    }

    updateMember() {
        const ref = this.dialogService.open(ManageMemberComponent, {
            header: `Update Member`,
            data: this.selectedProduct,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-6',
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.loadData();
            }
        });
    }

    confirm() {
        this.confirmationService.confirm({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteMember();
            },
        });
    }

    deleteMember() {
        this.apiService
            .postTypeRequest(`member_ops/delete`, this.selectedProduct)
            .toPromise()
            .then((result: any) => {
                if (result.result) {
                    this.loadData();
                }
            })
            .finally(() => {
                this.loading = false;
                this.bulkAddloading = false;
                this.bulkAdd = false;
            });
    }

    bulkUpload() {
        this.bulkAddloading = true;
        var counter_id;
        if (
            (this.authService.getUser().user_role == 'OWNER' &&
                this.counterService.getCounterData()?.id) ||
            this.authService.getUser()?.counter_id
        ) {
            counter_id =
                this.counterService.getCounterData()?.id ??
                this.authService.getUser()?.counter_id;
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Select Counter',
                detail: `Please select a counter`,
            });
            this.bulkAddloading = false;
            return;
        }
        var data = {
            counter_id: counter_id ?? this.authService.getUser()?.counter_id,
            member_data: this.bulkAddData,
        };
        this.apiService
            .postTypeRequest(`member_ops/insert`, data)
            .toPromise()
            .then((result: any) => {
                if (result.result) {
                    // {
                    //     "success": 0,
                    //     "incomplete_data": 0,
                    //     "invalid_member_type": [],
                    //     "duplicate_members": [
                    //         "sanjay2",
                    //         "sanjay3"
                    //     ],
                    //     "duplicate_cardnumber": []
                    // }
                    this.loadData();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successfully registered',
                        detail: result.data.success + ' members',
                    });
                    
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Unsuccessful registration',
                        detail: "Invalid member details",
                    });
                    if (
                        result.data.duplicate_members.length > 0 ||
                        result.data.incomplete_data > 0 ||
                        result.data.invalid_member_type.length > 0 ||
                        result.data.duplicate_members.length > 0 ||
                        result.data.duplicate_cardnumber.length > 0
                    ) {
                        this.errorMessage = result.data;
                        this.Unsuccessful_registration = true;
                        // this.messageService.add({
                        //     severity: 'error',
                        //     summary: 'Unsuccessful registration',
                        //     detail: result.data.duplicate_members.length+" members",
                        // });
                    }
                }
            })
            .finally(() => {
                this.loading = false;
                this.bulkAddloading = false;
                this.bulkAdd = false;
            });
    }

    openCardDetailsDialog() {
        this.commonForm.patchValue({
            member_id: this.selectedProduct.member_id,
        });
        this.cardUpdate = true;
    }

    updateCardDetails() {
        if (this.commonForm.valid) {
            this.CardDetailsSubmitLoading = true;
            this.apiService
                .postTypeRequest(`card_update`, this.commonForm.value)
                .toPromise()
                .then((result: any) => {
                    if (result.result) {
                        this.commonForm.reset();
                        this.loadData();
                    }
                })
                .finally(() => {
                    this.CardDetailsSubmitLoading = false;
                    this.cardUpdate = false;
                });
        } else {
            var controls = this.commonForm.controls;
            for (const name in controls) {
                controls[name].markAsDirty();
                controls[name].markAllAsTouched();
            }
        }
    }

    generatePDF() {
        this.title = `ALL members`;
        this.dialogService.open(MemberListReportComponent, {
            data: {
                data: this.tableData,
                title: this.title,
            },
            header: this.title,
            styleClass: 'w-10 sm:w-10 md:w-10 lg:w-6',
        });
    }

    /**
     * This function generates an Excel file containing data from a table of active members.
     */
    generateExcel() {
        var excelData = [];
        this.tableData.forEach((data: any) => {
            let row = {
                'Full Name': data['full_name'],
                'Card Number': data['card_number'],
                'Phone Number': data['phone_number'] ? data['phone_number'] : null,
                'Parents PNo': data['parents_ph'] ? data['parents_ph'] : null,
                'Gender': data['gender'],
                'Date Of Birth': data['dob'],
                'Email': data['email'] ? data['email'] : null,
                "Member Type": data['member_type'],
                'Institution Name': data['institution_name'],
                'Hostel Name': data['hostel_name'],
                'Balance': (parseFloat(data['balance']) / 10).toFixed(2),
            };
            excelData.push(row);
        });
        this.excelService.exportAsExcelFile(
            excelData,
            'Active Members'
        );
    }
}
