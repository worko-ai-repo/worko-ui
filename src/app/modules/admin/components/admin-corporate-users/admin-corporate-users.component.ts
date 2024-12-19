import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

// Service module import for Api calling
import { AdminService } from '../../services/admin.service';

// Shared components like spinner ,modals and etcetras.
import { MatSort } from "@angular/material/sort";
import { ModalType } from "src/app/modules/shared/interfaces/shared.interface";
import { MatPaginator } from "@angular/material/paginator";
import { ModalComponent } from "src/app/modules/shared/components/modal/modal.component";
import { NgxSpinnerService } from "ngx-spinner";
import { MatTableDataSource } from "@angular/material/table";
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";


// Interface for FetchUsersOptionsDto
interface FetchUsersOptionsDto {
  useCurrentPage?: boolean;
  corporateUserType?: string;
  name?: string;
  searchText?: string;
  pageSize?: number;
  sortOrder?: string;
  resetPagination?: boolean;
}


@Component({
  selector: 'app-admin-corporate-users',
  templateUrl: './admin-corporate-users.component.html',
  styleUrls: ['./admin-corporate-users.component.scss']
})
export class AdminCorporateUsersComponent implements OnInit {
  // DEFAULT MEMBER VARIABLES
  sortOrder = {
    ASC: "ascending",
    DESC: "descending",
  };
  
  // Corporate User Type 
  userType = {
    ALL:"",
    ADMIN: "corporate-admin",
    RECRUITER: "corporate-recruiter",
  };

  //Pagination Properties

  lastKey: string | null = null; // The current lastKey for the current page
  previousKeys: string[] = []; // Stack to store previous lastKeys for "Previous" functionality
  hasNext: boolean = false; // To enable/disable "Next" button
  hasPrevious: boolean = false; // To enable/disable "Previous" button
  pageSize: number = 25; // Default page size
  pageSizeOptions: number[] = [25, 50, 100, 150];

   
  @ViewChild("companyJobMatSort") companyJobMatSort!: MatSort; //@todo RENAME THIS AND SEE WHERE ITS GETTING UTILIZED
  @ViewChild("companyJobMatPaginator") companyJobMatPaginator!: MatPaginator;
  
  // Corporate Users related properties
  users: any = [];
  dataSource = new MatTableDataSource<any>(); // To store the updated data in the table
  noUsersMessage: string = "No Users Present";
  selectedCorporateUserType = "";
  selectedSortOrder: string = this.sortOrder.DESC;
  currentSeletedUser: string = "";

  //Filters Properties
  searchQuery: string = "";
  filteredUsers: any[] = [];
 
  // Properties related to modal handling
  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  showModal: ModalType | undefined;
  modalMessage: string = "";
  modalTitle: string = "";

  // Properties related to modal messages
  modalCustomTitle : string = "";
  modalCustomMessage : string = ""; 

  successTitle: string = "";
  successMessage: string = "";
  modalSize : string = "xl";
  copiedContextId: any;
  
  /**
   * Initializes the AdminJobsComponent with the required services and sets up the job form.
   *
   * @param {Router} router - The Angular router service.
   * @param {FormBuilder} fb - The Angular form builder service.
   * @param {AdminService} adminService - The admin service for API calls.
   * @param {NgxSpinnerService} spinner - The service for displaying a loading spinner.
   */
  constructor(private router: Router,
     private fb: FormBuilder,
     private adminService: AdminService,
     private spinner: NgxSpinnerService ,
    private cdr: ChangeDetectorRef) {
  }
  // Implement the OnInit function to fetch the records on component initialization
  ngOnInit(): void {
      // Fetch jobs on component initialization
    this.fetchUsers({ pageSize: 25, sortOrder: this.sortOrder.DESC,  resetPagination: true });
  }

