import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-referral-reject-details-popup',
  templateUrl: './referral-reject-details-popup.component.html',
  styleUrls: ['./referral-reject-details-popup.component.scss']
})
export class ReferralRejectDetailsPopupComponent {

  @Output() onSuccess: EventEmitter<any> = new EventEmitter<any>();

  closePopup() {
    this.onSuccess.emit();
  }

}
