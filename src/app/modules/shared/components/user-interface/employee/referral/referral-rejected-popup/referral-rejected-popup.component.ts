import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

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

  comments = new FormControl();

  ngOnChanges() {
    console.log(this.userType);
  }

  rejectSubmitBtn() {
    const rejectReasons = {
      rejectTitle: this.selectedOption,
      rejectComments: this.comments.value
    };
    console.log(rejectReasons);
    this.selectedOption = '';
    this.comments.reset();
    this.onSuccess.emit(rejectReasons);
  }

}
