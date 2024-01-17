import { Component } from '@angular/core';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss']
})
export class EmployeeEditComponent {
  currentStep: number = 1;



  nextStep() {
   
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep() {
    
    
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
}
