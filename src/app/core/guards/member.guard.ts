import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root',
})
export class MemberGuard implements CanActivate {
    constructor(public router: Router, public authService: AuthService) {}

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
        if (!TokenExpired && user.user_role == 'COUNTER_MEMBER_ROLE') {
            this.authService.beginSession();
            return true;
        } else {
            localStorage.removeItem('user');
            this.router.navigate(['/member/login'], {
                queryParams: { returnUrl: state.url },
            });
            return false;
        }
        //"COUNTER_MEMBER_ROLE"
    }
}
