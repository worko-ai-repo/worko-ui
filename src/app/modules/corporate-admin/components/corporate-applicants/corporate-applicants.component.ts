import { ActivatedRoute, Router } from "@angular/router";
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from "@angular/forms";

// Rxjs import for observable debounceTime, distinctUntilChanged, of, switchMap
import { Observable, Subject, debounceTime, distinctUntilChanged, map, of, switchMap } from "rxjs";

// Service module import for Api calling
import { CorporateService } from "../../services/corporate.service";

// Shared components like spinner ,modals and etcetras.
import { MatSort, Sort } from "@angular/material/sort";
import { ModalType } from "src/app/modules/shared/interfaces/shared.interface";
import { MatPaginator } from "@angular/material/paginator";
import { ModalComponent } from "src/app/modules/shared/components/modal/modal.component";
import { NgxSpinnerService } from "ngx-spinner";
import { MatTableDataSource } from "@angular/material/table";
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";

import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { StorageService } from "src/app/modules/app-core/services/storage.service";

interface FetchJobsOptionsDto {
  companyId?: string;
  jobStatus?: string;
  searchText?: string;
  pageSize?: number;
  sortOrder?: string;
  resetPagination?: boolean;
}

interface RangeDropDownDto {
  label: string;
  value: {
    min: number;
    max: number;
  };
}

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
  selector: 'app-corporate-applicants',
  templateUrl: './corporate-applicants.component.html',
  styleUrls: ['./corporate-applicants.component.scss']
})


export class CorporateApplicantsComponent {

  userType: any;

  cvUrl: SafeResourceUrl | null = null;
  cvPath: any = "";
  // cvPath = 'https://worko-app-dev.s3.ap-south-1.amazonaws.com/users/e1134dca-6071-70ff-2941-54fcce656f38/resumes/01JA89YTM0MAGV6E511PWYWK8W.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=REDACTED%2F20241201%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20241201T163703Z&X-Amz-Expires=900&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAEaCmFwLXNvdXRoLTEiRzBFAiEAr88kTmkBHmAvjf%2FzP7s3RjtKeQU6LpsjYeUMyPkkIvcCIHwNciYBStd2TYCaSbwjyf21cEIh7AuapST8zglX54GNKoADCKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMMjExMTI1MzUzODk5Igz6yFDKzOE64ST9i%2BIq1AJTey%2BH53l45ZwuhS83bAaTfamgYsWPNzKVUW4boZ1L82ERqQ2s60c730t1tcQjD7MvuGRZeO%2BfjH6OCdCPcgQ9YT16mbch4PgUrulW3dSqAHC1FpnWOJHoql8OPjG8gMD7Ixe8DUioH9ERvo2KIThxpqdfrznF0Oy8%2FmcXm4NCgGnLs0pNBvRnSFjhtu7zr%2B18QQPjxxcRWogNIUMOEfvgGXFOcEHftQwXreS5DqBECs2AAvx%2FO1yFuq%2FcFvB8KFlmdjJjp286LFE64Bkbgfmkxbk9uNjbWP9p3CX%2BfkaQ%2FZBJS2SuAW8zZUmr%2Fg24UekoQzOeyrKFOWl1ZaysQsgCGjM8c8RXvP01pq%2Bsam7ZI1RmogCB4v5%2FdXzAtmZ8rPypQWvjgGEjx9TYrAOGQ1kF7p2M5VibbU10AbWXm%2BzBmlC367r45MmzNldCJhktz%2F5UNwZ9MKyfsroGOp4BPgc0U%2FnfnE3%2FpDES7OH3BUvdb69%2B21hGuqLSKjj1jLed5bmFBd5%2B98pOOr7szw92%2FqF4JJnWn7Dx6HS%2FPqYMknEAJn1w2sSGuhBIKFNENTPw2s2eKlvr2ntki6%2BCiR3kdUlzZhnZDLUXSRdZxfWh8t%2BvaEjQz5YABTYdCIRVUBwNaQVxltVI28aP4iughY3xcJbJEgxZZDS9MiFlWMs%3D&X-Amz-Signature=a1de102fdc60db73cc134715d78b3cc296e17b2bf70338cbe8c7ca8f48c39c41&X-Amz-SignedHeaders=host';

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

