import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeComponent } from './employee.component';

import { RouterModule, Routes } from '@angular/router';
//import { UserMenubarComponent } from '../candidate/components/user-menubar/user-menubar.component';
import { UserNavbarComponent } from '../candidate/components/user-navbar/user-navbar.component';
import { CandidateModule } from '../candidate/candidate.module';
import { CandidateComponent } from '../candidate/candidate.component';
import { JobHistoryComponent } from '../shared/components/user-interface/employee/dashboard/job-history/job-history.component';
import { ServicePackageComponent } from '../shared/components/user-interface/employee/dashboard/service-package/service-package.component';
import { BankDetailsComponent } from '../shared/components/user-interface/employee/dashboard/bank-details/bank-details.component';
import { EmployeeReferralComponent } from './components/employee-referral/employee-referral.component';
// import { AwaitingStatusComponent } from '../shared/components/user-interface/referral/awaiting-status/awaiting-status.component';
import { SharedModule } from '../shared/shared.module';
import { EmployeeReferralDetailsComponent } from '../shared/components/user-interface/employee/referral/employee-referral-details/employee-referral-details.component';
import { EmployeeServiceComponent } from './components/employee-service/employee-service.component';
import { ReviewPopupComponent } from '../shared/components/user-interface/employee/services/review-popup/review-popup.component';
import { EmployeePackagesComponent } from './components/employee-packages/employee-packages.component';
import { EmployeeEditComponent } from './components/employee-edit/employee-edit.component';
import { EmployeeDetailsComponent } from '../shared/components/user-interface/employee/dashboard/employee-details/employee-details.component';
import { EmployeeEditDetailsComponent } from '../shared/components/user-interface/employee/employee-edit/employee-edit-details/employee-edit-details.component';
import { EmployeeProfessionalDetailsComponent } from '../shared/components/user-interface/employee/employee-edit/employee-professional-details/employee-professional-details.component';
import { AddBankDetailsComponent } from '../shared/components/user-interface/employee/employee-edit/add-bank-details/add-bank-details.component';
import { UserStepperComponent } from '../shared/components/user-interface/employee/employee-edit/user-stepper/user-stepper.component';
import { FormsModule } from '@angular/forms';
import { EmployeeAboutComponent } from '../shared/components/user-interface/employee/dashboard/employee-about/employee-about.component';
import { NgbRatingModule} from '@ng-bootstrap/ng-bootstrap'
import { EmployeeDashboardComponent } from './components/employee-dashboard/employee-dashboard.component';


export const routes: Routes = [

  {
    path: '',
    component: EmployeeComponent,
    children: [
      {
        path: 'Dashboard',
        component: EmployeeDashboardComponent,
      },
      {
        path: 'Referral',
        component: EmployeeReferralComponent
      },
      {
        path: 'Service',
        component: EmployeeServiceComponent
      },
      {
        path: 'Packages',
        component: EmployeePackagesComponent
      },
      {
        path: 'Edit-profile',
        component: EmployeeEditComponent
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
    EmployeePackagesComponent,
    EmployeeEditComponent,
    EmployeeEditDetailsComponent,
    EmployeeProfessionalDetailsComponent,
    AddBankDetailsComponent,
    
    
    
    
    
    
    
  ],
  imports: [
    CommonModule,
    CandidateModule,
    SharedModule,
    FormsModule,
    NgbRatingModule,
    
    
    RouterModule.forChild(routes),
  ]
})
export class EmployeeModule { }
