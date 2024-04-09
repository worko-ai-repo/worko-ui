import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateDashboardComponent } from './components/candidate-dashboard/candidate-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { CandidateComponent } from './candidate.component';
import { candidateGuard } from './guards/candidate.guard';
import { UserNavbarComponent } from './components/user-navbar/user-navbar.component';

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
import { PaymentMethodComponent } from '../shared/components/user-interface/service/payment-method/payment-method.component';
import { AcceptedComponent } from '../shared/components/user-interface/service/accepted/accepted.component';
import { PaymentFailedComponent } from '../shared/components/user-interface/service/payment-failed/payment-failed.component';
import { ServiceRejectedComponent } from '../shared/components/user-interface/service/service-rejected/service-rejected.component';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { PackageComponent } from '../shared/components/user-interface/subscription/package/package.component';
import { ReferEarnComponent } from './components/refer-earn/refer-earn.component';
import { InviteFriendsComponent } from '../shared/components/refer&earn/invite-friends/invite-friends.component';
import { SubscriptionPlanComponent } from '../shared/components/user-interface/subscription/subscription-plan/subscription-plan.component';
import { ReferEarnStatusComponent } from '../shared/components/refer&earn/refer-earn-status/refer-earn-status.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { PersonalInformationComponent } from '../shared/components/user-interface/edit-profile/personal-information/personal-information.component';
import { PersonalDetailsComponent } from '../shared/components/user-interface/edit-profile/personal-details/personal-details.component';
import { UploadComponent } from '../shared/components/user-interface/edit-profile/upload/upload.component';
 import { AcceptedReferralComponent } from '../shared/components/user-interface/candidate/accepted-referral/accepted-referral.component';
 import { FormControl, NgModel} from '@angular/forms';
 import { FormsModule } from '@angular/forms';
import { EmployeeModule } from '../employee/employee.module';
import { ReferralDoneComponent } from '../shared/components/user-interface/employee/referral/referral-done/referral-done.component';
import { AwaitingServiceComponent } from '../shared/components/user-interface/service/awaiting-service/awaiting-service.component';
import { CancelledServiceComponent } from '../shared/components/user-interface/service/cancelled-service/cancelled-service.component';
import { DoneServiceComponent } from '../shared/components/user-interface/service/done-service/done-service.component';
import { UserStepperComponent } from '../shared/components/user-interface/employee/employee-edit/user-stepper/user-stepper.component';
import { SharedModule } from '../shared/shared.module';
import { NavbarToggleSwitchService } from './services/navbar-toggle-switch.service';
import { AdminModule } from '../admin/admin.module';
import { ReferralReqDoneComponent } from '../shared/components/user-interface/referral/referral-req-done/referral-req-done.component';
import { MarkAsDoneComponent } from '../shared/components/user-interface/referral/referral-reusable-button/mark-as-done/mark-as-done.component';
import { RaiseIssueComponent } from '../shared/components/user-interface/referral/referral-reusable-button/raise-issue/raise-issue.component';
import { NewRequestBtnComponent } from '../shared/components/user-interface/referral/referral-reusable-button/new-request-btn/new-request-btn.component';
import { SeeReviewComponent } from '../shared/components/user-interface/referral/referral-reusable-button/see-review/see-review.component';
import { WithdrawReferralComponent } from '../shared/components/user-interface/referral/referral-reusable-button/withdraw-referral/withdraw-referral.component';
import { ProvideFeedbackComponent } from '../shared/components/user-interface/referral/referral-reusable-button/provide-feedback/provide-feedback.component';
import { WithdrawnReferralComponent } from '../shared/components/user-interface/candidate/withdrawn-referral/withdrawn-referral.component';



export const routes: Routes = [

  {
    path: '',
    component: CandidateComponent,
    children: [
      {
        path: 'dashboard',
        component: CandidateDashboardComponent,
        // canActivate: [ candidateGuard]
      },
      {
        path: 'referral',
        component: ReferralComponent,
       
      },
      {
        path: 'service',
        component: ServiceComponent,
       
      },
      {
        path: 'subscription',
        component: SubscriptionComponent,
       
      },
      {
        path: 'refer&earn',
        component: ReferEarnComponent,
       
      },
      {
        path: 'edit-profile',
        component: EditProfileComponent,
       
      },
      
      
      
      
      
      
      
    ]
  }  
]

@NgModule({
  
  declarations: [
   CandidateDashboardComponent,
  CandidateComponent,
  UserNavbarComponent,
 
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
  ReferralReqDoneComponent,
  ServiceComponent,
  AllServicesComponent,
  PaymentDueComponent,
  PaymentMethodComponent,
  AcceptedComponent,
  PaymentFailedComponent,
  ServiceRejectedComponent,
  SubscriptionComponent,
  PackageComponent,
  ReferEarnComponent,
  InviteFriendsComponent,
  SubscriptionPlanComponent,
  ReferEarnStatusComponent,
  EditProfileComponent,
  PersonalInformationComponent,
  PersonalDetailsComponent,
  UploadComponent,
   AcceptedReferralComponent,
   WithdrawnReferralComponent,
   MarkAsDoneComponent,
   NewRequestBtnComponent,
   SeeReviewComponent,
   ProvideFeedbackComponent,
   WithdrawReferralComponent,
   ReferralStepperComponent,
   AwaitingServiceComponent,
   CancelledServiceComponent,
   DoneServiceComponent,
   
   
   
  ],
  imports: [
  CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild(routes)
    
    

  ],
  exports: [
    UserNavbarComponent,
    UserDetailsComponent,
    UserProfileCompleteComponent,
    AwaitingStatusComponent,
    ReferralStepperComponent,
    ReferralCancelledComponent,
    AllServicesComponent,
    
    
    

  ]
})
export class CandidateModule { }
