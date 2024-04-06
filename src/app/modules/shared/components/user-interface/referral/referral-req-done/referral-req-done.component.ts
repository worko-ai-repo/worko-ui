import { Component, EventEmitter, Output, Input, } from '@angular/core';

@Component({
  selector: 'app-referral-req-done',
  templateUrl: './referral-req-done.component.html',
  styleUrls: ['./referral-req-done.component.scss']
})
export class ReferralReqDoneComponent {

  @Input() userType:any;
  @Input() refereeDetails:any;
  @Input() reviewData:any;
  @Input() selectedStatus: any;
  @Input() selectedReferral: any;
  @Output() markAsDone = new EventEmitter<string>();
  @Output() raiseIssue = new EventEmitter<any>();
  @Output() referralRating = new EventEmitter<any>();

 constructor() {}

 ngOnInit(): void {
   console.log(this.selectedReferral, "selectedReferral");
 }

 ngOnChanges(): void {
   console.log(this.selectedReferral, "selectedReferral");
 }

 referralMarkAsDone(){
   this.markAsDone.emit(this.selectedReferral);
   // this.showReferralDetails.emit(item);
 }

 referralRaiseIssue(raiseIssueContent:any) {
  this.raiseIssue.emit({selectedReferral: this.selectedReferral, raiseIssueContent:raiseIssueContent});
 }

 referralReviewRating(reviewRatingData:any) {
  this.referralRating.emit({selectedReferral:this.selectedReferral, reviewRatingData:reviewRatingData});
 }

}
