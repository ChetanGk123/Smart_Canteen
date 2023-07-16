import { Component, OnInit } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { MemberService } from 'src/app/core/services/MemberService/member.service';
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
        const userRole = this.memberService.getUserData().user_role;

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
