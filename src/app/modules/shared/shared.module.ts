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
import { ReferEarnStatusComponent } from './components/refer&earn/refer-earn-status/refer-earn-status.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ModalComponent,
    
    
    
    
    
    
    
    
    
  ],
  imports: [
    CommonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    
    
  ],
  exports: [
  ModalComponent
  ],
})
export class SharedModule { }
