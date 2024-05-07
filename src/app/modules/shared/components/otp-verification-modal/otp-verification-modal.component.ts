
import { Component, Output,EventEmitter, Input  } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CandidateProfileService } from 'src/app/modules/candidate/services/candidate-profile.service';

@Component({
  selector: 'app-otp-verification-modal',
  templateUrl: './otp-verification-modal.component.html',
  styleUrls: ['./otp-verification-modal.component.scss']
})
export class OtpVerificationModalComponent {
  @Output() onSuccess: EventEmitter<void> = new EventEmitter<void>();
  @Input() email: any | undefined;
  @Input() id: any | undefined;
  constructor(private candidateProfileService :CandidateProfileService, private spinner: NgxSpinnerService) {}

  invalidCode: boolean = false;
  form = {
    paymentCode: ""
  }
  displayPaymentCode: boolean = true;
  onKeyUp(event: any) {
    this.invalidCode = false;
  }

  cancel(form: any) {
    this.form.paymentCode = '';
    this.invalidCode = false;
    form.value.paymentCode = "";
    this.onSuccess.emit();
    // this.modal.cancel();
  }
  async submitPaymentCode(form:any){
    this.spinner.show();
    console.log(this.email,this.id)
    try{
 let response=  await this.candidateProfileService.verifyOtp(this.email,this.id,this.form.paymentCode)
 console.log(response)
 if(response.verificationStatus===true){
  this.spinner.hide();
  this.cancel(form);
 }else{
  this.spinner.hide();
  this.invalidCode=true
 }

    }catch(error){
  this.spinner.hide();
     
      this.invalidCode=true
    }

      
    

  }
}
