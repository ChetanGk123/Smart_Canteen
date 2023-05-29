import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceHistoryComponent } from './attendance-history/attendance-history.component';
import { AttendanceComponent } from './attendance.component';

const routes: Routes = [
    {
        path: '',
        component: AttendanceComponent,
    },{
        path:'attendenceHistory',
        component:AttendanceHistoryComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule { }
