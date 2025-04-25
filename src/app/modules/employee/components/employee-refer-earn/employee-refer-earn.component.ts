import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime, Subject } from 'rxjs';
import { AdminService } from 'src/app/modules/admin/services/admin.service';
import { ErrorHandlingService } from 'src/app/modules/app-core/services/error-handling.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { CandidateProfileService } from 'src/app/modules/candidate/services/candidate-profile.service';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';

import {
  REFERRAL_STATUS_OPTIONS,
  WITHDRAWAL_STATUS_OPTIONS
} from 'src/app/modules/shared/constants/status-options.constants';

export interface WithdrawalRequestPayload {
  accountHolderName: string;
  accountNumber: number;
  ifscCode: string;
  branchName: string;
}

export interface PaymentDoneDetails {
  userType: string;
  amountPaid: number;
  userId: string;
  actionDate: string; // ISO string
  uniqueTransactionReference: string;
}

@Component({
  selector: 'app-employee-refer-earn',
  templateUrl: './employee-refer-earn.component.html',
  styleUrls: ['./employee-refer-earn.component.scss']
})
export class EmployeeReferEarnComponent {

  paymentDoneDetails!: PaymentDoneDetails;
  referrerBankDetails!: WithdrawalRequestPayload;

  withdrawalStatusControl = new FormControl('');
  referralStatusControl = new FormControl('');

  withdrawalStatusOptions = WITHDRAWAL_STATUS_OPTIONS;
  referralStatusOptions = REFERRAL_STATUS_OPTIONS;

  withdrawalStatus: string | null = '';
  referralStatus: string | null = '';

  userType: any = "EMP";

  jobId: string | null = null; // Variable to store the job ID
  noReferralMessage: string = "No Referral Found"; // Will be showing this inside the table

  //Referral for refer and earn list property
  referralList: any[] = [];

  errorMessage: string = "";
  errorTitle: string = "";

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

  companyDetails: any;
  jobUrl: any;

  selectedStatusDropdown: string = '';

  rejectedReasons: { reason: any; comment: any; userId: any, actionDate: any } | undefined;

  // feedbackTitle: string = "Rejection Feedback";
  // feedbackDetails: string = "";
  rejectionTitle: string = "Application Rejected";
  filteredJobs: any = [];

  referralIdForWithdraw!: string;

  constructor(private router: Router, private fb: FormBuilder, private candidateService: CandidateProfileService, private errorHandlingService: ErrorHandlingService, private spinner: NgxSpinnerService, private cdr: ChangeDetectorRef, private sanitizer: DomSanitizer, private route: ActivatedRoute, private storage: StorageService, private adminService: AdminService) {
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

    this.referralStatusControl.valueChanges.subscribe((val) => {
      this.getFilteredData();
    });

    this.withdrawalStatusControl.valueChanges.subscribe((val) => {
      this.getFilteredData();
    });

    this.emailAddress = this.storage.get("userEmail");
    this.userId = this.storage.get("userId");

    if (this.emailAddress) {
      try {
        await this.getReferAndEarnList(null);
      } catch (error) {
        console.error("Error fetching Refer & Earn list:", error);
        this.modalSize = 'md';
        this.errorMessage = "Something went wrong. Please try again after some time.";
        this.errorTitle = "Error";
        this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
      }
    } else {
      this.modalSize = 'md';
      this.errorMessage = "Something went wrong. Please try again after some time.";
      this.errorTitle = "Error";
      this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
    }
  }

  async getReferAndEarnList(lastKey: string | null) {
    this.spinner.show();

    try {
      const response: any = await this.candidateService.getReferAndEarnByReferrerEmail(
        this.emailAddress,
        this.pageSize,
        this.referralStatus,
        lastKey,
        this.searchTerm
      );

      if (response) {
        this.referralList = response.data || [];
        const pagination = response.pagination || {};

        this.pageSize = pagination.pageSize || this.pageSize;
        this.currentLastKey = pagination.lastKey || null;
        this.hasNext = !!pagination.lastKey;
        this.hasPrevious = this.previousKeys.length > 0;

        // Clear filter dropdown
        this.selectedStatusDropdown = '';
      } else {
        console.warn('Refer and Earn list response is empty or invalid.');
      }
    } catch (error: any) {
      this.spinner.hide();
      this.errorHandlingService.handleApiError(error, () => {
        this.errorMessage = "Something went wrong. Please try again later.";
        this.errorTitle = "Error";
        this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
      });
    } finally {
      this.spinner.hide();
    }
  }

  async handleWithdrawalSubmission(payload: WithdrawalRequestPayload) {
    this.spinner.show();

    try {
      const response = await this.candidateService.requestWithdrawal(this.referralIdForWithdraw, payload);

      if (response) {
        this.closeModal(); // Close the bank details form modal

        // Use the previous lastKey if available; otherwise, start fresh
        const keyToUse = this.getKeyForCurrentPage();

        // Refresh or fetch updated data after withdrawal
        await this.getReferAndEarnList(keyToUse);
      }
    } catch (error: any) {
      this.spinner.hide();
      this.errorHandlingService.handleApiError(error, () => {
        this.successMessage = "Something went wrong. Please try again later.";
        this.successTitle = "Error";
        this.openModal(ModalType.SUCCESS_MESSAGE);
      });
    } finally {
      this.spinner.hide();
    }
  }

  showPaymentDetails(referral:any) {
    if(referral.paymentDoneDetails && referral.referrerBankDetails) {
      this.paymentDoneDetails = referral.paymentDoneDetails;
      this.referrerBankDetails = referral.referrerBankDetails;
      this.openModal(ModalType.SHOW_PAYMENT_DONE_DETAILS);
    }
  }

