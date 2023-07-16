import { Component, OnDestroy, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AppMainComponent } from './app.main.component';
import { AppConfig } from 'src/app/core/interfaces/appconfig';
import { ApiService } from 'src/app/core/services/api/api.service';
import { AppComponent } from 'src/app/app.component';
import { ConfigService } from 'src/app/core/services/app.config.service';
import { CounterService } from '../../application/features/counters/counter.service';
import { MemberService } from 'src/app/core/services/MemberService/member.service';

@Component({
    selector: 'app-config',
    templateUrl: './app.config.component.html',
})
export class AppConfigComponent implements OnInit, OnDestroy {
    scale: number = 14;

    scales: any[] = [12, 13, 14, 15, 16];

    config: AppConfig;
    counters: any[] = [];
    selectedCounter: any;
    subscription: Subscription;

    constructor(
        public apiService: ApiService,
        public appMain: AppMainComponent,
        public configService: ConfigService,
        public primengConfig: PrimeNGConfig,
        public counterService: CounterService,
        public memberService: MemberService
    ) {}

    ngOnInit() {
        this.config = this.configService.config;
        // this.subscription = this.configService.configUpdate$.subscribe(
        //     (config) => {
        //         this.config = config;
        //         this.scale = 13;

        //         this.applyScale();
        //     }
        // );
        if (this.memberService.getUserData().user_role == 'OWNER') {
            this.apiService
                .getTypeRequest(`table_data/COUNTER`)
                .toPromise()
                .then((result: any) => {
                    var data = {
                        contact_number: '',
                        contact_person: '',
                        counter_address: '',
                        counter_name: 'All Counters',
                        email: '',
                        id: '',
                        logo_location: '',
                        logo_url: '',
                        status: '',
                    };
                    this.selectedCounter = data;
                    this.updateCounter();
                    this.counters.push(data);
                    result?.data.forEach((element) => {
                        this.counters.push(element);
                    });
                });
        }
    }

    onConfigButtonClick(event) {
        this.appMain.configActive = !this.appMain.configActive;
        this.appMain.configClick = true;
        event.preventDefault();
    }

    incrementScale() {
        this.scale++;
        this.applyScale();
    }

    decrementScale() {
        this.scale--;
        this.applyScale();
    }

    applyScale() {
        document.documentElement.style.fontSize = this.scale + 'px';
    }

    onRippleChange(ripple) {
        this.primengConfig.ripple = ripple;
        this.configService.updateConfig({ ...this.config, ...{ ripple } });
    }

    onInputStyleChange() {
        this.configService.updateConfig(this.config);
    }

    changeTheme(theme: string, dark: boolean) {
        let themeElement = document.getElementById('theme-css');
        themeElement.setAttribute(
            'href',
            'assets/theme/' + theme + '/theme.css'
        );
        this.configService.updateConfig({ ...this.config, ...{ theme, dark } });
    }

    updateCounter() {
        this.counterService.setCounterData(this.selectedCounter);
        this.appMain.configActive = false;
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
