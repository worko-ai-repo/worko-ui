import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime, Subject } from 'rxjs';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { CorporateService } from 'src/app/modules/corporate-admin/services/corporate.service';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';


@Component({
  selector: 'app-admin-resume-match-tablew',
  templateUrl: './admin-resume-match-table.component.html',
  styleUrls: ['./admin-resume-match-table.component.scss']
})
export class AdminResumeMatchTableComponent {

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


  corporateBulkJdId: string | null = null; // Variable to store the job ID

  userType: any;

  cvUrl: SafeResourceUrl | null = null;
  cvPath: any = "";


  jobId: string | null = null; // Variable to store the job ID
  selectedStatus: string = this.status.ALL_APPLICATIONS;
  noApplicationsMessage: string = "No Matching Result Found"; // Will be showin inside the table

  //Filters Properties
  filteredJobs: any[] = [];

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

  bulkJdDetails: any; // To store the fetched JD details
  screenedCvData: any[] = [];



  constructor(private router: Router, private fb: FormBuilder, private corporateService: CorporateService, private spinner: NgxSpinnerService, private cdr: ChangeDetectorRef, private sanitizer: DomSanitizer, private route: ActivatedRoute, private storage: StorageService) {
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

    this.corporateBulkJdId = this.route.snapshot.paramMap.get('id');

    if (this.userId && this.emailAddress && this.corporateBulkJdId) {
      this.spinner.show(); // Show spinner before starting API calls

      try {
        await this.fetchBulkJDDetails();
        await this.checkProcessingStatus(null);
      } catch (error) {
        console.error("Error", error);
        this.modalSize = 'md';
        this.successMessage = "Something went wrong. Please try again after some time.";
        this.successTitle = "Error";
        this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
      } finally {
        this.spinner.hide(); // Ensure spinner hides regardless of success or failure
      }
    }
    else {
      this.modalSize = 'md';
      this.successMessage = "Something went wrong. Please try again after some time.";
      this.successTitle = "Error";
      this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
    }
  }

  async fetchBulkJDDetails(): Promise<void> {
    if (!this.corporateBulkJdId) {
      console.warn('CorporateBulkJdId is required.');
      this.handleError(null, 'CorporateBulkJdId is missing. Cannot fetch details.');
      return;
    }

    this.spinner.show();
    try {
      const response = await this.corporateService.getBulkJDDetailsById(this.corporateBulkJdId);
      this.bulkJdDetails = response;
      // console.log('Bulk JD Details:', this.bulkJdDetails);
    } catch (error) {
      console.error('Error fetching Bulk JD details:', error);
      this.handleError(error, 'Error fetching Bulk JD details. Please try again.');
    } finally {
      this.spinner.hide();
    }
  }

  async checkProcessingStatus(lastKey: string | null): Promise<void> {
    this.spinner.show();
    try {
      const response = await this.corporateService.getProcessingStatus(this.corporateBulkJdId, this.pageSize, lastKey, this.sortOrder.DESC, this.searchTerm);
      // console.log('Screened CV Matching Details:', response);

      if (response) {
        this.screenedCvData = response.data;
        this.pageSize = response.pagination.pageSize;
        this.currentLastKey = response.pagination.lastKey || null;
        this.hasNext = !!response.pagination.lastKey;
        this.hasPrevious = this.previousKeys.length > 0;
      }

      // if (response.status === 'COMPLETED') {
      //   console.log('Processing completed. Displaying results...');
      //   // Handle results or navigate
      // } else if (response.status === 'FAILED') {
      //   console.error('Processing failed.');
      // } else {
      //   console.log('Processing is still pending. Polling again...');
      //   setTimeout(() => this.checkProcessingStatus(), 5000); // Poll every 5 seconds
      // }
    } catch (error: any) {
      this.handleError(error, "Error checking processing status.");
    } finally {
      this.spinner.hide();
    }
  }

  refreshData() {
    // console.log('Refreshing processing status...');
    this.checkProcessingStatus(null);
  }

