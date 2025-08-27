import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { AdminService } from '../../services/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { MatTableDataSource } from '@angular/material/table';
import { ErrorHandlingService } from 'src/app/modules/app-core/services/error-handling.service';
import { DatePipe } from '@angular/common';
import { SortOrder } from 'src/app/modules/shared/types/sort-order.type';
import { ViewDetailsService } from 'src/app/modules/shared/services/view-details.service';
import { JobApplication } from 'src/app/modules/worko/interfaces/jobApplication.interface';

const ALLOWED_CORPORATE_USER_TYPES = ['CORPORATE-ADMIN', 'CORPORATE-RECRUITER'];

@Component({
  selector: 'app-admin-applicants',
  templateUrl: './admin-applicants.component.html',
  styleUrls: ['./admin-applicants.component.scss']
})
export class AdminApplicantsComponent {

  userType: any = "Admin";

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
  noApplicationsMessage: string = "No Job Applications Present"; // Will be showing this inside the table

  //Filters Properties
  filteredJobs: any[] = [];

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

  jobDetails!: any;

  lastKey: string | undefined = undefined;
  currentLastKey: string | null = null; // The current lastKey for the current page
  previousKeys: string[] = []; // Stack to store previous lastKeys for "Previous" functionality
  hasNext: boolean = false; // To enable/disable "Next" button
  hasPrevious: boolean = false; // To enable/disable "Previous" button
  pageSize: number = 25; // Default page size
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
  detailsTitle: string = "";
  scoreDetails: any = "";

  userId: any = " ";
  emailAddress: any = "";
  currentJob: any;
  newStatus: any;

  // companyDetails: any;
  jobUrl: any;

  selectedStatusDropdown: string = '';

  boxVisibleIndex: number | null = null;
  dropdownVisibleIndex: number | null = null;

  isUpdateEnabled: boolean = false;

  rejectedReasons: { reason: any; comment: any; userId: any, actionDate: any } | undefined;

  // feedbackTitle: string = "Rejection Feedback";
  // feedbackDetails: string = "";
  rejectionTitle: string = "Application Rejected";

  duplicacyDetails = {
    cvSourcedFrom: '',
    cvSourcedDate: ''
  };
  matchingScore: any;

