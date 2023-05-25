import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MembershipsRoutingModule } from './memberships-routing.module';
import { PrimengModule } from 'src/app/shared/primeng/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { AddMembershipsComponent } from './add-memberships/add-memberships.component';
import { CancelMembershipComponent } from './cancel-membership/cancel-membership.component';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MarkLeaveComponent } from './mark-leave/mark-leave.component';
import { ActiveLeavesComponent } from './active-leaves/active-leaves.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MassLeaveComponent } from './mass-leave/mass-leave.component';
import { CorePipesModule } from 'src/app/core/pipes/pipes.module';
import { AccountsModule } from '../accounts/accounts.module';
import { ActiveMembershipsComponent } from './active-memberships/active-memberships.component';
import { InactiveMembershipsComponent } from './inactive-memberships/inactive-memberships.component';
import { AllMembershipsComponent } from './all-memberships/all-memberships.component';
import { CommonReportComponent } from './reports/common-report/common-report.component';

@NgModule({
    declarations: [
        ActiveMembershipsComponent,
        AddMembershipsComponent,
        CancelMembershipComponent,
        MarkLeaveComponent,
        ActiveLeavesComponent,
        MassLeaveComponent,
        InactiveMembershipsComponent,
        AllMembershipsComponent,
        CommonReportComponent,
    ],
    imports: [
        CommonModule,
        MembershipsRoutingModule,
        CorePipesModule,
        PrimengModule,
        SharedModule,
        AccountsModule,
        FormsModule,
        ReactiveFormsModule,
        NgxMaskModule.forRoot(),
    ],
    exports: [],
    providers: [DynamicDialogRef, DynamicDialogConfig],
})
export class MembershipsModule {}
