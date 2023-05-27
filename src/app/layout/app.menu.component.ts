import { Component, OnInit } from '@angular/core';
import { MemberService } from '../core/services/MemberService/member.service';
import { AppMainComponent } from './app.main.component';

@Component({
    selector: 'app-menu',
    template: `
        <div class="layout-menu-container" style="scrollbar-width: 0;">
            <ul class="layout-menu" role="menu" (keydown)="onKeydown($event)">
                <li
                    app-menu
                    class="layout-menuitem-category"
                    *ngFor="let item of model; let i = index"
                    [item]="item"
                    [index]="i"
                    [root]="true"
                    role="none"
                >
                    <div
                        class="layout-menuitem-root-text"
                        [attr.aria-label]="item.label"
                    >
                        {{ item.label }}
                    </div>
                    <ul role="menu">
                        <li
                            app-menuitem
                            *ngFor="let child of item.items"
                            [item]="child"
                            [index]="i"
                            role="none"
                        ></li>
                    </ul>
                </li>
            </ul>
        </div>
    `,
})
export class AppMenuComponent implements OnInit {
    model: any[];
    User: any;

    constructor(
        public appMain: AppMainComponent,
        public memberService: MemberService
    ) {}

    ngOnInit() {
        var user = [
            {
                label: 'Home',
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/dashboard'],
                    },
                ],
            },
            {
                label: 'Attendance',
                items: [
                    {
                        label: 'Attendance',
                        icon: 'pi pi-fw pi-list',
                        routerLink: ['/attendance'],
                    },
                ],
            },
            {
                label: 'Members',
                items: [
                    {
                        label: 'All Members',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/members'],
                    },
                ],
            },
            {
                label: 'Memberships',
                items: [
                    {
                        label: 'All Memberships',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/memberships/allMemberships'],
                    },
                    {
                        label: 'Active Memberships',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/memberships/activeMemberships'],
                    },
                    {
                        label: 'InActive Memberships',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/memberships/inactiveMemberships'],
                    },
                    {
                        label: 'Active Leaves',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/memberships/activeLeaves'],
                    },
                    {
                        label: 'Sale History',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/memberships/saleHistory'],
                    },
                    {
                        label: 'Leave History',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/memberships/leaveHistory'],
                    },
                ],
            },
            {
                label: 'Cards',
                icon: 'pi pi-credit-card',
                items: [
                    {
                        label: 'Card Histrory',
                        icon: 'pi pi-credit-card',
                        routerLink: ['/cards/cardHistory'],
                    },
                ],
            },
            {
                label: 'Accounts',
                items: [
                    {
                        label: 'Income Accounts',
                        icon: 'pi pi-money-bill',
                        routerLink: ['/accounts/incomeAccount'],
                    },
                    {
                        label: 'Expense Accounts',
                        icon: 'pi pi-dollar',
                        routerLink: ['/accounts/expenseAccount'],
                    },
                    {
                        label: 'Commodity Accounts',
                        icon: 'pi pi-dollar',
                        routerLink: ['/accounts/commodityAccount'],
                    },
                    {
                        label: 'Account Transactions',
                        icon: 'pi pi-history',
                        routerLink: ['/accounts/accountTransactions'],
                    },
                ],
            },
            {
                label: 'Transactions',
                items: [
                    {
                        label: 'Transactions',
                        icon: 'pi pi-history',
                        routerLink: ['/transactions/history'],
                    },
                ],
            },
            {
                label: 'Utils',
                items: [
                    {
                        label: 'Misc',
                        icon: 'pi pi-slack',
                        routerLink: ['/utils'],
                    },
                ],
            },
            {
                label: 'POS',
                items: [
                    {
                        label: 'Main Category',
                        icon: 'pi pi-slack',
                        routerLink: ['/pos/mainCategory'],
                    },
                    {
                        label: 'Items',
                        icon: 'pi pi-slack',
                        routerLink: ['/pos/posItems'],
                    },
                    {
                        label: 'Sale',
                        icon: 'pi pi-slack',
                        routerLink: ['posSale/posSale'],
                    },
                    {
                        label: 'Sale History',
                        icon: 'pi pi-slack',
                        routerLink: ['/pos/posHistory'],
                    },
                ],
            },
            {
                label: 'Meal',
                items: [
                    {
                        label: 'Meal Types',
                        icon: 'pi pi-slack',
                        routerLink: ['/meal/mealType'],
                    },
                    {
                        label: 'Meal Packs',
                        icon: 'pi pi-slack',
                        routerLink: ['/meal/mealPack'],
                    },
                ],
            },
        ];
        var owner = [
            {
                label: 'Home',
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/dashboard'],
                    },
                ],
            },
            {
                label: 'Counters',
                items: [
                    {
                        label: 'All Counters',
                        icon: 'pi pi-fw pi-th-large',
                        routerLink: ['/counters'],
                    },
                ],
            },
            {
                label: 'Members',
                items: [
                    {
                        label: 'All Members',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/members'],
                    },
                ],
            },
            {
                label: 'Accounts',
                items: [
                    {
                        label: 'Account Transactions',
                        icon: 'pi pi-history',
                        routerLink: ['/accounts/accountTransactions'],
                    },
                ],
            },
            {
                label: 'Transactions',
                items: [
                    {
                        label: 'Transactions',
                        icon: 'pi pi-history',
                        routerLink: ['/transactions/history'],
                    },
                ],
            },
            {
                label: 'Utils',
                items: [
                    {
                        label: 'Misc',
                        icon: 'pi pi-slack',
                        routerLink: ['/utils'],
                    },
                ],
            },
            {
                label: 'POS',
                items: [
                    {
                        label: 'Main Category',
                        icon: 'pi pi-slack',
                        routerLink: ['/pos/mainCategory'],
                    },
                    {
                        label: 'Items',
                        icon: 'pi pi-slack',
                        routerLink: ['/pos/posItems'],
                    },
                    {
                        label: 'Sale History',
                        icon: 'pi pi-slack',
                        routerLink: ['/pos/posHistory'],
                    },
                ],
            },
        ];
        this.User = this.memberService.getUserData().user_role;
        this.model =
            this.User == 'OWNER' || this.User == 'su_user' ? owner : user;
    }

    onKeydown(event: KeyboardEvent) {
        const nodeElement = <HTMLDivElement>event.target;
        if (event.code === 'Enter' || event.code === 'Space') {
            nodeElement.click();
            event.preventDefault();
        }
    }
}
