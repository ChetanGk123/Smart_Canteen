import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CountersRoutingModule } from './counters-routing.module';
import { CountersComponent } from './counters.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { SharedModule } from 'src/app/shared/shared.module';
import { CorePipesModule } from 'src/app/core/pipes/pipes.module';
import { PrimengModule } from 'src/app/shared/primeng/primeng.module';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ManageCounterComponent } from './manage-counter/manage-counter.component';
import { CounterProfileComponent } from './counter-profile/counter-profile.component';


@NgModule({
  declarations: [
    CountersComponent,
    ManageCounterComponent,
    CounterProfileComponent
  ],
  imports: [
    CommonModule,
    CountersRoutingModule,
    CorePipesModule,
    PrimengModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
  ],
  providers: [DynamicDialogRef, DynamicDialogConfig],
})
export class CountersModule { }
