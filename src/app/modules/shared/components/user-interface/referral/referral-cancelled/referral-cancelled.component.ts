import { Component, Input, } from '@angular/core';

@Component({
  selector: 'app-referral-cancelled',
  templateUrl: './referral-cancelled.component.html',
  styleUrls: ['./referral-cancelled.component.scss']
})
export class ReferralCancelledComponent {

  @Input() selectedReferral: any;
  @Input() userType:any;
  @Input() empdetailsList:any;

  ngOnInit(): void {
    console.log(this.selectedReferral, "selectedReferral");
  }
 
  ngOnChanges(): void {
    console.log(this.selectedReferral, "selectedReferral");
  }

  showMore() {

  }

  openfile(data:any) {

  }

  leaveComment() {
    
  }

}
