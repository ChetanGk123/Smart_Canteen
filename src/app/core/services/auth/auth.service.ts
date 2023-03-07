import { Injectable } from '@angular/core';
import { Login, user } from '../../models/Login';
import { ApiService } from '../api/api.service';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import { LockScreenComponent } from 'src/app/features/lock-screen/lock-screen.component';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ConfigService } from '../app.config.service';
import { AppConfig } from '../../interfaces/appconfig';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    ref: DynamicDialogRef;
    loginData: Login = {};
    user: user;
    public returnUrl: string;
    encPassword = environment.encPassword;
    public userActivity;
    config: AppConfig;
    public userInactive: Subject<any> = new Subject();
    constructor(
        public dialogService: DialogService,
        private messageService: MessageService,
        private route: ActivatedRoute,
        public router: Router,
        public configService: ConfigService,
        public ApiService: ApiService
    ) {}

    async login(loginData: Login): Promise<boolean> {
        var response: any;
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
        await this.ApiService.postLoginTypeRequest('user_login', loginData)
            .toPromise()
            .then((result: any) => (response = result))
            .catch(() => {
                return false;
            });
        if (response?.result) {
            if (this.ref) this.ref.close();
            await this.setUser(response.data);
            if (response.data.user_role != 'USER') {
            }
            this.beginsesssion();
            this.setTheme(response.data.settings)
            loginData.password = '';
            this.messageService.add({
                severity: 'success',
                summary: 'Logged In',
                detail: `Welcome back ${this.user.full_name}`,
            });
            this.router.navigateByUrl(this.returnUrl);
            return true;
        } else {
            return false;
        }
    }

    lockScreen() {
        var data = this.getUser();
        if (data.token) {
            localStorage.removeItem('user');
            data.token = null;
            this.loginData = {
                password: '',
            };
            this.setUser(data);
            this.ref = this.dialogService.open(LockScreenComponent, {
                header: 'Unlock',
                width: '50%',
                contentStyle: { 'max-height': '500px', overflow: 'auto' },
                baseZIndex: 10000,
                closable: false,
            });
        }
    }

    setUser(user: user) {
        try {
            this.user = user;
            var enc = CryptoJS.AES.encrypt(
                JSON.stringify(this.user),
                this.encPassword
            ).toString();
            localStorage.setItem('user', enc);
        } catch (error) {
            console.log(error);
            this.logout();

        }
    }

    getUser() {
        try {
            var user: user;
            if (this.user) {
                user = this.user;
            } else {
                user = localStorage.getItem('user')
                    ? JSON.parse(
                          CryptoJS.AES.decrypt(
                              localStorage.getItem('user'),
                              this.encPassword.trim()
                          ).toString(CryptoJS.enc.Utf8)
                      )
                    : null;
            }

            if (user) {
                return user;
            } else {
                this.logout();
                return null;
            }
        } catch (error) {
            this.logout();
            return null;
        }
    }

    unlockScreen() {
        var loginData: Login = {
            username:
                this.user.user_name ??
                JSON.parse(localStorage.getItem('user')).username,
            password: this.loginData.password,
        };
        return this.login(loginData);
    }

    logout() {
        if (this.ref) this.ref.close();
        localStorage.clear();
        this.router.navigate(['/login']);
    }

    beginsesssion() {
        this.setTimeout();
        this.userInactive.subscribe(() => {
            this.lockScreen();
        });
    }

    setTimeout() {
        const helper = new JwtHelperService();
        var day1: any = helper.getTokenExpirationDate(this.getUser().token);
        var day2: any = new Date();
        this.userActivity = setTimeout(() => {
            if (this.getUser()) {
                this.userInactive.next(undefined);
            }
        }, Math.floor(day1 - day2) - 5000);
    }

    get TockenExpiry() {
        try {
            const helper = new JwtHelperService();
            var day1: any = helper.getTokenExpirationDate(this.getUser().token);
            var day2: any = new Date();
            return Math.floor(day1 - day2);
        } catch (error) {
            this.logout();
            return null;
        }
    }

    setTheme(settings:any) {
        let themeSettings = settings.filter((settings:any)=> settings.settings_name === "THEME_COLOR")
        let themeElement = document.getElementById('theme-css');
        let dark: boolean;
        let theme: string;
        if (themeSettings[0].settings_value == 'dark') {
            dark = true;
            theme = 'lara-dark-indigo';
        } else {
            dark = false;
            theme = 'lara-light-indigo';
        }
        themeElement.setAttribute(
            'href',
            'assets/theme/' + theme + '/theme.css'
        );
        this.configService.updateConfig({ ...this.config, ...{ theme, dark } });
    }
}
