import { Component } from '@angular/core';
import { ChangeDetectorRef, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table';
import { ViewEncapsulation } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';
export interface UserData {
  // name: string;
  // userEmail: string;
  orderId: string;
  packageName: string
  purchaseDate: Date;
  expiryDate: Date;
  Paymentstatus: string;
  creditedReferrals: string;
  requestedReferrals: string;
  acceptedReferrals: string;
  status: string;

}
@Component({
  selector: 'app-admin-payment',
  templateUrl: './admin-payment.component.html',
  styleUrls: ['./admin-payment.component.scss']
})
export class AdminPaymentComponent {
  @ViewChild('dropdown') dropdown!: ElementRef;
  @ViewChild('referralPaginator') referralPaginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  // ViewChild declarations for paginator and sort for service table
  @ViewChild('servicePaginator') servicePaginator!: MatPaginator;
  @ViewChild('serviceSort') serviceSort!: MatSort;
  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;

  displayedColumns: string[] = ['serialNumber', 'orderId', 'packageName', 'purchaseDate', 'expiryDate', 'creditedReferrals', 'requestedReferrals', 'acceptedReferrals', 'status', 'action'];
  candidatesDataSource: MatTableDataSource<UserData>;
  servicesDataSource: MatTableDataSource<UserData>;
  isFilterPopupOpen: boolean = true;
  isDropdownOpen: boolean = false;
  nameslist: any[] = [];
  rowData: any;
  successmessage: string = '';
  successtitle: string = '';
  copiedContextId: string | null = null; // Stores the last copied context ID
  // pageSize: any = 25;
  lastKey: string | undefined = undefined;
  iconTimeout: any;
  private searchTerms = new Subject<string>();
  sortOrder: any = '';
  fromDate: any = '';
  toDate: any = '';
  searchText: any = '';
  searchTerm: string = '';
  searchQuery: string = '';
  selectedStatus: string = '';
  selectedName: string = '';
  StatusOption: any = [
    {
      name: "Active",
      value: "active"
    },
    {
      name: "Used",
      value: "used"
    },
  ]
  nameOption: any = [
    {
      name: "Starter",
      value: "Starter"
    },
    {
      name: "Accelerator",
      value: "Accelerator"
    },
    {
      name: "Maximiser",
      value: "Maximiser"
    },
  ]

  isDropdownActive: boolean = false;
  isSearchActive: boolean = false;
  modalSize: string = 'md';

  currentLastKey: string | null = null; // The current lastKey for the current page
  previousKeys: string[] = []; // Stack to store previous lastKeys for "Previous" functionality
  hasNext: boolean = false; // To enable/disable "Next" button
  hasPrevious: boolean = false; // To enable/disable "Previous" button
  pageSize: number = 25; // Default page size
  pageSizeOptions: number[] = [25, 50, 100, 150];
  constructor(private router: Router, private elementRef: ElementRef, private cdr: ChangeDetectorRef, private adminService: AdminService, private spinner: NgxSpinnerService) {
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
    userEmail: '',
    orderId: '',
    packageName: '',
    purchaseDate: '',
    expiryDate: '',
    creditedReferrals: '',
    requestedReferrals: '',
    acceptedReferrals: '',
    fromDate: '',
    toDate: ''
  };


  async ngOnInit(): Promise<void> {
    this.getAllSubscriptions(null);
  }
  async getAllSubscriptions(lastKey: string | null) {
    this.spinner.show()
    await this.adminService.getAllSubscriptions(this.pageSize, lastKey, this.sortOrder, this.fromDate, this.toDate, this.searchTerm).then(async (response: any) => {
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
      this.spinner.hide()
      if (error.status == 404) {
        this.spinner.hide()
        this.router.navigate(['/auth/logout']);
      } else if (error.status == 401) {

        this.router.navigate(['/']);
      } else {
        this.modalSize = 'md'
        this.successmessage = "Something went wrong. Please try again after sometime"
        this.successtitle = "Error"
        this.openModal(ModalType.SUCCESS_ERROR_MESSAGE)
      }
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

    // Use the previous lastKey if available; otherwise, start fresh
    const keyToUse = this.getKeyForCurrentPage();
    this.getAllSubscriptions(keyToUse);

  }

  applyFromDateFilters() {

    if (this.filterModel.fromDate) {
      const dateObject = new Date(this.filterModel.fromDate);
      // Adjusting time so that UTC conversion in toISOString() doesn't affect the date
      dateObject.setMinutes(dateObject.getMinutes() - dateObject.getTimezoneOffset());
      const isoString = dateObject.toISOString();
      this.fromDate = isoString;
    } else {
      this.fromDate = "";
    }

    // this.initializeData();

    // Use the previous lastKey if available; otherwise, start fresh
    const keyToUse = this.getKeyForCurrentPage();
    this.getAllSubscriptions(keyToUse);
  }


  applyToDateFilters() {

    if (this.filterModel.toDate) {
      const dateObject = new Date(this.filterModel.toDate);
      // Set the time to 23:59:59.999 for the end of the day
      dateObject.setHours(23, 59, 59, 999);
      // Adjusting time so that UTC conversion in toISOString() doesn't affect the date
      dateObject.setMinutes(dateObject.getMinutes() - dateObject.getTimezoneOffset());

      const isoString = dateObject.toISOString();
      this.toDate = isoString;
    } else {
      this.toDate = "";
    }
    // this.initializeData();
    // Use the previous lastKey if available; otherwise, start fresh
    const keyToUse = this.getKeyForCurrentPage();
    this.getAllSubscriptions(keyToUse);
  }

  initializeData() {
    this.pageSize = 25;
    this.lastKey = "";
    this.sortOrder = "";
    this.searchTerm = "";
    this.referralPaginator.pageIndex = 0;  // Reset to the first page
    this.referralPaginator.pageSize = 25;  // Update the UI's pageSize
  }

  resetDatePickers() {
    this.filterModel.fromDate = null;
    this.filterModel.toDate = null;
    (document.getElementById('paymentStatus') as HTMLSelectElement).value = "";
    (document.getElementById('nameFilter') as HTMLSelectElement).value = "";
    // this.pageSize = 25;
    // this.referralPaginator.pageIndex = 0;  // Reset to the first page
    // this.referralPaginator.pageSize = 25;  // Update the UI's pageSize
    // this.lastKey = "";
    this.sortOrder = '';
    this.fromDate = "";
    this.toDate = "";
    this.searchTerm = "";
    this.searchQuery = "";
    this.isSearchActive = false;
    this.isDropdownActive = false;

    // Use the previous lastKey if available; otherwise, start fresh
    const keyToUse = this.getKeyForCurrentPage();
    this.getAllSubscriptions(keyToUse);
  }

  ngAfterViewInit() {
    // Set paginator and sort for referral table
    // this.candidatesDataSource.paginator = this.referralPaginator;
    // this.candidatesDataSource.sort = this.referralSort;

    // // Set paginator and sort for service table
    // this.servicesDataSource.paginator = this.servicePaginator;
    // this.servicesDataSource.sort = this.serviceSort;

    // Listen for changes in the page size
    // this.referralPaginator.page.subscribe((event: PageEvent) => {
    //   if (event.pageSize !== this.pageSize) {
    //     this.pageSize = event.pageSize;
    //     this.getAllSubscriptions(); // Call getAllReferral with updated pageSize
    //   }
    // });
  }

  onPageSizeChange(event: Event): void {
    const selectedPageSize = (event.target as HTMLSelectElement).value;
    this.pageSize = Number(selectedPageSize);
    this.previousKeys = [];
    this.getAllSubscriptions(null); // Call getAllUserData refresh the data with the new page size
  }


  onSort(sort: Sort): void {

    if (sort.active === 'purchaseDate') {
      // this.lastKey = "";
      // this.pageSize = 25;
      this.sortOrder = this.sortOrder === 'ascending' ? 'descending' : 'ascending';
      sort.direction === 'asc' ? 'ascending' : 'descending';
      this.sort.direction = sort.direction;

      // Use the previous lastKey if available; otherwise, start fresh
      const keyToUse = this.getKeyForCurrentPage();
      // Call API to get data with the new sort direction
      this.getAllSubscriptions(keyToUse);
    }
  }
  onStatusChange(selectedStatus: string) {

    this.isSearchActive = !!selectedStatus;
    // this.pageSize = 25;
    // this.lastKey = "";
    // this.sortOrder = '';
    // this.fromDate = '';
    // this.toDate = '';
    this.searchTerm = selectedStatus;
    this.selectedStatus = selectedStatus;

    // Use the previous lastKey if available; otherwise, start fresh
    const keyToUse = this.getKeyForCurrentPage();
    // Call API to get data
    this.getAllSubscriptions(keyToUse);
  }

  onNameChange(selectedName: string) {
    this.isDropdownActive = !!selectedName;
    // this.pageSize = 25;
    // this.lastKey = "";
    // this.sortOrder = '';
    // this.fromDate = '';
    // this.toDate = '';
    this.searchTerm = selectedName;
    this.selectedStatus = selectedName;

    // Use the previous lastKey if available; otherwise, start fresh
    const keyToUse = this.getKeyForCurrentPage();
    // Call API to get data
    this.getAllSubscriptions(keyToUse);
  }

  async viewRow(row: any) {
    let emailid = row.PK.split('#').pop() || "";
    try {
      let response = await this.adminService.getUserByEmailId(emailid)
      //  let response= await this.adminService.getEmployeeReferralByEmailId('')
      if (response) {
        row = response
        this.openModal(ModalType.ADMINDETAIL_POPUP, "", "", row);
      }
    } catch (error: any) {
      this.spinner.hide()
      this.modalSize = 'md'
      this.successmessage = "Something went wrong. Please try again after sometime"
      this.successtitle = "Error"
      this.openModal(ModalType.SUCCESS_ERROR_MESSAGE)
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
      console.error('Failed to copy text: ', err);
    });
  }

  onNext() {
    if (!this.hasNext) return;

    // Store the current lastKey in the stack before moving forward
    if (this.currentLastKey) {
      this.previousKeys.push(this.currentLastKey);
    }

    // Fetch the next page
    this.getAllSubscriptions(this.currentLastKey);
  }

  onPrevious() {
    if (!this.hasPrevious) return;

    // Retrieve the second-to-last key in the stack, which corresponds to the last key used for the previous page
    const previousLastKey = this.previousKeys.length > 1 ? this.previousKeys[this.previousKeys.length - 2] : null;

    // Remove the current page's lastKey from the stack
    this.previousKeys.pop();

    if (!previousLastKey) {
      // If no valid previous key, fetch the first page
      this.getAllSubscriptions(null);
    } else {
      // Fetch the previous page using the second-to-last key
      this.getAllSubscriptions(previousLastKey);
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
  openModal(modalType: ModalType, message: string = "", title: string = "", rowData: any = null): void {
    this.cdr.detectChanges();
    this.showModal = modalType;
    this.modalMessage = message;
    this.modalTitle = title;
    this.rowData = rowData;
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


  // handleSearchInput(event: Event) {


  //   this.searchQuery = (event.target as HTMLInputElement).value;
  //   this.isDropdownActive = !!this.searchQuery; // Disable dropdown if search query is active

  //   if (this.searchQuery.length >= 3) {
  //     this.pageSize ="";
  //     this.lastKey = "";
  //     this.searchTerms.next(this.searchQuery);
  //   }else if(this.searchQuery.length<=0){
  //    this.clearSearchInput()
  //   }


  // }
  // onSearchInputEnter(event: KeyboardEvent): void {

  //   if (event.key === 'Enter') { // Checking if the pressed key is Enter
  //     this.isDropdownActive = true; // Disable dropdown when search is active
  //     this.selectedStatus = ''; 
  //     this.pageSize = 25;
  //     this.lastKey = "";
  //     this.sortOrder = '';
  //     this.fromDate = '';
  //     this.toDate = '';
  //     this.searchTerms.next(this.searchQuery);
  //   } else {
  //     this.isDropdownActive = false; // Enable dropdown if search query is cleared
  //   }
  // }

  // clearSearchInput(){

  //   this.searchQuery='',
  //   this.pageSize =25;
  //   this.lastKey = "";
  //   this.sortOrder='';
  //   this.fromDate=this.fromDate, 
  //   this.toDate=this.toDate,
  //   this.searchTerm="",
  //   this.referralPaginator.pageSize = 25;
  //   this.referralPaginator.firstPage();  // Go back to the first page
  //   this.isDropdownActive=false;
  //   this.getAllSubscriptions();

  // }
  // applyFilters() {
  //   // Gather selected filter options
  //   const selectedFilters = {
  //     name: this.filterModel.name,
  //     userEmail: this.filterModel.userEmail,
  //     orderId: this.filterModel.orderId,
  //     packageName: this.filterModel.packageName,
  //     purchaseDate: this.filterModel.purchaseDate,
  //     expiryDate: this.filterModel.expiryDate,
  //     creditedReferrals: this.filterModel.creditedReferrals,
  //     requestedReferrals: this.filterModel.requestedReferrals,
  //     acceptedReferrals: this.filterModel.acceptedReferrals,
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

  //     } catch (e) {

  //       return false; // If parsing fails, return false to exclude the item
  //     }

  //     // Handle date range filtering
  //     const dateInRange = this.applyDateRangeFilter(new Date(data.purchaseDate), filterObject['fromDate'], filterObject['toDate']);

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

  // }

  // applyDateRangeFilter(createdAt: Date, fromDate: string | undefined, toDate: string | undefined): boolean {
  //   const from = fromDate ? new Date(fromDate) : null;
  //   const to = toDate ? new Date(toDate) : null;



  //   if (from && to) {
  //     return createdAt >= from && createdAt <= to;
  //   } else if (from) {
  //     return createdAt >= from;
  //   } else if (to) {
  //     return createdAt <= to;
  //   }

  //   return true;
  // }

  // resetDatePickers() {
  //   this.filterModel.fromDate = null;
  //   this.filterModel.toDate = null;
  //   this.applyFilters(); // Optionally reapply filters after reset
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





}
