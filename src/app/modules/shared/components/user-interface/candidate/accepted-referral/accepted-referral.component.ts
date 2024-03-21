import { Component, EventEmitter, Output, Input,  } from '@angular/core';
@Component({
  selector: 'app-accepted-referral',
  templateUrl: './accepted-referral.component.html',
  styleUrls: ['./accepted-referral.component.scss']
})
export class AcceptedReferralComponent {
  @Input() userType:any;
  @Input() selectedReferral: any;
  @Output() markAsDone = new EventEmitter<string>();
  @Output() raiseIssue = new EventEmitter<any>();
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
}
