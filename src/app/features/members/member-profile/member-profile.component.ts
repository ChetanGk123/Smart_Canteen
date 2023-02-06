import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { map, Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ManageMemberComponent } from '../manage-member/manage-member.component';
import { MemberService } from '../member.service';

@Component({
    selector: 'app-member-profile',
    templateUrl: './member-profile.component.html',
    styleUrls: ['./member-profile.component.scss'],
})
export class MemberProfileComponent implements OnInit {
    cardHistoryLoading: boolean = false;
    loading: boolean = false;
    cameraDialog: boolean = false;
    cardHistory: Observable<Object>;
    memberData: any;
    file_data: FormData;
    form: FormGroup = new FormGroup({
        file: new FormControl(),
    });
    constructor(
        public apiService: ApiService,
        public authService: AuthService,
        public router: Router,
        public route: ActivatedRoute,
        public dialogService: DialogService,
        public messageService: MessageService,
        public memberService: MemberService
    ) {}

    ngOnInit(): void {
        this.memberData = this.memberService.getMemberData();
        this.cardHistoryLoading = true;
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
            this.cardHistory = this.apiService
                .getTypeRequest(
                    `table_data/CARD_UPDATE_DETAILS/${this.memberData.member_id}`
                )
                .pipe(
                    map((res: any) => {
                        this.cardHistoryLoading = false;
                        return res.data;
                    })
                );
        } else {
            this.router.navigate(['../'], { relativeTo: this.route });
        }
    }

    loadData() {
        this.loading = true;
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
}
