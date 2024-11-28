import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminService } from 'src/app/modules/admin/services/admin.service';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { CorporateService } from '../../services/corporate.service';

// Interface for FetchJobsOptionsDto
interface FetchJobsOptionsDto {
  name?: string;
  searchText?: string;
  pageSize?: number;
  sortOrder?: string;
  resetPagination?: boolean;
}


@Component({
  selector: 'app-corporate-recruiter',
  templateUrl: './corporate-recruiter.component.html',
  styleUrls: ['./corporate-recruiter.component.scss']
})
export class CorporateRecruiterComponent implements OnInit {
  // DEFAULT MEMBER VARIABLES
  sortOrder = {
    ASC: "ascending",
    DESC: "descending",
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
  successtitle: string = "";
  modalSize: string = "xl";
  successmessage: string = "";
  copiedContextId: any;

  /**
   * Initializes the AdminJobsComponent with the required services and sets up the job form.
   *
   * @param {Router} router - The Angular router service.
   * @param {FormBuilder} fb - The Angular form builder service.
   * @param {AdminService} adminService - The admin service for API calls.
   * @param {NgxSpinnerService} spinner - The service for displaying a loading spinner.
   */

  // Constructor
  constructor(
    private router: Router,
    private corporateService: CorporateService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef
  ) { }

  // Implement the OnInit function to fetch the records on component initialization
  ngOnInit(): void {
    /* // Setup the filteredCompanies$ for the company autocomplete
    this.filteredCompanies$ = this.companyControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => this.filterCompanies(value))
    ) */
    // Fetch jobs on component initialization
    this.fetchUsers({ pageSize: 10, sortOrder: this.sortOrder.DESC, resetPagination: true });
  }

  /**
  * fetchUsers
  *
  * Fetches jobs from the server.By taking options as args and
  */
  async fetchUsers(options: FetchJobsOptionsDto) {
    this.spinner.show();
    try {
      // If resetPagination is true, reset the lastKey
      if (options.resetPagination) {
        this.lastKey = undefined;
      }
      const params = {
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
        this.router.navigate(["/corporate/cRecruiter"]);
      } else if (error.status === 401) {
        this.router.navigate(["/"]);
      } else {
        this.successmessage = "Something went wrong. Please try again later.";
        this.successtitle = "Error";
        this.openModal(ModalType.SUCCESS_MESSAGE);
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
    else {
      this.modalSize = "xl";
    }
    this.cdr.detectChanges();
    this.modalMessage = message;
    this.modalTitle = title;
    this.modal.open();
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
