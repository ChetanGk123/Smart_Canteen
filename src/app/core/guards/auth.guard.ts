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
    canActivate(
        _route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        const user = this.authService.getUser();
        const helper = new JwtHelperService();
        const TokenExpired = helper.isTokenExpired(user?.token) ?? false;

        if (!TokenExpired) {
            this.authService.beginsesssion();
            return true;
        } else {
            localStorage.removeItem('user');
            this.router.navigate(['/login'], {
                queryParams: { returnUrl: state.url },
            });
            return false;
        }
    }
}
