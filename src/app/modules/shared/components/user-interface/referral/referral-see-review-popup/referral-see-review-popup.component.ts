import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-referral-see-review-popup',
  templateUrl: './referral-see-review-popup.component.html',
  styleUrls: ['./referral-see-review-popup.component.scss']
})
export class ReferralSeeReviewPopupComponent implements OnChanges {

  @Output() onSuccess: EventEmitter<any> = new EventEmitter<any>();
  @Input() reviewData:any;

  finalRating: number = 0;
  reviewText:any;

  ngOnChanges() {
    if(this.reviewData?.length > 0)
    {
      console.log(this.reviewData);
      this.finalRating = this.reviewData[0].rating;
      this.reviewText = this.reviewData[0].reviewText;
    }
  }



  closePopup() {
    this.onSuccess.emit();
  }

}
