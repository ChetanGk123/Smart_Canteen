import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import {
    LocationStrategy,
    HashLocationStrategy,
    DatePipe,
} from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';


import { ConfigService } from './core/services/app.config.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PrimengModule } from './shared/primeng/primeng.module';
import { DialogService } from 'primeng/dynamicdialog';
import { MenuService } from './core/services/app.menu.service';
import { AccessComponent } from './pages/access/access.component';
import { ErrorComponent } from './pages/error/error.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { ApiInterceptor } from './core/interceptors/api.interceptor';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { EnvServiceProvider } from './env.service.provider';
import { LandingComponent } from './pages/landing/landing.component';
import { LockScreenComponent } from './pages/lock-screen/lock-screen.component';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        PrimengModule,
        NgxMaskModule.forRoot(),
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000',
        }),
    ],
    declarations: [
        AppComponent,
        LandingComponent,
        ErrorComponent,
        NotfoundComponent,
        AccessComponent,
        LockScreenComponent,
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
        DatePipe,
        MenuService,
        ConfigService,
        MessageService,
        ConfirmationService,
        DialogService,
        EnvServiceProvider,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
