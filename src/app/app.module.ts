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

import { DashboardComponent } from './features/dashboard/dashboard.component';

import { ConfigService } from './core/services/app.config.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PrimengModule } from './shared/primeng/primeng.module';
import { DialogService } from 'primeng/dynamicdialog';
import { AppConfigComponent } from './layout/app.config.component';
import { AppFooterComponent } from './layout/app.footer.component';
import { AppMainComponent } from './layout/app.main.component';
import { AppMenuComponent } from './layout/app.menu.component';
import { AppMenuitemComponent } from './layout/app.menuitem.component';
import { AppTopBarComponent } from './layout/app.topbar.component';
import { MenuService } from './core/services/app.menu.service';
import { AccessComponent } from './pages/access/access.component';
import { ErrorComponent } from './pages/error/error.component';
import { LoginComponent } from './pages/login/login.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { LandingComponent } from './features/landing/landing.component';
import { LockScreenComponent } from './features/lock-screen/lock-screen.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { ApiInterceptor } from './core/interceptors/api.interceptor';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { EnvServiceProvider } from './env.service.provider';

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
        AppMainComponent,
        AppTopBarComponent,
        AppFooterComponent,
        AppConfigComponent,
        AppMenuComponent,
        AppMenuitemComponent,
        DashboardComponent,
        LandingComponent,
        LoginComponent,
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
