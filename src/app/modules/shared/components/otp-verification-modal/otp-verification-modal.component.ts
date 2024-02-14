
import { Component, Output,EventEmitter  } from '@angular/core';

@Component({
  selector: 'app-otp-verification-modal',
  templateUrl: './otp-verification-modal.component.html',
  styleUrls: ['./otp-verification-modal.component.scss']
})
export class OtpVerificationModalComponent {
  @Output() onSuccess: EventEmitter<void> = new EventEmitter<void>();

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
  submitPaymentCode(form:any){


  }
}
