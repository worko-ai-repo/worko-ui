import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { AdminService } from '../../services/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { debounceTime, Subject } from 'rxjs';

export interface CorporateVitalDetails {
  cognitoUserId?: string;
  cognitoUserGroup?: string;
  companyId?: string;
  corporateUserType?: string;
  companyName?: string;
  userId?: string;
  email?: string;
}

@Component({
  selector: 'app-admin-company-listing',
  templateUrl: './admin-company-listing.component.html',
  styleUrls: ['./admin-company-listing.component.scss']
})
export class AdminCompanyListingComponent {

  // Corporate Jobs Component Properties
  corporateVitalDetails: CorporateVitalDetails = {};
  userType: any;

  cvUrl: SafeResourceUrl | null = null;
  cvPath: any = "";

  // Common Enums
  status = {
    ALL_APPLICATIONS: "",
    APPLIED: "APPLIED",
    CV_DOWNLOADED: "CV_DOWNLOADED",
    UNDER_EVALUATION: "UNDER_EVALUATION",
    PROCESSING_INTERVIEW: "PROCESSING_INTERVIEW",
    INTERVIEW_DONE: "INTERVIEW_DONE",
    HIRED: "HIRED",
    REJECTED: "REJECTED"
  };

  statusArray = [
    this.status.UNDER_EVALUATION,
    this.status.PROCESSING_INTERVIEW,
    this.status.INTERVIEW_DONE,
    this.status.HIRED
  ];

  jobId: string | null = null; // Variable to store the job ID
  selectedStatus: string = this.status.ALL_APPLICATIONS;
  noApplicationsMessage: string = "No Company Found"; // Will be showin inside the table

  allScreenedList: any[] = [];

  // Properties related to modal handling
  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  showModal: ModalType | undefined;
  modalMessage: string = "";
  modalTitle: string = "";

  // Properties related to modal messages
  successTitle: string = "";
  modalSize: string = "md";
  showClose: boolean = false;
  successMessage: string = "";

  // Component properties
  jobDetails!: any;

  lastKey: string | undefined = undefined;
  currentLastKey: string | null = null; // The current lastKey for the current page
  previousKeys: string[] = []; // Stack to store previous lastKeys for "Previous" functionality
  hasNext: boolean = false; // To enable/disable "Next" button
  hasPrevious: boolean = false; // To enable/disable "Previous" button
  pageSize: number = 50; // Default page size
  pageSizeOptions: number[] = [25, 50, 100, 150];

  searchText: any = '';
  searchTerm: string = '';
  searchQuery: string = '';
  private searchTerms = new Subject<string>();
  isSearchActive: boolean = true;

  sortOrder = {
    ASC: "ascending",
    DESC: "descending",
  };

  selectedSortOrder: string = this.sortOrder.DESC;

  detailedAnalysisModalSize: boolean = false;
  detailsTitle: string = "Detailed Analysis"
  scoreDetails: any = "";

  userId: any = " ";
  emailAddress: any = "";
  currentJob: any;
  newStatus: any;

  companyDetails: any;
  jobUrl: any;

  selectedStatusDropdown: string = '';

  boxVisibleIndex: number | null = null;
  dropdownVisibleIndex: number | null = null;

  isUpdateEnabled: boolean = false;

  companies: any[] = [];
  actionType!: string;
  actionOnCompany!: any;

  popupTitle: string = "";


  constructor(private router: Router, private fb: FormBuilder, private adminService: AdminService, private spinner: NgxSpinnerService, private cdr: ChangeDetectorRef, private sanitizer: DomSanitizer, private route: ActivatedRoute, private storage: StorageService) {
    this.searchTerms.pipe(
      debounceTime(300), // Adjust the debounce time as needed (300 milliseconds in this example)
      //distinctUntilChanged()
    )
      .subscribe((query: string) => {

        // Call your API here with the query string
        this.callApiWithSearchQuery(query);
      });
  }

  async ngOnInit() {

    this.emailAddress = this.storage.get("useremail");
    this.userId = this.storage.get("userId");

    this.getAllCompany(null);

    // if (this.userId && this.emailAddress) {
    //   this.spinner.show(); // Show spinner before starting API calls

    //   try {
    //     await this.fetchScreenedList(null);
    //   } catch (error) {
    //     console.error("Error", error);
    //     this.modalSize = 'md';
    //     this.successMessage = "Something went wrong. Please try again after some time.";
    //     this.successTitle = "Error";
    //     this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
    //   } finally {
    //     this.spinner.hide(); // Ensure spinner hides regardless of success or failure
    //   }
    // }
    // else {
    //   this.modalSize = 'md';
    //   this.successMessage = "Something went wrong. Please try again after some time.";
    //   this.successTitle = "Error";
    //   this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
    // }

  }

