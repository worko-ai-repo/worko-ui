import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-min-job-portal-job-listing',
  templateUrl: './min-job-portal-job-listing.component.html',
  styleUrls: ['./min-job-portal-job-listing.component.scss']
})
export class MinJobPortalJobListingComponent {
 
  @Input() companyName:any="";

  constructor(private router: Router) {}

 navigateToJobReferral(event: MouseEvent, companyName: string, jobDescription: string): void {
    event.preventDefault(); // Prevent the default anchor behavior

    // Convert jobDescription to a URL-friendly format
    // const formattedJobDescription = encodeURIComponent(jobDescription
    //   .toLowerCase()
    // );

    // Construct the route
    const route = `/company/${companyName.toLowerCase().replace(/\s+/g, '-')}-jobs/${jobDescription.toLowerCase().replace(/\s+/g, '-')}`;

    // Navigate to the constructed route
    this.router.navigate([route]);
  }
}
