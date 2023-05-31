import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActiveLeavesComponent } from './active-leaves/active-leaves.component';
import { AllMembershipsComponent } from './all-memberships/all-memberships.component';
import { MembershipLeaveHistoryComponent } from './membership-leave-history/membership-leave-history.component';
import { MembershipSaleHistoryComponent } from './membership-sale-history/membership-sale-history.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'allMemberships',
    },
    {
        path: 'allMemberships',
        component: AllMembershipsComponent,
    },
    {
        path: 'activeLeaves',
        component: ActiveLeavesComponent,
    },
    {
        path: 'saleHistory',
        component: MembershipSaleHistoryComponent,
    },
    {
        path: 'leaveHistory',
        component: MembershipLeaveHistoryComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MembershipsRoutingModule {}