   /**
   * fetchUsers
   *
   * Fetches jobs from the server.By taking options as args and
   */
   async fetchUsers(options: FetchUsersOptionsDto) {
    this.spinner.show();
    try {
      // If resetPagination is true, reset the lastKey
      if (options.resetPagination) {
        this.lastKey = null;
      }
      if(options.useCurrentPage){this.lastKey = this.previousKeys[this.previousKeys.length - 1]};
      const params = {
        corporateUserType: options.corporateUserType,
        searchText: options.searchText,
        pageSize: options.pageSize,
        lastKey: this.lastKey,
        sortOrder: options.sortOrder,
      };
      const response = await this.adminService.getCorporateUsers(params);
      if (response) {
        this.users = response.data;
        this.lastKey = response.pagination.lastKey;
        this.pageSize = response.pagination.pageSize;

        this.hasNext = !!response.pagination.lastKey;
        this.hasPrevious = this.previousKeys.length > 0;
        this.updateData(this.users);

        // Reset the paginator to the first page if necessary when mat-paginator is available and resetPagination is true
        if (options.resetPagination && this.companyJobMatPaginator) {
          this.companyJobMatPaginator.firstPage();
        }
      }
    } catch (error: any) {
      this.spinner.hide();
      if (error.status === 404) {
        this.router.navigate(["/admin/aCorporate"]);
      } else if (error.status === 401) {
        this.router.navigate(["/"]);
      } else {
        this.successMessage = "Something went wrong. Please try again later.";
        this.successTitle = "Error";
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
    this.filteredUsers = data;
    this.dataSource.data = this.filteredUsers;
    this.dataSource.paginator = this.companyJobMatPaginator;
    this.dataSource.sort = this.companyJobMatSort; // Ensure sorting is applied

    // Optional: Reset the paginator if needed
    if (this.companyJobMatPaginator) {
      this.companyJobMatPaginator.firstPage();
    }
  }
  /**
   * deleteUser
   * 
   * Deletes the user with the given ID.
   * 
   * @param userId - The ID of the user to be deleted.
   */
  deleteUser(userId: string) {
    // debugger;
    this.modalSize = "md";
    this.modalCustomTitle = "Warning!!";
    this.modalCustomMessage = "Are you sure you want to delete this user?";
    this.currentSeletedUser = userId;
    this.openModal(ModalType.CORPORATE_USER_WARNING);
  }
   async confirmDelete(){
     try {
      /* this.closeModal() */
      this.spinner.show();
      await this.adminService.deleteCorporateUserById(this.currentSeletedUser);
    } catch (error: any) {
      this.closeModal();
      this.spinner.hide();
      if (error.status === 404) {
        this.successMessage = "Something went wrong. Please try again later.";
        this.modalSize = "md";
        this.successTitle = "Error";
        this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
      } else {
        this.successMessage = "Something went wrong. Please try again later.";
        this.successTitle = "Error";
        this.modalSize = "md";
        this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
      }
    } finally {
      this.fetchUsers({corporateUserType : this.selectedCorporateUserType,searchText:this.searchQuery, pageSize: this.pageSize, sortOrder: this.selectedSortOrder, resetPagination: false , useCurrentPage: true });
      this.spinner.hide();
      this.closeModal()
    } 
  }
   /**
   * onSortOrderChange
   *
   * Updates the sort order of the jobs.
   */
   onSortOrderChange(event: any) {
    // console.log("Sort order:", event.target.value);
    this.fetchUsers({corporateUserType : this.selectedCorporateUserType,searchText:this.searchQuery, pageSize: this.pageSize, sortOrder: event.target.value, resetPagination: true });
  }

  /**
   * onCorporateUserTypeChange
   * 
   * Updates the corporate user type and fetch the desired jobs based on the user type.
   */
  onCorporateUserTypeChange(corporateUserType: any) {
    if (corporateUserType.target.value === this.userType.ALL) {
      this.selectedCorporateUserType = this.userType.ALL;
      this.fetchUsers({ pageSize: this.pageSize, resetPagination: true }); // Fetch all jobs
      return;
    }
      this.selectedCorporateUserType = corporateUserType.target.value; // Update global variable
      this.fetchUsers({ corporateUserType : this.selectedCorporateUserType , searchText:this.searchQuery,pageSize: this.pageSize, resetPagination: true }); // Fetch jobs with the new status
    }

  /*
   * @method searchJobs
   * @param query - The search query.
   */
  async searchJobs(event: any) {
    this.searchQuery = event.target.value;
    //  console.log("Search query:", this.searchQuery);
    this.fetchUsers({corporateUserType : this.selectedCorporateUserType,searchText:this.searchQuery, pageSize: this.pageSize, sortOrder: this.selectedSortOrder, resetPagination: true });
    if (this.filteredUsers.length == 0) {
      this.noUsersMessage = "No Invite present with this name or description";
    }
  }

  // Reset the job Form modal
  resetModal(): void {
    this.searchQuery = "";
    this.selectedCorporateUserType = this.userType.ALL;
    this.selectedSortOrder = this.sortOrder.DESC;
    this.fetchUsers({ corporateUserType :this.selectedCorporateUserType, pageSize: this.pageSize, resetPagination: true }); // Fetch jobs with the new status
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
    this.modal.cancel();
    this.currentSeletedUser = "";
  }

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
    this.fetchUsers({corporateUserType :this.selectedCorporateUserType,  searchText: this.searchQuery, pageSize: this.pageSize, sortOrder: this.selectedSortOrder , resetPagination: false });
  }


  onPrevious() {
    if (!this.hasPrevious) return;

    // Retrieve the second-to-last key in the stack, which corresponds to the last key used for the previous page
    const previousLastKey = this.previousKeys.length > 1 ? this.previousKeys[this.previousKeys.length - 2] : null;

    // Remove the current page's lastKey from the stack
    this.previousKeys.pop();

    if (!previousLastKey) {
      // If no valid previous key, fetch the first page
      this.fetchUsers({corporateUserType :this.selectedCorporateUserType, searchText: this.searchQuery, pageSize: this.pageSize, sortOrder: this.selectedSortOrder, resetPagination: true });
    } else {
      // Fetch the previous page using the second-to-last key
     this.lastKey = previousLastKey;
     this.fetchUsers({corporateUserType :this.selectedCorporateUserType, searchText: this.searchQuery, pageSize: this.pageSize, sortOrder: this.selectedSortOrder, resetPagination: false });
    }
  }

  onPageSizeChange(event: Event): void {
    const selectedPageSize = (event.target as HTMLSelectElement).value;
    this.pageSize = Number(selectedPageSize);
    this.previousKeys = [];
    this.fetchUsers({corporateUserType :this.selectedCorporateUserType, searchText: this.searchQuery, pageSize: this.pageSize, sortOrder: this.selectedSortOrder, resetPagination: true });
  }


    // Misc method
    getStatusClass(status: string): string {
      return `user-${status.toLowerCase()}`; // Returns 'user-admin' 'user-recruiter';
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
