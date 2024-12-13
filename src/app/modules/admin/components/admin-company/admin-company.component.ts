import { Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, map, of, switchMap } from 'rxjs';

import { AdminService } from '../../services/admin.service';

// Shared components like spinner ,modals and etcetras.
import { MatSort } from "@angular/material/sort";
import { ModalType } from "src/app/modules/shared/interfaces/shared.interface";
import { MatPaginator } from "@angular/material/paginator";
import { ModalComponent } from "src/app/modules/shared/components/modal/modal.component";
import { NgxSpinnerService } from "ngx-spinner";
import { MatTableDataSource } from "@angular/material/table";
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";


// Interface for FetchJobsOptionsDto
interface FetchJobsOptionsDto {
  corporateUserType?: any;
  inviteStatus?: string;
  firstName?: string;
  searchText?: string;
  pageSize?: number;
  sortOrder?: string;
  resetPagination?: boolean;
}

@Component({
  selector: 'app-admin-company',
  templateUrl: './admin-company.component.html',
  styleUrls: ['./admin-company.component.scss']
})
export class AdminCompanyComponent implements OnInit {
  status = {
    ALL: "",
    AWAITING: "AWAITING",
    ACCEPTED: "ACCEPTED",
    EXPIRED: "EXPIRED",
    CLOSED : "CLOSED"
  };

  // DEFAULT MEMBER VARIABLES
  sortOrder = {
    ASC: "ascending",
    DESC: "descending",
  };
  userType = {
    ALL:"",
    ADMIN: "ADMIN",
    RECRUITER: "RECRUITER",
  };

  corporateUserType = [
    { value: "ADMIN", name: "ADMIN" },
    { value: "RECRUITER", name: "RECRUITER" },
  ]

  // Corporate Invites related properties
  invites: any = [];
  isCompanyNameValid: boolean = false;
  dataSource = new MatTableDataSource<any>(); // To store the updated data in the table
  noInviteMessage: string = "No Invite Present";
  selectedStatus:string = this.status.ALL;
  selectedCorporateUserType = "";
  selectedSortOrder: string = this.sortOrder.DESC;

  // Properties related to the form
  companyForm: FormGroup;
  companyControl = new FormControl(); // Form control for company selection
  companyNameError: string = "";
  filteredCompanies$: Observable<any[]> = of([]);
  selectedCompany: any = null;
  @ViewChild("autoCompleteInput", { static: false, read: MatAutocompleteTrigger }) trigger!: MatAutocompleteTrigger;

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
  pageSize: number = 10;
  lastKey: string | undefined = undefined;
  @ViewChild("companyJobMatSort") companyJobMatSort!: MatSort; //@todo RENAME THIS AND SEE WHERE ITS GETTING UTILIZED
  @ViewChild("companyJobMatPaginator") companyJobMatPaginator!: MatPaginator;

  // Misc Vars
  copiedContextId: any;

