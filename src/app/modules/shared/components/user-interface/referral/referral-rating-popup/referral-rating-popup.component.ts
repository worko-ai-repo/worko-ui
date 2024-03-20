import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-referral-rating-popup',
  templateUrl: './referral-rating-popup.component.html',
  styleUrls: ['./referral-rating-popup.component.scss']
})
export class ReferralRatingPopupComponent implements OnChanges {
  @Output() onSuccess: EventEmitter<void> = new EventEmitter<void>();
  @Input() userType:any;

  ratingControl = new FormControl();
  reviewControl = new FormControl();

  getRating() {
    console.log(this.ratingControl.value);
  }

  ngOnChanges() {
    console.log(this.userType);
  }

  submitReview() {
    const reviewData = {
      rating: this.ratingControl.value,
      review: this.reviewControl.value
    };
    console.log(reviewData); // we will send this reviewData to backend
    this.ratingControl.reset();
    this.reviewControl.reset();
    this.onSuccess.emit(this.userType);
  }

}
