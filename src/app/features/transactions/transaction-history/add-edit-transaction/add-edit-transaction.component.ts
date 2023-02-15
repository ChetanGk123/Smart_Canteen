import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import {
    DynamicDialogRef,
    DynamicDialogConfig,
    DialogService,
} from 'primeng/dynamicdialog';
import { CoreConfig } from 'src/app/core/interfaces/coreConfig';
import { ApiService } from 'src/app/core/services/api/api.service';
import { MemberService } from 'src/app/core/services/MemberService/member.service';
import { EnvService } from 'src/app/env.service';
import { AddMemberTransactionComponent } from 'src/app/features/members/add-member-transaction/add-member-transaction.component';
// import { AddMemberTransactionComponent } from '../../../member/active-members/member-profile/add-member-transaction/add-member-transaction.component';
@Component({
    selector: 'app-add-edit-transaction',
    templateUrl: './add-edit-transaction.component.html',
    styleUrls: ['./add-edit-transaction.component.scss'],
})
export class AddEditTransactionComponent implements OnInit {
    cardNumber: any;
    loading: boolean = false;
    public coreConfig: CoreConfig;
    constructor(
        public ref: DynamicDialogRef,
        public apiService: ApiService,
        public config: DynamicDialogConfig,
        public messageService: MessageService,
        public dialogService: DialogService,
        public member: MemberService,
        public router: Router,
        public route: ActivatedRoute,
        public _coreEnvService: EnvService
    ) {
        this.coreConfig = _coreEnvService.config;
    }

    ngOnInit(): void {}

    loadData() {
        if (this.cardNumber.length == this.coreConfig.app.cardNumberLength) {
            this.loading = true;
            this.apiService
                .getTypeRequest(`specific_data/MEMBER_DATA/${this.cardNumber}`)
                .toPromise()
                .then((resopnse: any) => {
                    if (resopnse.result) {
                        this.ref.close();
                        this.add(resopnse.data);

                        this.messageService.add({
                            severity: 'success',
                            summary: resopnse.message,
                            detail: 'Found Card Details.',
                        });
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: resopnse.message,
                            detail: 'Card Details Not Found.',
                        });
                        this.cardNumber = '';
                    }
                })
                .finally(() => (this.loading = false));
        }
    }

    add(memberData: any) {
        console.log(memberData);

        const ref = this.dialogService.open(AddMemberTransactionComponent, {
            data: memberData,
            header: `Add Transaction`,
            styleClass: 'w-8  xs:w-12 sm:w-12 md:w-10 lg:w-5',
        });
        ref.onClose.subscribe((result: any) => {
            if (result) {
                this.ref.close(true);
            } else {
                this.ref.close();
            }
        });
    }
}
