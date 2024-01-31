import { Component, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
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

  @Input() employeeSocial:any;
  @Output() nextStep = new EventEmitter<void>();
  
  fileToUpload: File | null = null;
  fileName: string = "";
  fileType: string = "";
  constructor(private _formBuilder: FormBuilder, private renderer: Renderer2, private el: ElementRef) {}



  @Input() employeeDetails:any = {
    name: "",
    email: "",
    phoneNo: "",
    about: "",
    socialLinkGithub: "",
    socialLinklinkdin: "",
    socialLinktwitter: "",
    location:"",
    socialSk: "",
    socialPk: "",
    fileName: "",
    fileToUpload: "",
    fileType: ""

  };
  form:any={

  }

  handleFileInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
  }

  onNextClick() {
    this.nextStep.emit();
  }
  

  ngOnInit() {
    // Set the first step as active
    // this.setActiveStep(this.currentStep);
   
  }

      createEmployee(form:any){}




    }

  
  
  

 

  // stepper.component.ts


 

  

  
  


