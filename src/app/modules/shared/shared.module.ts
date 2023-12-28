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
