import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mini-job-portal-about-company',
  templateUrl: './mini-job-portal-about-company.component.html',
  styleUrls: ['./mini-job-portal-about-company.component.scss']
})
export class MiniJobPortalAboutCompanyComponent {

  @Input() companyName: any = "";
  @Input() jobDetails: any = [];
  aboutCompany: any;
  companyURl: any;

  constructor() { }
  ngOnInit(): void {
    this.aboutCompany = this.jobDetails[0]
    this.companyURl = this.jobDetails[0].companyDetails

  }


}
