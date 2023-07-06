import { Component, OnInit } from '@angular/core';
import { MemberService } from '../core/services/MemberService/member.service';
import { AppMainComponent } from './app.main.component';
import userRoutes from 'src/assets/routes/user-routes.json'
import ownerRoutes from 'src/assets/routes/owner-routes.json'
import attendantRoutes from 'src/assets/routes/attender-routes.json'
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
        // var user = [
        //     {
        //         label: 'Home',
        //         items: [
        //             {
        //                 label: 'Dashboard',
        //                 icon: 'pi pi-fw pi-home',
        //                 routerLink: ['/dashboard'],
        //             },
        //         ],
        //     },
        //     {
        //         label: 'Attendance',
        //         items: [
        //             {
        //                 label: 'Attendance',
        //                 icon: 'pi pi-fw pi-list',
        //                 routerLink: ['/attendance'],
        //             },
        //             {
        //                 label: 'Attendance History',
        //                 icon: 'pi pi-history',
        //                 routerLink: ['/attendance/attendenceHistory'],
        //             },
        //         ],
        //     },
        //     {
        //         label: 'Members',
        //         items: [
        //             {
        //                 label: 'All Members',
        //                 icon: 'pi pi-fw pi-home',
        //                 routerLink: ['/members'],
        //             },
        //         ],
        //     },
        //     {
        //         label: 'Memberships',
        //         items: [
        //             {
        //                 label: 'Memberships',
        //                 icon: 'pi pi-fw pi-book',
        //                 routerLink: ['/memberships/allMemberships'],
        //             },
        //             {
        //                 label: 'Active Leaves',
        //                 icon: 'pi pi-fw pi-calendar-minus',
        //                 routerLink: ['/memberships/activeLeaves'],
        //             },
        //             {
        //                 label: 'Sale History',
        //                 icon: 'pi pi-fw pi-history',
        //                 routerLink: ['/memberships/saleHistory'],
        //             },
        //             {
        //                 label: 'Leave History',
        //                 icon: 'pi pi-fw pi-history',
        //                 routerLink: ['/memberships/leaveHistory'],
        //             },
        //         ],
        //     },
        //     {
        //         label: 'Meal',
        //         items: [
        //             {
        //                 label: 'Meal Types',
        //                 icon: 'pi pi-list',
        //                 routerLink: ['/meal/mealType'],
        //             },
        //             {
        //                 label: 'Meal Packs',
        //                 icon: 'pi pi-database',
        //                 routerLink: ['/meal/mealPack'],
        //             },
        //         ],
        //     },
        //     {
        //         label: 'Cards',
        //         icon: 'pi pi-credit-card',
        //         items: [
        //             {
        //                 label: 'Card Histrory',
        //                 icon: 'pi pi-credit-card',
        //                 routerLink: ['/cards/cardHistory'],
        //             },
        //         ],
        //     },
        //     {
        //         label: 'Accounts',
        //         items: [
        //             {
        //                 label: 'Income Accounts',
        //                 icon: 'pi pi-money-bill',
        //                 routerLink: ['/accounts/incomeAccount'],
        //             },
        //             {
        //                 label: 'Expense Accounts',
        //                 icon: 'pi pi-dollar',
        //                 routerLink: ['/accounts/expenseAccount'],
        //             },
        //             {
        //                 label: 'Commodity Accounts',
        //                 icon: 'pi pi-link',
        //                 routerLink: ['/accounts/commodityAccount'],
        //             },
        //             {
        //                 label: 'Account Transactions',
        //                 icon: 'pi pi-history',
        //                 routerLink: ['/accounts/accountTransactions'],
        //             },
        //         ],
        //     },
        //     {
        //         label: 'Transactions',
        //         items: [
        //             {
        //                 label: 'Transactions',
        //                 icon: 'pi pi-history',
        //                 routerLink: ['/transactions/history'],
        //             },
        //         ],
        //     },
        //     {
        //         label: 'Utils',
        //         items: [
        //             {
        //                 label: 'Misc',
        //                 icon: 'pi pi-slack',
        //                 routerLink: ['/utils'],
        //             },
        //         ],
        //     },
        //     {
        //         label: 'Point Of Sale(POS)',
        //         items: [
        //             {
        //                 label: 'Main Category',
        //                 icon: 'pi pi-book',
        //                 routerLink: ['/pos/mainCategory'],
        //             },
        //             {
        //                 label: 'Items',
        //                 icon: 'pi pi-file',
        //                 routerLink: ['/pos/posItems'],
        //             },
        //             {
        //                 label: 'Sale',
        //                 icon: 'pi pi-money-bill',
        //                 routerLink: ['posSale/posSale'],
        //             },
        //             {
        //                 label: 'Sale History',
        //                 icon: 'pi pi-history',
        //                 routerLink: ['/pos/posHistory'],
        //             },
        //             {
        //                 label: 'Item Sale History',
        //                 icon: 'pi pi-history',
        //                 routerLink: ['/pos/posItemHistory'],
        //             },
        //         ],
        //     },
        // ];
        // var owner = [
        //     {
        //         label: 'Home',
        //         items: [
        //             {
        //                 label: 'Dashboard',
        //                 icon: 'pi pi-fw pi-home',
        //                 routerLink: ['/dashboard'],
        //             },
        //         ],
        //     },
        //     {
        //         label: 'Attendance',
        //         items: [
        //             {
        //                 label: 'Attendance History',
        //                 icon: 'pi pi-history',
        //                 routerLink: ['/attendance/attendenceHistory'],
        //             },
        //         ],
        //     },
        //     {
        //         label: 'Members',
        //         items: [
        //             {
        //                 label: 'All Members',
        //                 icon: 'pi pi-fw pi-home',
        //                 routerLink: ['/members'],
        //             },
        //         ],
        //     },
        //     {
        //         label: 'Memberships',
        //         items: [
        //             {
        //                 label: 'Memberships',
        //                 icon: 'pi pi-fw pi-book',
        //                 routerLink: ['/memberships/allMemberships'],
        //             },
        //             {
        //                 label: 'Active Leaves',
        //                 icon: 'pi pi-fw pi-calendar-minus',
        //                 routerLink: ['/memberships/activeLeaves'],
        //             },
        //             {
        //                 label: 'Sale History',
        //                 icon: 'pi pi-fw pi-history',
        //                 routerLink: ['/memberships/saleHistory'],
        //             },
        //             {
        //                 label: 'Leave History',
        //                 icon: 'pi pi-fw pi-history',
        //                 routerLink: ['/memberships/leaveHistory'],
        //             },
        //         ],
        //     },
        //     {
        //         label: 'Meal',
        //         items: [
        //             {
        //                 label: 'Meal Types',
        //                 icon: 'pi pi-list',
        //                 routerLink: ['/meal/mealType'],
        //             },
        //             {
        //                 label: 'Meal Packs',
        //                 icon: 'pi pi-database',
        //                 routerLink: ['/meal/mealPack'],
        //             },
        //         ],
        //     },
        //     {
        //         label: 'Cards',
        //         icon: 'pi pi-credit-card',
        //         items: [
        //             {
        //                 label: 'Card Histrory',
        //                 icon: 'pi pi-credit-card',
        //                 routerLink: ['/cards/cardHistory'],
        //             },
        //         ],
        //     },
        //     {
        //         label: 'Accounts',
        //         items: [
        //             {
        //                 label: 'Income Accounts',
        //                 icon: 'pi pi-money-bill',
        //                 routerLink: ['/accounts/incomeAccount'],
        //             },
        //             {
        //                 label: 'Expense Accounts',
        //                 icon: 'pi pi-dollar',
        //                 routerLink: ['/accounts/expenseAccount'],
        //             },
        //             {
        //                 label: 'Commodity Accounts',
        //                 icon: 'pi pi-link',
        //                 routerLink: ['/accounts/commodityAccount'],
        //             },
        //             {
        //                 label: 'Account Transactions',
        //                 icon: 'pi pi-history',
        //                 routerLink: ['/accounts/accountTransactions'],
        //             },
        //         ],
        //     },
        //     {
        //         label: 'Transactions',
        //         items: [
        //             {
        //                 label: 'Transactions',
        //                 icon: 'pi pi-history',
        //                 routerLink: ['/transactions/history'],
        //             },
        //         ],
        //     },
        //     {
        //         label: 'Utils',
        //         items: [
        //             {
        //                 label: 'Misc',
        //                 icon: 'pi pi-slack',
        //                 routerLink: ['/utils'],
        //             },
        //         ],
        //     },
        //     {
        //         label: 'Point Of Sale(POS)',
        //         items: [
        //             {
        //                 label: 'Main Category',
        //                 icon: 'pi pi-book',
        //                 routerLink: ['/pos/mainCategory'],
        //             },
        //             {
        //                 label: 'Items',
        //                 icon: 'pi pi-file',
        //                 routerLink: ['/pos/posItems'],
        //             },
        //             {
        //                 label: 'Sale History',
        //                 icon: 'pi pi-history',
        //                 routerLink: ['/pos/posHistory'],
        //             },
        //             {
        //                 label: 'Item Sale History',
        //                 icon: 'pi pi-history',
        //                 routerLink: ['/pos/posItemHistory'],
        //             },
        //         ],
        //     },
        // ];
        // var attendance = [
        //     {
        //         label: 'Attendance',
        //         items: [
        //             {
        //                 label: 'Attendance',
        //                 icon: 'pi pi-fw pi-list',
        //                 routerLink: ['/attendance'],
        //             },
        //             {
        //                 label: 'Attendance History',
        //                 icon: 'pi pi-history',
        //                 routerLink: ['/attendance/attendenceHistory'],
        //             },
        //         ],
        //     },
        // ];
        // this.User = this.memberService.getUserData().user_role;
        // if (this.User == 'COUNTER') {
        //     this.model = user;
        // } else if (this.User == 'ATTENDANCE') {
        //     this.model = attendance;
        // } else {
        //     this.model = owner;
        // }
        const userRole = this.memberService.getUserData().user_role;
        let routesFile: string;

        switch (userRole) {
            case 'COUNTER':
                this.model = userRoutes;
                break;
            case 'ATTENDANCE':
                this.model = attendantRoutes;
                break;
            default:
                this.model = ownerRoutes;
                break;
        }
    }


    onKeydown(event: KeyboardEvent) {
        const nodeElement = <HTMLDivElement>event.target;
        if (event.code === 'Enter' || event.code === 'Space') {
            nodeElement.click();
            event.preventDefault();
        }
    }
}
