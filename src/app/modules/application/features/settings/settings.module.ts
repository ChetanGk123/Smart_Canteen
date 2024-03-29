import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { PrimengModule } from 'src/app/shared/primeng/primeng.module';

@NgModule({
    declarations: [SettingsComponent],
    imports: [CommonModule, PrimengModule, SettingsRoutingModule],
})
export class SettingsModule {}
