import { Component, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CountryCodes } from 'src/app/modules/shared/data/country.data';
import { CompanyListingService } from 'src/app/modules/worko/services/company-listing.service';

@Component({
  selector: 'app-min-job-portal-job-list',
  templateUrl: './min-job-portal-job-list.component.html',
  styleUrls: ['./min-job-portal-job-list.component.scss']
})
export class MinJobPortalJobListComponent {


  @Input() jobDetails: any = [];
  @Input() isJobListing: boolean = true;
  @Input() companyName: any
  jobListing: any;
  locations: any[] = [];
  departments: any[] = [];
  salaryRanges: any[] = [];
  selectedLocation: string = '';
  selectedDepartment: string = '';
  selectedSalary: string = '';
  filteredJobs: any[] = [];




  constructor(private router: Router, private companyListing: CompanyListingService) { }

  navigateToJobReferral(event: MouseEvent, companyName: string, jobTitle: string, jobID: any,): void {
    event.preventDefault(); // Prevent the default anchor behavior

    // Encode the company name and job title for URL-safe navigation
    const formattedCompanyName = encodeURIComponent(companyName.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '-')); // Convert spaces to dashes and encode special characters
    const formattedJobTitle = encodeURIComponent(jobTitle.replace(/\s+/g, '-').replace(/\//g, '-')); // Replace spaces and slashes with dashes, then encode

    const route = `/companies/${formattedCompanyName}-jobs/${formattedJobTitle}-${jobID}`;

    this.router.navigateByUrl(route);
  }

  toggleJobContainer() {

    this.isJobListing = !this.isJobListing; // Toggle visibility
  }
  async ngOnInit(): Promise<void> {

  }

  populateDropdowns(): void {
    // Extract unique locations, departments, and salary ranges from the jobListing array
    this.locations = [...new Set(this.jobListing.map((job: { location: any; }) => this.toTitleCase(job.location)))];
    this.departments = [...new Set(this.jobListing.map((job: { department: any; }) => this.toTitleCase(job.department)))];
    this.salaryRanges = [...new Set(this.jobListing.map((job: { salaryRange: any; }) => job.salaryRange))];
  }

  // Helper function to convert to title case
  toTitleCase(str: string) {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['jobDetails'] && changes['jobDetails'].currentValue && this.jobDetails) {

      this.jobListing = this.jobDetails
      this.companyName = this.jobDetails[0]?.companyDetails?.name.toLowerCase()
      this.populateDropdowns();
      await this.getJobs()
    }
  }

  async getJobs(): Promise<void> {

    let response = await this.companyListing.getJobByCompanyID(this.jobListing[0]?.companyId, this.selectedLocation, this.selectedDepartment, this.selectedSalary);
    if (response) {

      this.filteredJobs = response.data
      //console.log(response)
      // this.companyName = this.jobListing.companyDetails.name
      // this.populateDropdowns();
    }

  }

  async getJobsByLocation(selectedLocation: string) {
    this.selectedLocation = selectedLocation
    await this.getJobs()
  }
  async getJobsByDepartment(selectedDepartment: string) {

    this.selectedDepartment = selectedDepartment;
    await this.getJobs()
  }
  async getJobsBySalary(selectedSalary: string) {

    this.selectedSalary = selectedSalary
    await this.getJobs()
  }


}
