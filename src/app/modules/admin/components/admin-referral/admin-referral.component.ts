import { Component } from '@angular/core';
import { ChangeDetectorRef, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table';
import { ViewEncapsulation } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { NgPluralCase } from '@angular/common';
import { Router } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';
import { ErrorHandlingService } from 'src/app/modules/app-core/services/error-handling.service';

export interface UserData {
  Name: string;
  emailId: string;
  jd: string;
  userSubscriptionId: string;
  matchingScore: string;
  jobUrl: string;
  status: string;
  Date: Date;
  companyName: string;
  companyId: string;

}

@Component({
  selector: 'app-admin-referral',
  templateUrl: './admin-referral.component.html',
  styleUrls: ['./admin-referral.component.scss']
})
export class AdminReferralComponent {

  @ViewChild('dropdown') dropdown!: ElementRef;
  @ViewChild('referralPaginator') referralPaginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  // ViewChild declarations for paginator and sort for service table
  @ViewChild('servicePaginator') servicePaginator!: MatPaginator;
  @ViewChild('serviceSort') serviceSort!: MatSort;
  @ViewChild(ModalComponent) modal!: ModalComponent;
  copiedContextId: string | null = null; // Stores the last copied context ID
  iconTimeout: any;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  displayedColumns: string[] = ['serialNumber', 'emailId', 'matchingScore', 'status', 'date', 'jobUrl', 'action'];
  candidatesDataSource: MatTableDataSource<UserData>;
  servicesDataSource: MatTableDataSource<UserData>;
  isFilterPopupOpen: boolean = true;
  isDropdownOpen: boolean = false;
  nameslist: any[] = [];
  rowData: any;
  successmessage: string = '';
  successtitle: string = '';
  lastKey: string | undefined = undefined;
  companyDetails: any;
  userDetails: any;
  private searchTerms = new Subject<string>();
  sortOrder: any = '';
  fromDate: any = '';
  toDate: any = '';
  searchText: any = '';
  searchTerm: string = '';
  searchQuery: string = '';
  selectedStatus: string = '';
  isDropdownActive: boolean = false;
  isSearchActive: boolean = false;
  StatusOption: any = [
    {
      name: "Awaiting",
      value: "awaiting"
    },
    {
      name: "Accepted",
      value: "accepted"
    },
    {
      name: "Referred",
      value: "done"
    },

    {
      name: "Rejected",
      value: "rejected"
    },
    {
      name: "Cancelled",
      value: "cancelled"
    },
    {
      name: "Withdrawn",
      value: "withdrawn"
    },
  ]
  formattedJD: any;
  cvUrl: any;
  constructor(private router: Router, private elementRef: ElementRef, private cdr: ChangeDetectorRef, private adminService: AdminService, private spinner: NgxSpinnerService, private errorHandlingService: ErrorHandlingService) {
    this.candidatesDataSource = new MatTableDataSource<UserData>(this.nameslist);
    this.servicesDataSource = new MatTableDataSource<UserData>(this.nameslist);
    this.searchTerms.pipe(
      debounceTime(300), // Adjust the debounce time as needed (300 milliseconds in this example)
      //distinctUntilChanged()
    )
      .subscribe((query: string) => {

        // Call your API here with the query string
        this.callApiWithSearchQuery(query);
      });
  }


  filterModel: any = {
    name: '',
    emailId: '',
    jd: '',
    Date: '',
    userSubscriptionId: '',
    matchingScore: '',
    jobUrl: '',
    status: '',
    companyName: '',
    companyId: '',
    fromDate: '',
    toDate: ''
  };
  modalSize: string = 'lg';

  currentLastKey: string | null = null; // The current lastKey for the current page
  previousKeys: string[] = []; // Stack to store previous lastKeys for "Previous" functionality
  hasNext: boolean = false; // To enable/disable "Next" button
  hasPrevious: boolean = false; // To enable/disable "Previous" button
  pageSize: number = 25; // Default page size
  pageSizeOptions: number[] = [25, 50, 100, 150];


  async ngOnInit(): Promise<void> {
    this.getAllReferral(null);
  }

  onPageSizeChange(event: Event): void {
    const selectedPageSize = (event.target as HTMLSelectElement).value;
    this.pageSize = Number(selectedPageSize);
    this.previousKeys = [];
    this.getAllReferral(null); // Call getAllUserData refresh the data with the new page size
  }

  async getAllReferral(lastKey: string | null) {
    this.spinner.show()
    await this.adminService.getAllReferral(this.pageSize, lastKey, this.sortOrder, this.fromDate, this.toDate, this.searchTerm, this.selectedStatus.toUpperCase()).then(async (response: any) => {
      if (response) {
        this.spinner.hide()
        this.nameslist = response.data;
        this.updateData(this.nameslist);

        this.pageSize = response.pagination.pageSize;
        this.currentLastKey = response.pagination.lastKey || null;
        this.hasNext = !!response.pagination.lastKey;
        this.hasPrevious = this.previousKeys.length > 0;
      }
    }).catch((error: any) => {
      // this.spinner.hide()
      // if (error.status == 404) {
      //   this.spinner.hide()
      //   this.router.navigate(['/auth/logout']);
      // } else if (error.status == 401) {

      //   this.router.navigate(['/']);
      // } else {
      //   this.modalSize = 'md'
      //   this.successmessage = "Something went wrong. Please try again after sometime"
      //   this.successtitle = "Error"
      //   this.openModal(ModalType.SUCCESS_ERROR_MESSAGE)
      // }
      this.spinner.hide();
        this.errorHandlingService.handleApiError(error, () => {
          this.modalSize = 'md';
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
    // this.sortOrder = '';
    this.searchTerm = query; // Setting here encoded query to filterData
    // this.fromDate = "",
    // this.toDate = "",
    // console.log(this.sortOrder,this.fromDate,this.toDate,this.searchTerm)
    // Use the previous lastKey if available; otherwise, start fresh
    // const keyToUse = this.getKeyForCurrentPage();
    // this.getAllReferral(keyToUse);

    this.previousKeys = [];
    this.getAllReferral(null);

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
    // this.getAllReferral(keyToUse);

    this.previousKeys = [];
    this.getAllReferral(null);
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

    // this.initializeData();

    // Use the previous lastKey if available; otherwise, start fresh
    // const keyToUse = this.getKeyForCurrentPage();
    // this.getAllReferral(keyToUse);

    this.previousKeys = [];
    this.getAllReferral(null);
  }

  initializeData() {
    this.pageSize = 50;
    this.lastKey = "";
    this.sortOrder = '';
    this.searchTerm = "";
    this.referralPaginator.pageIndex = 0;  // Reset to the first page
    this.referralPaginator.pageSize = 50;  // Update the UI's pageSize
  }

  resetDatePickers() {
    this.filterModel.fromDate = null;
    this.filterModel.toDate = null;
    // this.pageSize = 50;
    // this.lastKey = "";
    // this.sortOrder = '';
    this.fromDate = "",
    this.toDate = "",
    this.searchTerm = "",
    this.searchQuery = "";
    this.selectedStatus = "";
    //   this.referralPaginator.pageIndex = 0;  // Reset to the first page
    // this.referralPaginator.pageSize = 50;  // Update the UI's pageSize
    // this.isSearchActive = false,
    // this.isDropdownActive = false;
    (document.getElementById('referralStatus') as HTMLSelectElement).value = "";

    // Use the previous lastKey if available; otherwise, start fresh
    // const keyToUse = this.getKeyForCurrentPage();
    // this.getAllReferral(keyToUse);

    this.previousKeys = [];
    this.getAllReferral(null);
  }

  handleSearchInput(event: Event) {
    // this.searchQuery = (event.target as HTMLInputElement).value;
    // this.isDropdownActive = !!this.searchQuery; // Disable dropdown if search query is active

    if (this.searchQuery.length >= 3) {
      // this.pageSize = "";
      // this.lastKey = "";
      this.searchTerms.next(this.searchQuery);
    } else if (this.searchQuery.length <= 0) {
      this.clearSearchInput()
    }

  }

  clearSearchInput() {

    // this.referralPaginator.pageIndex = 0;  // Reset to the first page
    // this.pageSize = 50;                    // Set the pageSize to 25
    // this.referralPaginator.pageSize = 50;  // Update the UI's pageSize
    // this.lastKey = "";
    // this.sortOrder = '';
    // this.fromDate = this.fromDate,
    //   this.toDate = this.toDate,
    this.searchTerm = "";
    this.searchQuery = '';
    // this.isDropdownActive = false

    // Use the previous lastKey if available; otherwise, start fresh
    // const keyToUse = this.getKeyForCurrentPage();
    // this.getAllReferral(keyToUse);

    this.previousKeys = [];
    this.getAllReferral(null);
  }
  
  onSearchInputEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      // Checking if the pressed key is Enter
      // this.isDropdownActive = true; // Disable dropdown when search is active
      // this.selectedStatus = '';
      // this.pageSize = 50;
      // this.lastKey = "";
      // this.sortOrder = '';
      // this.fromDate = '';
      // this.toDate = '';
      this.searchTerms.next(this.searchQuery);
    }
  }
  onStatusChange(selectedStatus: string) {
    // this.isSearchActive = !!selectedStatus
    // this.pageSize = 50;
    // this.lastKey = "";
    // this.sortOrder = '';
    // this.fromDate = '';
    // this.toDate = '';
    this.selectedStatus = selectedStatus;

    // Use the previous lastKey if available; otherwise, start fresh
    // const keyToUse = this.getKeyForCurrentPage();
    // Call API to get data
    // this.getAllReferral(keyToUse);

    this.previousKeys = [];
    this.getAllReferral(null);
  }

  ngAfterViewInit() {
    // // Set paginator and sort for referral table
    // this.candidatesDataSource.paginator = this.referralPaginator;

    // // Listen for changes in the page size
    // this.referralPaginator.page.subscribe((event: PageEvent) => {
    //   if (event.pageSize !== this.pageSize) {
    //     this.pageSize = event.pageSize;
    //     this.getAllReferral(); // Call getAllReferral with updated pageSize
    //   }
    // });
  }

  openfile(event: { preventDefault: () => void; }) {
    event.preventDefault();



    //window.open(this.docResult.awsS3SignedUrl,'_blank')
    window.open(this.userDetails.CV, '_blank')

  }


  onSort(sort: Sort): void {

    if (sort.active === 'date') {
      // this.lastKey = "";
      // this.pageSize = 50;
      this.sortOrder = this.sortOrder === 'ascending' ? 'descending' : 'ascending';
      sort.direction === 'asc' ? 'ascending' : 'descending';
      this.sort.direction = sort.direction;

      // Use the previous lastKey if available; otherwise, start fresh
      const keyToUse = this.getKeyForCurrentPage();
      // Call API to get data with the new sort direction
      this.getAllReferral(keyToUse);
    }
  }

  copyToClipboard(contextId: string) {
    navigator.clipboard.writeText(contextId).then(() => {
      this.copiedContextId = contextId; // Store the copied ID

      // Reset the icon after 2 seconds
      if (this.iconTimeout) {
        clearTimeout(this.iconTimeout);
      }
      this.iconTimeout = setTimeout(() => {
        this.copiedContextId = null;
      }, 2000);
    }).catch(err => {
      // console.error('Failed to copy text: ', err);
    });
  }

  async viewRow(data: any) {
    let id = data.id;
    try {
      let response = await this.adminService.getReferralById(id)
      //  let response= await this.adminService.getEmployeeReferralByEmailId('')
      if (response) {
        this.rowData = response
        this.companyDetails = await this.adminService.getCompanyById(data.companyId);
        if (this.companyDetails) {
          const inputString = data.PK;
          const email = inputString.split('#').pop();
          this.userDetails = await this.adminService.getUserByEmailId(email);
          this.getCVUrl()
        }

      }
    } catch (error: any) {
      this.spinner.hide()
      this.modalSize = 'md'
      this.successmessage = "Something went wrong. Please try again after sometime"
      this.successtitle = "Error"
      this.openModal(ModalType.SUCCESS_ERROR_MESSAGE)
    }
  }
  async getCVUrl() {
    this.spinner.show()
    if (this.userDetails.CV && this.userDetails.id) {
      await this.adminService.getCVUrl(this.userDetails.id, this.userDetails.CV).then(async (response: any) => {
        this.spinner.hide()
        this.cvUrl = response.objectUrl;
        this.formattedJD = this.rowData.jdExtracted.split('\n').filter((line: string) => line.trim() !== ''); // Split by newline and remove empty lines
        this.openModal(ModalType.ADMINDETAIL_POPUP, "", "", this.rowData, this.companyDetails, this.userDetails);

      }).catch((error: any) => {
        // this.spinner.hide()
        // if (error.status == 404) {
        //   this.spinner.hide()
        //   this.router.navigate(['/auth/logout']);
        // } else if (error.status == 401) {

        //   this.router.navigate(['/']);
        // } else {
        //   this.modalSize = 'md'
        //   this.successmessage = "Something went wrong. Please try again after sometime"
        //   this.successtitle = "Error"
        //   this.openModal(ModalType.SUCCESS_ERROR_MESSAGE)
        // }
        this.spinner.hide();
        this.errorHandlingService.handleApiError(error, () => {
          this.modalSize = 'md';
          this.successmessage = "Something went wrong. Please try again later.";
          this.successtitle = "Error";
          this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
        });
      });
    } else {
      this.spinner.hide()
      this.formattedJD = this.rowData.jdExtracted.split('\n').filter((line: string) => line.trim() !== ''); // Split by newline and remove empty lines
      this.openModal(ModalType.ADMINDETAIL_POPUP, "", "", this.rowData, this.companyDetails, this.userDetails);
    }


  }

  onNext() {
    if (!this.hasNext) return;

    // Store the current lastKey in the stack before moving forward
    if (this.currentLastKey) {
      this.previousKeys.push(this.currentLastKey);
    }

    // Fetch the next page
    this.getAllReferral(this.currentLastKey);
  }

  onPrevious() {
    if (!this.hasPrevious) return;

    // Retrieve the second-to-last key in the stack, which corresponds to the last key used for the previous page
    const previousLastKey = this.previousKeys.length > 1 ? this.previousKeys[this.previousKeys.length - 2] : null;

    // Remove the current page's lastKey from the stack
    this.previousKeys.pop();

    if (!previousLastKey) {
      // If no valid previous key, fetch the first page
      this.getAllReferral(null);
    } else {
      // Fetch the previous page using the second-to-last key
      this.getAllReferral(previousLastKey);
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
  openModal(modalType: ModalType, message: string = "", title: string = "", rowData: any = null, companyDetails: any = null, userDetails: any = NgPluralCase): void {
    this.cdr.detectChanges();
    this.showModal = modalType;
    this.modalMessage = message;
    this.modalTitle = title;
    this.rowData = rowData;
    this.companyDetails = companyDetails;
    this.userDetails = userDetails
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


  // applyFilters() {
  //   // Gather selected filter options
  //   const selectedFilters = {
  //     name: this.filterModel.Name,
  //     emailId: this.filterModel.emailId,
  //     jobDescription: this.filterModel.jd,
  //     date: this.filterModel.Date,
  //     userSubscriptionId: this.filterModel.userSubscriptionId,
  //     matchingScore: this.filterModel.matchingScore,
  //     jobUrl: this.filterModel.jobUrl,
  //     status: this.filterModel.status,
  //     companyName: this.filterModel.companyName,
  //     companyId: this.filterModel.companyId,
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

  // applyDataSourceFilters(dataSource: MatTableDataSource<UserData>, filters: { [key: string]: string | undefined }) {
  //   dataSource.filterPredicate = (data: UserData, filter: string) => {
  //     let filterObject: { [key: string]: string | undefined }; // Explicitly type filterObject
  //     try {
  //       filterObject = JSON.parse(filter);
  //       // console.log('Parsed Filter Object:', filterObject);
  //     } catch (e) {
  //      // console.error('Error parsing filter object:', e);
  //       return false; // If parsing fails, return false to exclude the item
  //     }

  //     // Handle date range filtering
  //     const dateInRange = this.applyDateRangeFilter(new Date(data.Date), filterObject['fromDate'], filterObject['toDate']);

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

  //     return dateInRange && otherFilters;
  //   };

  //   dataSource.filter = JSON.stringify(filters);
  // //  console.log('Data Source Filter:', dataSource.filter);
  // }

  // applyDateRangeFilter(createdAt: Date, fromDate: string | undefined, toDate: string | undefined): boolean {
  //   const from = fromDate ? new Date(fromDate) : null;
  //   const to = toDate ? new Date(toDate) : null;

  //  // console.log('Applying Date Range Filter:', 'Created At:', createdAt, 'From:', from, 'To:', to);

  //   if (from && to) {
  //     return createdAt >= from && createdAt <= to;
  //   } else if (from) {
  //     return createdAt >= from;
  //   } else if (to) {
  //     return createdAt <= to;
  //   }

  //   return true;
  // }
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
  // clearSearchInput(input: any, dataSource: MatTableDataSource<UserData>) {
  //   input.value = ''; // Clear the input value
  //   dataSource.filter = ''; // Reset the filter to show all data

  //   if (dataSource.paginator) {
  //     dataSource.paginator.firstPage();
  //   }
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

  // resetDatePickers() {
  //   this.filterModel.fromDate = null;
  //   this.filterModel.toDate = null;
  //   this.applyFilters(); // Optionally reapply filters after reset
  // }

}
