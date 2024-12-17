import { Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, map, of, switchMap } from 'rxjs';

import { CorporateService } from '../../services/corporate.service';

// Shared components like spinner ,modals and etcetras.
import { MatSort } from "@angular/material/sort";
import { ModalType } from "src/app/modules/shared/interfaces/shared.interface";
import { MatPaginator } from "@angular/material/paginator";
import { ModalComponent } from "src/app/modules/shared/components/modal/modal.component";
import { NgxSpinnerService } from "ngx-spinner";
import { MatTableDataSource } from "@angular/material/table";
import { CorporateVitalDetails } from '../../corporate.component';
import { emailDomainDenyListValidator } from 'src/app/modules/shared/data/email-domain-validator';


// Interface for FetchInviteOptionDto
interface FetchInviteOptionDto {
  companyId?: string;
  corporateUserType?: any;
  inviteStatus?: string;
  firstName?: string;
  searchText?: string;
  pageSize?: number;
  sortOrder?: string;
  resetPagination?: boolean;
}

@Component({
  selector: 'app-corporate-invites',
  templateUrl: './corporate-invites.component.html',
  styleUrls: ['./corporate-invites.component.scss']
})
export class CorporateInvitesComponent implements OnInit{
  // Corporate Vital Details
  corporateVitalDetails : CorporateVitalDetails = {}

  status = {
    ALL: "",
    AWAITING: "AWAITING",
    ACCEPTED: "ACCEPTED",
    EXPIRED: "EXPIRED",
    DELETED: "DELETED",
  };

  // DEFAULT MEMBER VARIABLES
  sortOrder = {
    ASC: "ascending",
    DESC: "descending",
  };
  userType = {
    ALL:"",
    ADMIN: "corporate-admin",
    RECRUITER: "corporate-recruiter",
  };

  corporateUserType = [
    { value: "corporate-admin", name: "ADMIN" },
    { value: "corporate-recruiter", name: "RECRUITER" },
  ]

  corporateCompanyName : string ="";

  // Corporate Invites related properties
  invites: any = [];
  noInviteMessage: string = "No Invite Present";
  selectedStatus:string = this.status.ALL;
  selectedCorporateUserType = "";
  selectedSortOrder: string = this.sortOrder.DESC;
  dataSource = new MatTableDataSource<any>(); // To store the updated data in the table

  // Properties related to the form
  inviteForm: FormGroup;
 
  //Filters Properties
  searchQuery: string = "";
  filteredInvites: any[] = [];

  // Properties related to modal handling
  modalType = ModalType;
  showModal: ModalType | undefined;
  modalMessage: string = "";
  modalTitle: string = "";
  @ViewChild(ModalComponent) modal!: ModalComponent;

  // Modal new Properties
  successtitle: string = "";
  redirectTitle: string = "";
  modalSize: string = "";
  errorMessage = "";
  redirectMessage = "";
  errorTitle = "Error";
  userId: any;

  //Pagination Properties
  
  lastKey: string | null = null; // The current lastKey for the current page
  previousKeys: string[] = []; // Stack to store previous lastKeys for "Previous" functionality
  hasNext: boolean = false; // To enable/disable "Next" button
  hasPrevious: boolean = false; // To enable/disable "Previous" button
  pageSize: number = 25; // Default page size
  pageSizeOptions: number[] = [25, 50, 100, 150];

  @ViewChild("companyJobMatSort") companyJobMatSort!: MatSort; //@todo RENAME THIS AND SEE WHERE ITS GETTING UTILIZED
  @ViewChild("companyJobMatPaginator") companyJobMatPaginator!: MatPaginator;

  // Misc Vars
  copiedContextId: any;
  isRecruiter: boolean = false;
  showCloseBtn: boolean = true;

