import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-user-stepper',
  templateUrl: './user-stepper.component.html',
  styleUrls: ['./user-stepper.component.scss']
})
export class UserStepperComponent implements OnInit {
  @Input() currentStep!: number;
  @Output() nextStep = new EventEmitter<void>();
  @Output() previousStep = new EventEmitter<void>();
  currentValue = 1;
  circles = Array.from({ length: 3 });

  // currentValue = 0;
  // circles = Array.from({ length: 3 }); // Adjust the length based on the number of circles
  ngOnInit() {
     // Automatically click "Next" on component initialization to move to the first step
  }

  // Inside your component class
getStepText(step: number): string {
  switch (step) {
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
      const progress = document.getElementById("progress") as HTMLElement;
      const circles = document.querySelectorAll(".circle");
  
      circles.forEach((circle, index) => {
        if (index < this.currentValue) {
          circle.classList.add("active");
        } else {
          circle.classList.remove("active");
        }
      });
  
      const actives = document.querySelectorAll(".active");
      progress.style.width = ((actives.length - 1) / (circles.length - 1)) * 100 + '%';
  
      const next = document.getElementById("btnNext") as HTMLButtonElement;
      const prev = document.getElementById("btnPrev") as HTMLButtonElement;
  
      if (this.currentValue === circles.length) {
        next.disabled = true;
      } else if (this.currentValue <= 1) {
        prev.disabled = true;
      } else {
        next.disabled = false;
        prev.disabled = false;
      }
    }
  }
  


