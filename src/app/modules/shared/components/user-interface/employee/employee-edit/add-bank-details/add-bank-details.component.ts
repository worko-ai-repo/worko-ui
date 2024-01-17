import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-add-bank-details',
  templateUrl: './add-bank-details.component.html',
  styleUrls: ['./add-bank-details.component.scss']
})
export class AddBankDetailsComponent {
  @Output() previousStep = new EventEmitter<void>();


  onPreviousClick() {
    this.previousStep.emit();
  }
}
