import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActiveLeavesComponent } from './active-leaves/active-leaves.component';
import { ActiveMembershipsComponent } from './active-memberships/active-memberships.component';
import { AllMembershipsComponent } from './all-memberships/all-memberships.component';
import { InactiveMembershipsComponent } from './inactive-memberships/inactive-memberships.component';
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
        path: 'activeMemberships',
        component: ActiveMembershipsComponent,
    },
    {
        path: 'inactiveMemberships',
        component: InactiveMembershipsComponent,
    },
    {
        path: 'activeLeaves',
        component: ActiveLeavesComponent,
    },
    {
        path: 'saleHistory',
        component: MembershipSaleHistoryComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MembershipsRoutingModule {}
