import { Component, HostListener } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { LockScreenService } from './core/services/LockScreenService/lock-screen.service';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    @HostListener('document:keydown.shift.m')
    doSomething() {
        // //
    }
    menuMode = 'static';

    constructor(
        private primengConfig: PrimeNGConfig,
        public lockScrrenScervice: LockScreenService
    ) {}

    ngOnInit() {
        this.primengConfig.ripple = true;
        document.documentElement.style.fontSize = '14px';
    }

    display() {
        // //
    }
}
