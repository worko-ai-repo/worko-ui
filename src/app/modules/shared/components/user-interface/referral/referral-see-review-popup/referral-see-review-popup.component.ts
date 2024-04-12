import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-referral-see-review-popup',
  templateUrl: './referral-see-review-popup.component.html',
  styleUrls: ['./referral-see-review-popup.component.scss']
})
export class ReferralSeeReviewPopupComponent implements OnChanges {

  @Input() userType:any;
  @Output() onSuccess: EventEmitter<any> = new EventEmitter<any>();
  @Input() reviewData: any;

  finalRating: number = 0;
  noReviewReceived: string = "No review received for this referral!!";

  ratingForCand = null;
  reviewTextForCand = null;

  ratingForEmp = null;
  reviewTextForEmp = null;

  ngOnChanges() {
    console.log(this.reviewData);
    if (this.reviewData?.length > 0) {
      this.assignReview();
    }
  }

  assignReview() {
    this.reviewData.forEach((element:any) => {
      if (element.ratingForUserType === "CAND") {
        this.ratingForCand = element.rating;
        this.reviewTextForCand = element.reviewText;
      }
      // else {
      //   this.ratingForCand = null;
      //   this.reviewTextForCand = null;
      // }

      if (element.ratingForUserType === "EMP") {
        this.ratingForEmp = element.rating;
        this.reviewTextForEmp = element.reviewText;
      }
      // else {
      //   this.ratingForEmp = null;
      //   this.reviewTextForEmp = null;
      // }

    });

  }

  closePopup() {
    this.onSuccess.emit();
  }

}
