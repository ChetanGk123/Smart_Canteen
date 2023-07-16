import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AppConfig } from 'src/app/core/interfaces/appconfig';
import { CoreConfig } from 'src/app/core/interfaces/coreConfig';
import { ConfigService } from 'src/app/core/services/app.config.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { EnvService } from 'src/app/env.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [
        `
            :host ::ng-deep .p-phoneNumber input {
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
    displayLogins: boolean;
    cardNumber: string;
    phoneNumber: string;
    OTP: string;
    loading: boolean = false;
    showValidateOTP: boolean = false;
    validation: boolean = false;
    validationLoading: boolean = false;

    config: AppConfig;
    coreConfig: CoreConfig;

    subscription: Subscription;
    constructor(
        public configService: ConfigService,
        private authService: AuthService,
        private messageService: MessageService,
        public router: Router,
        public _coreEnvService: EnvService
    ) {
        this.coreConfig = _coreEnvService.config;
    }

    ngOnInit() {
        this.displayLogins = !environment.production;
        this.loading = false;
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(
            (config) => {
                this.config = config;
            }
        );
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    async signIn() {
        this.loading = true;
        var credentials: any = {
            cardNumber: this.cardNumber,
            phoneNumber: this.phoneNumber,
        };
        await this.authService.sendLoginOTP(credentials).then((result: any) => {
            if (result) {
                this.showValidateOTP = result;
            }
            this.loading = false;
        });
    }

    async otherSignIn(cardNumber, phoneNumber) {
        this.cardNumber = cardNumber;
        this.phoneNumber = phoneNumber;
        this.loading = true;
        var credentials: any = {
            card_number: cardNumber,
            registered_phone_number: phoneNumber,
        };
        await this.authService.sendLoginOTP(credentials).then((result: any) => {
            console.log(result);
            this.loading = false;
            this.showValidateOTP = result;
        });
    }

    validateOTP() {
        if (this.OTP.length > 0 && this.OTP.length < 6) {
            this.messageService.add({
                severity: 'error',
                summary: 'Invalid OTP',
                detail: `OTP should be 6 digits`,
            });
        } else if (this.OTP.length > 6) {
            this.messageService.add({
                severity: 'error',
                summary: 'Invalid OTP',
                detail: `OTP should be 6 digits`,
            });
        } else {
            this.validationLoading = true;
        }
        if(this.validationLoading){
            var payload:any = {
                card_number: this.cardNumber,
            registered_phone_number: this.phoneNumber,
            otp: this.OTP
            }
            this.authService.validateOTP(payload).then(()=>{
                this.validationLoading = false;
            })
        }
    }
}
