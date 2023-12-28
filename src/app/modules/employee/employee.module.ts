import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeComponent } from './employee.component';
import { EmployeeDashboardComponent } from './components/employee-dashboard/employee-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeNavbarComponent } from './components/employee-navbar/employee-navbar.component';
import { EmployeeDetailsComponent } from './components/employee-details/employee-details.component';
import { EmployeeProfileComponent } from './components/employee-profile/employee-profile.component';
import { EmployeeJobComponent } from './components/employee-job/employee-job.component';
import { EmployeeServicePackageComponent } from './components/employee-service-package/employee-service-package.component';
import { EmployeeBankDetailsComponent } from './components/employee-bank-details/employee-bank-details.component';

export const routes: Routes = [

  {
    path: '',
    component: EmployeeComponent,
    children: [
      {
        path: 'employee-dashboard',
        component: EmployeeDashboardComponent
      },
      {
        path: 'employee-details',
        component: EmployeeDetailsComponent
      },
      {
        path: 'employee-bank-details',
        component: EmployeeBankDetailsComponent
      },
      {
        path: 'employee-job',
        component: EmployeeJobComponent
      },
      {
        path: 'employee-service-package',
        component: EmployeeServicePackageComponent
      },
      {
        path: 'employee-profile',
        component: EmployeeProfileComponent
      },
      {
        path: 'employee-navbar',
        component: EmployeeNavbarComponent
      },
      
      
      
      
      
      
      
    ]
  }  
]
@NgModule({
  declarations: [
    EmployeeComponent,
    EmployeeDashboardComponent,
    EmployeeNavbarComponent,
    EmployeeDetailsComponent,
    EmployeeProfileComponent,
    EmployeeJobComponent,
    EmployeeServicePackageComponent,
    EmployeeBankDetailsComponent
  ],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes)
  ]
})
export class EmployeeModule { }
