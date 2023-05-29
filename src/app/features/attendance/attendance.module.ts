import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendanceRoutingModule } from './attendance-routing.module';
import { AttendanceComponent } from './attendance.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CorePipesModule } from 'src/app/core/pipes/pipes.module';
import { PrimengModule } from 'src/app/shared/primeng/primeng.module';
import { PosSaleComponent } from './pos-sale/pos-sale.component';
import { AttendanceHistoryComponent } from './attendance-history/attendance-history.component';

@NgModule({
    declarations: [AttendanceComponent, PosSaleComponent, AttendanceHistoryComponent],
    imports: [
        CommonModule,
        AttendanceRoutingModule,
        FormsModule,
        CorePipesModule,
        ReactiveFormsModule,
        PrimengModule,
    ],
})
export class AttendanceModule {}