  /**
   * Initializes the Component with the required services and sets up the job form.
   *
   * @param {Router} router - The Angular router service.
   * @param {FormBuilder} fb - The Angular form builder service.
   * @param {corporateService} CorporateService - The admin service for API calls.
   * @param {NgxSpinnerService} spinner - The service for displaying a loading spinner.
   */
  constructor(private router: Router,
    private fb: FormBuilder,
    private corporateService: CorporateService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef) {

    // Initialize the corporate Invite form with necessary fields and validation
    this.inviteForm = this.fb.group({
      companyId: ["", Validators.required],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: [
        "",
        [Validators.required, Validators.email, emailDomainDenyListValidator()]
      ],
      corporateUserType: [this.userType.RECRUITER, Validators.required],
    });
  }
  // Implement the OnInit function to fetch the records on component initialization
  ngOnInit(): void {
    // Set up the corporateVitalDetails
    this.corporateService.corporateDetails$.subscribe((details) => {
      if (details) {
        this.corporateVitalDetails = details;
        this.corporateCompanyName = this.corporateVitalDetails.companyName || "";
        this.inviteForm.patchValue({
          companyId: this.corporateVitalDetails.companyId,
        });
        this.corporateVitalDetails.corporateUserType === this.userType.RECRUITER ? this.isRecruiter = true : this.isRecruiter = false;
    
        this.fetchInvites({
           companyId:this.corporateVitalDetails.companyId,
           pageSize: 25,
           sortOrder: this.sortOrder.DESC,
           resetPagination: true });

      }
    });
     
    // Fetch jobs on component initialization
  }

  /**
  * fetchInvites
  *
  * Fetches jobs from the server.By taking options as args and
  */
  async fetchInvites(options: FetchInviteOptionDto) {
    this.spinner.show();
    try {
      const companyId = this.corporateVitalDetails.companyId;

      // If resetPagination is true, reset the lastKey
      if (options.resetPagination) {
        this.lastKey = null;
      }
      const params = {
        companyId ,
        corporateUserType:options.corporateUserType,
        inviteStatus: options.inviteStatus,
        searchText: options.searchText,
        pageSize: options.pageSize,
        lastKey: this.lastKey,
        sortOrder: options.sortOrder,
      };
      const response = await this.corporateService.getCorporateInvites(params);
      if (response) {
        this.invites = response.data;
        this.lastKey = response.pagination.lastKey;
        this.pageSize = response.pagination.pageSize;

        this.hasNext = !!response.pagination.lastKey;
        this.hasPrevious = this.previousKeys.length > 0;
        this.updateData(this.invites);

        // Reset the paginator to the first page if necessary when mat-paginator is available and resetPagination is true
        if (options.resetPagination && this.companyJobMatPaginator) {
          this.companyJobMatPaginator.firstPage();
        }
      }
    } catch (error: any) {
      // Hide the spinner
      this.spinner.hide();
      if (error.status === 404) {
        // If page not found then open modal saying thaat somthing is wrong cant fetch the data
        this.modalSize = "sm";
        this.errorMessage = "Something went wrong. Please try reload the Page.";
        this.successtitle = "Error";
        this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);

      } else if (error.status === 401) {
        this.router.navigate(["/"]);
      } else {
        this.errorMessage = "Something went wrong. Please try again later.";
        this.successtitle = "Error";
        this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
      }
    } finally {
      this.spinner.hide();
    }
  }

  /**
   * updateData: Updates the data in the table.
   */
  // Update data method
  updateData(data: any) {
    this.filteredInvites = data;
    this.dataSource.data = this.filteredInvites;
    this.dataSource.paginator = this.companyJobMatPaginator;
    this.dataSource.sort = this.companyJobMatSort; // Ensure sorting is applied

    // Optional: Reset the paginator if needed
    if (this.companyJobMatPaginator) {
      this.companyJobMatPaginator.firstPage();
    }
  }

  // Validation function for common and specific checks
  isInvalid(controlName: string): boolean {
    const control = this.inviteForm.get(controlName);

    if (!control) {
      return false;
    }
    // Common validation: control should be invalid and touched/dirty
    return control.invalid && (control.dirty || control.touched);
  }

  // Helper method to get the error message
  getErrorMessage(controlName: string): string | null {
    const control = this.inviteForm.get(controlName);

    // Check if the control is invalid and touched/dirty
    if (this.isInvalid(controlName)) {
      // Check and return specific validation error messages
      if (control?.errors) {
        if (control.errors["required"]) {
          return "This field is required";
        }
        if (control.errors["pattern"]) {
          return "Invalid format, allowed symbols [.,?!-'\"]";
        }
        if (control.errors["email"]) {
          return "Please enter a valid email address";
        }
        if (control.errors["personalEmail"]) {
          return "Personal email addresses are not allowed";
        }
      }
    }

    return null;
  }

  // Method to mark form control as touched when user leaves the input
  markControlAsTouched(controlName: string): void {
    const control = this.inviteForm.get(controlName);
    if (control) {
      control.markAsTouched(); // Marks control as touched to trigger validation
    }
  }

