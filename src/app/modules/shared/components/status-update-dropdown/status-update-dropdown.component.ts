import { Component, Input, Output, EventEmitter } from '@angular/core';
import { WithdrawalStatus } from '../../enums/refer-and-earn.enums';

@Component({
  selector: 'app-status-update-dropdown',
  templateUrl: './status-update-dropdown.component.html',
  styleUrls: ['./status-update-dropdown.component.scss'],
})
export class StatusUpdateDropdownComponent {
  @Input() currentStatus!: string;
  @Input() allowedNextStatuses: string[] = [];
  @Input() transformStatus!: (status: string) => string;
  @Input() index!: number;

  @Output() statusSelected = new EventEmitter<string>();

  withdrawlStatuses = WithdrawalStatus;

  dropdownVisible = false;
  selectedStatus: string = '';
  isUpdateEnabled = false;

  toggleDropdown(): void {
    this.dropdownVisible = !this.dropdownVisible;
    if (!this.dropdownVisible) {
      this.selectedStatus = '';
      this.isUpdateEnabled = false;
    }
  }

  onStatusChange(): void {
    this.isUpdateEnabled = !!this.selectedStatus && this.selectedStatus !== this.currentStatus;
  }

  updateStatus(): void {
    this.statusSelected.emit(this.selectedStatus);
    this.toggleDropdown();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case this.withdrawlStatuses.NOT_ACHIEVED_YET:
        return 'detailed-analysis-btn disabled';

      // case this.withdrawlStatuses.ACHIEVED:
      // case this.withdrawlStatuses.WITHDRAWAL_REQUESTED:
      // case this.withdrawlStatuses.WITHDRAWAL_ACCEPTED:
      // case this.withdrawlStatuses.PAYMENT_COMPLETED:
      // case this.withdrawlStatuses.WITHDRAWAL_REJECTED:
      //   return 'detailed-analysis-btn status-light';

      case this.withdrawlStatuses.ACHIEVED:
        return 'detailed-analysis-btn status-light';
      default:
        return `job-${status.toLowerCase()}`; // Generic fallback class
    }
  }

}
