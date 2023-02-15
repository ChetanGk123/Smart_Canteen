import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainCategoryComponent } from './main-category/main-category.component';
import { PosHistoryComponent } from './pos-history/pos-history.component';
import { PosItemsComponent } from './pos-items/pos-items.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'posItems',
        pathMatch: 'full',
    },
    {
        path: 'posItems',
        component: PosItemsComponent,
    },
    {
        path: 'mainCategory',
        component: MainCategoryComponent,
    },
    {
        path: 'subCategory',
        component: SubCategoryComponent,
    },
    {
        path: 'posHistory',
        component: PosHistoryComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PosRoutingModule {}
