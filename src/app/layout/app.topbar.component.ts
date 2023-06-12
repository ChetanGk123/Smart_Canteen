import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth/auth.service';
import { ConfigService } from '../core/services/app.config.service';
import { AppConfig } from '../core/interfaces/appconfig';
import { DialogService } from 'primeng/dynamicdialog';
import { MemberService } from '../core/services/MemberService/member.service';
import { CoreConfig } from '../core/interfaces/coreConfig';
import { EnvService } from '../env.service';
import { Subject, takeUntil } from 'rxjs';
import { CounterService } from '../features/counters/counter.service';
import { SettingsService } from '../features/settings/settings.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent implements OnInit, OnDestroy {
    checked: boolean;
    config: AppConfig;
    public coreConfig: CoreConfig;
    public counterData: any;

    // Private
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        public appMain: AppMainComponent,
        public authService: AuthService,
        public configService: ConfigService,
        public dialogService: DialogService,
        public memberService: MemberService,
        private settingsService: SettingsService,
        public _coreEnvService: EnvService,
        public counterService: CounterService,
        public router: Router
    ) {
        this.coreConfig = _coreEnvService.config;
    }
    ngOnInit(): void {
        this.config = this.configService.config;

        //this.checked = !this.config?.dark ?? true;
        this.settingsService.settingsDate$.subscribe((newValue) => {
            // Handle updated settingsDate value
            if (newValue == null) {
                newValue = this.settingsService.getSettingsData();
            }
            this.checked = newValue[1].settings_value == 'light' ? true : false;
        });
        this.counterService.counterDate$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: any) => {
                this.counterData = data;
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    changeTheme() {
        // let themeElement = document.getElementById('theme-css');
        let dark: boolean;
        let theme: string;
        if (this.checked) {
            this.checked = false;
            dark = true;
            theme = 'lara-dark-indigo';
        } else {
            this.checked = true;
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
