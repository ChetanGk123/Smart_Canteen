import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationRoutingModule } from './application-routing.module';
import { AppConfigComponent } from './layout/app.config.component';
import { AppFooterComponent } from './layout/app.footer.component';
import { AppMainComponent } from './layout/app.main.component';
import { AppMenuComponent } from './layout/app.menu.component';
import { AppMenuitemComponent } from './layout/app.menuitem.component';
import { AppTopBarComponent } from './layout/app.topbar.component';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/shared/primeng/primeng.module';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';


@NgModule({
  declarations: [
    LoginComponent,
        AppMainComponent,
        AppTopBarComponent,
        AppFooterComponent,
        AppConfigComponent,
        AppMenuComponent,
        AppMenuitemComponent,
        DashboardComponent,
        NotfoundComponent
  ],
  imports: [
    CommonModule,
        PrimengModule,
        FormsModule,
        ReactiveFormsModule,
        ApplicationRoutingModule,
  ]
})
export class ApplicationModule { }
