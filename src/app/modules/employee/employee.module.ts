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
import { EmployeeDetailsComponent } from '../shared/components/user-interface/employee/dashboard/employee-details/employee-details.component';
import { EmployeeReferralComponent } from './components/employee-referral/employee-referral.component';
// import { AwaitingStatusComponent } from '../shared/components/user-interface/referral/awaiting-status/awaiting-status.component';
import { SharedModule } from '../shared/shared.module';
import { EmployeeReferralDetailsComponent } from '../shared/components/user-interface/employee/referral/employee-referral-details/employee-referral-details.component';
import { EmployeeServiceComponent } from './components/employee-service/employee-service.component';
import { ReviewPopupComponent } from '../shared/components/user-interface/employee/services/review-popup/review-popup.component';


export const routes: Routes = [

  {
    path: '',
    component: EmployeeComponent,
    children: [
      {
        path: 'edashboard',
        component: EmployeeDashboardComponent
      },
      {
        path: 'ereferral',
        component: EmployeeReferralComponent
      },
      {
        path: 'eservice',
        component: EmployeeServiceComponent
      },
      {
        path: 'epackages ',
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
    EmployeeDetailsComponent,
    EmployeeReferralComponent,
    EmployeeReferralDetailsComponent,
    EmployeeServiceComponent,
    
    
    
  ],
  imports: [
    CommonModule,
    CandidateModule,
    SharedModule,
    
    
    RouterModule.forChild(routes),
  ]
})
export class EmployeeModule { }
