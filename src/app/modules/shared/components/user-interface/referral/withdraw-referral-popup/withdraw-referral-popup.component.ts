import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-withdraw-referral-popup',
  templateUrl: './withdraw-referral-popup.component.html',
  styleUrls: ['./withdraw-referral-popup.component.scss']
})
export class WithdrawReferralPopupComponent {

  @Output() onSuccess: EventEmitter<any> = new EventEmitter<any>();
  @Input() userType: any;

  reasonControl: FormControl = new FormControl('', Validators.required);

  constructor() { }

  comments = new FormControl('');

  ngOnChanges() {
    console.log(this.userType);
  }


  withdrawSubmitBtn() {

    if (this.reasonControl.valid) {
      const withdrawDetails = {
        withdrawReason: this.reasonControl.value,
        withdrawComments: this.comments.value
      };

      console.log(withdrawDetails);
      this.onSuccess.emit(withdrawDetails);
      this.reasonControl.setValue('');
      this.comments.reset();
    }
  }

}
