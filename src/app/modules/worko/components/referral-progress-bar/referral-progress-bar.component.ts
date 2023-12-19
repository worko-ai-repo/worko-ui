import { Component } from '@angular/core';

@Component({
  selector: 'app-referral-progress-bar',
  templateUrl: './referral-progress-bar.component.html',
  styleUrls: ['./referral-progress-bar.component.scss']
})
export class ReferralProgressBarComponent {
  originalPoints = 2.1;
  possiblePoints = 4;
}
