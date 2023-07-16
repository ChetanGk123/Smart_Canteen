import { Injectable } from '@angular/core';
import {
    ActivatedRoute,
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(
        public router: Router,
        public authService: AuthService,
        private route: ActivatedRoute
    ) {}
    async canActivate(
        _route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean | UrlTree> {
        const user = this.authService.getUser();
        const helper = new JwtHelperService();
        const tokenExpired = helper.isTokenExpired(user?.token) ?? false;
        if (!tokenExpired) {
            this.authService.beginSession();
            const userRole = user.user_role;
            const allowedRoutes = await this.getRoutesForUserRole(userRole);
            if (userRole === 'OWNER' && state.url === '/attendance') {
                return this.router.createUrlTree(['/counters']);
            } else if (
                (userRole === 'OWNER' || userRole === 'COUNTER') &&
                state.url === '/app/settings'
            ) {
                return true;
            } else if (allowedRoutes.some((route) => route === state.url)) {
                return true;
            } else {
                // pages/access
                return this.router.createUrlTree(['/pages/notfound']);
            }
        } else {
            localStorage.removeItem('user');
            return this.router.createUrlTree(['/app/login'], {
                queryParams: { returnUrl: state.url },
            });
        }
    }

    getRoutesForUserRole(userRole: string): Promise<string[]> {
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

        return this.loadRoutes(routesFile);
    }

    loadRoutes(routesFile: string): Promise<string[]> {
        // Assuming the JSON files are located in the assets folder
        return fetch(`${routesFile}`)
            .then((response) => response.json())
            .then((data) => {
                const routerLinks = [];
                data.forEach((item) => {
                    if (item.items) {
                        item.items.forEach((subItem) => {
                            if (subItem.routerLink) {
                                routerLinks.push(subItem.routerLink[0]);
                            }
                        });
                    }
                });

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
}
