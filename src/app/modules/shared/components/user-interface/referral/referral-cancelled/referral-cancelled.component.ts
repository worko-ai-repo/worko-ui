import { Component, Input, } from '@angular/core';

@Component({
  selector: 'app-referral-cancelled',
  templateUrl: './referral-cancelled.component.html',
  styleUrls: ['./referral-cancelled.component.scss']
})
export class ReferralCancelledComponent {

  @Input() selectedReferral: any;

  ngOnInit(): void {
    console.log(this.selectedReferral, "selectedReferral");
  }
 
  ngOnChanges(): void {
    console.log(this.selectedReferral, "selectedReferral");
  }

}
