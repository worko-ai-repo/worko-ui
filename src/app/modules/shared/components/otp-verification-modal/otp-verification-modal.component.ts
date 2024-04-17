
import { Component, Output,EventEmitter, Input  } from '@angular/core';
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
  constructor(private candidateProfileService :CandidateProfileService) {}

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
    console.log(this.email,this.id)
    try{
 let response=  await this.candidateProfileService.verifyOtp(this.email,this.id,this.form.paymentCode)
 console.log(response)
 if(response.verificationStatus===true){
  this.cancel(form);
 }else{
  this.invalidCode=true
 }

    }catch(error){
     
      this.invalidCode=true
    }

      
    

  }
}
