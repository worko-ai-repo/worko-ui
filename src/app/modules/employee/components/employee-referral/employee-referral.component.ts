import { Component } from '@angular/core';

@Component({
  selector: 'app-employee-referral',
  templateUrl: './employee-referral.component.html',
  styleUrls: ['./employee-referral.component.scss']
})
export class EmployeeReferralComponent {
  selectedStatus: string = 'AWAITING';


  onStatusSelected(status: string): void {
    this.selectedStatus = status;
  }
}
