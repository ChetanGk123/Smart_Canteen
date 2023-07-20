import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MemberGuard } from 'src/app/core/guards/member.guard';
import { MemberProfileComponent } from './features/member-profile/member-profile.component';
import { AppMainComponent } from './layout/app.main.component';

const routes: Routes = [
    {
        path:'login',
        component: LoginComponent
    },
    {
        path:'',
        component: AppMainComponent,
        children:[
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'profile',
            },
            {
                path:'profile',
                canActivate:[MemberGuard],
                component:MemberProfileComponent
            }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembersRoutingModule { }
