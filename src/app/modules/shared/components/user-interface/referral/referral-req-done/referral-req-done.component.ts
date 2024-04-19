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
  @Input() processStatus:any;
  referralRatingFlag:any = null;

  constructor() { }

  ngOnInit(): void {
    console.log(this.selectedReferral, "selectedReferral");
  }

  ngOnChanges(): void {
    console.log(this.selectedReferral, "selectedReferral");
    this.referralRatingFlag = null;
    if (this.processStatus) {
      this.checkRating();
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

  referralMarkAsDone() {
    this.markAsDone.emit(this.selectedReferral);
    // this.showReferralDetails.emit(item);
  }

  referralRaiseIssue(raiseIssueContent: any) {
    this.raiseIssue.emit({ selectedReferral: this.selectedReferral, raiseIssueContent: raiseIssueContent });
  }

  referralReviewRating(reviewRatingData: any) {
    this.referralRating.emit({ selectedReferral: this.selectedReferral, reviewRatingData: reviewRatingData });
  }

}
