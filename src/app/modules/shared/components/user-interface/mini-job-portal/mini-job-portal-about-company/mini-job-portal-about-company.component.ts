import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mini-job-portal-about-company',
  templateUrl: './mini-job-portal-about-company.component.html',
  styleUrls: ['./mini-job-portal-about-company.component.scss']
})
export class MiniJobPortalAboutCompanyComponent {

  @Input() companyName:any="";
}
