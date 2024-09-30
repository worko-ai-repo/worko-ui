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
  filteredJobs: any[] = [];
  technicalSkills: any[] = [];
  softSkills: any[] = [];
  coreSkills: any[] = [];
  locations: any[] = [];
  departments: any[] = [];
  selectedLocation: string = '';
  selectedDepartment: string = '';
  selectedSalary: string = '';
  selectedExperience: any = "";
  selectedCoreSkill: any = "";
  selectedSoftSkill: any = "";
  selectedTechnicalSkill: any = "";
  salaryRanges = [
    { label: '1 LPA - 3 LPA', minSalary: 100000, maxSalary: 300000 },
    { label: '4 LPA - 6 LPA', minSalary: 400000, maxSalary: 600000 },
    { label: '7 LPA - 10 LPA', minSalary: 700000, maxSalary: 1000000 },
    { label: '11 LPA - 15 LPA', minSalary: 1100000, maxSalary: 1500000 },
    { label: '16 LPA - 20 LPA', minSalary: 1600000, maxSalary: 2000000 },
    { label: '21 LPA - 30 LPA', minSalary: 2100000, maxSalary: 3000000 },
  ];
  experienceRanges = [
    { label: 'Fresher', minExperience: 0 }
  ];
  // experienceRanges = [
  //   { label: '0 - 1 Year', minExperience: 0, maxExperience: 1 },
  //   { label: '1 - 3 Years', minExperience: 1, maxExperience: 3 },
  //   { label: '2 - 5 Years', minExperience: 2, maxExperience: 5 },
  //   { label: '3 - 5 Years', minExperience: 3, maxExperience: 5 },
  //   { label: '5 - 10 Years', minExperience: 5, maxExperience: 10 },
  //   { label: '10+ Years', minExperience: 10, maxExperience: 20 }, // Assuming a max for "10+"
  // ];




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

    // Dynamically generate the remaining experience ranges
for (let i = 1; i <= 30; i++) {
  this.experienceRanges.push({ label: `${i} Year${i > 1 ? 's' : ''}`, minExperience: i });
}
  }

  populateDropdowns(): void {
    // Extract unique locations, departments, and salary ranges from the jobListing array
    this.locations = [...new Set(this.jobListing.map((job: { location: any; }) => this.toTitleCase(job.location)))];
    this.departments = [...new Set(this.jobListing.map((job: { department: any; }) => this.toTitleCase(job.department)))];
    // Extract unique core skills
    this.coreSkills = [...new Set(this.jobListing.flatMap((job: { coreSkills: string[]; }) => job.coreSkills))];

    // Extract unique soft skills
    this.softSkills = [...new Set(this.jobListing.flatMap((job: { softSkills: string[]; }) => job.softSkills))];

    // Extract unique technical skills
    this.technicalSkills = [...new Set(this.jobListing.flatMap((job: { technicalSkills: string[]; }) => job.technicalSkills))];
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

    let response = await this.companyListing.getJobByCompanyID(this.jobListing[0]?.companyId, this.selectedLocation, this.selectedDepartment, this.selectedSoftSkill, this.selectedCoreSkill,this.selectedSalary,this.selectedExperience);
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
  async getJobsByExperience(selectedExperience: string) {
    this.selectedExperience = selectedExperience
    await this.getJobs()
  }
  async getJobsByCoreSkill(selectedCoreSkill: string) {
    this.selectedCoreSkill = selectedCoreSkill
    await this.getJobs()
  }
  async getJobsBySoftSkill(selectedSoftSkill: string) {
    this.selectedSoftSkill = selectedSoftSkill
    await this.getJobs()
  }
  async getJobsByTechnicalSkill(selectedTechnicalSkill: string) {
    this.selectedTechnicalSkill = selectedTechnicalSkill
    await this.getJobs()
  }



}
