import { Component, EventEmitter, Output, Input, } from '@angular/core';

@Component({
  selector: 'app-referral-req-done',
  templateUrl: './referral-req-done.component.html',
  styleUrls: ['./referral-req-done.component.scss']
})
export class ReferralReqDoneComponent {

  @Input() userType: any;
  @Input() refereeDetails: any;
  @Input() reviewData: any;
  @Input() selectedStatus: any;
  @Input() selectedReferral: any;
  @Output() markAsDone = new EventEmitter<string>();
  @Output() raiseIssue = new EventEmitter<any>();
  @Output() referralRating = new EventEmitter<any>();
  @Input() processStatus: any;
  referralRatingFlag: any = null;
  showRaiseIssueButton: boolean = false;

  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges(): void {
   
    this.referralRatingFlag = null;
    if (this.processStatus) {
      this.checkRating();
    }

    if (this.selectedStatus === 'DONE') {
      this.calculateRaiseIssueButtonVisibility();
    }
  }

  checkRating() {
    let flag = false;
    this.reviewData.forEach((element: any) => {
      if (element.ratingForUserType === 'EMP') {
        flag = true;
      }
    });
    this.referralRatingFlag = flag;
  }

  calculateRaiseIssueButtonVisibility() {
    const doneDate = this.selectedReferral?.doneByCandidate ?? this.selectedReferral?.doneByEmployee;
    const fortyEightHoursInMillis = 48 * 60 * 60 * 1000; // 48 hours in milliseconds

    const currentTime = new Date().getTime();
    const difference = currentTime - new Date(doneDate).getTime();

    // If the time difference is less than 48 hours, show the button
    this.showRaiseIssueButton = difference < fortyEightHoursInMillis;
  }

  referralMarkAsDone() {
    this.markAsDone.emit(this.selectedReferral);
    // this.showReferralDetails.emit(item);
  }

  referralRaiseIssue(raiseIssueContent: any) {
    this.raiseIssue.emit({ selectedReferral: this.selectedReferral, raiseIssueContent: raiseIssueContent });
  }

  referralReviewRating(reviewRatingData: any) {
    this.referralRating.emit(reviewRatingData);
  }

}