  // Corporate Jobs Component Properties
  corporateVitalDetails: CorporateVitalDetails = {};

  // Properties related to job management
  jobs: any[] = []; // To store the fetched jobs
  jobId: string | null = null; // Variable to store the job ID
  dataSource = new MatTableDataSource<any>(); // To store the updated data in the table
  selectedStatus: string = this.status.ALL_APPLICATIONS;
  noApplicationsMessage: string = "No Job Applications Present"; // Will be showin inside the table

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

  // Component properties
  copiedContextId: any;
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
  detailsTitle: string = "Detailed Analysis"
  scoreDetails: any = "";

  userId: any = " ";
  emailAddress: any = "";
  currentJob: any;
  newStatus: any;

  companyDetails: any;
  jobUrl: any;


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

    // this.emailAddress = this.storage.get("useremail");
    // this.userId = this.storage.get("userId");
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

    // else {
    //   try {
    //     await this.fetchJobDetails(this.jobId);
    //     this.getAllJobApplications(null);
    //   } catch (error) {
    //     console.error('Error fetching job details:', error);
    //   }
    // }

    this.corporateVitalDetails.cognitoUserId = this.storage.get("cognitoUserId");

    if (this.corporateVitalDetails.cognitoUserId) {
      this.spinner.show(); // Show spinner before starting API calls

      try {
        await this.fetchUserDetailsWithCompany(this.corporateVitalDetails.cognitoUserId);
      } catch (error) {
        console.error("Error in ngOnInit while fetching user details:", error);
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

    // this.getAllJobApplications(null);
    // this.cvUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.cvPath);

    // Set up the corporateVitalDetails
    // this.corporateService.corporateDetails$.subscribe((details) => {
    //   if (details) {
    //     console.log("user details is", details)
    //     this.corporateVitalDetails = details;

    // this.jobForm.patchValue({
    //   companyId: this.corporateVitalDetails.companyId,
    // });

    // this.fetchJobs({
    //   // companyId:this.corporateVitalDetails.companyId,
    //   companyId: "01HZM77T3F331PMJP1C8B75N1P",
    //   pageSize: 10,
    //   sortOrder: this.sortOrder.DESC,
    //   jobStatus: this.status.ALL,
    //   resetPagination: true,
    // });
    //   }
    // });

  }

  navigateToJobUrl(event: any): void {
    event.preventDefault(); // Prevents default browser navigation
    if (this.jobUrl) {
      window.open(this.jobUrl, '_blank'); // Opens the link in a new tab
    }
  }

  getJobLink(): void {

    // Encode the company name and job title for URL-safe navigation
    const formattedCompanyName = this.companyDetails?.name.toLowerCase().replace(/\(.*?\)/g, '').replace(/\s*&\s*/g, '&').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    const formattedJobTitle = this.jobDetails?.jobTitle.toLowerCase().replace(/\(.*?\)/g, '').replace(/\s*&\s*/g, '&').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    const route = `/company/jobs/${formattedCompanyName}-jobs/${formattedJobTitle}-${this.jobId}`;
    this.jobUrl = route;
  }

  // Fetching the user details with company
  async fetchUserDetailsWithCompany(cognitoUserId: string) {
    try {
      let userDetail = await this.corporateService.getCorporateUserDetailById(cognitoUserId);

      if (userDetail) {
        this.corporateVitalDetails.companyId = userDetail[0]?.companyId || null;
        this.corporateVitalDetails.corporateUserType = userDetail[0]?.corporateUserType || null;
        this.userType = userDetail[0]?.corporateUserType || null;
        this.corporateVitalDetails.userId = userDetail[0]?.id || null;
        this.corporateVitalDetails.email = userDetail[0]?.email || null;

        // console.log(this.corporateVitalDetails);

        // Fetch job details and applications after user details are fetched
        if (this.jobId) {
          await this.fetchJobDetails(this.jobId);
          this.getJobLink();
          this.getAllJobApplications(null);
        } else {
          console.warn("Job ID is not available.");
        }
      } else {
        console.warn("No user details found for the given Cognito User ID.");
      }
    }
    catch (error) {
      console.error("Error fetching user details:", error);
      throw error; // Let ngOnInit handle the modal and spinner
    }
  }

  formatRange(min: number, max: number, type: string): string {
    if (type === 'experience') {
      if (min === 0 && max === 0) return '-'; // Handling edge case for no experience range
      return `${min}-${max} ${max === 1 ? 'Year' : 'Years'}`;
    } else if (type === 'salary') {
      if (min === 0 && max === 0) return '-'; // Handling edge case for no salary range
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
    this.getAllJobApplications(null); // Call getAllJobApplications refresh the data with the new page size
  }

  onSortOrderChange(event: any) {
    this.selectedSortOrder = event.target.value;
    const keyToUse = this.getKeyForCurrentPage();
    this.getAllJobApplications(keyToUse);
  }

  callApiWithSearchQuery(query: string): void {
    this.searchTerm = query; // Setting here encoded query to filterData
    const keyToUse = this.getKeyForCurrentPage();
    this.getAllJobApplications(keyToUse);
  }

  clearSearchInput() {
    this.searchTerm = "";
    this.searchQuery = '';

    // Use the previous lastKey if available; otherwise, start fresh
    const keyToUse = this.getKeyForCurrentPage();
    this.getAllJobApplications(keyToUse);
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
    const companyId = this.corporateVitalDetails.companyId;
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

  // CompanyId(CompanyId: any, pageSize: number, lastKey: string | null, sortOrder: { ASC: string; DESC: string; }, searchTerm: string, arg5: string) {
  //   throw new Error("Method not implemented.");
  // }
  // searchTerm(pageSize: number, lastKey: string | null, sortOrder: { ASC: string; DESC: string; }, searchTerm: any, arg4: string) {
  //   throw new Error("Method not implemented.");
  // }


  // @TODO Add to reusable code
  /**
   * toTitleCase
   * 
   * Converts a string to title case.
   */
  toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
  // /**
  //  * fetchJobs
  //  *
  //  * Fetches jobs from the server.By taking options as args and
  //  */
  // async fetchJobs(options: FetchJobsOptionsDto) {
  //   this.spinner.show();
  //   try {
  //     // If resetPagination is true, reset the lastKey
  //     if (options.resetPagination) {
  //       this.lastKey = undefined;
  //     }
  //     const params = {
  //       // companyId : this.corporateVitalDetails.companyId,
  //       companyId: "01HZM77T3F331PMJP1C8B75N1P",
  //       status: options.jobStatus,
  //       searchText: options.searchText,
  //       pageSize: options.pageSize,
  //       lastKey: this.lastKey,
  //       sortOrder: options.sortOrder,
  //     };
  //     debugger;
  //     const response = await this.corporateService.getJobs(params);
  //     if (response) {
  //       this.jobs = response.data;
  //       this.lastKey = response.pagination.lastKey;
  //       this.pageSize = response.pagination.pageSize;

  //       this.updateData(this.jobs);

  //       // // Reset the paginator to the first page if necessary when mat-paginator is available and resetPagination is true
  //       // if (options.resetPagination && this.companyJobMatPaginator) {
  //       //   this.companyJobMatPaginator.firstPage();
  //       // }
  //     }
  //   } catch (error: any) {
  //     this.spinner.hide();
  //     if (error.status === 404) {
  //       this.router.navigate(["/admin/dashboard"]);
  //     } else if (error.status === 401) {
  //       this.router.navigate(["/"]);
  //     } else {
  //       this.successmessage = "Something went wrong. Please try again later.";
  //       this.successtitle = "Error";
  //       this.openModal(ModalType.SUCCESS_MESSAGE);
  //     }
  //   } finally {
  //     this.spinner.hide();
  //   }
  // }

  // async fetchJobDetails(jobId: any) {
  //   this.spinner.show();
  //   this.corporateService.getJobDetailsById(jobId).then((response: any) => {
  //     if (response) {
  //       this.spinner.hide();
  //       this.jobDetails = response[0];
  //     }
  //   }).catch((error: any) => {
  //     if (error.status == 404) {
  //       this.spinner.hide()
  //       this.router.navigate(['/auth/logout']);
  //     } else if (error.status == 401) {
  //       this.spinner.hide();
  //       this.router.navigate(['/']);
  //     }
  //     this.spinner.hide();
  //     this.jobDetails = [];
  //   }
  //   );
  // }

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
      if (error.status === 401) {
        this.router.navigate(['/']);
      } else {
        console.error("Error fetching job details:", error);
        this.modalSize = 'md';
        this.successMessage = "Something went wrong. Please try again later.";
        this.successTitle = "Error";
        this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
      }
    } finally {
      this.spinner.hide();
    }
  }


  handleAction(job: any, newStatus: any) {

    // Check if the current job's status is already at or beyond "View CV" (CV_DOWNLOADED)
    if (this.isStatusBeyondCurrent(job.status, newStatus)) {
      if (newStatus === "CV_DOWNLOADED") {
        // Directly open the CV modal if status is greater than or equal to "CV_DOWNLOADED"
        this.cvUrl = this.sanitizer.bypassSecurityTrustResourceUrl(job?.applicantDetails?.cvAwsS3SignedUrl);
        this.openModal(ModalType.VIEW_CV);
      }
      return;
    }

    // Check the statusTracker before proceeding
    if (this.hasStatusInTracker(job.statusTracker, newStatus)) {
      console.warn(`Status '${newStatus}' already exists in statusTracker. Skipping update.`);
      return; // Exit early if the status is already in the tracker
    }

    this.currentJob = job;
    this.newStatus = newStatus;

    if (newStatus === "REJECTED") {
      this.openModal(ModalType.REJECTED_REQUEST);
      return;
    }

    this.updateJobApplicationStatus(job.id, newStatus);
    // Call updateStatus API if the status is not already in the tracker
    // this.updateJobApplicationStatus(job.id, newStatus).then(async (response: any) => {
    //   if (response) {
    //     // Refresh jobApplicationListing data
    //     await this.getAllJobApplications(null);
    //     if (response.status === "CV_DOWNLOADED") {
    //       this.cvUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.currentJob?.applicantDetails?.cvAwsS3SignedUrl);
    //       this.openModal(ModalType.VIEW_CV);
    //     }
    //   }
    // }).catch((error) => {
    //   this.successMessage = "Something went wrong. Please try again later.";
    //   this.successTitle = "Error";
    //   this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
    // });
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
      userId: this.corporateVitalDetails.userId,
      status: newStatus,
      emailId: this.corporateVitalDetails.email, // Email of the corporate user
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
        await this.getAllJobApplications(null);
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

    this.updateJobApplicationStatus(this.currentJob.id, this.newStatus, rejectReasonsData).then(async (response: any) => {
      if (response) {
        this.spinner.hide();
        this.closeModal();
        // Refresh jobApplicationListing data
        // await this.getAllJobApplications(null);
      }
    }).catch((error) => {
      this.spinner.hide();
      this.successMessage = "Something went wrong. Please try again later.";
      this.successTitle = "Error";
      this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
    });
  }
  // /**
  //  * updateData: Updates the data in the table.
  //  */
  // // Update data method
  // updateData(data: any) {
  //   this.filteredJobs = data;
  //   this.dataSource.data = this.filteredJobs;
  //   this.dataSource.paginator = this.companyJobMatPaginator;
  //   this.dataSource.sort = this.companyJobMatSort; // Ensure sorting is applied

  //   // Optional: Reset the paginator if needed
  //   if (this.companyJobMatPaginator) {
  //     this.companyJobMatPaginator.firstPage();
  //   }
  // }


  /* Skills selector ends here */

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
    // Reset modal size every time you open the modal
    if (modalType === this.modalType.SHOW_MORE_DETAILS) {
      this.modalSize = "lg";
      this.showClose = true;
    }
    else if (modalType === this.modalType.VIEW_CV) {
      this.modalSize = "xl";
      this.showClose = true;
    }
    else if (modalType === this.modalType.REJECTED_REQUEST) {
      this.showClose = true;
    }
    else {
      this.modalSize = "md";
      this.showClose = false;
    }

    this.cdr.detectChanges();
    this.modalMessage = message;
    this.modalTitle = title;
    this.modal.open();
  }