  async getAllCompany(lastKey: string | null) {

    this.spinner.show();
    try {
      const response: any = await this.adminService.getCompanyList(
        this.pageSize,
        lastKey,
        this.sortOrder.ASC,
        this.searchTerm
      );

      if (response) {
        this.companies = response.data || [];
        this.pageSize = response.pagination.pageSize;
        this.currentLastKey = response.pagination.lastKey || null;
        this.hasNext = !!response.pagination.lastKey;
        this.hasPrevious = this.previousKeys.length > 0;

        // Reset dropdown-related states
        this.dropdownVisibleIndex = null;
        this.selectedStatusDropdown = '';
        this.isUpdateEnabled = false;
      } else {
        console.warn("Company listing response is empty or undefined.");
      }
    } catch (error: any) {
      if (error.status === 404) {
        console.error("404 Error: Resource not found.");
      } else if (error.status === 401) {
        this.router.navigate(['/']);
      } else {
        console.error("Error fetching job applications:", error);
        this.modalSize = 'md';
        this.successMessage = "Something went wrong. Please try again later.";
        this.successTitle = "Error";
        this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
      }
    } finally {
      this.spinner.hide();
    }
  }

  async deleteCompany(company: any, action: string) {
    this.spinner.show();

    // Extract companyId by removing "ID#" prefix
    const companyId = company.SK.startsWith("ID#") ? company.SK.slice(3) : "";

    // If companyId is empty, show an error message and stop execution
    if (!companyId) {
      console.error("Invalid company ID. Deletion aborted.");
      this.spinner.hide();

      // Show error modal to the user
      this.modalSize = 'md';
      this.successMessage = "Something went wrong. Unable to delete the company.";
      this.successTitle = "Error";
      this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);

      return;
    }

