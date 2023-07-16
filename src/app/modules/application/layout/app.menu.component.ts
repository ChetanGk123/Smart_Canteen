import { Component, OnInit } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { MemberService } from 'src/app/core/services/MemberService/member.service';

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
                        routerLink: ['/app/dashboard'],
                    },
                ],
            },
            {
                label: 'Members',
                items: [
                    {
                        label: 'All Members',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/app/members'],
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
                        routerLink: ['/app/cards/cardHistory'],
                    },
                ],
            },
            {
                label: 'Accounts',
                items: [
                    {
                        label: 'Income Accounts',
                        icon: 'pi pi-money-bill',
                        routerLink: ['/app/accounts/incomeAccount'],
                    },
                    {
                        label: 'Expense Accounts',
                        icon: 'pi pi-dollar',
                        routerLink: ['/app/accounts/expenseAccount'],
                    },
                    {
                        label: 'Account Transactions',
                        icon: 'pi pi-history',
                        routerLink: ['/app/accounts/accountTransactions'],
                    },
                ],
            },
            {
                label: 'Transactions',
                items: [
                    {
                        label: 'Transactions',
                        icon: 'pi pi-history',
                        routerLink: ['/app/transactions/history'],
                    },
                ],
            },
            {
                label: 'Utils',
                items: [
                    {
                        label: 'Misc',
                        icon: 'pi pi-slack',
                        routerLink: ['/app/utils'],
                    },
                ],
            },
            {
                label: 'POS',
                items: [
                    {
                        label: 'Main Category',
                        icon: 'pi pi-slack',
                        routerLink: ['/app/pos/mainCategory'],
                    },
                    {
                        label: 'Items',
                        icon: 'pi pi-slack',
                        routerLink: ['/app/pos/posItems'],
                    },
                    {
                        label: 'Sale',
                        icon: 'pi pi-slack',
                        routerLink: ['posSale/posSale'],
                    },
                    {
                        label: 'Sale History',
                        icon: 'pi pi-slack',
                        routerLink: ['/app/pos/posHistory'],
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
                        routerLink: ['/app/dashboard'],
                    },
                ],
            },
            {
                label: 'Counters',
                items: [
                    {
                        label: 'All Counters',
                        icon: 'pi pi-fw pi-th-large',
                        routerLink: ['/app/counters'],
                    },
                ],
            },
            {
                label: 'Members',
                items: [
                    {
                        label: 'All Members',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/app/members'],
                    },
                ],
            },
            {
                label: 'Accounts',
                items: [
                    {
                        label: 'Account Transactions',
                        icon: 'pi pi-history',
                        routerLink: ['/app/accounts/accountTransactions'],
                    },
                ],
            },
            {
                label: 'Transactions',
                items: [
                    {
                        label: 'Transactions',
                        icon: 'pi pi-history',
                        routerLink: ['/app/transactions/history'],
                    },
                ],
            },
            {
                label: 'Utils',
                items: [
                    {
                        label: 'Misc',
                        icon: 'pi pi-slack',
                        routerLink: ['/app/utils'],
                    },
                ],
            },
            {
                label: 'POS',
                items: [
                    {
                        label: 'Main Category',
                        icon: 'pi pi-slack',
                        routerLink: ['/app/pos/mainCategory'],
                    },
                    {
                        label: 'Items',
                        icon: 'pi pi-slack',
                        routerLink: ['/app/pos/posItems'],
                    },
                    {
                        label: 'Sale History',
                        icon: 'pi pi-slack',
                        routerLink: ['/app/pos/posHistory'],
                    },
                ],
            },
        ];
        this.User = this.memberService.getUserData().user_role;
        this.getRoutesForUserRole(this.User).then(data => this.model = data)
        //this.model
            //this.User == 'OWNER' || this.User == 'su_user' ? owner : user;
    }

    async getRoutesForUserRole(userRole: string){
        let routesFile: string = 'assets/routes/';

        switch (userRole) {
            case 'COUNTER':
                routesFile += 'user-routes.json';
                break;
            case 'ATTENDANCE':
                routesFile += 'attender-routes.json';
                break;
            default:
                routesFile += 'owner-routes.json';
                break;
        }

        return await this.loadRoutes(routesFile) as any[];
    }

    loadRoutes(routesFile: string) {
        // Assuming the JSON files are located in the assets folder
        return fetch(`${routesFile}`)
            .then((response) => response.json())
            .then((data) => {
                const routerLinks = data;
                return routerLinks;
            })
            .catch((error) => {
                console.error(
                    `Error loading routes from ${routesFile}:`,
                    error
                );
                return [];
            });
    }

    onKeydown(event: KeyboardEvent) {
        const nodeElement = <HTMLDivElement>event.target;
        if (event.code === 'Enter' || event.code === 'Space') {
            nodeElement.click();
            event.preventDefault();
        }
    }
}