  // async fetchJobDetails(jobId: any) {
  //   try {
  //     const response: any = await this.adminService.getJobDetailsById(jobId);
  //     if (response && response.length > 0) {
  //       this.jobDetails = response[0];
  //       this.companyDetails = response[0].companyDetails;
  //     } else {
  //       console.warn("Job details response is empty or undefined.");
  //       this.jobDetails = [];
  //     }
  //   } catch (error: any) {
  //     if (error.status === 404) {
  //       this.router.navigate(['/auth/logout']);
  //     } else if (error.status === 401) {
  //       this.router.navigate(['/']);
  //     } else {
  //       console.error("Error fetching job details:", error);
  //       this.modalSize = 'md';
  //       this.successMessage = "Something went wrong. Please try again later.";
  //       this.successTitle = "Error";
  //       this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
  //     }
  //   }
  // }

  getFilteredData() {
    const referralStatus = this.referralStatusControl.value;
    const withdrawalStatus = this.withdrawalStatusControl.value;

    this.referralStatus = referralStatus;
    this.withdrawalStatus = withdrawalStatus;

    this.previousKeys = [];
    // Your API call or filtering logic
    this.getReferAndEarnList(null);
  }

  hasRequestedWithdrawal(referral: any): boolean {
    return referral?.statusTracker?.some(
      (entry: any) => entry.newStatus === 'WITHDRAWAL_REQUESTED'
    );
  }

  withdrawMoney(referral: any) {
    this.referralIdForWithdraw = referral?.id;
    this.openModal(this.modalType.BANK_DETAILS_POPUP)
  }

  navigateToJobUrl(event: any): void {
    event.preventDefault(); // Prevents default browser navigation
    if (this.jobUrl) {
      window.open(this.jobUrl, '_blank'); // Opens the link in a new tab
    }
  }

  openInNewTab(url: string) {
    if (url) {
      window.open(url, '_blank'); // Open in a new tab
    }
  }

  getJobLink(): void {

    // Encode the company name and job title for URL-safe navigation
    const formattedCompanyName = this.companyDetails?.name.toLowerCase().replace(/\(.*?\)/g, '').replace(/\s*&\s*/g, '&').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    const formattedJobTitle = this.jobDetails?.jobTitle.toLowerCase().replace(/\(.*?\)/g, '').replace(/\s*&\s*/g, '&').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    const route = `/company/jobs/${formattedCompanyName}-jobs/${formattedJobTitle}-${this.jobId}`;
    this.jobUrl = route;
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

  onPageSizeChange(event: Event): void {
    const selectedPageSize = (event.target as HTMLSelectElement).value;
    this.pageSize = Number(selectedPageSize);
    this.previousKeys = [];
    this.getReferAndEarnList(null); // Call getReferAndEarnList refresh the data with the new page size
  }

  onSortOrderChange(event: any) {
    this.selectedSortOrder = event.target.value;
    const keyToUse = this.getKeyForCurrentPage();
    this.getReferAndEarnList(keyToUse);
  }

  callApiWithSearchQuery(query: string): void {
    this.searchTerm = query; // Setting here encoded query to filterData
    this.previousKeys = []; // Resetting pagination keys to refresh the data based on fresh search
    this.getReferAndEarnList(null); // Starting from the beginning by passing `null` for `lastKey` to fetch the initial page of results.
  }

  clearSearchInput() {
    this.searchTerm = "";
    this.searchQuery = '';

    this.previousKeys = [];
    this.getReferAndEarnList(null);
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

  hasStatusInTracker(statusTracker: any[], statusToCheck: string): boolean {
    return statusTracker.some(
      (tracker) => tracker.oldStatus === statusToCheck || tracker.newStatus === statusToCheck
    );
  }

  //Rejected reason will come here from the reject modal
  receiveDataFromChild(data: any) {

    this.spinner.show();
    let rejectReasonsData = data;

    // this.updateJobApplicationStatus(this.currentJob.id, this.newStatus, rejectReasonsData).then(async (response: any) => {
    //   if (response) {
    //     this.spinner.hide();
    //     this.closeModal();
    //     // Refresh jobApplicationListing data
    //     // await this.getAllJobApplications(null);
    //   }
    // })
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
      [this.modalType.BANK_DETAILS_POPUP]: { size: "md", close: true },
      [this.modalType.SHOW_PAYMENT_DONE_DETAILS]: { size: "md", close: true}
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
    this.closeModal();
  }

  /**
   * Resets the search input and shows all jobs.
   */
  resetBtnHandler(): void {
    
    this.searchQuery = "";
    this.searchTerm = "";
    this.searchQuery = "";
    this.selectedSortOrder = this.sortOrder.DESC;

    this.previousKeys = [];
    // this.getReferAndEarnList(null);
    //  Reset button clicked
    this.referralStatusControl.reset('');
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
    this.getReferAndEarnList(this.currentLastKey);
  }

  onPrevious() {
    if (!this.hasPrevious) return;

    // Retrieve the second-to-last key in the stack, which corresponds to the last key used for the previous page
    const previousLastKey = this.previousKeys.length > 1 ? this.previousKeys[this.previousKeys.length - 2] : null;

    // Remove the current page's lastKey from the stack
    this.previousKeys.pop();

    if (!previousLastKey) {
      // If no valid previous key, fetch the first page
      this.getReferAndEarnList(null);
    } else {
      // Fetch the previous page using the second-to-last key
      this.getReferAndEarnList(previousLastKey);
    }

  }

}
