import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-referral-raise-issue-popup',
  templateUrl: './referral-raise-issue-popup.component.html',
  styleUrls: ['./referral-raise-issue-popup.component.scss']
})
export class ReferralRaiseIssuePopupComponent {

  @Output() onSuccess: EventEmitter<any> = new EventEmitter<any>();
  @Input() userType:any;

  issueDescription = new FormControl();
  selectedOption: string;

  constructor() {
    this.selectedOption = "";
  }

  ngOnChanges() {
    console.log(this.userType);
  }

  raiseIssueSubmitBtn() {
    const issueData = {
      issueTitle: this.selectedOption,
      issueDescription: this.issueDescription.value
    };
    console.log(issueData); // we will send this reviewData to backend
    this.selectedOption = "";
    this.issueDescription.reset();
    this.onSuccess.emit(issueData);
  }

}
