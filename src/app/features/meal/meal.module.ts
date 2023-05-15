import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MealRoutingModule } from './meal-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { SharedModule } from 'src/app/shared/shared.module';
import { CorePipesModule } from 'src/app/core/pipes/pipes.module';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MealTypeComponent } from './meal-type/meal-type.component';
import { EditMealTypeComponent } from './meal-type/edit-meal-type/edit-meal-type.component';
import { MealPackComponent } from './meal-pack/meal-pack.component';
import { EditMealPackNameComponent } from './meal-pack/edit-meal-pack-name/edit-meal-pack-name.component';
import { ConfigureMealPackComponent } from './meal-pack/configure-meal-pack/configure-meal-pack.component';


@NgModule({
  declarations: [
    MealTypeComponent,
    EditMealTypeComponent,
    MealPackComponent,
    EditMealPackNameComponent,
    ConfigureMealPackComponent
  ],
  imports: [
    CommonModule,
    MealRoutingModule,
    CorePipesModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        NgxMaskModule.forRoot(),
  ],
  providers: [DynamicDialogRef, DynamicDialogConfig],
})
export class MealModule { }
