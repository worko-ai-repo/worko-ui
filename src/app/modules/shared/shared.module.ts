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
import { NgbRatingModule} from '@ng-bootstrap/ng-bootstrap'
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
import { RouterModule, Routes } from '@angular/router';
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
import { UserStepperComponent } from './components/user-interface/employee/employee-edit/user-stepper/user-stepper.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, NgModel } from '@angular/forms';
import { EditBankDetailsComponent } from './components/user-interface/employee/edit-bank-details/edit-bank-details.component';

import { PublicSidebarComponent } from './components/public-profile/public-sidebar/public-sidebar.component';
import { PublicServicePackagesComponent } from './components/public-profile/public-service-packages/public-service-packages.component';
import { PublicReviewsComponent } from './components/public-profile/public-reviews/public-reviews.component';
// import { SlickCarouselModule } from 'ngx-slick-carousel';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminChartComponent } from './components/Admin/Dashboard/admin-chart/admin-chart.component';
import { PaymentTrendComponent } from './components/Admin/Dashboard/payment-trend/payment-trend.component';
import { AdminTotalAmountComponent } from './components/Admin/Dashboard/admin-total-amount/admin-total-amount.component';
import { EmployeeAboutComponent } from './components/user-interface/employee/dashboard/employee-about/employee-about.component';
import { OtpVerificationModalComponent } from './components/otp-verification-modal/otp-verification-modal.component';
import { ReferralRatingPopupComponent } from './components/user-interface/referral/referral-rating-popup/referral-rating-popup.component';
import { ReferralRaiseIssuePopupComponent } from './components/user-interface/referral/referral-raise-issue-popup/referral-raise-issue-popup.component';
import { UserMenubarComponent } from './components/user-menubar/user-menubar.component';
import { ReferralSeeReviewPopupComponent } from './components/user-interface/referral/referral-see-review-popup/referral-see-review-popup.component';
import { ReferralRejectDetailsPopupComponent } from './components/user-interface/referral/referral-reject-details-popup/referral-reject-details-popup.component';
import { ReferralRejectedPopupComponent } from './components/user-interface/employee/referral/referral-rejected-popup/referral-rejected-popup.component';
import { RaiseIssueComponent } from './components/user-interface/referral/referral-reusable-button/raise-issue/raise-issue.component';
import { WithdrawReferralComponent } from './components/user-interface/referral/referral-reusable-button/withdraw-referral/withdraw-referral.component';
import { WithdrawReferralPopupComponent } from './components/user-interface/referral/withdraw-referral-popup/withdraw-referral-popup.component';
import { ProvideFeedbackComponent } from './components/user-interface/referral/referral-reusable-button/provide-feedback/provide-feedback.component';
import { WithdrawnReferralComponent } from './components/user-interface/candidate/withdrawn-referral/withdrawn-referral.component';
import { ConfirmationDialogPopupComponent } from './components/user-interface/referral/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { EmployeeReferralRejectComponent } from './components/user-interface/employee/referral/employee-referral-reject/employee-referral-reject.component';
import { EmployeeAcceptedReferralComponent } from './components/user-interface/employee/referral/employee-accepted-referral/employee-accepted-referral.component';
import { MarkAsDoneComponent } from './components/user-interface/referral/referral-reusable-button/mark-as-done/mark-as-done.component';
import { SeeReviewComponent } from './components/user-interface/referral/referral-reusable-button/see-review/see-review.component';
import { CircleChartComponent } from '../worko/components/circle-chart/circle-chart.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DetailedAnalysisComponent } from './components/user-interface/referral/detailed-analysis/detailed-analysis.component';
import { AddCompanyComponent } from '../worko/components/add-company/add-company.component';
import { PlansOrderPaymentModalComponent } from './components/plans-order-payment-modal/plans-order-payment-modal.component';
import { PaymentConfirmationModalComponent } from './components/payment-confirmation-modal/payment-confirmation-modal.component';
import { PgResponseComponent } from './components/user-interface/subscription/pg-response/pg-response.component';
import { ChatUIComponent } from './components/chat-ui/chat-ui.component';
import { AutosizeModule } from 'ngx-autosize';
import { MiniJobPortalTitleComponent } from './components/user-interface/mini-job-portal/mini-job-portal-title/mini-job-portal-title.component';
import { MiniJobPortalDescriptionComponent } from './components/user-interface/mini-job-portal/mini-job-portal-description/mini-job-portal-description.component';
import { MiniJobPortalAboutCompanyComponent } from './components/user-interface/mini-job-portal/mini-job-portal-about-company/mini-job-portal-about-company.component';
import { MiniJobPortalSkillsComponent } from './components/user-interface/mini-job-portal/mini-job-portal-skills/mini-job-portal-skills.component';
import { MiniJobPortalOtherjobComponent } from './components/user-interface/mini-job-portal/mini-job-portal-otherjob/mini-job-portal-otherjob.component';
import { MinJobPortalJobListingComponent } from './components/user-interface/mini-job-portal/min-job-portal-job-listing/min-job-portal-job-listing.component';
import { MinJobPortalReferralFormComponent } from './components/user-interface/mini-job-portal/min-job-portal-referral-form/min-job-portal-referral-form.component';
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
    UserStepperComponent,
    EditBankDetailsComponent,
    PublicSidebarComponent,
    PublicServicePackagesComponent,
    PublicReviewsComponent,
    AdminChartComponent,
    PaymentTrendComponent,
    AdminTotalAmountComponent,
    EmployeeAboutComponent,
    OtpVerificationModalComponent,
    ReferralRatingPopupComponent,
    ReferralRaiseIssuePopupComponent,
    UserMenubarComponent,
    ReferralSeeReviewPopupComponent,
    ReferralRejectDetailsPopupComponent,
    RaiseIssueComponent,
    MarkAsDoneComponent,
    WithdrawReferralPopupComponent,
    ConfirmationDialogPopupComponent,
    SeeReviewComponent,
    ProvideFeedbackComponent,
    CircleChartComponent,
    DetailedAnalysisComponent,
    AddCompanyComponent,
    PlansOrderPaymentModalComponent,
    PaymentConfirmationModalComponent,
    PgResponseComponent,
    ChatUIComponent,
    MiniJobPortalTitleComponent,
    MiniJobPortalDescriptionComponent,
    MiniJobPortalAboutCompanyComponent,
    MiniJobPortalSkillsComponent,
    MiniJobPortalOtherjobComponent,
    MinJobPortalJobListingComponent,
    MinJobPortalReferralFormComponent
    // DoneServiceComponent,
    // CancelledServiceComponent,
    // AwaitingServiceComponent,
  ],

  imports: [
    CommonModule,
    MatStepperModule,
    FormsModule,
    MatStepperModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    ReactiveFormsModule,
    // SlickCarouselModule,
    NgbRatingModule,
    RouterModule,
    MatProgressSpinnerModule,
    AutosizeModule,
    // BrowserAnimationsModule,
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
  UserStepperComponent,
  MatAutocompleteModule,
  ReactiveFormsModule,
  EditBankDetailsComponent,
  PublicSidebarComponent,
  PublicServicePackagesComponent,
  PublicReviewsComponent,
  AdminChartComponent,
  PaymentTrendComponent,
  AdminTotalAmountComponent,
  EmployeeAboutComponent,
  OtpVerificationModalComponent,
  ReferralRatingPopupComponent,
  ReferralRaiseIssuePopupComponent,
  UserMenubarComponent,
  ReferralSeeReviewPopupComponent,
  ReferralRejectDetailsPopupComponent,
  RaiseIssueComponent,
  MarkAsDoneComponent,
  WithdrawReferralPopupComponent,
  ConfirmationDialogPopupComponent,
  SeeReviewComponent,
  ProvideFeedbackComponent,
  CircleChartComponent,
  DetailedAnalysisComponent,
  AddCompanyComponent,
  PlansOrderPaymentModalComponent,
  PaymentConfirmationModalComponent,
  ChatUIComponent,
  MiniJobPortalTitleComponent,
  MiniJobPortalAboutCompanyComponent,
  MiniJobPortalDescriptionComponent,
  MiniJobPortalSkillsComponent,
  MiniJobPortalOtherjobComponent,
  MinJobPortalJobListingComponent,
  MinJobPortalReferralFormComponent
  ],

})
export class SharedModule { }
