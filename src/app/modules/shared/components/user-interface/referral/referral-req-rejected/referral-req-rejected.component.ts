import { Component, EventEmitter, Output, Input,  } from '@angular/core';

@Component({
  selector: 'app-referral-req-rejected',
  templateUrl: './referral-req-rejected.component.html',
  styleUrls: ['./referral-req-rejected.component.scss']
})
export class ReferralReqRejectedComponent {

  @Input() selectedReferral: any;
  @Output() markAsDone = new EventEmitter<string>();
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
}