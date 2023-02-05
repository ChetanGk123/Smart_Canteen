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
    User:any

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
                label: 'Members',
                items: [
                    {
                        label: 'All Members',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/members'],
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
            /*
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
                label: 'Mess',
                items: [
                    {
                        label: 'Memberships',
                        icon: 'pi pi-book',
                        routerLink: ['/mess/memberships'],
                    },
                    {
                        label: 'Leaves',
                        icon: 'pi pi-user-minus',
                        routerLink: ['/mess/activeLeaves'],
                    },
                ],
            },
            {
                label: 'Attendance',
                items: [
                    {
                        label: 'Attendance',
                        icon: 'pi pi-list',
                        routerLink: ['/attandance'],
                    },
                    {
                        label: 'Attendance History',
                        icon: 'pi pi-history',
                        routerLink: ['/attandance/attendanceHistory'],
                    },
                ],
            },
            {
                label: 'Accounts',
                items: [
                    {
                        label: 'Income Accounts',
                        icon: 'pi pi-money-bill',
                        routerLink: ['/account/incomeAccount'],
                    },
                    {
                        label: 'Expense Accounts',
                        icon: 'pi pi-dollar',
                        routerLink: ['/account/expenseAccount'],
                    },
                    {
                        label: 'Account Transactions',
                        icon: 'pi pi-history',
                        routerLink: ['/account/accountTransactions'],
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
                    {
                        label: 'Pending Payments',
                        icon: 'pi pi-stopwatch',
                        routerLink: ['/transactions/pendingPayments'],
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
                    {
                        label: 'Membership Types',
                        icon: 'pi pi-database',
                        routerLink: ['/utils/membershipsTypes'],
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
                        label: 'Sub Category',
                        icon: 'pi pi-slack',
                        routerLink: ['/pos/subCategory'],
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
                label: 'Reports',
                items: [
                    {
                        label: 'POS Summary',
                        icon: 'pi pi-money-bill',
                        routerLink: ['/report/posSummary'],
                    },
                    {
                        label: 'Membership Summary',
                        icon: 'pi pi-dollar',
                        routerLink: ['/report/membershipSummary'],
                    },
                ],
            },
            */
        ];
        this.User = this.memberService.getUserData().user_role
        this.model =
            this.User == 'OWNER' || this.User == 'su_user'
                ? owner
                : user;
    }

    onKeydown(event: KeyboardEvent) {
        const nodeElement = <HTMLDivElement>event.target;
        if (event.code === 'Enter' || event.code === 'Space') {
            nodeElement.click();
            event.preventDefault();
        }
    }
}
