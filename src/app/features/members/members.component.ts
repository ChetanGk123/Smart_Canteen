import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/core/services/api/api.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import * as XLSX from 'xlsx';
import { ManageMemberComponent } from './manage-member/manage-member.component';
import { MemberService } from './member.service';
import { MembersData } from './members-details.model';

@Component({
    selector: 'app-members',
    templateUrl: './members.component.html',
    styleUrls: ['./members.component.scss'],
})
export class MembersComponent implements OnInit {
    tableData: any;
    bulkAddData: any = [];
    loading: boolean = false;
    CardDetailsSubmitLoading: boolean = false;
    cardUpdate: boolean = false;
    bulkAddloading: boolean = false;
    bulkAdd: boolean = false;
    selectedProduct: any;
    items: MenuItem[];
    commonForm: FormGroup = new FormGroup({
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
        public memberService: MemberService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
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
        this.loadData();
    }

    loadData() {
        this.loading = true;
        this.apiService
            .getTypeRequest(`table_data/MEMBER`)
            .toPromise()
            .then((result: any) => {
                this.loading = false;
                this.tableData = result?.data;
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
                    "photo_url": "https://thetechvaidya.com/smart_canteen/uploads/default_logo.png",
                    "profile_photo": "default_logo.png",
                    "member_type_id": "3",
                    "member_type": "STUDENT",
                    "address": "sdfsdfsfsdf",
                    "status": "1",
                    "balance": "2.00"
                } */
            });
    }

    excelFileInputChange(fileInputEvent: any) {
        debugger;
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
            console.log('data', data);
            this.bulkAddData = data;
            this.bulkAdd = true;
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
        var data = {
            counter_id: this.authService.getUser()?.counter_id,
            member_data: this.bulkAddData,
        };
        console.log(data);
        this.apiService
            .postTypeRequest(`member_ops/insert`, data)
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
}
