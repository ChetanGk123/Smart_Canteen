import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardHistoryComponent } from './card-history/card-history.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'cardHistory',
    },
    {
        path: 'cardHistory',
        component: CardHistoryComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CardsRoutingModule {}
