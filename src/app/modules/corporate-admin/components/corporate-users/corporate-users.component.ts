import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

// Service module import for Api calling
import { CorporateService } from '../../services/corporate.service';

// Shared components like spinner ,modals and etcetras.
import { MatSort } from "@angular/material/sort";
import { ModalType } from "src/app/modules/shared/interfaces/shared.interface";
import { MatPaginator } from "@angular/material/paginator";
import { ModalComponent } from "src/app/modules/shared/components/modal/modal.component";
import { NgxSpinnerService } from "ngx-spinner";
import { MatTableDataSource } from "@angular/material/table";
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { CorporateVitalDetails } from '../../corporate.component';


// Interface for FetchJobsOptionsDto
interface FetchJobsOptionsDto {
  companyId?:string;
  corporateUserType?: string;
  name?: string;
  searchText?: string;
  pageSize?: number;
  sortOrder?: string;
  resetPagination?: boolean;
}


@Component({
  selector: 'app-corporate-users',
  templateUrl: './corporate-users.component.html',
  styleUrls: ['./corporate-users.component.scss']
})
export class CorporateUsersComponent implements OnInit {
  // Corporate Vital Details
  corporateVitalDetails : CorporateVitalDetails = {}
  
  corporateCompanyName : string ="";

  // DEFAULT MEMBER VARIABLES
  sortOrder = {
    ASC: "ascending",
    DESC: "descending",
  };
  
  // Corporate User Type 
  userType = {
    ALL:"",
    ADMIN: "ADMIN",
    RECRUITER: "RECRUITER",
  };

  //Pagination Properties
  pageSize: number = 10;
  lastKey: string | undefined = undefined;
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

  successtitle: string = "";
  modalSize : string = "xl";
  successmessage: string = "";
  copiedContextId: any;
  

  isRecruiter: boolean = false;
  /**
   * Initializes the AdminJobsComponent with the required services and sets up the job form.
   *
   * @param {Router} router - The Angular router service.
   * @param {FormBuilder} fb - The Angular form builder service.
   * @param {corporateService} CorporateService - The admin service for API calls.
   * @param {NgxSpinnerService} spinner - The service for displaying a loading spinner.
   */
  constructor(private router: Router,
     private fb: FormBuilder,
     private corporateService: CorporateService,
     private spinner: NgxSpinnerService ,
    private cdr: ChangeDetectorRef) {
  }
  // Implement the OnInit function to fetch the records on component initialization
  ngOnInit(): void {
     // Set up the corporateVitalDetails
     this.corporateService.corporateDetails$.subscribe((details) => {
      if (details) {
        this.corporateVitalDetails = details;
        this.corporateCompanyName = this.corporateVitalDetails.companyName || "";
        this.corporateVitalDetails.corporateUserType === "RECRUITER" ? this.isRecruiter = true : this.isRecruiter = false;

      // Fetch jobs on component initialization
    this.fetchUsers({ 
      companyId:this.corporateVitalDetails.companyId,
      pageSize: 10, 
      sortOrder: this.sortOrder.DESC, 
       resetPagination: true 
      });

    }
  });
   
  // Fetch jobs on component initialization
}

   /**
   * fetchUsers
   *
   * Fetches jobs from the server.By taking options as args and
   */
   async fetchUsers(options: FetchJobsOptionsDto) {
    this.spinner.show();
    try {
      const companyId = this.corporateVitalDetails.companyId;
      // If resetPagination is true, reset the lastKey
      if (options.resetPagination) {
        this.lastKey = undefined;
      }
      const params = {
        companyId ,
        corporateUserType: options.corporateUserType,
        searchText: options.searchText,
        pageSize: options.pageSize,
        lastKey: this.lastKey,
        sortOrder: options.sortOrder,
      };
      const response = await this.corporateService.getCorporateUsers(params);
      if (response) {
        this.users = response.data;
        this.lastKey = response.pagination.lastKey;
        this.pageSize = response.pagination.pageSize;

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
        this.successmessage = "Something went wrong. Please try again later.";
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
    debugger;
    this.modalSize = "md";
    this.modalCustomTitle = "Warning!!";
    this.modalCustomMessage = "Are you sure you want to delete this user?";
    this.currentSeletedUser = userId;
    this.openModal(ModalType.CORPORATE_USER_WARNING);
  }
   async confirmDelete(){
     try {
      this.spinner.show();
      const companyId = this.corporateVitalDetails.companyId;
      const response = await this.corporateService.deleteCorporateUserById(this.currentSeletedUser ,companyId!);
      if (response) {
        this.successmessage = "User deleted successfully.";
        this.successtitle = "Success";
        this.openModal(ModalType.SUCCESS_MESSAGE);
        this.fetchUsers({ pageSize: this.pageSize, resetPagination: true });
      }
    } catch (error: any) {
      this.spinner.hide();
      if (error.status === 404) {
        this.router.navigate(["/admin/aCorporate"]);
      } else if (error.status === 401) {
        this.router.navigate(["/"]);
      } else {
        this.successmessage = "Something went wrong. Please try again later.";
        this.successtitle = "Error";
        this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
      }
    } finally {
      this.spinner.hide();
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
   this.fetchUsers({ corporateUserType:this.selectedCorporateUserType, searchText: this.searchQuery, pageSize: 200 });
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
