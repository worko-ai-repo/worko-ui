import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-referral-see-review-popup',
  templateUrl: './referral-see-review-popup.component.html',
  styleUrls: ['./referral-see-review-popup.component.scss']
})
export class ReferralSeeReviewPopupComponent {

  @Output() onSuccess: EventEmitter<any> = new EventEmitter<any>();

  finalRating: number = 3;

  closePopup() {
    this.onSuccess.emit();
  }

}
