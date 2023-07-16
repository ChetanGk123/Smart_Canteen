import { Injectable } from '@angular/core';
import { Login, user } from '../../models/Login';
import { ApiService } from '../api/api.service';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ConfigService } from '../app.config.service';
import { AppConfig } from '../../interfaces/appconfig';
import { SettingsService } from 'src/app/modules/application/features/settings/settings.service';
import { LockScreenComponent } from 'src/app/pages/lock-screen/lock-screen.component';

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
        private settingsService: SettingsService,
        private route: ActivatedRoute,
        public router: Router,
        public configService: ConfigService,
        public ApiService: ApiService
    ) {}

    async login(loginData: Login, returnUrl?: any): Promise<boolean> {
        var response: any;
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || returnUrl;
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
            this.settingsService.updateSettingsDate(response.data.settings);
            this.beginSession();
            this.setTheme(response.data.settings);
            loginData.password = '';
            this.messageService.add({
                severity: 'success',
                summary: 'Logged In',
                detail: `Welcome back ${this.user.full_name}`,
            });
            this.router.navigateByUrl(this.returnUrl);
            return true;
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: `${response.message}`,
            });
            return false;
        }
    }
    async sendLoginOTP(loginData: any): Promise<any> {
        var response: any;
        await this.ApiService.postLoginTypeRequest('send_otp', loginData)
            .toPromise()
            .then((result: any) => {
                response = result;
            })
            .catch(() => {
                return false;
            });
        console.log(response);
        if (response.result) {
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: `${response.message}`,
            });
        }
        return response.result;
    }

    async validateOTP(payload: any, returnUrl?: any): Promise<any> {
        this.returnUrl =
            returnUrl ??
            (this.route.snapshot.queryParams['returnUrl'] || 'member');
        var response: any;
        await this.ApiService.postLoginTypeRequest('validate_otp', payload)
            .toPromise()
            .then((result: any) => {
                response = result;
                console.log(response);
                if (response.result) {
                    var userData = {
                        token: response.data.token,
                        counter_id: response.data.counter_id,
                        user_role: response.data.user_role,
                        user_id: response.data.user_id,
                        full_name: response.data.full_name,
                        user_name: response.data.user_name,
                        dp_location: response.data.dp_location,
                    };
                    this.setUser(userData);
                    this.setTheme(response.data.settings);
                    this.beginSession();
                    this.setMemberData(
                        response.data.member_profile_data.member_data
                    );
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Logged In',
                        detail: `Welcome back ${userData.full_name}`,
                    });
                    this.router.navigateByUrl(this.returnUrl);
                    return true;
                } else {
                    // this.messageService.add({
                    //     severity: 'error',
                    //     summary: 'Error',
                    //     detail: `${response.message}`,
                    // });
                    return false;
                }
            })
            .catch(() => {
                return false;
            });
    }

    setMemberData(member: any) {
        try {
            var enc = CryptoJS.AES.encrypt(
                JSON.stringify(member),
                this.encPassword
            ).toString();
            localStorage.setItem('memberData', enc);
        } catch (error) {
            console.log(error);
            this.logout();
        }
    }

    memberLogout() {
        if (this.ref) this.ref.close();
        localStorage.clear();
        this.router.navigate(['/member/login']);
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
                //this.logout();
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
        this.router.navigate(['/app/login']);
    }

    beginSession() {
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

    setTheme(settings: any) {
        let themeSettings = settings.filter(
            (settings: any) => settings.settings_name === 'THEME_COLOR'
        );
        // let themeElement = document.getElementById('theme-css');
        let dark: boolean;
        let theme: string;
        if (themeSettings[0].settings_value == 'dark') {
            dark = true;
            theme = 'lara-dark-indigo';
        } else {
            dark = false;
            theme = 'lara-light-indigo';
        }
        // themeElement.setAttribute(
        //     'href',
        //     'assets/theme/' + theme + '/theme.css'
        // );
        this.configService.updateConfig({ ...this.config, ...{ theme, dark } });
    }
}
