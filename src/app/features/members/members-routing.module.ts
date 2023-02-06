import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemberProfileComponent } from './member-profile/member-profile.component';
import { MembersComponent } from './members.component';

const routes: Routes = [
    { path: '', component: MembersComponent },
    {
        path:'memberProfile', component: MemberProfileComponent
    }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembersRoutingModule { }
