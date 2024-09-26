import { ChangeDetectorRef, Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table';
import { ViewEncapsulation } from '@angular/core';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { AdminService } from '../../services/admin.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { NgxSpinnerService } from 'ngx-spinner';
import { error } from 'jquery';
import { Router } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';

export interface UserData {
  Name: string;
  userID: string
  emailid: string;
  number: string;
  referralcount: number;
  companyName: string;
  department: string;
  designation: string;
  Subscribed: string;
  createdAt: any;

}


@Component({
  selector: 'app-admin-candidate',
  templateUrl: './admin-candidate.component.html',
  styleUrls: ['./admin-candidate.component.scss'],
  encapsulation: ViewEncapsulation.None  // Disable view encapsulation

})
export class AdminCandidateComponent implements AfterViewInit {
  @ViewChild('dropdown') dropdown!: ElementRef;
  @ViewChild('referralPaginator') referralPaginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  // ViewChild declarations for paginator and sort for service table
  // @ViewChild('servicePaginator') servicePaginator!: MatPaginator;
  // @ViewChild('serviceSort') serviceSort!: MatSort;
  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;

  displayedColumns: string[] = ['serialnumber', 'name', 'emailid', 'number', 'accountcreateddate', 'referralcount', 'companyname', 'department', 'designation', 'action'];
  candidatesDataSource: MatTableDataSource<UserData>;
  servicesDataSource: MatTableDataSource<UserData>;
  isFilterPopupOpen: boolean = true;
  isDropdownOpen: boolean = false;
  userData: any;
  userSubscription: any;
  nameslist: any[] = [];
  successtitle: string = '';
  successmessage: string = '';
  pageSize: any = 25;
  lastKey: string | undefined = undefined;
  private searchTerms = new Subject<string>();
  searchTerm: string = '';
  searchQuery: string = '';
  sortOrder: any;
  userExperience: any;
  status: any;
  fromDate: any = '';
  toDate: any = '';
  filterModel: any = {
    fromDate: '',
    toDate: ''

  };
  constructor(private router: Router, private adminService: AdminService, private _liveAnnouncer: LiveAnnouncer, private spinner: NgxSpinnerService) {
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




  ngAfterViewInit() {

    // Set paginator and sort for referral table
    this.candidatesDataSource.paginator = this.referralPaginator;
    // // this.candidatesDataSource.sort = this.referralSort;
    // this.candidatesDataSource.sort = this.sort;

    this.referralPaginator.page.subscribe((event: PageEvent) => {
      if (event.pageSize !== this.pageSize) {
        this.pageSize = event.pageSize;
        this.getAllUserData(); // Call getAllReferral with updated pageSize
      }
    });

    // // Set paginator and sort for service table
    // this.servicesDataSource.paginator = this.servicePaginator;
    // this.servicesDataSource.sort = this.serviceSort;
  }





  async ngOnInit(): Promise<void> {

    this.getAllUserData();
  }
  async getAllUserData() {
    this.spinner.show()
    await this.adminService.getAllUserData('CAND', this.pageSize, this.lastKey, this.searchTerm, this.sortOrder, this.fromDate, this.toDate).then(async (response: any) => {
      if (response) {
        this.nameslist = response.data;
        this.lastKey = response.pagination.lastKey;
        this.pageSize = response.pagination.pageSize;
        //  await  this.sortCandidatesByDate('desc'); // Sort it in descending order when the component initializes
        //console.log("Issue list:", this.issueList);
        this.updateData(this.nameslist);
      }
    }).catch((error: any) => {
      console.log(error)
      this.spinner.hide()
      if (error.status == 404) {
        this.spinner.hide()
        this.router.navigate(['/auth/logout']);
      } else if (error.status == 401) {

        this.router.navigate(['/']);
      } else {
        this.successmessage = "Something went wrong. Please try again after sometime"
        this.successtitle = "Error"
        this.openModal(ModalType.SUCCESS_MESSAGE)
      }
    });
  }
  updateData(newData: UserData[]) {
    this.spinner.hide()
    this.candidatesDataSource.data = newData;
    if (this.referralPaginator) {
      this.referralPaginator.firstPage();
    }

  }
  callApiWithSearchQuery(query: string): void {
    this.pageSize = "";
    this.lastKey = "";

    this.searchTerm = query; // Setting here encoded query to filterData
    // console.log(this.sortOrder,this.fromDate,this.toDate,this.searchTerm)
    this.getAllUserData();

  }

  handleSearchInput(event: Event) {
    // this.searchQuery = (event.target as HTMLInputElement).value;


    if (this.searchQuery.length >= 3) {
      this.pageSize = "";
      this.lastKey = "";
      this.searchTerms.next(this.searchQuery);
    } else if (this.searchQuery.length <= 0) {
      this.clearSearchInput()
    }


  }

  onSearchInputEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter') { // Checking if the pressed key is Enter
      this.pageSize = 25;
      this.lastKey = "";
      this.searchTerms.next(this.searchQuery);
    }
  }

  clearSearchInput() {

    this.referralPaginator.pageIndex = 0;  // Reset to the first page
    this.pageSize = 25;                    // Set the pageSize to 25
    this.referralPaginator.pageSize = 25;  // Update the UI's pageSize
    this.lastKey = "";
    this.searchTerm = ""
    this.searchQuery = "";
    this.getAllUserData();
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
    this.initializeData();
    this.getAllUserData();
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
    this.initializeData();
    this.getAllUserData();
  }

  initializeData() {
    this.pageSize = 25;
    this.lastKey = "";
    this.sortOrder = '';
    this.searchTerm = "";
    this.referralPaginator.pageIndex = 0;  // Reset to the first page
    this.referralPaginator.pageSize = 25;  // Update the UI's pageSize
  }

  resetDatePickers() {
    this.filterModel.fromDate = null;
    this.filterModel.toDate = null;
    this.pageSize = 25;
    this.lastKey = "";
    this.sortOrder = '';
    this.fromDate = "",
      this.toDate = "",
      this.searchTerm = ""
    this.searchQuery = "";
    this.referralPaginator.pageIndex = 0;  // Reset to the first page
    this.referralPaginator.pageSize = 25;  // Update the UI's pageSize
    this.getAllUserData();
  }

  //backend sorting code
  onSort(sort: Sort): void {

    if (sort.active === 'accountcreateddate') {
      this.lastKey = "";
      this.pageSize = 25;
      this.sortOrder = this.sortOrder === 'ascending' ? 'descending' : 'ascending';
      sort.direction === 'asc' ? 'ascending' : 'descending';
      this.sort.direction = sort.direction;
      // Call API with the new sort direction
      this.getAllUserData();
    }
  }

  //frontend sorting code
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
    this.spinner.show()
    await this.adminService.getSubscriptionsByEmailId(userData.email).then(async (response: any) => {

      // if(response && response.length > 0){
      this.spinner.hide()
      this.userSubscription = response
      if (userData.isCandidateFresher !== undefined && userData.isCandidateFresher) {
        this.status = "Yes";
      } else if (userData.isCandidateFresher !== undefined && !userData.isCandidateFresher) {
        this.status = "No";
      } else {
        this.status = "Candidate profile data Not Filled";
      }
      //   this.userExperience= await this.adminService.getUserExperienceByEmailId(userData.email)  
      // // Determine status

      // if (this.userExperience.length > 0 && this.userExperience.isEmailVerified==='false') {
      //   this.status = "Yes";
      // } else if (this.userExperience.length ===0) {
      //   this.status = "No";
      // } else {
      //   this.status = "Company EmailID Verified";
      // }


      this.openModal(ModalType.ADMINDETAIL_POPUP, "", "", userData, this.userSubscription, this.status);


    }).catch((error: any) => {
      this.spinner.hide()
      if (error.status == 404) {
        this.spinner.hide()
        this.router.navigate(['/auth/logout']);
      } else if (error.status == 401) {

        this.router.navigate(['/']);
      } else {
        this.successmessage = "Something went wrong. Please try again after sometime"
        this.successtitle = "Error"
        this.openModal(ModalType.SUCCESS_MESSAGE)
      }
    });



  }
  /**
  * Open modal.
  *
  * @param {ModalType} modalType
  * @param {string} [message = ""]
  * @param {string} [title = ""]
  * @returns {void}
  */
  openModal(modalType: ModalType, message: string = "", title: string = "", userData: any = null, userSubscription: any = null, userExperience: any = null): void {
    this.showModal = modalType;
    this.modalMessage = message;
    this.modalTitle = title;
    this.userData = userData;
    this.userSubscription = userSubscription;
    this.userExperience = userExperience
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


  // filterModel: any = {
  //   Name: '',
  //   emailid: "",
  //   number: "",
  //   referralcount: "",
  //   companyname: "",
  //   department: "",
  //   designation: "",
  //   Subscribed: "",
  // };


  // applyFilters() {
  //   // Gather selected filter options
  //   const selectedFilters = {
  //     name: this.filterModel.Name,
  //     emailid: this.filterModel.emailid,
  //     number: this.filterModel.number,
  //     referralcount: this.filterModel.referralcount,
  //     companyname: this.filterModel.companyname,
  //     department: this.filterModel.department,
  //     designation: this.filterModel.designation,
  //     Subscribed: this.filterModel.Subscribed,

  //   };

  //   // Apply filters to both data sources
  //   this.applyDataSourceFilters(this.candidatesDataSource, selectedFilters);

  //   // Reset pagination to navigate to first page
  //   if (this.candidatesDataSource.paginator) {
  //     this.candidatesDataSource.paginator.firstPage();
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
  // announceSortChange(sortState: Sort) {
  //   // This example uses English messages. If your application supports
  //   // multiple language, you would internationalize these strings.
  //   // Furthermore, you can customize the message to add additional
  //   // details about the values being sorted.
  //   if (sortState.direction) {
  //     this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
  //   } else {
  //     this._liveAnnouncer.announce('Sorting cleared');
  //   }
  // }

}


