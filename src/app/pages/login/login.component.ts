import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigService } from '../../core/services/app.config.service';
import { AppConfig } from '../../core/interfaces/appconfig';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Login } from 'src/app/core/models/Login';
import { CoreConfig } from 'src/app/core/interfaces/coreConfig';
import { EnvService } from 'src/app/env.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [
        `
            :host ::ng-deep .p-password input {
                width: 100%;
                padding: 1rem;
            }

            :host ::ng-deep .pi-eye {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }

            :host ::ng-deep .pi-eye-slash {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }
        `,
    ],
})
export class LoginComponent implements OnInit, OnDestroy {
    displayLogins:boolean
    username: string;
    password: string;
    rememberme: boolean = true;
    loading: boolean = false;

    config: AppConfig;
    coreConfig:CoreConfig;

    subscription: Subscription;

    constructor(
        public configService: ConfigService,
        private authService: AuthService,
        public router: Router,
        public _coreEnvService: EnvService
    ) {
        this.coreConfig =  _coreEnvService.config
    }

    ngOnInit(): void {
        this.displayLogins = !environment.production
        this.loading = false;
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(
            (config) => {
                this.config = config;
            }
        );
        const user = localStorage.getItem('user');
        if (user) {
            this.router.navigate(['/']);
        }
    }

    signIn() {
        this.loading = true;
        var credentials: Login = {
            username: this.username,
            password: this.password,
        };
        this.authService.login(credentials).then((result: any) => {
            if (result) {
                this.loading = true;
            } else {
                this.loading = false;
            }
        });
    }
    otherSignIn(username:any,password:any) {
        this.loading = true;
        var credentials: Login = {
            username: username,
            password: password,
        };
        this.authService.login(credentials).then((result: any) => {
            if (result) {
                this.loading = true;
            } else {
                this.loading = false;
            }
        });
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
