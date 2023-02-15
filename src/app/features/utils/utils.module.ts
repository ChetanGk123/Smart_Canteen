import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UtilsRoutingModule } from './utils-routing.module';
import { UtilsComponent } from './utils.component';
import { CommonComponent } from './common/common.component';
import { PrimengModule } from 'src/app/shared/primeng/primeng.module';
import { CommonEditComponent } from './common/common-edit/common-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
    declarations: [
        UtilsComponent,
        CommonComponent,
        CommonEditComponent,
    ],
    imports: [
        CommonModule,
        UtilsRoutingModule,
        PrimengModule,
        FormsModule,
        FormsModule,
        ReactiveFormsModule,
        NgxMaskModule.forRoot(),
    ],
    exports: [CommonComponent],
})
export class UtilsModule {}
