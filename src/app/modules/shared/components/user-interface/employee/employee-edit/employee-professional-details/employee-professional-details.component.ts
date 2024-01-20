import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-employee-professional-details',
  templateUrl: './employee-professional-details.component.html',
  styleUrls: ['./employee-professional-details.component.scss']
})
export class EmployeeProfessionalDetailsComponent {
  @Output() nextStep = new EventEmitter<void>();
  @Output() previousStep = new EventEmitter<void>();


  onNextClick() {
    this.nextStep.emit();
  }
  onPreviousClick() {
    this.previousStep.emit();
  }
}
