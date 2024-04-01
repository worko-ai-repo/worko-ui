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
  noReviewReceived:string = "No review received for this referral!!";

  ngOnChanges() {
      console.log(this.reviewData);
  }

  closePopup() {
    this.onSuccess.emit();
  }

}