  constructor(private router: Router, private fb: FormBuilder, private adminService: AdminService, private spinner: NgxSpinnerService, private cdr: ChangeDetectorRef, private sanitizer: DomSanitizer, private route: ActivatedRoute, private storage: StorageService, private errorHandlingService: ErrorHandlingService, private datePipe: DatePipe, private viewDetailsService: ViewDetailsService) {
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

    this.emailAddress = this.storage.get("userEmail");
    this.userId = this.storage.get("userId");
    this.jobId = this.route.snapshot.paramMap.get('id');

    if (!this.jobId) {
      this.spinner.show();
      this.successMessage = 'Please select a job from the job listing page.';
      this.successTitle = 'Alert';

      setTimeout(() => {
        this.spinner.hide();
        this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
      }, 1000);

      // this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
      return;
    }

    if (this.userId && this.emailAddress && this.jobId) {
      this.spinner.show(); // Show spinner before starting API calls

      try {
        await this.fetchJobDetails(this.jobId);
        this.getJobLink();
        this.getAllJobApplications(null);
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

  private isCorporateCreatedJob(): boolean {
    return !!this.jobDetails?.createdByCorporateUserId;
  }

  private isAdminCreatedJob(): boolean {
    return !!this.jobDetails?.createdByUserId ||
      (!this.jobDetails?.createdByUserId && !this.jobDetails?.createdByCorporateUserId);
  }

  private viewCV(job: any): void {
    this.cvUrl = this.sanitizer.bypassSecurityTrustResourceUrl(job?.applicantDetails?.cvAwsS3SignedUrl);
    this.openModal(ModalType.VIEW_CV);
  }

  showRejectReason(job: any) {

    if (job?.status === 'REJECTED' && (job?.rejectedByUserId || job?.rejectionFeedbackBySystem)) {
      if (job?.rejectedByUserId) {
        this.rejectedReasons = job.rejectedByUserId;
        this.openModal(ModalType.REJECT_DETAILS);
      } else if (job?.rejectionFeedbackBySystem) {
        this.scoreDetails = job.rejectionFeedbackBySystem;
        this.detailsTitle = "Rejection Feedback";
        this.openModal(ModalType.SHOW_MORE_DETAILS);
      }
    }
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

  getJobLink(): void {

    // Encode the company name and job title for URL-safe navigation
    // const formattedCompanyName = this.jobDetails?.companyName.toLowerCase().replace(/\(.*?\)/g, '').replace(/\s*&\s*/g, '&').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    // const formattedJobTitle = this.jobDetails?.jobTitle.toLowerCase().replace(/\(.*?\)/g, '').replace(/\s*&\s*/g, '&').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    // const route = `/company/jobs/${formattedCompanyName}-jobs/${formattedJobTitle}-${this.jobId}`;

    if (this.jobDetails.companyName) {
      // Replace any whitespace or special characters in company name with an underscore
      const refinedCompanyName = this.jobDetails.companyName.replace(/\s/g, "_");

      // Construct the new URL
      const baseUrl = window.location.origin; // Gets the domain dynamically
      const route = `${baseUrl}/jobs/${refinedCompanyName}/${this.jobId}`;

      this.jobUrl = route;
    }
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

  transformStatus(status: string): string {
    return status ? status.replace(/_/g, ' ') : status;
  }

  getMatchLabel(score: number): string {
    if (score <= 30) return 'Poor Match';
    if (score <= 50) return 'Weak Match';
    if (score <= 69) return 'Average Match';
    if (score <= 84) return 'Strong Match';
    return 'Perfect Match';
  }

  getMatchClass(score: number): string {
    if (score <= 30) return 'bg-danger text-white';       // Poor
    if (score <= 50) return 'bg-warning text-dark';       // Weak
    if (score <= 69) return 'bg-info text-white';         // Average
    if (score <= 84) return 'bg-primary text-white';      // Strong
    return 'bg-success text-white';                       // Perfect
  }

  onPageSizeChange(event: Event): void {
    const selectedPageSize = (event.target as HTMLSelectElement).value;
    this.pageSize = Number(selectedPageSize);
    this.previousKeys = [];
    this.getAllJobApplications(null); // Call getAllJobApplications refresh the data with the new page size
  }

  onSortOrderChange(order: SortOrder) {
    this.selectedSortOrder = order;
    const keyToUse = this.getKeyForCurrentPage();
    this.getAllJobApplications(keyToUse);
  }

  callApiWithSearchQuery(query: string): void {
    this.searchTerm = query; // Setting here encoded query to filterData
    // const keyToUse = this.getKeyForCurrentPage();
    // this.getAllJobApplications(keyToUse);
    this.previousKeys = []; // Resetting pagination keys to refresh the data based on fresh search
    this.getAllJobApplications(null); // Starting from the beginning by passing `null` for `lastKey` to fetch the initial page of results.
  }

  clearSearchInput() {
    this.searchTerm = "";
    this.searchQuery = '';

    // Use the previous lastKey if available; otherwise, start fresh
    // const keyToUse = this.getKeyForCurrentPage();
    // this.getAllJobApplications(keyToUse);

    this.previousKeys = [];
    this.getAllJobApplications(null);
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

  viewDuplicacyDetails(cvSourcedFrom: string, cvSourcedDate: any) {
    this.duplicacyDetails = {
      cvSourcedFrom: cvSourcedFrom,
      cvSourcedDate: cvSourcedDate
    };

    this.openModal(ModalType.VIEW_CV_DUPLICACY_DETAILS);
  }

  private getKeyForCurrentPage(): string | null {
    // Return the last key from the stack or null if the stack is empty
    return this.previousKeys.length > 0 ? this.previousKeys[this.previousKeys.length - 1] : null;
  }

  async getAllJobApplications(lastKey: string | null) {

    this.spinner.show();
    try {
      const response: any = await this.adminService.getAllJobApplicants(
        this.pageSize,
        this.userType.toUpperCase(),
        // companyId,
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
      // if (error.status === 404) {
      //   console.error("404 Error: Resource not found.");
      // } else if (error.status === 401) {
      //   this.router.navigate(['/']);
      // } else {
      //   console.error("Error fetching job applications:", error);
      //   this.modalSize = 'md';
      //   this.successMessage = "Something went wrong. Please try again later.";
      //   this.successTitle = "Error";
      //   this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
      // }
      this.errorHandlingService.handleApiError(error, () => {
        console.error("Error fetching job applications:", error);
        this.modalSize = 'md';
        this.successMessage = "Something went wrong. Please try again later.";
        this.successTitle = "Error";
        this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
      });
    } finally {
      this.spinner.hide();
    }
  }

  async fetchJobDetails(jobId: any) {
    try {
      const response: any = await this.adminService.getJobDetailsById(jobId);
      if (response) {
        this.jobDetails = response;
        // this.companyDetails = response[0].companyDetails;
      } else {
        console.warn("Job details response is empty or undefined.");
        // this.jobDetails = [];
      }
    } catch (error: any) {
      // if (error.status === 404) {
      //   this.router.navigate(['/auth/logout']);
      // } else if (error.status === 401) {
      //   this.router.navigate(['/']);
      // } else {
      //   console.error("Error fetching job details:", error);
      //   this.modalSize = 'md';
      //   this.successMessage = "Something went wrong. Please try again later.";
      //   this.successTitle = "Error";
      //   this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
      // }

      this.errorHandlingService.handleApiError(error, () => {
        console.error("Error fetching job details:", error);
        this.modalSize = 'md';
        this.successMessage = "Something went wrong. Please try again later.";
        this.successTitle = "Error";
        this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
      });

    }
  }

  formatCvDownloadedDate(statusTracker: any[]): any {
    if (!statusTracker) return '-';

    const action = statusTracker.find(item => item.newStatus === this.status.CV_DOWNLOADED);
    if (!action) return '-';

    const actionUserType = action.userType?.toUpperCase();
    const actionDate = this.datePipe.transform(action.actionDate, 'd MMM yyyy, h:mm a');

    if (this.isAdminCreatedJob()) {
      if (actionUserType === 'ADMIN') return `${actionDate} [WA]`;
      if (ALLOWED_CORPORATE_USER_TYPES.includes(actionUserType)) return actionDate;
    }

    if (this.isCorporateCreatedJob() &&
      ALLOWED_CORPORATE_USER_TYPES.includes(actionUserType)) {
      return actionDate;
    }

    return '-';
  }

  shouldShowUpdateIcon(job: any): boolean {
    const allowedStatuses = [
      this.status.CV_DOWNLOADED,
      this.status.UNDER_EVALUATION,
      this.status.PROCESSING_INTERVIEW,
      this.status.INTERVIEW_DONE,
    ];
    return !this.jobDetails?.createdByCorporateUserId && allowedStatuses.includes(job.status);
  }

  handleAction(job: any, newStatus: any) {
    const isCVDownloaded = newStatus === this.status.CV_DOWNLOADED;
    const isBeyond = this.isStatusBeyondCurrent(job.status, newStatus);
    const isInTracker = this.hasStatusInTracker(job.statusTracker, newStatus);

    // 1. If corporate created the job → just open CV without updating status
    if (this.isCorporateCreatedJob() && isCVDownloaded) {
      // Job created by corporate, and admin is trying to download CV → just show the CV
      this.viewCV(job);
      return;
    }

    // Check if the current job's status is already at or beyond "View CV" (CV_DOWNLOADED)
    if (isBeyond) {
      if (isCVDownloaded) {
        // Directly open the CV modal if status is greater than or equal to "CV_DOWNLOADED"
        this.viewCV(job);
      }
      return;
    }

    if (isInTracker) {
      console.warn(`Status '${newStatus}' already exists in statusTracker. Skipping update.`);
      return; // Exit early if the status is already in the tracker
    }

    this.currentJob = job;
    this.newStatus = newStatus;

    if (newStatus === "REJECTED") {
      this.openModal(ModalType.REJECTED_REQUEST);
      return;
    }

    // Only update status if job is admin-created
    if (this.isAdminCreatedJob()) {
      this.updateJobApplicationStatus(job.id, job.applicantDetails.name, newStatus);
    }
  }

  // Utility to check if the current status is already at or beyond the target status
  isStatusBeyondCurrent(currentStatus: string, targetStatus: string): boolean {
    const statusOrder = [
      "APPLIED",
      "CV_DOWNLOADED",
      "UNDER_EVALUATION",
      "PROCESSING_INTERVIEW",
      "INTERVIEW_DONE",
      "HIRED",
      "REJECTED"
    ];

    // Get the indices of the statuses in the predefined order
    const currentIndex = statusOrder.indexOf(currentStatus);
    const targetIndex = statusOrder.indexOf(targetStatus);

    // Return true if the current status is at or beyond the target status
    return currentIndex >= targetIndex;
  }

  hasStatusInTracker(statusTracker: any[], statusToCheck: string): boolean {
    return statusTracker.some(
      (tracker) => tracker.oldStatus === statusToCheck || tracker.newStatus === statusToCheck
    );
  }

  async sendApplicationToRecruiter(jobApplicationId: string): Promise<any> {
    this.spinner.show(); // Show spinner at the start

    try {
      // Call the service method
      const response = await this.adminService.displayJobApplicationToCorporate(jobApplicationId);

      if (response) {
        // Refresh job application listing using pagination key if needed
        const keyToUse = this.getKeyForCurrentPage();
        await this.getAllJobApplications(keyToUse);

        // success message modal
        this.successMessage = "Job application has been sent to recruiter successfully.";
        this.successTitle = "Success!";
        this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);

        // return response;
      } else {
        throw new Error("No response received from server.");
      }
    } catch (error) {
      this.successMessage = "Something went wrong. Please try again later.";
      this.successTitle = "Error";
      this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
    } finally {
      this.spinner.hide(); // Always hide spinner
    }
  }

  async updateJobApplicationStatus(
    jobApplicationId: string,
    jobApplicantName: string,
    newStatus: string,
    rejectReasons?: {
      rejectTitle
      : string; rejectComments: string
    }
  ): Promise<any> {
    this.spinner.show(); //spinner at the start

    const payload: any = {
      userType: this.userType.toUpperCase(),
      userId: this.userId,
      status: newStatus,
      emailId: this.emailAddress, // Email of the corporate user
      applicantName: jobApplicantName
    };

    // Add rejection-specific data if the status is "REJECTED"
    if (newStatus === "REJECTED" && rejectReasons) {
      payload.reason = rejectReasons.rejectTitle;
      payload.userComment = rejectReasons.rejectComments;
    }

    try {
      // Call the service to update status
      const response: any = await this.adminService.updateJobApplicationStatus(jobApplicationId, payload);

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

  //Rejected reason will come here from the reject modal
  receiveDataFromChild(data: any) {

    this.spinner.show();
    let rejectReasonsData = data;

    this.updateJobApplicationStatus(this.currentJob.id, this.currentJob.applicantDetails.name, this.newStatus, rejectReasonsData).then(async (response: any) => {
      if (response) {
        this.spinner.hide();
        this.closeModal();
        // Refresh jobApplicationListing data
        // await this.getAllJobApplications(null);
      }
    })
  }

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
      [this.modalType.VIEW_CV_DUPLICACY_DETAILS]: { size: "md", close: true }
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
    this.router.navigate(['/admin/ajobs']);
    this.closeModal();
  }

  /**
   * Resets the search input and shows all jobs.
   */
  resetBtnHandler(): void {
    //  Reset button clicked
    this.searchQuery = "";
    this.selectedStatus = this.status.ALL_APPLICATIONS;
    this.searchTerm = "";
    this.searchQuery = "";
    this.selectedSortOrder = this.sortOrder.DESC;

    // Use the previous lastKey if available; otherwise, start fresh
    // const keyToUse = this.getKeyForCurrentPage();
    // this.getAllJobApplications(keyToUse);

    this.previousKeys = [];
    this.getAllJobApplications(null);
  }

  /**
   * onStausChange
   *
   * Fetch the job applications based on the selected status from filter.
   */
  onStatusChange(statusVal: any) {
    if (statusVal.target.value === this.status.APPLIED) {
      this.selectedStatus = this.status.APPLIED;
      // Use the previous lastKey if available; otherwise, start fresh
      // const keyToUse = this.getKeyForCurrentPage();
      // Call API to get data
      // this.getAllJobApplications(keyToUse);
      this.previousKeys = [];
      this.getAllJobApplications(null);
      return;
    }
    this.selectedStatus = statusVal.target.value; // Update global variable
    // Use the previous lastKey if available; otherwise, start fresh
    // const keyToUse = this.getKeyForCurrentPage();
    // Call API to get data
    // this.getAllJobApplications(keyToUse);

    this.previousKeys = [];
    this.getAllJobApplications(null);
  }

  viewDetails(Job: any) {
    const details = this.viewDetailsService.getScoreDetails(Job);
    this.matchingScore =  Job?.matchingScore;
    if (!details) return;

    this.scoreDetails = details;
    this.detailsTitle = "Detailed Analysis";
    this.detailedAnalysisModalSize = true;
    this.openModal(ModalType.SHOW_MORE_DETAILS);
  }

  getCvDownloadedDate(statusTracker: any[]): string | null {
    if (!statusTracker) return null;
    const found = statusTracker.find(item => item.newStatus === 'CV_DOWNLOADED');
    return found ? found.actionDate : null;
  }

  closeDetailedPopup() {
    this.detailedAnalysisModalSize = false;
    this.closeModal();
  }

  // Misc method
  getStatusClass(status: string): string {
    return `job-${status.toLowerCase()}`; // Returns 'job-published', 'job-closed', 'job-archived'
  }

  navigateToJobReferral(event: MouseEvent, companyName: string, jobTitle: string, jobID: any): void {
    event.preventDefault(); // Prevent default anchor behavior

    // Encode the company name and job title for URL-safe navigation
    const formattedCompanyName = companyName.toLowerCase().replace(/\(.*?\)/g, '').replace(/\s*&\s*/g, '&').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    const formattedJobTitle = jobTitle.toLowerCase().replace(/\(.*?\)/g, '').replace(/\s*&\s*/g, '&').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    const route = `/company/jobs/${formattedCompanyName}-jobs/${formattedJobTitle}-${jobID}`;

    // Open the route in a new tab
    window.open(route, '_blank');
  }

  onNext() {
    if (!this.hasNext) return;

    // Store the current lastKey in the stack before moving forward
    if (this.currentLastKey) {
      this.previousKeys.push(this.currentLastKey);
    }

    // Fetch the next page
    this.getAllJobApplications(this.currentLastKey);
  }

  onPrevious() {
    if (!this.hasPrevious) return;

    // Retrieve the second-to-last key in the stack, which corresponds to the last key used for the previous page
    const previousLastKey = this.previousKeys.length > 1 ? this.previousKeys[this.previousKeys.length - 2] : null;

    // Remove the current page's lastKey from the stack
    this.previousKeys.pop();

    if (!previousLastKey) {
      // If no valid previous key, fetch the first page
      this.getAllJobApplications(null);
    } else {
      // Fetch the previous page using the second-to-last key
      this.getAllJobApplications(previousLastKey);
    }
  }
  
  showPushToRecruiterButton(job: JobApplication): boolean {
    if (!job?.statusTracker?.length) return false;

    // Find the ACCEPTED status change
    const acceptedStatus = [...job.statusTracker].reverse().find((entry) => entry.newStatus === "APPLIED");

    if (!acceptedStatus?.actionDate) return false;

    // Calculate hours since ACCEPTED
    const hoursSinceAccepted = (new Date().getTime() - new Date(acceptedStatus.actionDate).getTime()) / (1000 * 60 * 60);

    const isWithin24Hours = hoursSinceAccepted < 24;
    const scoreIsValid = ((job.matchingScore >= 50 && job.matchingScore <= 70) || job.matchingScore >= 90) && Boolean(job.scoreDetails);

    return isWithin24Hours && job.status !== "REJECTED"  && scoreIsValid;
  }
}
