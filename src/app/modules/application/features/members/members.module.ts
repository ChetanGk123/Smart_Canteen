import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MembersRoutingModule } from './members-routing.module';
import { MembersComponent } from './members.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { SharedModule } from 'src/app/shared/shared.module';
import { CorePipesModule } from 'src/app/core/pipes/pipes.module';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ManageMemberComponent } from './manage-member/manage-member.component';
import { MemberProfileComponent } from './member-profile/member-profile.component';
import { AddMemberTransactionComponent } from './add-member-transaction/add-member-transaction.component';
import { MemberTransactionsComponent } from './reports/member-transactions/member-transactions.component';
import { MemberCardHistoryComponent } from './reports/member-card-history/member-card-history.component';
import { MemberLeaveHistoryComponent } from './reports/member-leave-history/member-leave-history.component';
import { MemberListReportComponent } from './reports/member-list-report/member-list-report.component';
import { MemberMembershipHistoryComponent } from './reports/member-membership-history/member-membership-history.component';

@NgModule({
    declarations: [
        MembersComponent,
        ManageMemberComponent,
        AddMemberTransactionComponent,
        MemberProfileComponent,
        MemberTransactionsComponent,
        MemberCardHistoryComponent,
        MemberLeaveHistoryComponent,
        MemberListReportComponent,
        MemberMembershipHistoryComponent,
    ],
    imports: [
        CommonModule,
        MembersRoutingModule,
        CorePipesModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        NgxMaskModule.forRoot(),
    ],
    providers: [DynamicDialogRef, DynamicDialogConfig],
})
export class MembersModule {}
