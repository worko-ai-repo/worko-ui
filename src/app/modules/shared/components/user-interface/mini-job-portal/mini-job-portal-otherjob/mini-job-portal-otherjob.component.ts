import { Component, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mini-job-portal-otherjob',
  templateUrl: './mini-job-portal-otherjob.component.html',
  styleUrls: ['./mini-job-portal-otherjob.component.scss']
})
export class MiniJobPortalOtherjobComponent {
  @Input() otherJobDetails: any;
  companyName: any;
  constructor(private router: Router) { }

  navigateToJobReferral(event: MouseEvent, companyName: string, jobTitle: string, jobID: any): void {
    event.preventDefault(); // Prevent the default anchor behavior

    // const formattedCompanyName = companyName.toLowerCase().replace(/\s+/g, '-'); // Convert spaces to dashes
    // let formattedJobTitle = jobTitle.replace(/\s+/g, '-').replace(/\//g, '-'); // Preserve the case for job title but replace spaces with dashes

    const formattedCompanyName =companyName.toLowerCase().replace(/\(.*?\)/g, '').replace(/\s*&\s*/g, '&').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    const formattedJobTitle = jobTitle.toLowerCase().replace(/\(.*?\)/g, '').replace(/\s*&\s*/g, '&').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    const currentDomain = window.location.origin;
    const url = `${currentDomain}/company/jobs/${formattedCompanyName}-jobs/${formattedJobTitle}-${jobID}`;

    window.open(url, '_blank');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['otherJobDetails'] && changes['otherJobDetails'].currentValue) {
      this.companyName = this.otherJobDetails[0]?.companyDetails.name.toLowerCase()

    }
  }
}
