import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-referral-reject-details-popup',
  templateUrl: './referral-reject-details-popup.component.html',
  styleUrls: ['./referral-reject-details-popup.component.scss']
})
export class ReferralRejectDetailsPopupComponent {

  @Input() userType: any;
  @Output() onSuccess: EventEmitter<any> = new EventEmitter<any>();
  @Input() rejectReasonsData: any;

  closePopup() {
    this.onSuccess.emit();
  }

  getUserComment(data: any): string | null {
    if (Array.isArray(data) && data.length > 0) {
      return data[0]?.userComment || null;
    } else if (data && typeof data === 'object') {
      return data.userComment || null;
    }
    return null; // Return null if data is neither an object nor a non-empty array
  }


}