  /**
   * Initializes the Component with the required services and sets up the job form.
   *
   * @param {Router} router - The Angular router service.
   * @param {FormBuilder} fb - The Angular form builder service.
   * @param {AdminService} adminService - The admin service for API calls.
   * @param {NgxSpinnerService} spinner - The service for displaying a loading spinner.
   */
  constructor(private router: Router,
    private fb: FormBuilder,
    private adminService: AdminService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef) {

    // Initialize the corporate Invite form with necessary fields and validation
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      industry: ['', Validators.required],
      teamSize: [null, [Validators.required, Validators.min(1)]],
      carrierPage: ['', [Validators.required, Validators.pattern('https?://.+')]],
      linkedIn: ['', [Validators.required, Validators.pattern('https?://.+')]],
      logoUrl: ['', Validators.pattern('https?://.+')],
    });
  }
  // Implement the OnInit function to fetch the records on component initialization
  ngOnInit(): void {
     // Setup the filteredCompanies$ for the company autocomplete
    this.filteredCompanies$ = this.companyControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => this.filterCompanies(value))
    ) 
    // Fetch jobs on component initialization
    this.fetchInvites({ pageSize: 10, sortOrder: this.sortOrder.DESC, resetPagination: true });
  }

  /**
  * fetchInvites
  *
  * Fetches jobs from the server.By taking options as args and
  */
  async fetchInvites(options: FetchJobsOptionsDto) {
    this.spinner.show();
    try {
      // If resetPagination is true, reset the lastKey
      if (options.resetPagination) {
        this.lastKey = undefined;
      }
      const params = {
        corporateUserType:options.corporateUserType,
        inviteStatus: options.inviteStatus,
        searchText: options.searchText,
        pageSize: options.pageSize,
        lastKey: this.lastKey,
        sortOrder: options.sortOrder,
      };
      const response = await this.adminService.getCorporateInvites(params);
      if (response) {
        this.invites = response.data;
        this.lastKey = response.pagination.lastKey;
        this.pageSize = response.pagination.pageSize;
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
        this.modalSize = "md";
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
    const control = this.companyForm.get(controlName);

    if (!control) {
      return false;
    }
    // Common validation: control should be invalid and touched/dirty
    return control.invalid && (control.dirty || control.touched);
  }

  // Helper method to get the error message
  getErrorMessage(controlName: string): string | null {
    const control = this.companyForm.get(controlName);

    // Check if the control is invalid and touched/dirty
    if (this.isInvalid(controlName)) {
      // Check and return specific validation error messages
      if (control?.errors) {
        if (control.errors["required"]) {
          return "This field is required";
        }
        if (control.errors["pattern"]) {
          return "Invalid format , allowed symbols [.,?!-'\"]";
        }
      }
    }

    return null;
  }

  // Method to mark form control as touched when user leaves the input
  markControlAsTouched(controlName: string): void {
    const control = this.companyForm.get(controlName);
    if (control) {
      control.markAsTouched(); // Marks control as touched to trigger validation
    }
  }

  /* Company Selector starts here: This gorup of method will help in selecting company from a dynamic dropdown menu */
  // Fetch the companies and return the list
  filterCompanies(value: string): Observable<any[]> {
    return this.adminService.getCompanyName(value).pipe(
      map((response) => {
        const companies = Array.isArray(response.data) ? response.data : [];
        this.isCompanyNameValid = companies.length === 0 ? false : true;
        this.companyNameError = companies.length === 0 ? "No companies found." : "";
        return companies;
      })
    );
  }

  // Display the company name in the input when selected
  onCompanySelect(event: any): void {
    const selectedCompany = event.option.value; // Now selectedCompany is the whole object
    this.companyControl.setValue(selectedCompany.name); // Set the name in the input
    // Set company ID or any other required logic
    this.companyForm.get("companyId")?.setValue(selectedCompany.SK.slice(3));
  }

  // Optionally, open the autocomplete when user focuses the input
  onInputFocus() {
    if (this.trigger) {
      this.trigger.openPanel(); // Manually open the autocomplete
    }
  }

  // Validate the company name on blur
  onInputBlur(): void {
    const companyNameValue = this.companyControl.value?.trim(); // Check if the input is empty
    // If the input is empty, show an error
    let companyIdCheck = this.companyForm.get("companyId")?.value === null || this.companyForm.get("companyId")?.value === "";
    if (companyNameValue === "" || companyNameValue === null) {
      this.companyNameError = "Company name is required.";
      this.isCompanyNameValid = false;
    }
    if (companyIdCheck) {
      this.companyNameError = "Please select a company from the list.";
      this.isCompanyNameValid = false;
    }
    if (companyIdCheck && companyNameValue === "") {
      this.companyNameError = ""; // Clear the error if companies are found
      this.isCompanyNameValid = true;
    }
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
      this.fetchInvites({corporateUserType : this.selectedCorporateUserType, searchText:this.searchQuery,inviteStatus: this.selectedStatus, pageSize: this.pageSize, resetPagination: true }); // Fetch jobs with the new status
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
      this.fetchInvites({ corporateUserType : this.selectedCorporateUserType ,searchText:this.searchQuery,inviteStatus: this.selectedStatus, pageSize: this.pageSize, resetPagination: true }); // Fetch jobs with the new status
    }

  /**
   * Submits the job form and creates a new job.
   */
  async onSubmit(): Promise<void> {
    if (this.companyForm.valid && !this.companyNameError) { // Ensure error is falsy, not just an empty string
      this.spinner.show();
      try {
        await this.adminService.createInvite(this.companyForm.value);  // Await the async call
        await this.fetchInvites({ pageSize: 10, sortOrder: this.sortOrder.DESC, resetPagination: true });
        this.closeModal();  // Close modal only after a successful fetch
      } catch (error) {
        console.error("Invite creation failed:", error);  // Log the actual error for debugging
        this.errorTitle = "Error";
        this.errorMessage = "Something went wrong. Please try again later.";  // Show specific error message if available
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
      await this.adminService.updateInviteStatus(inviteId, status );
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
    this.searchQuery = "";
    this.selectedStatus = this.status.ALL;
    this.selectedCorporateUserType = this.userType.ALL;
    this.selectedSortOrder = this.sortOrder.DESC;
    this.fetchInvites({ corporateUserType :this.selectedCorporateUserType,inviteStatus: this.selectedStatus, pageSize: this.pageSize, resetPagination: true }); // Fetch jobs with the new status
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
}
