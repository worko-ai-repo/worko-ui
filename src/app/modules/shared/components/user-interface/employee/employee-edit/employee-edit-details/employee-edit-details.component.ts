import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-employee-edit-details',
  templateUrl: './employee-edit-details.component.html',
  styleUrls: ['./employee-edit-details.component.scss']
})
export class EmployeeEditDetailsComponent {
  @Output() nextStep = new EventEmitter<void>();
  
  fileToUpload: File | null = null;
  fileName: string = "";
  fileType: string = "";

  handleFileInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
  }

  onNextClick() {
    this.nextStep.emit();
  }
}
