import { style } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-stepper',
  templateUrl: './user-stepper.component.html',
  styleUrls: ['./user-stepper.component.scss']
})
export class UserStepperComponent implements OnInit {
  @Input() currentStep!: number;
  @Output() nextStep = new EventEmitter<void>();
  @Output() previousStep = new EventEmitter<void>();
  @Input() userType: any = "";
  currentValue = 1;
  circles = Array.from({ length: 3 });
  userRole: any;
 url: string = "";
 constructor(private router: Router) {}
  ngOnInit() {
    if (this.userType == "Candidate") {
      this.url =  "/candidate/dashboard";
    }

    if (this.userType == "Employee") {
      this.url =  "/employee/edashboard";
    }
    
  }

  navigateToUrl() {
    this.router.navigateByUrl(this.url);
  }
  getStepName(step: number): string {
    if (this.userType === "Candidate") {
        switch (step) {
            case 1:
                return "Personal Information";
            case 2:
                return "Professional Details";
            case 3:
                return "Upload";
            default:
                return "";
        }
    } else if (this.userType === "Employee") {
        switch (step) {
            case 1:
              case 1:
                return "Personal Information";
            case 2:
                return "Professional Details";
            case 3:
                return "Add Bank Details";
            default:
                return "";
        }
    }
    return "";
}



  next() {
    this.currentValue++;
    if (this.currentValue > this.circles.length) {
      this.currentValue = this.circles.length;
    }
    this.update();
  }

  prev() {
    this.currentValue--;
    if (this.currentValue < 1) {
      this.currentValue = 1;
    }
    this.update();
  }

  update() {
    const progress = document.getElementById('progress') as HTMLElement;
    const circles = document.querySelectorAll('.circle');

    circles.forEach((circle, index) => {
      if (index < this.currentValue) {
        circle.classList.add('active');
      } else {
        circle.classList.remove('active');
      }
    });

    const actives = document.querySelectorAll('.active');
    progress.style.width =
      ((actives.length - 1) / (circles.length - 1)) * 100 + '%';

  }



  }
  


