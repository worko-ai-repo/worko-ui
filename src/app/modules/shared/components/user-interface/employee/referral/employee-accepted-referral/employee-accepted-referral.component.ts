import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-employee-accepted-referral',
  templateUrl: './employee-accepted-referral.component.html',
  styleUrls: ['./employee-accepted-referral.component.scss']
})
export class EmployeeAcceptedReferralComponent {
  @Input() userType: any;
  @Input() selectedReferral: any;
  @Input() refereeDetails: any;
  @Output() markAsDone = new EventEmitter<any>();
  @Output() referralRating = new EventEmitter<any>();
  @Output() raiseIssue = new EventEmitter<any>();
  @Output() cancelRatingPopup = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
    console.log(this.selectedReferral, "selectedReferral");
  }

  ngOnChanges(): void {
    console.log(this.selectedReferral, "selectedReferral");
  }

  referralMarkAsDone() {
    this.markAsDone.emit(this.selectedReferral);
    // this.showReferralDetails.emit(item);
  }

  referralReviewRating(reviewRatingData: any) {
    this.referralRating.emit({ selectedReferral: this.selectedReferral, reviewRatingData: reviewRatingData });
  }

  cancelReviewRatingPopup() {
    this.cancelRatingPopup.emit();
  }

  referralRaiseIssue(data: any) {
    this.raiseIssue.emit(data);
  }

}
