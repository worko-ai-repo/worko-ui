import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mini-job-portal-title',
  templateUrl: './mini-job-portal-title.component.html',
  styleUrls: ['./mini-job-portal-title.component.scss']
})
export class MiniJobPortalTitleComponent {
  @Input()  jobDescriptionDetails:any;

  


}
