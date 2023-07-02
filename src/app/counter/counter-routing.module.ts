import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppMainComponent } from '../layout/app.main.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

const routes: Routes = [
    {
        path:'',
        component: AppMainComponent,
        children:[
            {
                path:'',
                component: DashboardComponent
            }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CounterRoutingModule { }
