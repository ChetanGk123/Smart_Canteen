import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PosSaleComponent } from './posSale.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { SharedModule } from 'src/app/shared/shared.module';
import { PrimengModule } from 'src/app/shared/primeng/primeng.module';
import { ToolbarModule } from 'primeng/toolbar';
import { PosSaleRoutingModule } from './posSale-routing.module';
import { CorePipesModule } from 'src/app/core/pipes/pipes.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        ToolbarModule,
        CorePipesModule,
        PosSaleRoutingModule,
        PrimengModule,
        ReactiveFormsModule,
        NgxMaskModule.forRoot(),
    ],
    declarations: [PosSaleComponent],
})
export class PosSaleModule {}