  async handleAction(cv: any) {
    // Validation check
    if (cv?.cloudFileName && cv?.companyId && this.corporateBulkJdId) {
      this.spinner.show();
      try {
        const response = await this.corporateService.getSingleCvDetails(
          cv?.companyId,
          cv.cloudFileName,
          this.corporateBulkJdId
        );
        const objectUrl = response?.objectUrl;

        if (objectUrl) {
          this.cvUrl = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
          this.openModal(ModalType.VIEW_CV);
        } else {
          console.warn('No object URL received from the server.');
          this.handleError(null, 'Unable to fetch the CV. Please try again later.');
        }
      } catch (error) {
        console.error('Error fetching CV details:', error);
        this.handleError(error, 'Error fetching CV details. Please try again.');
      } finally {
        this.spinner.hide();
      }
    } else {
      console.warn('Required parameters are missing: cloudFileName, companyId, or corporateBulkJdId.');
      this.handleError(null, 'Required parameters are missing. Cannot fetch CV details.');
    }
  }

  // viewMatchingResultPage(id: any): void {
  //   this.router.navigate(["admin/aCandidateScreener/aMatchingResult/" + id]);
  // }

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
    this.checkProcessingStatus(keyToUse);
  }

  callApiWithSearchQuery(query: string): void {
    this.searchTerm = query; // Setting here encoded query to filterData
    // const keyToUse = this.getKeyForCurrentPage();
    // this.getAllJobApplications(keyToUse);

    this.previousKeys = []; // Resetting pagination keys to refresh the data based on fresh search
    this.checkProcessingStatus(null); // Starting from the beginning by passing `null` for `lastKey` to fetch the initial page of results.
  }

  clearSearchInput() {
    this.searchTerm = "";
    this.searchQuery = '';

    // Use the previous lastKey if available; otherwise, start fresh
    // const keyToUse = this.getKeyForCurrentPage();
    // this.getAllJobApplications(keyToUse);

    this.previousKeys = [];
    this.checkProcessingStatus(null);
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

  // async getAllJobApplications(lastKey: string | null) {

  //   // const companyId = "01HZM77T3F331PMJP1C8B75N1P"
  //   const companyId = this.corporateVitalDetails.companyId;
  //   this.spinner.show()
  //   await this.corporateService.getAllJobApplicants(this.userType.toUpperCase(), companyId, this.jobId, this.selectedStatus, this.pageSize, lastKey, this.selectedSortOrder, this.searchTerm).then(async (response: any) => {
  //     if (response) {
  //       this.spinner.hide();
  //       this.filteredJobs = response.data;
  //       // this.updateData(this.nameslist);

  //       this.pageSize = response.pagination.pageSize;
  //       this.currentLastKey = response.pagination.lastKey || null;
  //       this.hasNext = !!response.pagination.lastKey;
  //       this.hasPrevious = this.previousKeys.length > 0;
  //     }
  //   }).catch((error: any) => {
  //     this.spinner.hide()
  //     if (error.status == 404) {
  //       this.spinner.hide()
  //       // this.router.navigate(['/auth/logout']);
  //     } else if (error.status == 401) {

  //       this.router.navigate(['/']);
  //     } else {
  //       this.modalSize = 'md'
  //       this.successMessage = "Something went wrong. Please try again after sometime"
  //       this.successTitle = "Error"
  //       this.openModal(ModalType.SUCCESS_ERROR_MESSAGE)
  //     }
  //   });
  // }

  async getAllJobApplications(lastKey: string | null) {
    const companyId = "testing";
    if (!companyId) {
      console.warn("Company ID is missing. Cannot fetch job applications.");
      return;
    }

    this.spinner.show();
    try {
      const response: any = await this.corporateService.getAllJobApplicants(
        this.pageSize,
        this.userType,
        companyId,
        this.jobId,
        this.selectedStatus,
        lastKey,
        this.selectedSortOrder,
        this.searchTerm
      );

      if (response) {
        this.filteredJobs = response.data || [];
        this.pageSize = response.pagination.pageSize;
        this.currentLastKey = response.pagination.lastKey || null;
        this.hasNext = !!response.pagination.lastKey;
        this.hasPrevious = this.previousKeys.length > 0;

        // Reset dropdown-related states
        this.dropdownVisibleIndex = null;
        this.selectedStatusDropdown = '';
        this.isUpdateEnabled = false;
      } else {
        console.warn("Job applications response is empty or undefined.");
      }
    } catch (error: any) {
      if (error.status === 401) {
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

  async fetchJobDetails(jobId: any) {
    this.spinner.show();
    try {
      const response: any = await this.corporateService.getJobDetailsById(jobId);
      if (response && response.length > 0) {
        this.jobDetails = response[0];
        this.companyDetails = response[0].companyDetails;
      } else {
        console.warn("Job details response is empty or undefined.");
        this.jobDetails = [];
      }
    } catch (error: any) {
      console.error("Error fetching job details:", error);
      this.modalSize = 'md';
      this.successMessage = "Something went wrong. Please try again later.";
      this.successTitle = "Error";
      this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);

    } finally {
      this.spinner.hide();
    }
  }

  async updateJobApplicationStatus(
    jobApplicationId: string,
    newStatus: string,
    rejectReasons?: {
      rejectTitle
      : string; rejectComments: string
    }
  ): Promise<any> {
    this.spinner.show(); //spinner at the start

    const payload: any = {
      userType: this.userType,
      userId: this.userId,
      status: newStatus,
      emailId: "", // Email of the corporate user
    };

    // Add rejection-specific data if the status is "REJECTED"
    if (newStatus === "REJECTED" && rejectReasons) {
      payload.reason = rejectReasons.rejectTitle;
      payload.userComment = rejectReasons.rejectComments;
    }

    try {
      // Call the service to update status
      const response: any = await this.corporateService.updateJobApplicationStatus(jobApplicationId, payload);

      if (response) {
        // Refresh jobApplicationListing data

        // Use the previous lastKey if available; otherwise, start fresh
        const keyToUse = this.getKeyForCurrentPage();
        await this.getAllJobApplications(keyToUse);
        // await this.getAllJobApplications(null);

        if (response.status === "CV_DOWNLOADED") {
          this.cvUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.currentJob?.applicantDetails?.cvAwsS3SignedUrl);
          this.openModal(ModalType.VIEW_CV);
        }
        return response; // Return the response for the caller
      } else {
        throw new Error("No response received from server.");
      }
    } catch (error: any) {
      // Handle errors
      // if (error.status === 404) {
      //   this.router.navigate(['/auth/logout']);
      // } else if (error.status === 401) {
      //   this.storage.set('redirectAfterLogin', '/candidate/referral');
      //   this.router.navigate(['/']);
      // } else {
      this.successMessage = "Something went wrong. Please try again later.";
      this.successTitle = "Error";
      this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
      // }
    } finally {
      this.spinner.hide(); // Always hide the spinner
    }
  }

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
      [this.modalType.REJECTED_REQUEST]: { size: "md", close: true }
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
    this.router.navigate(['/corporate/cJobs']);
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
    this.checkProcessingStatus(null);
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
      this.checkProcessingStatus(null);
      return;
    }
    this.selectedStatus = statusVal.target.value; // Update global variable
    // Use the previous lastKey if available; otherwise, start fresh
    // const keyToUse = this.getKeyForCurrentPage();
    // Call API to get data
    // this.getAllJobApplications(keyToUse);

    this.previousKeys = [];
    this.checkProcessingStatus(null);
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
    this.checkProcessingStatus(null); // Call fetchScreenedList refresh the data with the new page size
  }

  onNext() {
    if (!this.hasNext) return;

    // Store the current lastKey in the stack before moving forward
    if (this.currentLastKey) {
      this.previousKeys.push(this.currentLastKey);
    }

    // Fetch the next page
    this.checkProcessingStatus(this.currentLastKey);
  }

  onPrevious() {
    if (!this.hasPrevious) return;

    // Retrieve the second-to-last key in the stack, which corresponds to the last key used for the previous page
    const previousLastKey = this.previousKeys.length > 1 ? this.previousKeys[this.previousKeys.length - 2] : null;

    // Remove the current page's lastKey from the stack
    this.previousKeys.pop();

    if (!previousLastKey) {
      // If no valid previous key, fetch the first page
      this.checkProcessingStatus(null);
    } else {
      // Fetch the previous page using the second-to-last key
      this.checkProcessingStatus(previousLastKey);
    }

  }

}
