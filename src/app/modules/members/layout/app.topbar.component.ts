import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { AppConfig } from 'src/app/core/interfaces/appconfig';
import { CoreConfig } from 'src/app/core/interfaces/coreConfig';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ConfigService } from 'src/app/core/services/app.config.service';
import { EnvService } from 'src/app/env.service';
import { MemberService } from 'src/app/core/services/MemberService/member.service';
import { CounterService } from '../../application/features/counters/counter.service';

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
        public _coreEnvService: EnvService,
        public counterService: CounterService,
        public router: Router
    ) {
        this.coreConfig = _coreEnvService.config;
    }
    ngOnInit(): void {
        this.config = this.configService.config;

        this.checked = !this.config?.dark ?? true;
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
