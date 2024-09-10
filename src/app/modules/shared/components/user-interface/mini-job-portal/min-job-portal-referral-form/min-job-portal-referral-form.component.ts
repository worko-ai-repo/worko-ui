import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-min-job-portal-referral-form',
  templateUrl: './min-job-portal-referral-form.component.html',
  styleUrls: ['./min-job-portal-referral-form.component.scss']
})
export class MinJobPortalReferralFormComponent {

  @Input()  companyName:any
}
