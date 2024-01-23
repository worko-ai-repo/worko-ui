import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ModalComponent } from './components/modal/modal.component';
import { AwaitingStatusComponent } from './components/user-interface/referral/awaiting-status/awaiting-status.component';
import { ReferralStepperComponent } from './components/user-interface/referral/referral-stepper/referral-stepper.component';
import {MatStep, MatStepperModule} from '@angular/material/stepper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReferralCancelledComponent } from './components/user-interface/referral/referral-cancelled/referral-cancelled.component';
import { ReferralReqRejectedComponent } from './components/user-interface/referral/referral-req-rejected/referral-req-rejected.component';
import { AllServicesComponent } from './components/user-interface/service/all-services/all-services.component';
import { PaymentDueComponent } from './components/user-interface/service/payment-due/payment-due.component';
import { PaymentMethodComponent } from './components/user-interface/service/payment-method/payment-method.component';
import { AcceptedComponent } from './components/user-interface/service/accepted/accepted.component';
import { PaymentFailedComponent } from './components/user-interface/service/payment-failed/payment-failed.component';
import { ServiceRejectedComponent } from './components/user-interface/service/service-rejected/service-rejected.component';
import { PackageComponent } from './components/user-interface/subscription/package/package.component';
import { InviteFriendsComponent } from './components/refer&earn/invite-friends/invite-friends.component';
import { SubscriptionPlanComponent } from './components/user-interface/subscription/subscription-plan/subscription-plan.component';
import { PersonalInformationComponent } from './components/user-interface/edit-profile/personal-information/personal-information.component';
import { PersonalDetailsComponent } from './components/user-interface/edit-profile/personal-details/personal-details.component';
import { UploadComponent } from './components/user-interface/edit-profile/upload/upload.component';
import { Routes } from '@angular/router';
import { AcceptedReferralComponent } from './components/user-interface/candidate/accepted-referral/accepted-referral.component';
import { JobHistoryComponent } from './components/user-interface/employee/dashboard/job-history/job-history.component';
import { ServicePackageComponent } from './components/user-interface/employee/dashboard/service-package/service-package.component';
import { BankDetailsComponent } from './components/user-interface/employee/dashboard/bank-details/bank-details.component';
import { EmployeeDetailsComponent } from './components/user-interface/employee/dashboard/employee-details/employee-details.component';
import { EmployeeReferralDetailsComponent } from './components/user-interface/employee/referral/employee-referral-details/employee-referral-details.component';
import { ReferralDoneComponent } from './components/user-interface/employee/referral/referral-done/referral-done.component';
import { RequestAwaitingComponent } from './components/user-interface/employee/services/request-awaiting/request-awaiting.component';
import { ReviewPopupComponent } from './components/user-interface/employee/services/review-popup/review-popup.component';
import { SelectServiceComponent } from './components/user-interface/employee/services/select-service/select-service.component';
import { ServiceRejectComponent } from './components/user-interface/employee/services/service-reject/service-reject.component';
import { ServiceAddHeaderComponent } from './components/user-interface/employee/packages/service-add-header/service-add-header.component';
import { ServicesMenuComponent } from './components/user-interface/employee/packages/services-menu/services-menu.component';
import { CareerGuidanceDetailsComponent } from './components/user-interface/employee/packages/career-guidance-details/career-guidance-details.component';
import { ShowCareerGuidanceDetailsComponent } from './components/user-interface/employee/packages/show-career-guidance-details/show-career-guidance-details.component';
import { DoneCareerGuidanceComponent } from './components/user-interface/employee/packages/done-career-guidance/done-career-guidance.component';
import { TotalEarningComponent } from './components/user-interface/employee/packages/total-earning/total-earning.component';
import { PackageFormComponent } from './components/user-interface/employee/packages/package-form/package-form.component';
import { EmployeeProfessionalDetailsComponent } from './components/user-interface/employee/employee-edit/employee-professional-details/employee-professional-details.component';
import { AddBankDetailsComponent } from './components/user-interface/employee/employee-edit/add-bank-details/add-bank-details.component';
import { AwaitingServiceComponent } from './components/user-interface/service/awaiting-service/awaiting-service.component';
import { CancelledServiceComponent } from './components/user-interface/service/cancelled-service/cancelled-service.component';
import { DoneServiceComponent } from './components/user-interface/service/done-service/done-service.component';



export const routes: Routes = [

  
]
@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ModalComponent,
    ReferralDoneComponent,
    RequestAwaitingComponent,
    ReviewPopupComponent,
    SelectServiceComponent,
    ServiceRejectComponent,
    ServiceAddHeaderComponent,
    ServicesMenuComponent,
    CareerGuidanceDetailsComponent,
    ShowCareerGuidanceDetailsComponent,
    DoneCareerGuidanceComponent,
    TotalEarningComponent,
    PackageFormComponent,
    // DoneServiceComponent,
    // CancelledServiceComponent,
    // AwaitingServiceComponent,
    
    
    

    
    
    
    
  ],

  imports: [
    CommonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    
    
    
  ],

  exports: [
  ModalComponent,
  // AwaitingStatusComponent,
  ReferralDoneComponent,
  RequestAwaitingComponent,
  ReviewPopupComponent,
  SelectServiceComponent,
  ServiceRejectComponent,
  ServiceAddHeaderComponent,
  ServicesMenuComponent,
  CareerGuidanceDetailsComponent,
  ShowCareerGuidanceDetailsComponent,
  DoneCareerGuidanceComponent,
  TotalEarningComponent,
  PackageFormComponent,
  ],

})
export class SharedModule { }
