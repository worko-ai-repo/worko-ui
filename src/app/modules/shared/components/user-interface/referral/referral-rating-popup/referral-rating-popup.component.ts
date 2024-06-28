import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-referral-rating-popup',
  templateUrl: './referral-rating-popup.component.html',
  styleUrls: ['./referral-rating-popup.component.scss']
})
export class ReferralRatingPopupComponent implements OnChanges {
  @Output() onSuccess: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
  @Input() userType:any;

  ratingControl = new FormControl();
  reviewControl = new FormControl();

  getRating() {
   
  }

  ngOnChanges() {
   
  }

  submitReviewRating() {
    const reviewRatingData = {
      rating: this.ratingControl.value,
      review: this.reviewControl.value
    };
   
    this.ratingControl.reset();
    this.reviewControl.reset();
    this.onSuccess.emit(reviewRatingData);
  }

  cancelBtn() {
    this.onCancel.emit();
  }

}
