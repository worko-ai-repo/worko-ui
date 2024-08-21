import { ChangeDetectorRef, Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
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

export interface UserData {
  Name: string;
  userID: string
  emailid: string;
  number: string;
  referralcount: number;
  companyName: string;
  department: string;
  designation: string;
  Subscribed: string

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
  @ViewChild('MatSort') sort!: MatSort;

  // ViewChild declarations for paginator and sort for service table
  // @ViewChild('servicePaginator') servicePaginator!: MatPaginator;
  // @ViewChild('serviceSort') serviceSort!: MatSort;
  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;

  displayedColumns: string[] = ['serialnumber', 'name', 'emailid', 'number', 'referralcount', 'companyname', 'department', 'designation', 'Subscribed', 'action'];
  candidatesDataSource: MatTableDataSource<UserData>;
  servicesDataSource: MatTableDataSource<UserData>;
  isFilterPopupOpen: boolean = true;
  isDropdownOpen: boolean = false;
  userData: any;
  userSubscription: any;
  nameslist: any[] = [];
  successtitle: string = '';
  successmessage: string = '';
  constructor(private router: Router, private adminService: AdminService, private _liveAnnouncer: LiveAnnouncer, private spinner: NgxSpinnerService) {
    this.candidatesDataSource = new MatTableDataSource<UserData>(this.nameslist);
    this.servicesDataSource = new MatTableDataSource<UserData>(this.nameslist);
  }


  filterModel: any = {
    Name: '',
    emailid: "",
    number: "",
    referralcount: "",
    companyname: "",
    department: "",
    designation: "",
    Subscribed: "",
  };
  applyFilters() {
    // Gather selected filter options
    const selectedFilters = {
      name: this.filterModel.Name,
      emailid: this.filterModel.emailid,
      number: this.filterModel.number,
      referralcount: this.filterModel.referralcount,
      companyname: this.filterModel.companyname,
      department: this.filterModel.department,
      designation: this.filterModel.designation,
      Subscribed: this.filterModel.Subscribed,

    };

    // Apply filters to both data sources
    this.applyDataSourceFilters(this.candidatesDataSource, selectedFilters);

    // Reset pagination to navigate to first page
    if (this.candidatesDataSource.paginator) {
      this.candidatesDataSource.paginator.firstPage();
    }
  }

  // applyDataSourceFilters(dataSource: MatTableDataSource<UserData>, filters: any) {
  //   dataSource.filterPredicate = (data: UserData, filter: string) => {
  //     const searchString = Object.keys(filters)
  //       .map(key => filters[key])
  //       .join('');
  //     return searchString.trim().toLowerCase().split(' ').every(term =>
  //       Object.values(data).join('').toLowerCase().includes(term)
  //     );
  //   };
  //   dataSource.filter = 'activate';
  // }

  applyDataSourceFilters(dataSource: MatTableDataSource<UserData>, filters: { [key: string]: string | undefined }) {
    dataSource.filterPredicate = (data: UserData, filter: string) => {
      let filterObject: { [key: string]: string | undefined }; // Explicitly type filterObject
      try {
        filterObject = JSON.parse(filter);

      } catch (e) {

        return false; // If parsing fails, return false to exclude the item
      }

      // // Handle date range filtering
      // const dateInRange = this.applyDateRangeFilter(new Date(data.purchaseDate), filterObject['fromDate'], filterObject['toDate']);

      // Handle other fields
      const otherFilters = Object.keys(filterObject).every(key => {
        if (key === 'fromDate' || key === 'toDate') {
          // Skip date range fields
          return true;
        }

        const filterKey = key as keyof UserData;
        if (!filterObject[filterKey]) {
          return true;
        }

        const dataValue = data[filterKey] ? data[filterKey].toString().toLowerCase() : '';
        const filterValue = filterObject[filterKey] ? filterObject[filterKey]!.toString().toLowerCase() : '';
        return dataValue.includes(filterValue);
      });

      return otherFilters;
    };

    dataSource.filter = JSON.stringify(filters);

  }

  ngAfterViewInit() {

    // Set paginator and sort for referral table
    this.candidatesDataSource.paginator = this.referralPaginator;
    // this.candidatesDataSource.sort = this.referralSort;
    this.candidatesDataSource.sort = this.sort;



    // // Set paginator and sort for service table
    // this.servicesDataSource.paginator = this.servicePaginator;
    // this.servicesDataSource.sort = this.serviceSort;
  }



  search(event: Event, filterValue: string, dataSource: MatTableDataSource<UserData>) {
    const filterText = filterValue.trim().toLowerCase();
    dataSource.filter = filterText;

    if (dataSource.paginator) {
      dataSource.paginator.firstPage();
    }
  }
  handleSearchInput(event: Event, dataSource: MatTableDataSource<UserData>) {
    const filterValue = (event.target as HTMLInputElement).value;
    dataSource.filter = filterValue.trim().toLowerCase();

    if (dataSource.paginator) {
      dataSource.paginator.firstPage();
    }
  }
  clearSearchInput(input: any, dataSource: MatTableDataSource<UserData>) {
    input.value = ''; // Clear the input value
    dataSource.filter = ''; // Reset the filter to show all data

    if (dataSource.paginator) {
      dataSource.paginator.firstPage();
    }
  }

  async ngOnInit(): Promise<void> {
    this.getAllUserData();
  }
  async getAllUserData() {
    this.spinner.show()
    await this.adminService.getAllUserData('CAND').then(async (response: any) => {
      if (response) {
        this.nameslist = response.data;
        //console.log("Issue list:", this.issueList);
        this.updateData(this.nameslist);
      }
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
  updateData(newData: UserData[]) {
    this.spinner.hide()
    this.candidatesDataSource.data = newData;
    if (this.referralPaginator) {
      this.referralPaginator.firstPage();
    }

  }

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation(); // Prevent event propagation to avoid immediate closing of the dropdown
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.listenForOutsideClick(); // Listen for clicks outside the dropdown to close it
    } else {
      this.removeOutsideClickListener(); // Remove the listener if the dropdown is closed
    }
  }

  listenForOutsideClick() {
    document.addEventListener('click', this.closeDropdownOnClickOutside);
  }

  removeOutsideClickListener() {
    document.removeEventListener('click', this.closeDropdownOnClickOutside);
  }

  closeDropdownOnClickOutside = (event: MouseEvent) => {
    if (!this.dropdown.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
      this.removeOutsideClickListener();
    }
  }
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }



  async viewRow(userData: any) {
    this.spinner.show()
    await this.adminService.getSubscriptionsByEmailId(userData.email).then(async (response: any) => {
      // if(response && response.length > 0){
      this.spinner.hide()
      this.userSubscription = response[0]
      this.openModal(ModalType.ADMINDETAIL_POPUP, "", "", userData, this.userSubscription);

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
  openModal(modalType: ModalType, message: string = "", title: string = "", userData: any = null, userSubscription: any = null): void {
    this.showModal = modalType;
    this.modalMessage = message;
    this.modalTitle = title;
    this.userData = userData;
    this.userSubscription = userSubscription;
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

}


