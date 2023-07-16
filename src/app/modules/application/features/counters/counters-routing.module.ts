import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CounterProfileComponent } from './counter-profile/counter-profile.component';
import { CountersComponent } from './counters.component';

const routes: Routes = [
    { path: '', component: CountersComponent },
    {
        path: 'counterProfile',
        component: CounterProfileComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CountersRoutingModule {}
