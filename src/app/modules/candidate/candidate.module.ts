import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateDashboardComponent } from './components/candidate-dashboard/candidate-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { CandidateComponent } from './candidate.component';
import { candidateGuard } from './guards/candidate.guard';
import { UserNavbarComponent } from './components/user-navbar/user-navbar.component';
import { UserMenubarComponent } from './components/user-menubar/user-menubar.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UserProfileCompleteComponent } from './components/user-profile-complete/user-profile-complete.component';
import { UserSoftSkillsComponent } from './components/user-soft-skills/user-soft-skills.component';
import { UserAboutComponent } from './components/user-about/user-about.component';
import { UserSkillsComponent } from './components/user-skills/user-skills.component';
import { ReferralComponent } from './components/referral/referral.component'; 
import { AwaitingStatusComponent } from '../shared/components/user-interface/referral/awaiting-status/awaiting-status.component';
import { ReferralStepperComponent } from '../shared/components/user-interface/referral/referral-stepper/referral-stepper.component';
import { NewRequestComponent } from '../shared/components/user-interface/referral/new-request/new-request.component';
import { ReferralCancelledComponent } from '../shared/components/user-interface/referral/referral-cancelled/referral-cancelled.component';
import { ReferralReqRejectedComponent } from '../shared/components/user-interface/referral/referral-req-rejected/referral-req-rejected.component';
import { ServiceComponent } from './components/service/service.component';
import { AllServicesComponent } from '../shared/components/user-interface/service/all-services/all-services.component';
import { PaymentDueComponent } from '../shared/components/user-interface/service/payment-due/payment-due.component';




export const routes: Routes = [

  {
    path: '',
    component: CandidateComponent,
    children: [
      {
        path: 'candidate-dashboard',
        component: CandidateDashboardComponent,
        canActivate: [ candidateGuard]
      },
      {
        path: 'candidate-referral',
        component: ReferralComponent,
       
      },
      {
        path: 'candidate-service',
        component: ServiceComponent,
       
      },
      
      
      
      
      
      
      
      
    ]
  }  
]

@NgModule({
  declarations: [
   CandidateDashboardComponent,
  CandidateComponent,
  UserNavbarComponent,
  UserMenubarComponent,
  UserDetailsComponent,
  UserProfileCompleteComponent,
  UserSoftSkillsComponent,
  UserAboutComponent,
  UserSkillsComponent,
  ReferralComponent,
  AwaitingStatusComponent,
  ReferralStepperComponent,
  NewRequestComponent,
  ReferralCancelledComponent,
  ReferralReqRejectedComponent,
  ServiceComponent,
  AllServicesComponent,
  PaymentDueComponent,
  
    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class CandidateModule { }
