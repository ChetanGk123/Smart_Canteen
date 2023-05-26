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

@NgModule({
    declarations: [
        MembersComponent,
        ManageMemberComponent,
        AddMemberTransactionComponent,
        MemberProfileComponent,
        MemberTransactionsComponent,
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
