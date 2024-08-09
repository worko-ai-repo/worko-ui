import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-referral-reject-details-popup',
  templateUrl: './referral-reject-details-popup.component.html',
  styleUrls: ['./referral-reject-details-popup.component.scss']
})
export class ReferralRejectDetailsPopupComponent {
  
  @Input() userType:any;
  @Output() onSuccess: EventEmitter<any> = new EventEmitter<any>();
  @Input() rejectReasonsData:any;

  closePopup() {
    this.onSuccess.emit();
  }

}
