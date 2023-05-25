import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MealPackComponent } from './meal-pack/meal-pack.component';
import { MealTypeComponent } from './meal-type/meal-type.component';

const routes: Routes = [
    { path: '', redirectTo: 'mealType', pathMatch: 'full' },
    {
        path: 'mealType',
        component: MealTypeComponent,
    },
    {
        path: 'mealPack',
        component: MealPackComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MealRoutingModule {}
