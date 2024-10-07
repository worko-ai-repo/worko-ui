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
    { label: '0 - 5 LPA', minSalary: 0, maxSalary: 5 },
    { label: '5 - 8 LPA', minSalary: 5, maxSalary: 8 },
    { label: '8 - 12 LPA', minSalary: 8, maxSalary: 12 },
    { label: '12 - 15 LPA', minSalary: 12, maxSalary: 15 },
    { label: '15 - 22 LPA', minSalary: 15, maxSalary: 22 },
    { label: '22 - 30 LPA', minSalary: 22, maxSalary: 30 },
    { label: '30 + LPA ', minSalary: 30, maxSalary: 99999 }
  ];

  experienceRanges = [
    { label: '0 - 2 years', minExperience: 0, maxExperience: 2 },
    { label: '2 - 4 years', minExperience: 2, maxExperience: 4 },
    { label: '4 - 6 years', minExperience: 4, maxExperience: 6 },
    { label: '6 - 8 years', minExperience: 6, maxExperience: 8 },
    { label: '8 - 10 years', minExperience: 8, maxExperience: 10 },
    { label: '10 - 12 years', minExperience: 10, maxExperience: 12 },
    { label: '12 + years', minExperience: 12, maxExperience: 9999 },

  ];




  constructor(private router: Router, private companyListing: CompanyListingService, private spinner: NgxSpinnerService) { }

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
      this.companyName = this.jobDetails[0]?.companyDetails?.name.toLowerCase()
      this.populateDropdowns();
      await this.getJobs()
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
