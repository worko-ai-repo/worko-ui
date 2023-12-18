import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-referral-progress-bar',
  templateUrl: './referral-progress-bar.component.html',
  styleUrls: ['./referral-progress-bar.component.scss']
})
export class ReferralProgressBarComponent {
  @Input() score: any;

  originalPoints = 2.1;
  possiblePoints = 10;
}
