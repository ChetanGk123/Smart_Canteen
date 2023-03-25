import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AppConfig } from '../interfaces/appconfig';

@Injectable()
export class ConfigService {
    config: AppConfig

    private configUpdate = new Subject<AppConfig>();

    configUpdate$ = this.configUpdate.asObservable();

    /**
     *
     */
    constructor() {
        var tempConfig = {
            theme: 'lara-light-indigo',
            dark: false,
            inputStyle: 'outlined',
            ripple: true,
        };
        this.config = JSON.parse(localStorage.getItem("config"))??tempConfig
        this.updateConfig(this.config)
    }

    updateConfig(config: AppConfig) {
        let themeElement = document.getElementById('theme-css');
        this.config = config;
        this.configUpdate.next(config);
        localStorage.setItem("config",JSON.stringify(this.config))
        themeElement.setAttribute(
            'href',
            'assets/theme/' + this.config.theme + '/theme.css'
        );
    }

    getConfig() {
        return this.config;
    }
}
