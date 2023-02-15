import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PosSaleComponent } from './posSale.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'posSale',
    },
    {
        path: 'posSale',
        component: PosSaleComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PosSaleRoutingModule {}
