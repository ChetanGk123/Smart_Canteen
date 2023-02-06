import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardsRoutingModule } from './cards-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { SharedModule } from 'primeng/api';
import { PrimengModule } from 'src/app/shared/primeng/primeng.module';
import { CardDetailsComponent } from './card-history/card-details/card-details.component';
import { CardHistoryComponent } from './card-history/card-history.component';

@NgModule({
    declarations: [CardHistoryComponent, CardDetailsComponent],
    imports: [
        CommonModule,
        PrimengModule,
        SharedModule,
        CardsRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgxMaskModule.forRoot(),
    ],
})
export class CardsModule {}
