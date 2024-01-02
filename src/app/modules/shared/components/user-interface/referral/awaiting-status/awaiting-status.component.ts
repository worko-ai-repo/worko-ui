import { Component, EventEmitter, Output } from '@angular/core';
import { CandidateDropdownService } from 'src/app/modules/services/candidate-dropdown.service';

@Component({
  selector: 'app-awaiting-status',
  templateUrl: './awaiting-status.component.html',
  styleUrls: ['./awaiting-status.component.scss']
})
export class AwaitingStatusComponent {
  @Output() statusSelected = new EventEmitter<string>();
  selectedStatus: string = 'Awaiting';

  referralRequests = [
    { id: 1, title: 'Referral Request', number: '#6493', date:'Dec 1 2023' },
    { id: 2, title: 'Rejected Request', number: '#6494', date:'Dec 5 2023' },
    { id: 3, title: 'Referral Request', number: '#6495', date:'Dec 7 2023' },
    { id: 4, title: 'Referral Request', number: '#6496', date:'Dec 12 2023' },
    { id: 5, title: 'Cancelled Request', number: '#6497', date:'Dec 18 2023' },
    { id: 6, title: 'Rejected Request', number: '#6498', date:'Dec 20 2023' },
    { id: 7, title: 'Rejected Request', number: '#6499', date:'Dec 24 2023' }

  ];
  

  onSelectStatus(status: string): void {
    this.selectedStatus = status;
    this.statusSelected.emit(status);
  }
 

  

  
  
}
