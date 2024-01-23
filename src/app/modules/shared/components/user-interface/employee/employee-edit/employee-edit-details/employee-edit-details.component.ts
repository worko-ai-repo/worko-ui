import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-employee-edit-details',
  templateUrl: './employee-edit-details.component.html',
  styleUrls: ['./employee-edit-details.component.scss'],
  
  
})
export class EmployeeEditDetailsComponent {
 
  @Output() nextStep = new EventEmitter<void>();
  
  fileToUpload: File | null = null;
  fileName: string = "";
  fileType: string = "";
  constructor(private _formBuilder: FormBuilder) {}


  handleFileInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
  }

  onNextClick() {
    this.nextStep.emit();
  }
  steps = ['Step 1', 'Step 2', 'Step 3'];
  currentStep = 1;

  ngOnInit() {
    // Set the first step as active
    this.setActiveStep(this.currentStep);
  }

  

  setActiveStep(stepIndex: number) {
    this.currentStep = stepIndex;
  }
}
