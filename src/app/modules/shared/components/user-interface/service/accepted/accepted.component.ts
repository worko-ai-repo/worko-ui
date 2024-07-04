import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-accepted',
  templateUrl: './accepted.component.html',
  styleUrls: ['./accepted.component.scss']
})
export class AcceptedComponent {
  @Input() selectedService: any;
  @Output() markAsDone = new EventEmitter<string>();
  userType:any;


  ngOnChanges(): void {
  }

  serviceMarkAsDone(){
    this.markAsDone.emit(this.selectedService);
    // this.showReferralDetails.emit(item);
  }

  referralRaiseIssue(data:any) {

  }

  referralReviewRating(data:any) {

  }

  cancelReviewRatingPopup() {

  }
}