  // Closes the currently opened modal
  closeModal(): void {
    // this.resetModal();
    // this.companyControl.enable();
    // this.isEditMode = false;
    this.modal.cancel();
  }

  continue() {
    this.router.navigate(['/corporate/cJobs']);
    this.closeModal();
  }

  // Opens the job Form modal
  openModalone(): void {
    this.openModal(ModalType.ADMINJOBS_POPUP);
  }

  /**
   * Resets the search input and shows all jobs.
   */
  resetBtnHandler(): void {
/*     console.log("Reset button clicked");
 */    this.searchQuery = "";
    this.selectedStatus = this.status.ALL_APPLICATIONS;
    this.searchTerm = "",
      this.searchQuery = "";
    this.selectedSortOrder = this.sortOrder.DESC;

    // (document.getElementById('referralStatus') as HTMLSelectElement).value = "";

    // Use the previous lastKey if available; otherwise, start fresh
    const keyToUse = this.getKeyForCurrentPage();
    this.getAllJobApplications(keyToUse);
  }

  /**
   * onStausChange
   *
   * Updates the status of a job. and fetch the desired jobs based on the status.
   */
  onStatusChange(statusVal: any) {
    if (statusVal.target.value === this.status.APPLIED) {
      this.selectedStatus = this.status.APPLIED;
      // Use the previous lastKey if available; otherwise, start fresh
      const keyToUse = this.getKeyForCurrentPage();
      // Call API to get data
      this.getAllJobApplications(keyToUse);
      return;
    }
    this.selectedStatus = statusVal.target.value; // Update global variable
    // Use the previous lastKey if available; otherwise, start fresh
    const keyToUse = this.getKeyForCurrentPage();
    // Call API to get data
    this.getAllJobApplications(keyToUse);
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

  // onSort(sort: Sort): void {

  //   if (sort.active === 'date') {
  //     // this.lastKey = "";
  //     // this.pageSize = 50;
  //     this.sortOrder = this.sortOrder === 'ascending' ? 'descending' : 'ascending';
  //     sort.direction === 'asc' ? 'ascending' : 'descending';
  //     this.sort.direction = sort.direction;

  //     // Use the previous lastKey if available; otherwise, start fresh
  //     const keyToUse = this.getKeyForCurrentPage();
  //     // Call API to get data with the new sort direction
  //     this.getAllJobApplications(keyToUse);
  //   }
  // }

  //   /**
  //    * onSortOrderChange
  //    *
  //    * Updates the sort order of the jobs.
  //    */
  //   onSortOrderChange(event: any) {
  // /*     console.log("Sort order:", event.target.value);
  //  */    this.fetchJobs({ jobStatus: this.selectedStatus, pageSize: this.pageSize, sortOrder: event.target.value, resetPagination: true });
  //   }

  //   /**
  //    * Archives a job.
  //    * @param job - The job object to archive.
  //    */
  //   updateJobStatus = async (job: any, newStatus: string) => {
  // /*     console.log(job);
  //  */    try {
  //       this.spinner.show();
  //       const jobData = {
  //         companyId: job.PK.startsWith("COMP#ID#") ? job.PK.slice(8, -1) : job.PK,
  //         status: newStatus,
  //       };
  //       if (newStatus === this.status.CLOSED) {
  //         await this.corporateService.deleteJob(job.id, jobData);
  //       } else {
  //         this.corporateService.archiveJob(job.id, jobData);
  //       }

  //       // This will  Give time to If  Codition in the HTML to work as expected
  //       setTimeout(() => {
  //         this.fetchJobs({ jobStatus: this.selectedStatus, pageSize: this.pageSize, resetPagination: true, sortOrder: this.selectedSortOrder });
  //       }, 1000);
  //     } catch (error) {
  //       this.successmessage = "Something went wrong. Please try again later.";
  //       this.successtitle = "Error";
  //       this.openModal(ModalType.SUCCESS_MESSAGE);
  //     } finally {
  //       this.spinner.hide();
  //     }
  //   };

  // //Pagination methods
  // /**
  //  * @method onPageChange - this will be called when the user changes the page size
  //  * @param event
  //  */
  // onPageChange(event: any) {
  //   this.pageSize = event.pageSize;

  //   // Fetch jobs with pagination reset
  //   this.fetchJobs({ jobStatus: this.selectedStatus, pageSize: this.pageSize, resetPagination: false, sortOrder: this.selectedSortOrder });
  // }

  // Misc method
  getStatusClass(status: string): string {
    return `job-${status.toLowerCase()}`; // Returns 'job-published', 'job-closed', 'job-archived'
  }

  // Copy the context ID to the clipboard
  copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    this.copiedContextId = id;
    setTimeout(() => {
      this.copiedContextId = null;
    }, 2000);
  };

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



}
