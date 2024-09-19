import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-min-job-portal-job-list',
  templateUrl: './min-job-portal-job-list.component.html',
  styleUrls: ['./min-job-portal-job-list.component.scss']
})
export class MinJobPortalJobListComponent {
  @Input() companyName:any="";
  isJobContainerVisible = true; // Flag to control visibility

  jobs = [
    {
        jobTitle: "Assistant Manager - Sales & Marketing (Speciality Sales)",
        location: "Hyderabad",
        experience: "2-3 years",
        department: "Sales & Marketing",
        companyLogo: "assets/company-logo/301.jpg"
    },
    {
        jobTitle: "Sales Executive - Retail",
        location: "Bangalore",
        experience: "1-2 years",
        department: "Sales",
        companyLogo: "assets/company-logo/301.jpg"
    }
];

  constructor(private router: Router) {}

 navigateToJobReferral(event: MouseEvent, companyName: string, jobDescription: string): void {
    event.preventDefault(); // Prevent the default anchor behavior

    // Construct the route
    const route = `/${companyName.toLowerCase().replace(/\s+/g, '-')}-jobs/${jobDescription.toLowerCase().replace(/\s+/g, '-')}`;

    // Navigate to the constructed route
    // this.router.navigate([route],{
    //   state: { companySK: SK}
    // });
    this.router.navigate([route])
  }

  toggleJobContainer() {
    this.isJobContainerVisible = !this.isJobContainerVisible; // Toggle visibility
  }

}
