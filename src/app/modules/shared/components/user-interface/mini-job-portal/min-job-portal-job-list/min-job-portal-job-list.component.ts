import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CountryCodes } from 'src/app/modules/shared/data/country.data';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { CompanyListingService } from 'src/app/modules/worko/services/company-listing.service';
import { ModalComponent } from '../../../modal/modal.component';

@Component({
  selector: 'app-min-job-portal-job-list',
  templateUrl: './min-job-portal-job-list.component.html',
  styleUrls: ['./min-job-portal-job-list.component.scss']
})
export class MinJobPortalJobListComponent {


  @ViewChild(ModalComponent) modal!: ModalComponent;
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
  successmessage: string = "";
  successtitle: string = "";
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  salaryRanges = [
    { label: '0L - 5L', minSalary: 0, maxSalary: 5 },
    { label: '5L - 10L', minSalary: 5, maxSalary: 10 },
    { label: '10L - 15L', minSalary: 10, maxSalary: 15 },
    { label: '15L - 22L', minSalary: 15, maxSalary: 22 },
    { label: '22L - 30L', minSalary: 22, maxSalary: 30 },
    { label: '30L - 40L', minSalary: 30, maxSalary: 40 },
    { label: '40L - 50L', minSalary: 40, maxSalary: 50 },
    { label: '50L - 70L', minSalary: 50, maxSalary: 70 },
    { label: '70L+', minSalary: 70, maxSalary: 9999 }
  ];


  experienceRanges = [
    { label: '0 - 1 year', minExperience: 0, maxExperience: 1 },
    { label: '1 - 3 years', minExperience: 1, maxExperience: 3 },
    { label: '3 - 6 years', minExperience: 3, maxExperience: 6 },
    { label: '6 - 9 years', minExperience: 6, maxExperience: 9 },
    { label: '9 - 12 years', minExperience: 9, maxExperience: 12 },
    { label: '12 - 15 years', minExperience: 12, maxExperience: 15 },
    { label: '15 - 20 years', minExperience: 15, maxExperience: 20 },
    { label: '20 - 25 years', minExperience: 20, maxExperience: 25 },
    { label: '25+ years', minExperience: 25, maxExperience: 9999 }
  ];




  constructor(private router: Router, private companyListing: CompanyListingService, private spinner: NgxSpinnerService) { }

  navigateToJobReferral(event: MouseEvent, companyName: string, jobTitle: string, jobID: any,): void {
    event.preventDefault(); // Prevent the default anchor behavior
    // Encode the company name and job title for URL-safe navigation
    const formattedCompanyName =companyName.toLowerCase().replace(/\(.*?\)/g, '').replace(/\s*&\s*/g, '&').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    const formattedJobTitle = jobTitle.toLowerCase().replace(/\(.*?\)/g, '').replace(/\s*&\s*/g, '&').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    const route = `/companies/jobs/${formattedCompanyName}-jobs/${formattedJobTitle}-${jobID}`;

    this.router.navigateByUrl(route);
  }

  toggleJobContainer() {

    this.isJobListing = !this.isJobListing; // Toggle visibility
  }
  async ngOnInit(): Promise<void> {

  }

  populateDropdowns(): void {
    // Extract unique locations, departments, and salary ranges from the jobListing array
    this.locations = [...new Set(this.jobListing.map((job: { location: any; }) => job.location))];
    this.departments = [...new Set(this.jobListing.map((job: { department: any; }) => job.department))];
    // Extract unique core skills
    this.coreSkills = [...new Set(this.jobListing.flatMap((job: { coreSkills: string[]; }) => job.coreSkills))];

    // Extract unique soft skills
    this.softSkills = [...new Set(this.jobListing.flatMap((job: { softSkills: string[]; }) => job.softSkills))];

    // Extract unique technical skills
    this.technicalSkills = [...new Set(this.jobListing.flatMap((job: { technicalSkills: string[]; }) => job.technicalSkills))];
  }


  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['jobDetails'] && changes['jobDetails'].currentValue && this.jobDetails) {

      this.jobListing = this.jobDetails
      //this.companyName = this.jobDetails[0]?.companyDetails?.name.toLowerCase()
      this.populateDropdowns();
      this.filteredJobs=this.jobDetails
      // if(this.jobListing.length>0){
      // await this.getJobs()
      // }
    }
  }

  async getJobs(): Promise<void> {
    this.spinner.show()
    try {
      let response = await this.companyListing.getJobByCompanyID(this.jobListing[0]?.companyId, this.selectedLocation, this.selectedDepartment, this.selectedSoftSkill, this.selectedCoreSkill, this.selectedSalary, this.selectedExperience, this.selectedTechnicalSkill);
      if (response) {
        this.spinner.hide()
        this.filteredJobs = response.data
        //console.log(response)
        // this.companyName = this.jobListing.companyDetails.name
        // this.populateDropdowns();
      }
    } catch (error) {
      this.spinner.hide();
      this.successmessage = "Something went wrong. Please try again after sometime"
      this.successtitle = "Error"
      this.openModal(ModalType.SUCCESS_MESSAGE)
    }

  }
  async handleFilterChange(filterType: string, selectedValue: any) {
    // Dynamically assign the selected value to the corresponding property
    (this as any)[filterType] = selectedValue;

    // Call getJobs once the filter is changed
    await this.getJobs();
  }


  // async getJobsByLocation(selectedLocation: string) {
  //   this.selectedLocation = selectedLocation
  //   await this.getJobs()
  // }
  // async getJobsByDepartment(selectedDepartment: string) {

  //   this.selectedDepartment = selectedDepartment;
  //   await this.getJobs()
  // }
  // async getJobsBySalary(selectedSalary: string) {

  //   this.selectedSalary = selectedSalary
  //   await this.getJobs()
  // }
  // async getJobsByExperience(selectedExperience: string) {
  //   this.selectedExperience = selectedExperience
  //   await this.getJobs()
  // }
  // async getJobsByCoreSkill(selectedCoreSkill: string) {
  //   this.selectedCoreSkill = selectedCoreSkill
  //   await this.getJobs()
  // }
  // async getJobsBySoftSkill(selectedSoftSkill: string) {
  //   this.selectedSoftSkill = selectedSoftSkill
  //   await this.getJobs()
  // }
  // async getJobsByTechnicalSkill(selectedTechnicalSkill: string) {
  //   this.selectedTechnicalSkill = selectedTechnicalSkill
  //   await this.getJobs()
  // }
  cancel() {
    this.selectedLocation = ""
    this.selectedDepartment = ""
    this.selectedSalary = '',
      this.selectedExperience = "",
      this.selectedSoftSkill = "",
      this.selectedCoreSkill = "",
      this.selectedTechnicalSkill = "",
      this.getJobs()
    this.closeModal();

  }

  /**
 * Open modal.
 *
 * @param {ModalType} modalType
 * @param {string} [message = ""]
 * @param {string} [title = ""]
 * @returns {void}
 */
  openModal(modalType: ModalType, message: string = "", title: string = ""): void {

    this.showModal = modalType;
    this.modalMessage = message;
    this.modalTitle = title;
    this.modal.open();
  }
  /**
 * Close modal.
 *
 * @returns {void}
 */
  closeModal(): void {
    this.modal.cancel();
  }



}
