import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MembersRoutingModule } from './members-routing.module';
import { MemberProfileComponent } from './features/member-profile/member-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/shared/primeng/primeng.module';
import { MemberMembershipHistoryComponent } from './features/reports/member-membership-history/member-membership-history.component';
import { MemberLeaveHistoryComponent } from './features/reports/member-leave-history/member-leave-history.component';
import { MemberCardHistoryComponent } from './features/reports/member-card-history/member-card-history.component';
import { NgxMaskModule } from 'ngx-mask';
import { SharedModule } from 'primeng/api';
import { CorePipesModule } from 'src/app/core/pipes/pipes.module';
import { MemberTransactionsComponent } from './features/reports/member-transactions/member-transactions.component';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { LoginComponent } from './pages/login/login.component';
import { AppConfigComponent } from './layout/app.config.component';
import { AppFooterComponent } from './layout/app.footer.component';
import { AppMainComponent } from './layout/app.main.component';
import { AppMenuComponent } from './layout/app.menu.component';
import { AppMenuitemComponent } from './layout/app.menuitem.component';
import { AppTopBarComponent } from './layout/app.topbar.component';

@NgModule({
    declarations: [
        LoginComponent,
        AppMainComponent,
        AppTopBarComponent,
        AppFooterComponent,
        AppConfigComponent,
        AppMenuComponent,
        AppMenuitemComponent,
        MemberProfileComponent,
        MemberTransactionsComponent
    ],
    imports: [
        CommonModule,
        PrimengModule,
        FormsModule,
        ReactiveFormsModule,
    MembersRoutingModule
    ],
    providers: [DynamicDialogRef, DynamicDialogConfig],
})
export class MembersModule {}
