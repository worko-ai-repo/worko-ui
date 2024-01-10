import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeComponent } from './employee.component';
import { EmployeeDashboardComponent } from './components/employee-dashboard/employee-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { UserMenubarComponent } from '../candidate/components/user-menubar/user-menubar.component';
import { UserNavbarComponent } from '../candidate/components/user-navbar/user-navbar.component';
import { CandidateModule } from '../candidate/candidate.module';
import { CandidateComponent } from '../candidate/candidate.component';
import { JobHistoryComponent } from '../shared/components/user-interface/employee/dashboard/job-history/job-history.component';
import { ServicePackageComponent } from '../shared/components/user-interface/employee/dashboard/service-package/service-package.component';
import { BankDetailsComponent } from '../shared/components/user-interface/employee/dashboard/bank-details/bank-details.component';


export const routes: Routes = [

  {
    path: '',
    component: EmployeeComponent,
    children: [
      {
        path: 'dashboard',
        component: EmployeeDashboardComponent
      },
      {
        path: 'referral',
        component: EmployeeDashboardComponent
      },
      {
        path: 'service',
        component: EmployeeDashboardComponent
      },
      {
        path: 'packages ',
        component: EmployeeDashboardComponent
      },
      
      
      
      
      
      
      
      
    ]
  }  
]
@NgModule({
  declarations: [
    EmployeeComponent,
    EmployeeDashboardComponent,
    JobHistoryComponent,
    ServicePackageComponent,
    BankDetailsComponent,
    
  
  ],
  imports: [
    CommonModule,
    CandidateModule,
    
    RouterModule.forChild(routes),
  ]
})
export class EmployeeModule { }
