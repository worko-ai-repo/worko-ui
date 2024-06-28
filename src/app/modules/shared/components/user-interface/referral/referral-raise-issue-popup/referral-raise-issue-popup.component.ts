import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-referral-raise-issue-popup',
  templateUrl: './referral-raise-issue-popup.component.html',
  styleUrls: ['./referral-raise-issue-popup.component.scss']
})
export class ReferralRaiseIssuePopupComponent {

  @Output() onSuccess: EventEmitter<any> = new EventEmitter<any>();
  @Input() userType: any;

  selectedOption: FormControl = new FormControl('', Validators.required);
  issueDescription: FormControl = new FormControl('', Validators.required);

  constructor() {
  }

  ngOnChanges() {
   
  }

  raiseIssueSubmitBtn() {

    if (this.selectedOption.valid && this.issueDescription.valid) {
      const issueData = {
        issueTitle: this.selectedOption.value,
        issueDescription: this.issueDescription.value
      };

     
      this.selectedOption.setValue('');
      this.issueDescription.reset();
      this.onSuccess.emit(issueData);
    }

  }

}
