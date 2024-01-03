import { Component } from '@angular/core';
import { CandidateDropdownService } from 'src/app/modules/services/candidate-dropdown.service';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.scss']
})
export class ReferralComponent {

  selectedStatus: string = 'Awaiting';

  onStatusSelected(status: string): void {
    this.selectedStatus = status;
  }
  
}
