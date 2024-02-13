import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-referral-progress-bar',
  templateUrl: './referral-progress-bar.component.html',
  styleUrls: ['./referral-progress-bar.component.scss']
})
export class ReferralProgressBarComponent {
  @Input() score: any;
  showScore: boolean = false;
  showEmailContent: boolean = false;
  originalPoints = 2.1;
  possiblePoints = 10;
  texts: string[] = [
    "Matching your educational qualification",
    "Checking your responsibilities and experiences",
    "Final checks happening",
    "We are almost done"
  ];


  ngOnInit(): void {
    let index = 0;
    const interval = setInterval(() => {
      if (index < this.texts.length) {
        const element = document.getElementById('loopedText');
        if (element) {
          element.innerText = this.texts[index];
          index++;
        }
      } else {
        clearInterval(interval);
        setTimeout(() => {
          this.showScore = true; // Show the score after 30 seconds
        }, 30000); // Wait for 5 seconds after the loop ends
      }
    }, 7000); // Display each message for 5 seconds
  }
  

  onViewMore(): void {
    // Toggle the visibility of the email content
    this.showEmailContent = true;
  }
}
