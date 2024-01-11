import { Component } from '@angular/core';

@Component({
  selector: 'app-employee-referral-details',
  templateUrl: './employee-referral-details.component.html',
  styleUrls: ['./employee-referral-details.component.scss']
})
export class EmployeeReferralDetailsComponent {

  showCard: boolean = false;

  selectedStatus!: string; 

    // ...

    onStatusSelected(status: string): void {
        this.selectedStatus = status;
    }

    onAccept(): void {
        // Handle the accept logic
        console.log('Accepted');
    }

    onReject(): void {
      this.showCard = !this.showCard;
    }

    onLeave(): void {
        // Handle the leave logic
        console.log('Leave');
    }

}
