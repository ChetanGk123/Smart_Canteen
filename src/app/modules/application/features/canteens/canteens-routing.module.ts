import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanteensComponent } from './canteens.component';

const routes: Routes = [{ path: '', component: CanteensComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CanteensRoutingModule {}
