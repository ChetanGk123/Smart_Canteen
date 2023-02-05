import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CanteensRoutingModule } from './canteens-routing.module';
import { CanteensComponent } from './canteens.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { SharedModule } from 'src/app/shared/shared.module';
import { CorePipesModule } from 'src/app/core/pipes/pipes.module';
import { PrimengModule } from 'src/app/shared/primeng/primeng.module';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ManagaeCanteenComponent } from './managae-canteen/managae-canteen.component';


@NgModule({
  declarations: [
    CanteensComponent,
    ManagaeCanteenComponent,
  ],
  imports: [
    CommonModule,
    CanteensRoutingModule,
    CorePipesModule,
    PrimengModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
  ],
  providers: [DynamicDialogRef, DynamicDialogConfig],
})
export class CanteensModule { }
