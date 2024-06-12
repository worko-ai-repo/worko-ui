import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-referral-rejected-popup',
  templateUrl: './referral-rejected-popup.component.html',
  styleUrls: ['./referral-rejected-popup.component.scss']
})
export class ReferralRejectedPopupComponent {

  @Output() onSuccess: EventEmitter<any> = new EventEmitter<any>();
  @Input() userType: any;
  selectedOption: string;

  constructor() {
    this.selectedOption = '';
  }

  reasonControl: FormControl = new FormControl('', Validators.required);
  comments: FormControl = new FormControl('', Validators.required);

  ngOnChanges() {
    console.log(this.userType);
  }

  rejectSubmitBtn() {
    if (this.reasonControl.valid && this.comments.valid) {
      const rejectReasons = {
        rejectTitle: this.reasonControl.value,
        rejectComments: this.comments.value
      };
      console.log(rejectReasons);
      this.reasonControl.setValue('');
      this.comments.reset();
      this.onSuccess.emit(rejectReasons);
    }
  }

}