    try {
      const response: any = await this.adminService.deleteCompany(companyId);

      if (response) {
        this.successMessage = "Company deleted successfully.";
        this.successTitle = "Success";
        this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);

        // Refresh the company list after deletion
        await this.getAllCompany(this.currentLastKey);
      } else {
        console.warn("Delete company response is empty or undefined.");
      }
    } catch (error: any) {
      if (error.status === 404) {
        console.error("404 Error: Company not found.");
      } else if (error.status === 401) {
        this.router.navigate(['/']);
      } else {
        console.error("Error deleting company:", error);
        this.modalSize = 'md';
        this.successMessage = "Something went wrong. Please try again later.";
        this.successTitle = "Error";
        this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
      }
    } finally {
      this.spinner.hide();
    }
  }



  actionBtn(company: any, action: string) {
    this.actionType = action;
    this.actionOnCompany = company;

    if (action === 'delete') {
      this.actionType = action;
      this.actionOnCompany = company;
      this.modalSize = "sm";
      this.successMessage = `Are you sure you want to delete this company?`;
      this.openModal(ModalType.CORPORATE_USER_WARNING);
    } else if (action === 'edit') {
      this.popupTitle = "Update Company";
      this.modalSize = "lg";
      this.openModal(ModalType.ADMIN_ADD_COMPANY);
    }
  }

  openInNewTab(url: string) {
    if (url) {
      window.open(url, '_blank'); // Open in a new tab
    }
  }

  async handleCompanySubmission(event: { action: string, data: any }) {
    this.spinner.show(); // Show loading spinner

    try {
      if (event.action === 'update') {
        // console.log("Calling API to update company...", event.data);

        // Ensure the companyId is extracted properly
        const companyId = this.actionOnCompany.SK?.startsWith("ID#") ? event.data.SK.slice(3) : "";

        if (!companyId) {
          console.error("Invalid company ID. Update aborted.");
          this.showErrorMessage("Something went wrong. Unable to update the company.");
          return;
        }

        const response = await this.adminService.updateCompany(companyId, event.data, false);

        if (response) {
          this.showSuccessMessage("Company updated successfully.");
          await this.getAllCompany(this.currentLastKey); // Refresh company list
        }
      } else {
        // console.log("Calling API to create new company...", event.data);

        const response = await this.adminService.createCompany(event.data);

        if (response) {
          this.showSuccessMessage("Company created successfully.");
          await this.getAllCompany(null); // Refresh company list
        }
      }
    } catch (error: any) {
      this.handleApiError(error);
    } finally {
      this.spinner.hide(); // Hide loading spinner
      this.closeModal(); // Close modal after submission
    }
  }

  showSuccessMessage(message: string) {
    this.successMessage = message;
    this.successTitle = "Success";
    this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
  }

  showErrorMessage(message: string) {
    this.modalSize = 'md';
    this.successMessage = message;
    this.successTitle = "Error";
    this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
  }

  handleApiError(error: any) {
    if (error.status === 404) {
      console.error("404 Error: Company not found.");
    } else if (error.status === 401) {
      this.router.navigate(['/']); // Redirect to login
    } else {
      console.error("Error:", error);
      this.showErrorMessage("Something went wrong. Please try again later.");
    }
  }

  openAddCompanyForm() {
    this.actionOnCompany = null;  // Set to null to trigger change detection properly
    this.popupTitle = "Add Company";
    this.cdr.detectChanges();
    this.openModal(ModalType.ADMIN_ADD_COMPANY);
  }

  isOptionDisabled(option: string, currentStatus: string): boolean {
    const currentIndex = this.statusArray.indexOf(currentStatus);
    const optionIndex = this.statusArray.indexOf(option);
    return optionIndex !== currentIndex + 1; // Enable only the next status
  }

  statusChange(selectedStatus: string, job: any): void {
    this.isUpdateEnabled = !!selectedStatus && selectedStatus !== job.status;
  }

  toggleDropdown(index: number): void {
    // Toggle dropdown visibility
    if (this.dropdownVisibleIndex === index) {
      this.dropdownVisibleIndex = null; // Close the dropdown if already open
    } else {
      this.dropdownVisibleIndex = index; // Open the dropdown for the selected row
      this.selectedStatusDropdown = ''; // Reset selected status
      this.isUpdateEnabled = false; // Disable update button initially
    }
  }

  isDropdownVisible(index: number): boolean {
    return this.dropdownVisibleIndex === index;
  }

  closeStatusBox(): void {
    this.boxVisibleIndex = null;
  }

  navigateToJobUrl(event: any): void {
    event.preventDefault(); // Prevents default browser navigation
    if (this.jobUrl) {
      window.open(this.jobUrl, '_blank'); // Opens the link in a new tab
    }
  }

  async fetchScreenedList(lastKey: string | null): Promise<void> {
    this.spinner.show();
    try {
      const response = await this.adminService.getScreenedList(this.pageSize, lastKey, this.sortOrder.DESC, this.searchTerm);
      // console.log('All Screened List:', response);

      if (response) {
        this.allScreenedList = response.data; // Update the list with the API response
        this.pageSize = response.pagination.pageSize;
        this.currentLastKey = response.pagination.lastKey || null;
        this.hasNext = !!response.pagination.lastKey;
        this.hasPrevious = this.previousKeys.length > 0;

        // if (response.status === 'COMPLETED') {
        //   console.log('Processing completed. Displaying results...');
        //   // Handle results or navigate
        // } else if (response.status === 'FAILED') {
        //   console.error('Processing failed.');
        // } else {
        //   console.log('Processing is still pending. Polling again...');
        //   setTimeout(() => this.checkProcessingStatus(), 5000); // Poll every 5 seconds
        // }
      } else {
        console.warn('No screened list data received.');
      }
    } catch (error: any) {
      this.handleError(error, "Error fetching screened list");
    } finally {
      this.spinner.hide();
    }
  }

  viewMatchingResultPage(id: any): void {
    this.router.navigate(["admin/aCandidateScreener/aMatchingResult/" + id]);
  }

  private handleError(error: any, defaultMessage: string): void {
    console.error(defaultMessage, error);

    if (error.status === 404) {
      this.router.navigate(['/auth/logout']);
      return;
    } else if (error.status === 401) {
      this.router.navigate(['/']);
      return;
    }

    this.modalSize = 'md';
    this.successMessage = "Something went wrong. Please try again later.";
    this.successTitle = "Error";
    this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
  }

  formatRange(min: number | null, max: number | null, type: string): string {
    if (min === null || max === null) return '-'; // Handle null values during API loading

    if (min === max) {
      if (type === 'experience') {
        return `${min} ${min === 1 ? 'Year' : 'Years'}`;
      } else if (type === 'salary') {
        return `${min} LPA`;
      }
    }

    if (type === 'experience') {
      if (min === 0 && max === 0) return '-'; // Handling edge case for no experience range
      if (max === 9999) return `${min}+ Years`; // Handle max as 9999 for experience
      return `${min}-${max} ${max === 1 ? 'Year' : 'Years'}`;
    } else if (type === 'salary') {
      if (min === 0 && max === 0) return '-'; // Handling edge case for no salary range
      if (max === 9999) return `${min}+ LPA`; // Handle max as 9999 for salary
      return `${min}-${max} LPA`;
    }

    return '-'; // Default value
  }

  getCvDownloadedDate(statusTracker: any[]): string | null {
    if (!statusTracker) return null;
    const found = statusTracker.find(item => item.newStatus === 'CV_DOWNLOADED');
    return found ? found.actionDate : null;
  }

  transformStatus(status: string): string {
    return status ? status.replace(/_/g, ' ') : status;
  }

  onSortOrderChange(event: any) {
    this.selectedSortOrder = event.target.value;
    const keyToUse = this.getKeyForCurrentPage();
    this.getAllCompany(keyToUse);
  }

  callApiWithSearchQuery(query: string): void {
    this.searchTerm = query; // Setting here encoded query to filterData
    // const keyToUse = this.getKeyForCurrentPage();
    // this.getAllJobApplications(keyToUse);

    this.previousKeys = []; // Resetting pagination keys to refresh the data based on fresh search
    this.getAllCompany(null); // Starting from the beginning by passing `null` for `lastKey` to fetch the initial page of results.
  }

  clearSearchInput() {
    this.searchTerm = "";
    this.searchQuery = '';

    // Use the previous lastKey if available; otherwise, start fresh
    // const keyToUse = this.getKeyForCurrentPage();
    // this.getAllJobApplications(keyToUse);

    this.previousKeys = [];
    this.getAllCompany(null);
  }

  handleSearchInput(event: Event) {

    if (this.searchQuery.length >= 3) {
      this.searchTerms.next(this.searchQuery);
    } else if (this.searchQuery.length <= 0) {
      this.clearSearchInput()
    }
  }

  onSearchInputEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.searchTerms.next(this.searchQuery);
    }
  }

  private getKeyForCurrentPage(): string | null {
    // Return the last key from the stack or null if the stack is empty
    return this.previousKeys.length > 0 ? this.previousKeys[this.previousKeys.length - 1] : null;
  }

  // async updateJobApplicationStatus(
  //   jobApplicationId: string,
  //   newStatus: string,
  //   rejectReasons?: {
  //     rejectTitle
  //     : string; rejectComments: string
  //   }
  // ): Promise<any> {
  //   this.spinner.show(); //spinner at the start

  //   const payload: any = {
  //     userType: this.userType,
  //     userId: this.corporateVitalDetails.userId,
  //     status: newStatus,
  //     emailId: this.corporateVitalDetails.email, // Email of the corporate user
  //   };

  //   // Add rejection-specific data if the status is "REJECTED"
  //   if (newStatus === "REJECTED" && rejectReasons) {
  //     payload.reason = rejectReasons.rejectTitle;
  //     payload.userComment = rejectReasons.rejectComments;
  //   }

  //   try {
  //     // Call the service to update status
  //     const response: any = await this.adminService.updateJobApplicationStatus(jobApplicationId, payload);

  //     if (response) {
  //       // Refresh jobApplicationListing data

  //       // Use the previous lastKey if available; otherwise, start fresh
  //       const keyToUse = this.getKeyForCurrentPage();
  //       await this.getAllJobApplications(keyToUse);
  //       // await this.getAllJobApplications(null);

  //       if (response.status === "CV_DOWNLOADED") {
  //         this.cvUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.currentJob?.applicantDetails?.cvAwsS3SignedUrl);
  //         this.openModal(ModalType.VIEW_CV);
  //       }
  //       return response; // Return the response for the caller
  //     } else {
  //       throw new Error("No response received from server.");
  //     }
  //   } catch (error: any) {
  //     // Handle errors
  //     // if (error.status === 404) {
  //     //   this.router.navigate(['/auth/logout']);
  //     // } else if (error.status === 401) {
  //     //   this.storage.set('redirectAfterLogin', '/candidate/referral');
  //     //   this.router.navigate(['/']);
  //     // } else {
  //     this.successMessage = "Something went wrong. Please try again later.";
  //     this.successTitle = "Error";
  //     this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
  //     // }
  //   } finally {
  //     this.spinner.hide(); // Always hide the spinner
  //   }
  // }

  /* Modal Handler Section Starts Here */

  /**
   * openModal
   *
   * A global modal method that open
   *
   * @param modalType - The type of modal to open.
   * @param message - The message to display in the modal.
   * @param title - The title to display in the modal.
   */
  openModal(modalType: ModalType, message: string = "", title: string = ""): void {
    this.showModal = modalType;

    // Strongly typed modal configuration
    const modalConfig: Partial<Record<ModalType, { size: string; close: boolean }>> = {
      [this.modalType.SHOW_MORE_DETAILS]: { size: "lg", close: true },
      [this.modalType.VIEW_CV]: { size: "xl", close: true },
      [this.modalType.REJECTED_REQUEST]: { size: "md", close: true },
      [this.modalType.ADMIN_ADD_COMPANY]: { size: "lg", close: true },
    };

    // Fallback configuration for undefined modal types
    const config = modalConfig[modalType] || { size: "md", close: false };

    this.modalSize = config.size;
    this.showClose = config.close;

    this.cdr.detectChanges();

    this.modalMessage = message;
    this.modalTitle = title;
    this.modal.open();
  }

  // Closes the currently opened modal
  closeModal(): void {
    this.modal.cancel();
  }

  continue() {
    // this.router.navigate(['/corporate/cJobs']);
    this.closeModal();
  }

  /**
   * Resets the search input and shows all job applications.
   */
  resetBtnHandler(): void {
    // "Reset button clicked"
    this.searchQuery = "";
    this.selectedStatus = this.status.ALL_APPLICATIONS;
    this.searchTerm = "";
    this.searchQuery = "";
    this.selectedSortOrder = this.sortOrder.DESC;

    // Use the previous lastKey if available; otherwise, start fresh
    // const keyToUse = this.getKeyForCurrentPage();
    // this.getAllJobApplications(keyToUse);

    this.previousKeys = [];
    this.getAllCompany(null);
  }

  /**
   * onStausChange
   *
   * Based on selected job application status fetch the job applications.
   */
  onStatusChange(statusVal: any) {
    if (statusVal.target.value === this.status.APPLIED) {
      this.selectedStatus = this.status.APPLIED;
      // Use the previous lastKey if available; otherwise, start fresh
      // const keyToUse = this.getKeyForCurrentPage();
      // Call API to get data
      // this.getAllJobApplications(keyToUse);

      this.previousKeys = [];
      this.getAllCompany(null);
      return;
    }
    this.selectedStatus = statusVal.target.value; // Update global variable
    // Use the previous lastKey if available; otherwise, start fresh
    // const keyToUse = this.getKeyForCurrentPage();
    // Call API to get data
    // this.getAllJobApplications(keyToUse);

    this.previousKeys = [];
    this.getAllCompany(null);
  }

  viewDetails(scoreDetails: any) {
    this.scoreDetails = scoreDetails;
    this.detailedAnalysisModalSize = true;
    this.openModal(ModalType.SHOW_MORE_DETAILS);
  }

  closeDetailedPopup() {
    this.detailedAnalysisModalSize = false;
    this.closeModal();
  }

  // Misc method
  getStatusClass(status: string): string {
    return `job-${status.toLowerCase()}`; // Returns 'job-published', 'job-closed', 'job-archived'
  }

  onPageSizeChange(event: Event): void {
    const selectedPageSize = (event.target as HTMLSelectElement).value;
    this.pageSize = Number(selectedPageSize);
    this.previousKeys = [];
    this.getAllCompany(null); // Call fetchScreenedList refresh the data with the new page size
  }

  onNext() {
    if (!this.hasNext) return;

    // Store the current lastKey in the stack before moving forward
    if (this.currentLastKey) {
      this.previousKeys.push(this.currentLastKey);
    }

    // Fetch the next page
    this.getAllCompany(this.currentLastKey);
  }

  onPrevious() {
    if (!this.hasPrevious) return;

    // Retrieve the second-to-last key in the stack, which corresponds to the last key used for the previous page
    const previousLastKey = this.previousKeys.length > 1 ? this.previousKeys[this.previousKeys.length - 2] : null;

    // Remove the current page's lastKey from the stack
    this.previousKeys.pop();

    if (!previousLastKey) {
      // If no valid previous key, fetch the first page
      this.getAllCompany(null);
    } else {
      // Fetch the previous page using the second-to-last key
      this.getAllCompany(previousLastKey);
    }

  }

}
