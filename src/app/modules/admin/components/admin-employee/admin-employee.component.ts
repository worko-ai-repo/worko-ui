import { Component } from "@angular/core";
import {
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import {
  MatPaginator,
  MatPaginatorIntl,
  PageEvent,
} from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import {
  MatTableDataSource,
  MatTableDataSourcePaginator,
} from "@angular/material/table";
import { ViewEncapsulation } from "@angular/core";
import { Action } from "rxjs/internal/scheduler/Action";
import { AdminService } from "../../services/admin.service";
import { ModalComponent } from "src/app/modules/shared/components/modal/modal.component";
import { ModalType } from "src/app/modules/shared/interfaces/shared.interface";
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from "@angular/router";
import { debounceTime, Subject } from "rxjs";
import { ErrorHandlingService } from "src/app/modules/app-core/services/error-handling.service";

export interface UserData {
  name: string;
  emailId: string;
  Phonenumber: string;
  companyName: string;
  companyEmailIdVerifiedStatus: string;
  createdAt: any;
  // referreeDesignation: string;
  // referreeDepartment: string;
  // referralCount: string;
  // acceptedRequestCount: string;
  // doneRequestCount: string;
}
@Component({
  selector: "app-admin-employee",
  templateUrl: "./admin-employee.component.html",
  styleUrls: ["./admin-employee.component.scss"],
})
export class AdminEmployeeComponent {
  @ViewChild("dropdown") dropdown!: ElementRef;
  @ViewChild("referralPaginator") referralPaginator!: MatPaginator;
  @ViewChild("referralSort") referralSort!: MatSort;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  // ViewChild declarations for paginator and sort for service table
  @ViewChild("servicePaginator") servicePaginator!: MatPaginator;
  @ViewChild("serviceSort") serviceSort!: MatSort;
  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  lastKey: string | undefined = undefined;
  private searchTerms = new Subject<string>();
  searchTerm: string = "";
  searchQuery: string = "";
  displayedColumns: string[] = [
    "serialNumber",
    "name",
    "emailId",
    "PhoneNumber",
    "accountCreatedDate",
    "companyName",
    "companyEmailIdVerifiedStatus",
    "action",
  ];
  candidatesDataSource: MatTableDataSource<UserData>;
  isFilterPopupOpen: boolean = true;
  isDropdownOpen: boolean = false;
  nameslist: any[] = [];
  userData: any;
  userExperience: any;
  userReferralData: any;
  successmessage: string = "";
  successtitle: string = "";
  sortOrder: any;
  status: any;
  fromDate: any = "";
  toDate: any = "";
  filterModel: any = {
    fromDate: "",
    toDate: "",
  };
  modalSize: string = "lg";

  currentLastKey: string | null = null; // The current lastKey for the current page
  previousKeys: string[] = []; // Stack to store previous lastKeys for "Previous" functionality
  hasNext: boolean = false; // To enable/disable "Next" button
  hasPrevious: boolean = false; // To enable/disable "Previous" button
  pageSize: number = 25; // Default page size
  pageSizeOptions: number[] = [25, 50, 100, 150];
  // candidatesDataSource: any[] = []; // The data for the table

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    private adminService: AdminService,
    private spinner: NgxSpinnerService,
    private errorHandlingService: ErrorHandlingService
  ) {
    this.candidatesDataSource = new MatTableDataSource<UserData>(
      this.nameslist
    );
    this.searchTerms
      .pipe(
        debounceTime(300) // Adjust the debounce time as needed (300 milliseconds in this example)
        //distinctUntilChanged()
      )
      .subscribe((query: string) => {
        // Call your API here with the query string
        this.callApiWithSearchQuery(query);
      });
  }

  async ngOnInit(): Promise<void> {
    this.getAllUserData(null);
  }

  async getAllUserData(lastKey: string | null) {
    this.spinner.show();
    await this.adminService
      .getAllUserData(
        "EMP",
        this.pageSize,
        lastKey,
        this.searchTerm,
        this.sortOrder,
        this.fromDate,
        this.toDate
      )
      .then(async (response: any) => {
        if (response) {
          this.spinner.hide();
          this.nameslist = response.data;
          // this.sortCandidatesByDate("desc")
          this.updateData(this.nameslist);

          this.pageSize = response.pagination.pageSize;
          this.currentLastKey = response.pagination.lastKey || null;
          this.hasNext = !!response.pagination.lastKey;
          this.hasPrevious = this.previousKeys.length > 0;
        }
      })
      .catch((error: any) => {
        // this.spinner.hide();
        // if (error.status == 404) {
        //   this.spinner.hide();
        //   this.router.navigate(["/auth/logout"]);
        // } else if (error.status == 401) {
        //   this.router.navigate(["/"]);
        // } else {
        //   this.modalSize = "md";
        //   this.successmessage =
        //     "Something went wrong. Please try again after sometime";
        //   this.successtitle = "Error";
        //   this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
        // }
        this.spinner.hide();
        this.errorHandlingService.handleApiError(error, () => {
          this.modalSize = "md";
          this.successmessage = "Something went wrong. Please try again later.";
          this.successtitle = "Error";
          this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
        });
      });
  }

  updateData(newData: UserData[]) {
    this.candidatesDataSource.data = newData;
    // if (this.referralPaginator) {
    //   this.referralPaginator.firstPage();
    // }
  }
  callApiWithSearchQuery(query: string): void {
    // this.pageSize = "";
    // this.lastKey = "";

    this.searchTerm = query; // Setting here encoded query to filterData
    // this.initializeData();

    // Use the previous lastKey if available; otherwise, start fresh
    // const keyToUse = this.getKeyForCurrentPage();
    // this.getAllUserData(keyToUse);

    this.previousKeys = [];
    this.getAllUserData(null);
  }

  handleSearchInput(event: Event) {
    // this.searchQuery = (event.target as HTMLInputElement).value;

    if (this.searchQuery.length >= 3) {
      // this.pageSize = "";
      // this.lastKey = "";
      this.searchTerms.next(this.searchQuery);
    } else if (this.searchQuery.length <= 0) {
      this.clearSearchInput();
    }
  }

  onSearchInputEnter(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      // Checking if the pressed key is Enter
      // this.pageSize = 25;
      // this.lastKey = "";
      this.searchTerms.next(this.searchQuery);
    }
  }

  clearSearchInput() {
    // this.referralPaginator.pageIndex = 0;  // Reset to the first page
    // this.pageSize = 25;                    // Set the pageSize to 25
    // this.referralPaginator.pageSize = 25;  // Update the UI's pageSize
    // this.lastKey = "";
    this.searchTerm = "";
    this.searchQuery = "";
    // this.initializeData();

    // Use the previous lastKey if available; otherwise, start fresh
    // const keyToUse = this.getKeyForCurrentPage();
    // this.getAllUserData(keyToUse);

    this.previousKeys = [];
    this.getAllUserData(null);
  }

  ngAfterViewInit() {
    // // Set paginator and sort for referral table
    // this.candidatesDataSource.paginator = this.referralPaginator;

    // this.referralPaginator.page.subscribe((event: PageEvent) => {
    //   if (event.pageSize !== this.pageSize) {
    //     this.pageSize = event.pageSize;
    //     this.getAllUserData(null); // Call getAllReferral with updated pageSize
    //   }
    // });
  }

  onPageSizeChange(event: Event): void {
    const selectedPageSize = (event.target as HTMLSelectElement).value;
    this.pageSize = Number(selectedPageSize);
    this.previousKeys = [];
    this.getAllUserData(null); // Call getAllUserData refresh the data with the new page size
  }

  onSort(sort: Sort): void {
    if (sort.active === "accountcreateddate") {
      // this.lastKey = "";
      // this.pageSize = 25;
      this.sortOrder = this.sortOrder === 'ascending' ? 'descending' : 'ascending';
      sort.direction === "asc" ? "ascending" : "descending";
      this.sort.direction = sort.direction;
      // this.initializeData();

      // Use the previous lastKey if available; otherwise, start fresh
      const keyToUse = this.getKeyForCurrentPage();
      // Call API to get data with the new sort direction
      this.getAllUserData(keyToUse);
    }
  }

  // //frontend sorting code
  // onSort(event: Sort) {
  //   const active = event.active;
  //   const direction = event.direction;

  //   if (active === 'accountcreateddate') {
  //     this.sortCandidatesByDate(direction);
  //   }
  //     // Update data source
  // this.candidatesDataSource.data = this.nameslist;
  // }

  // sortCandidatesByDate(direction: string) {

  //   this.nameslist= this.nameslist.sort((a, b) => {
  //     const dateA = new Date(a.createdAt).getTime();
  //     const dateB = new Date(b.createdAt).getTime();

  //     if (direction === 'asc') {

  //       return dateA - dateB; // Ascending order
  //     } else {

  //       return dateB - dateA; // Descending order
  //     }
  //   });
  // }

  async viewRow(userData: any) {
    this.spinner.show();
    await this.adminService
      .getUserExperienceByEmailId(userData.email)
      .then(async (response: any) => {
        // if(response && response.length > 0){
        this.userExperience = response[0];
        //console.log(this.userExperience)
        await this.adminService
          .getEmployeeReferralByEmailId(userData.email)
          .then(async (response: any) => {
            this.spinner.hide();
            // if(response && response.length > 0){
            this.userReferralData = response;
            //console.log(this.userReferralData)
            //console.log(this.userReferralData)

            // console.log(this.userData.isCandidateFresher);  // Log to check the values
            // console.log(this.userData.candidateExperience); // Log to check the values

            // if (this.userData && (this.userData.isCandidateFresher !== undefined || this.userData.candidateExperience !== undefined)) {
            //   this.status = "Yes";  // At least one of the properties exists
            // } else {
            //   this.status = "No";   // Neither of the properties exists
            // }

            this.openModal(
              ModalType.ADMINDETAIL_POPUP,
              "",
              "",
              userData,
              this.userExperience,
              this.userReferralData
            );
          });
      })
      .catch((error: any) => {
        this.spinner.hide();
        this.modalSize = "md";
        this.successmessage =
          "Something went wrong. Please try again after sometime";
        this.successtitle = "Error";
        this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
      });
  }
  applyFromDateFilters() {
    if (this.filterModel.fromDate) {
      const dateObject = new Date(this.filterModel.fromDate);
      // Adjusting time so that UTC conversion in toISOString() doesn't affect the date
      dateObject.setMinutes(
        dateObject.getMinutes() - dateObject.getTimezoneOffset()
      );
      const isoString = dateObject.toISOString();
      this.fromDate = isoString;
    } else {
      this.fromDate = "";
    }

    // this.initializeData();

    // Use the previous lastKey if available; otherwise, start fresh
    // const keyToUse = this.getKeyForCurrentPage();
    // this.getAllUserData(keyToUse);

    this.previousKeys = [];
    this.getAllUserData(null);
  }

  applyToDateFilters() {
    if (this.filterModel.toDate) {
      const dateObject = new Date(this.filterModel.toDate);

      // Set the time to 23:59:59.999 for the end of the day
      dateObject.setHours(23, 59, 59, 999);

      // Adjusting time so that UTC conversion in toISOString() doesn't affect the date
      dateObject.setMinutes(
        dateObject.getMinutes() - dateObject.getTimezoneOffset()
      );

      const isoString = dateObject.toISOString();
      this.toDate = isoString;
    } else {
      this.toDate = "";
    }

    // Use the previous lastKey if available; otherwise, start fresh
    // const keyToUse = this.getKeyForCurrentPage();
    // this.getAllUserData(keyToUse);

    this.previousKeys = [];
    this.getAllUserData(null);
  }

  initializeData() {
    this.pageSize = 25;
    this.lastKey = "";
    this.sortOrder = "";
    this.searchTerm = "";
    this.referralPaginator.pageIndex = 0; // Reset to the first page
    this.referralPaginator.pageSize = 25; // Update the UI's pageSize
  }

  resetDatePickers() {
    this.filterModel.fromDate = null;
    this.filterModel.toDate = null;
    this.fromDate = "";
    this.toDate = "";
    this.searchTerm = ""
    this.searchQuery = "";
    // this.referralPaginator.pageIndex = 0;  // Reset to the first page
    // this.referralPaginator.pageSize = 25;  // Update the UI's pageSize

    // Use the previous lastKey if available; otherwise, start fresh
    // const keyToUse = this.getKeyForCurrentPage();
    // this.getAllUserData(keyToUse);

    this.previousKeys = [];
    this.getAllUserData(null);
  }

  onNext() {
    if (!this.hasNext) return;

    // Store the current lastKey in the stack before moving forward
    if (this.currentLastKey) {
      this.previousKeys.push(this.currentLastKey);
    }

    // Fetch the next page
    this.getAllUserData(this.currentLastKey);
  }

  onPrevious() {
    if (!this.hasPrevious) return;

    // Retrieve the second-to-last key in the stack, which corresponds to the last key used for the previous page
    const previousLastKey = this.previousKeys.length > 1 ? this.previousKeys[this.previousKeys.length - 2] : null;

    // Remove the current page's lastKey from the stack
    this.previousKeys.pop();

    if (!previousLastKey) {
      // If no valid previous key, fetch the first page
      this.getAllUserData(null);
    } else {
      // Fetch the previous page using the second-to-last key
      this.getAllUserData(previousLastKey);
    }
  }

  private getKeyForCurrentPage(): string | null {
    // Return the last key from the stack or null if the stack is empty
    return this.previousKeys.length > 0 ? this.previousKeys[this.previousKeys.length - 1] : null;
  }

  /**
   * Open modal.
   *
   * @param {ModalType} modalType
   * @param {string} [message = ""]
   * @param {string} [title = ""]
   * @returns {void}
   */
  openModal(
    modalType: ModalType,
    message: string = "",
    title: string = "",
    userData: any = null,
    userExperience: any = null,
    userReferralData: any = null
  ): void {
    this.cdr.detectChanges();
    this.showModal = modalType;
    this.modalMessage = message;
    this.modalTitle = title;
    this.userData = userData;
    this.userExperience = userExperience;
    this.userReferralData = userReferralData;
    this.modal.open();
  }
  /**
   * Close modal.
   *
   * @returns {void}
   */
  closeModal(): void {
    this.modal.cancel();
  }

  //  applyFilters() {
  //   // Gather selected filter options
  //   const selectedFilters = {
  //     name: this.filterModel.Name,
  //     emailId: this.filterModel.emailId,
  //     Phonenumber: this.filterModel.Phonenumber,
  //     companyName: this.filterModel.companyName,
  //     companyEmailIdVerifiedStatus: this.filterModel.companyEmailIdVerifiedStatus,
  //     fromDate: this.filterModel.fromDate,
  //     toDate: this.filterModel.toDate,
  //   };

  //   // Apply filters to both data sources
  //   this.applyDataSourceFilters(this.candidatesDataSource, selectedFilters);
  //   this.applyDataSourceFilters(this.servicesDataSource, selectedFilters);

  //   // Reset pagination to navigate to first page
  //   if (this.candidatesDataSource.paginator) {
  //     this.candidatesDataSource.paginator.firstPage();
  //   }
  //   if (this.servicesDataSource.paginator) {
  //     this.servicesDataSource.paginator.firstPage();
  //   }
  // }
  // filterModel: any = {
  //   Name: '',
  //   emailId: '',
  //   Phonenumber: '',
  //   companyName: '',
  //   companyEmailIdVerifiedStatus: '',
  //   fromDate: '',
  //   toDate: ''
  // };

  // search(event: Event, filterValue: string, dataSource: MatTableDataSource<UserData>) {
  //   const filterText = filterValue.trim().toLowerCase();
  //   dataSource.filter = filterText;

  //   if (dataSource.paginator) {
  //     dataSource.paginator.firstPage();
  //   }
  // }
  // handleSearchInput(event: Event, dataSource: MatTableDataSource<UserData>) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   dataSource.filter = filterValue.trim().toLowerCase();

  //   if (dataSource.paginator) {
  //     dataSource.paginator.firstPage();
  //   }
  // }
  // clearSearchInput(input:any,dataSource: MatTableDataSource<UserData>){
  //   input.value = ''; // Clear the input value
  // dataSource.filter = ''; // Reset the filter to show all data

  // if (dataSource.paginator) {
  //   dataSource.paginator.firstPage();
  // }
  // }

  // toggleDropdown(event: MouseEvent) {
  //   event.stopPropagation(); // Prevent event propagation to avoid immediate closing of the dropdown
  //   this.isDropdownOpen = !this.isDropdownOpen;
  //   if (this.isDropdownOpen) {
  //     this.listenForOutsideClick(); // Listen for clicks outside the dropdown to close it
  //   } else {
  //     this.removeOutsideClickListener(); // Remove the listener if the dropdown is closed
  //   }
  // }

  // listenForOutsideClick() {
  //   document.addEventListener('click', this.closeDropdownOnClickOutside);
  // }

  // removeOutsideClickListener() {
  //   document.removeEventListener('click', this.closeDropdownOnClickOutside);
  // }

  // closeDropdownOnClickOutside = (event: MouseEvent) => {
  //   if (!this.dropdown.nativeElement.contains(event.target)) {
  //     this.isDropdownOpen = false;
  //     this.removeOutsideClickListener();
  //   }
  // }
  // // applyDataSourceFilters(dataSource: MatTableDataSource<UserData>, filters: any) {
  // //   dataSource.filterPredicate = (data: UserData, filter: string) => {
  // //     const searchString = Object.keys(filters)
  // //       .map(key => filters[key])
  // //       .join('');
  // //     return searchString.trim().toLowerCase().split(' ').every(term =>
  // //       Object.values(data).join('').toLowerCase().includes(term)
  // //     );
  // //   };
  // //   dataSource.filter = 'activate';
  // // }
  // applyDataSourceFilters(dataSource: MatTableDataSource<UserData>, filters: { [key: string]: string | undefined }) {
  //   dataSource.filterPredicate = (data: UserData, filter: string) => {
  //     let filterObject: { [key: string]: string | undefined }; // Explicitly type filterObject
  //     try {
  //       filterObject = JSON.parse(filter);

  //     } catch (e) {

  //       return false; // If parsing fails, return false to exclude the item
  //     }

  //     // // Handle date range filtering
  //     // const dateInRange = this.applyDateRangeFilter(new Date(data.purchaseDate), filterObject['fromDate'], filterObject['toDate']);

  //     // Handle other fields
  //     const otherFilters = Object.keys(filterObject).every(key => {
  //       if (key === 'fromDate' || key === 'toDate') {
  //         // Skip date range fields
  //         return true;
  //       }

  //       const filterKey = key as keyof UserData;
  //       if (!filterObject[filterKey]) {
  //         return true;
  //       }

  //       const dataValue = data[filterKey] ? data[filterKey].toString().toLowerCase() : '';
  //       const filterValue = filterObject[filterKey] ? filterObject[filterKey]!.toString().toLowerCase() : '';
  //       return dataValue.includes(filterValue);
  //     });

  //     return otherFilters;
  //   };

  //   dataSource.filter = JSON.stringify(filters);

  // }
}
