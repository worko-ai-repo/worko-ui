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
import { ReferralRejectedPopupComponent } from '../shared/components/user-interface/employee/referral/referral-rejected-popup/referral-rejected-popup.component';
import { EmployeeReferralRejectComponent } from '../shared/components/user-interface/employee/referral/employee-referral-reject/employee-referral-reject.component';
import { EmployeeAcceptedReferralComponent } from '../shared/components/user-interface/employee/referral/employee-accepted-referral/employee-accepted-referral.component';
import { AuthRouteGuardService } from '../worko/services/auth-route-guard.service';
import { EmployeeReferEarnComponent } from './components/employee-refer-earn/employee-refer-earn.component';
import { MatTooltipModule } from '@angular/material/tooltip';




export const routes: Routes = [

  {
    path: '',
    component: EmployeeComponent,
    children: [
      {
        path: 'Dashboard',
        component: EmployeeDashboardComponent,canActivate:[AuthRouteGuardService]
      },
      {
        path: 'Referral',
        canActivate:[AuthRouteGuardService],
        children: [
          {
            path: '',
            redirectTo: 'awaiting', // Redirect to "awaiting" by default
            pathMatch: 'full'
          },
          {
            path: ':status', // Handle dynamic statuses
            component: EmployeeReferralComponent,
            canActivate: [AuthRouteGuardService]
          }
        ]
      },
      {
        path: 'Service',
        component: EmployeeServiceComponent,canActivate:[AuthRouteGuardService]
      },
      {
        path: 'Packages',
        component: EmployeePackagesComponent,canActivate:[AuthRouteGuardService]
      },
      {
        path: 'Edit-profile',
        component: EmployeeEditComponent,canActivate:[AuthRouteGuardService]
      },

      {
        path: 'Refer&earn',
        component: EmployeeReferEarnComponent, canActivate:[AuthRouteGuardService]
      }
      
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
    EmployeeReferralRejectComponent,
    EmployeeAcceptedReferralComponent,
    EmployeeServiceComponent,
    EmployeePackagesComponent,
    EmployeeEditComponent,
    EmployeeEditDetailsComponent,
    EmployeeProfessionalDetailsComponent,
    AddBankDetailsComponent,
    EmployeeReferEarnComponent,
    // ReferralRejectedPopupComponent
    
    
    
    
    
    
    
  ],
  imports: [
    CommonModule,
    CandidateModule,
    SharedModule,
    FormsModule,
    NgbRatingModule,
    MatTooltipModule,
    
    
    RouterModule.forChild(routes),
  ]
})
export class EmployeeModule { }
