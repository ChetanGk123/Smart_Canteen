import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PosRoutingModule } from './pos-routing.module';
import { PosItemsComponent } from './pos-items/pos-items.component';
import { AddPosComponent } from './add-pos/add-pos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { SharedModule } from 'src/app/shared/shared.module';
import { PrimengModule } from 'src/app/shared/primeng/primeng.module';
import { UpdatePosComponent } from './update-pos/update-pos.component';
import { PosDetailsComponent } from './pos-items/pos-details/pos-details.component';
import { MainCategoryComponent } from './main-category/main-category.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { UtilsModule } from '../utils/utils.module';
import { EditMainCategoryComponent } from './main-category/edit-main-category/edit-main-category.component';
import { EditSubCategoryComponent } from './sub-category/edit-sub-category/edit-sub-category.component';
import { UpdateImageComponent } from './update-image/update-image.component';
import { CorePipesModule } from 'src/app/core/pipes/pipes.module';
import { PosHistoryComponent } from './pos-history/pos-history.component';
import { AcademicConstraintsComponent } from './pos-items/pos-details/academic-constraints/academic-constraints.component';
import { TimeConstraintsComponent } from './pos-items/pos-details/time-constraints/time-constraints.component';

@NgModule({
    declarations: [
        PosItemsComponent,
        AddPosComponent,
        UpdatePosComponent,
        PosDetailsComponent,
        MainCategoryComponent,
        SubCategoryComponent,
        EditMainCategoryComponent,
        EditSubCategoryComponent,
        UpdateImageComponent,
        PosHistoryComponent,
        AcademicConstraintsComponent,
        TimeConstraintsComponent,
    ],
    imports: [
        CommonModule,
        CorePipesModule,
        PosRoutingModule,
        PrimengModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        UtilsModule,
        NgxMaskModule.forRoot(),
    ],
})
export class PosModule {}
