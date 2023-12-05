import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeComponent } from './employee.component';
import { EmployeeDashboardComponent } from './components/employee-dashboard/employee-dashboard.component';
import { RouterModule, Routes } from '@angular/router';


export const routes: Routes = [

  {
    path: '',
    component: EmployeeComponent,
    children: [
      {
        path: 'employee-dashboard',
        component: EmployeeDashboardComponent
      },
      
      
      
      
      
      
    ]
  }  
]
@NgModule({
  declarations: [
    EmployeeComponent,
    EmployeeDashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class EmployeeModule { }
