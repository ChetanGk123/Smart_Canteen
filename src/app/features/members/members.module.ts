import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MembersRoutingModule } from './members-routing.module';
import { MembersComponent } from './members.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { SharedModule } from 'src/app/shared/shared.module';
import { CorePipesModule } from 'src/app/core/pipes/pipes.module';
import { PrimengModule } from 'src/app/shared/primeng/primeng.module';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ManageMemberComponent } from './manage-member/manage-member.component';
import { MemberProfileComponent } from './member-profile/member-profile.component';

@NgModule({
  declarations: [
    MembersComponent,
    ManageMemberComponent,
    MemberProfileComponent
  ],
  imports: [
    CommonModule,
    MembersRoutingModule,
    CorePipesModule,
    PrimengModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
  ],
  providers: [DynamicDialogRef, DynamicDialogConfig],
})
export class MembersModule { }
