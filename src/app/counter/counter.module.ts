import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CounterRoutingModule } from './counter-routing.module';
import { DashboardComponent } from './features/dashboard/dashboard.component';

@NgModule({
    declarations: [DashboardComponent],
    imports: [CommonModule, CounterRoutingModule],
})
export class CounterModule {}