/**
 * OpenCreateInviteModal
 */
  openCreateInviteModal(): void {
    this.showCloseBtn = false;
    this.openModal(this.modalType.CORPORATE_USER_ADD_INVITE)
  }
  
  /* Company Selector Ends Here */

    /**
   * onStausChange
   *
   * Updates the status of a job. and fetch the desired jobs based on the status.
   */
    onStatusChange(statusVal: any) {
      if (statusVal.target.value === this.status.ALL) {
        this.selectedStatus = this.status.ALL;
        this.fetchInvites({ pageSize: this.pageSize, resetPagination: true }); // Fetch all jobs
        return;
      }
      this.selectedStatus = statusVal.target.value; // Update global variable
      this.fetchInvites({corporateUserType : this.selectedCorporateUserType, searchText:this.searchQuery,inviteStatus: this.selectedStatus, pageSize: this.pageSize,sortOrder: this.selectedSortOrder, resetPagination: true }); // Fetch jobs with the new status
    }

 /**
   * onSortOrderChange
   *
   * Updates the sort order of the jobs.
   */
  onSortOrderChange(event: any) {
        // console.log("Sort order:", event.target.value);
        this.fetchInvites({corporateUserType : this.selectedCorporateUserType, searchText:this.searchQuery,inviteStatus: this.selectedStatus, pageSize: this.pageSize, sortOrder: event.target.value, resetPagination: true });
      }

  /**
   * onCorporateUserTypeChange
   * 
   * Updates the corporate user type and fetch the desired jobs based on the user type.
   */
  onCorporateUserTypeChange(corporateUserType: any) {
    if (corporateUserType.target.value === this.userType.ALL) {
      this.selectedCorporateUserType = this.userType.ALL;
      this.fetchInvites({ pageSize: this.pageSize, resetPagination: true }); // Fetch all jobs
      return;
    }
      this.selectedCorporateUserType = corporateUserType.target.value; // Update global variable
      this.fetchInvites({ corporateUserType : this.selectedCorporateUserType ,searchText:this.searchQuery,inviteStatus: this.selectedStatus, pageSize: this.pageSize, sortOrder: this.selectedSortOrder,resetPagination: true }); // Fetch jobs with the new status
    }

  /**
   * Submits the job form and creates a new job.
   */
  async onSubmit(): Promise<void> {
    if (this.inviteForm.valid) { // Ensure error is falsy, not just an empty string
      this.spinner.show();
      try {
        await this.corporateService.createInvite(this.inviteForm.value);  // Await the async call
        await this.fetchInvites({ pageSize: 10, sortOrder: this.sortOrder.DESC, resetPagination: true });
        this.closeModal();  // Close modal only after a successful fetch
      } catch (error: any) {
        console.error("Invite creation failed:", error);  // Log the actual error for debugging
        this.errorTitle = "Error";
        this.errorMessage = error.status === 409 ? error.error?.errorMsg : "Something went wrong. Please try again later.";  // Show specific error message if available
        this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);  // Ensure correct modal type
      } finally {
        this.spinner.hide();  // Always hide spinner regardless of success or failure
      }
    } else {
      // Optional: Handle form validation errors here, e.g., show a message if the form is invalid
      console.warn("Form submission blocked due to validation errors");
    }
  }

  /**
   * updateStatus
   * 
   * Updates the status of a job. and fetch the desired jobs based on the status.
   * 
   * @param status - New status to be updated
   */
  async updateStatus(status: string, inviteId: string): Promise<void> {
    this.spinner.show();
    try {
      const companyId = this.corporateVitalDetails.companyId;
    await this.corporateService.updateInviteStatus(inviteId, status , companyId! );
      await this.fetchInvites({ pageSize: this.pageSize, resetPagination: true });
    } catch (error) {
      console.error("Invite status update failed:", error);
      this.errorTitle = "Error";
      this.errorMessage = "Something went wrong. Please try again later.";
      this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
    } finally {
      this.spinner.hide();
    }
  }

  // Delete invite
  async deleteInvite(inviteId: string): Promise<void> {
    this.spinner.show();
    try {
      const companyId = this.corporateVitalDetails.companyId;
    await this.corporateService.deleteInvite(inviteId , companyId! );
      await this.fetchInvites({ pageSize: this.pageSize, resetPagination: true });
    } catch (error) {
      console.error("Invite status update failed:", error);
      this.errorTitle = "Error";
      this.errorMessage = "Something went wrong. Please try again later.";
      this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
    } finally {
      this.spinner.hide();
    }
  }
  

  /**
   * openModal
   * 
   * Opens the modal with the given message and title.
   * 
   * @param modalType - Type of modal to be opened
   * @param message - Message to be displayed in the modal
   * @param title -Title of the modal
   */
  openModal(modalType: ModalType, message: string = "", title: string = ""): void {
    this.showModal = modalType;
    // Reset modal size every time you open the modal
    if (modalType === this.modalType.SUCCESS_MESSAGE) {
      this.modalSize = "md";
    }
    this.cdr.detectChanges();
    this.modalMessage = message;
    this.modalTitle = title;
    this.modal.open();
  }

  // Closes the currently opened modal
  closeModal(): void {
    this.resetModal();
    this.modal.cancel();
  }

  /*
   * @method searchJobs
   * @param query - The search query.
   */
    async searchJobs(event: any) {
      this.searchQuery = event.target.value;
      //  console.log("Search query:", this.searchQuery);
     this.fetchInvites({ inviteStatus: this.selectedStatus, searchText: this.searchQuery, pageSize: this.pageSize });
      if (this.filteredInvites.length == 0) {
        this.noInviteMessage = "No Invite present with this name or description";
      }
    }

  // Reset the job Form modal
  resetModal(): void {
    this.inviteForm.reset();
    this.inviteForm.patchValue({
      companyId: this.corporateVitalDetails.companyId,
      corporateUserType: this.userType.RECRUITER,
    });
    this.resetBtnHandler()
  }

  // Misc method
  getStatusClass(status: string): string {
    return `invite-${status.toLowerCase()}`; // Returns 'user-admin' 'user-recruiter';
  }

  // Copy the context ID to the clipboard
  copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    this.copiedContextId = id;
    setTimeout(() => {
      this.copiedContextId = null;
    }, 2000);
  };
  //Pagination methods
  /**
   * @method onPageChange - this will be called when the user changes the page size
   * @param event
   */

  onNext() {
    if (!this.hasNext) return;

    // Store the current lastKey in the stack before moving forward
    if (this.lastKey) {
      this.previousKeys.push(this.lastKey);
    }

    // Fetch the next page
    this.fetchInvites({ inviteStatus:this.selectedStatus,corporateUserType:this.selectedCorporateUserType, searchText: this.searchQuery, pageSize: this.pageSize, sortOrder: this.selectedSortOrder , resetPagination: false });
  }


  onPrevious() {
    if (!this.hasPrevious) return;

    // Retrieve the second-to-last key in the stack, which corresponds to the last key used for the previous page
    const previousLastKey = this.previousKeys.length > 1 ? this.previousKeys[this.previousKeys.length - 2] : null;

    // Remove the current page's lastKey from the stack
    this.previousKeys.pop();

    if (!previousLastKey) {
      // If no valid previous key, fetch the first page
      this.fetchInvites({ inviteStatus:this.selectedStatus,corporateUserType:this.selectedCorporateUserType, searchText: this.searchQuery, pageSize: this.pageSize, sortOrder: this.selectedSortOrder, resetPagination: true });
    } else {
      // Fetch the previous page using the second-to-last key
     this.lastKey = previousLastKey;
     this.fetchInvites({ inviteStatus:this.selectedStatus,corporateUserType:this.selectedCorporateUserType, searchText: this.searchQuery, pageSize: this.pageSize, sortOrder: this.selectedSortOrder, resetPagination: false });
    }
  }

  onPageSizeChange(event: Event): void {
    const selectedPageSize = (event.target as HTMLSelectElement).value;
    this.pageSize = Number(selectedPageSize);
    this.previousKeys = [];
    this.fetchInvites({ inviteStatus:this.selectedStatus,corporateUserType:this.selectedCorporateUserType, searchText: this.searchQuery, pageSize: this.pageSize, sortOrder: this.selectedSortOrder, resetPagination: true });
  }

    /**
   * Resets the search input and shows all jobs.
   */
    resetBtnHandler(): void {
      /*     console.log("Reset button clicked");
       */ 
          this.searchQuery = "";
          this.selectedStatus = this.status.ALL;
          this.selectedCorporateUserType = this.userType.ALL;
          this.fetchInvites({
            companyId:this.corporateVitalDetails.companyId,
            pageSize: this.pageSize,
            sortOrder: this.sortOrder.DESC,
            resetPagination: true });
 
       }
}
