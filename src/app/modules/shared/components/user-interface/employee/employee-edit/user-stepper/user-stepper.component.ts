import { Component } from '@angular/core';

@Component({
  selector: 'app-user-stepper',
  templateUrl: './user-stepper.component.html',
  styleUrls: ['./user-stepper.component.scss']
})
export class UserStepperComponent {

  currentValue = 1;
  circles = Array.from({ length: 3 }); // Adjust the length based on the number of circles

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
    const progressElement = document.getElementById('progress');
    if (progressElement) {
      const actives = document.querySelectorAll('.active');
      const progress = (actives.length - 1) / (this.circles.length - 1) * 100 + '%';

      if (this.currentValue === this.circles.length) {
        // Handle button states or other actions here
      } else if (this.currentValue <= 1) {
        // Handle button states or other actions here
      }

      progressElement.style.width = progress;

      const circles = document.querySelectorAll('.circle');
      circles.forEach((circle, index) => {
        if (index < this.currentValue) {
          circle.classList.add('active');
        } else {
          circle.classList.remove('active');
        }
      });
    }
  }

}
