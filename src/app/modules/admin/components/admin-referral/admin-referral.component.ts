import { Component } from '@angular/core';
import { ChangeDetectorRef, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table';
import { ViewEncapsulation } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { NgPluralCase } from '@angular/common';
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
  @ViewChild('referralSort') referralSort!: MatSort;

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
  displayedColumns: string[] = ['serialnumber', 'emailId', 'matchingScore', 'status', 'date', 'companyId', 'userSubscriptionId', 'jobUrl', 'action'];
  candidatesDataSource: MatTableDataSource<UserData>;
  servicesDataSource: MatTableDataSource<UserData>;
  isFilterPopupOpen: boolean = true;
  isDropdownOpen: boolean = false;
  nameslist: any[] = [];
  rowData: any;
  successmessage: string = '';
  successtitle: string = '';
  pageSize: number = 25;
  lastKey: string | undefined = undefined;
  companyDetails: any;
  userDetails: any;
  constructor(private elementRef: ElementRef, private adminService: AdminService, private spinner: NgxSpinnerService) {
    this.candidatesDataSource = new MatTableDataSource<UserData>(this.nameslist);
    this.servicesDataSource = new MatTableDataSource<UserData>(this.nameslist);
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


  async ngOnInit(): Promise<void> {
    this.getAllReferral();
  }
  async getAllReferral() {
    this.spinner.show()
    await this.adminService.getAllReferral(this.pageSize, this.lastKey).then(async (response: any) => {
      if (response) {
        this.spinner.hide()
        this.nameslist = response.data;
        this.lastKey = response.pagination.lastKey;
        this.pageSize = response.pagination.pageSize;
        this.updateData(this.nameslist);
      }
    }).catch((error: any) => {
      this.spinner.hide()
      this.successmessage = "Something went wrong. Please try again after sometime"
      this.successtitle = "Error"
      this.openModal(ModalType.SUCCESS_MESSAGE)
    });
  }
  updateData(newData: UserData[]) {
    this.candidatesDataSource.data = newData;
    if (this.referralPaginator) {
      this.referralPaginator.firstPage();

    }
  }

  applyFilters() {
    // Gather selected filter options
    const selectedFilters = {
      name: this.filterModel.Name,
      emailId: this.filterModel.emailId,
      jobDescription: this.filterModel.jd,
      date: this.filterModel.Date,
      userSubscriptionId: this.filterModel.userSubscriptionId,
      matchingScore: this.filterModel.matchingScore,
      jobUrl: this.filterModel.jobUrl,
      status: this.filterModel.status,
      companyName: this.filterModel.companyName,
      companyId: this.filterModel.companyId,
      fromDate: this.filterModel.fromDate,
      toDate: this.filterModel.toDate,
    };

    // Apply filters to both data sources
    this.applyDataSourceFilters(this.candidatesDataSource, selectedFilters);
    this.applyDataSourceFilters(this.servicesDataSource, selectedFilters);

    // Reset pagination to navigate to first page
    if (this.candidatesDataSource.paginator) {
      this.candidatesDataSource.paginator.firstPage();
    }
    if (this.servicesDataSource.paginator) {
      this.servicesDataSource.paginator.firstPage();
    }
  }

  applyDataSourceFilters(dataSource: MatTableDataSource<UserData>, filters: { [key: string]: string | undefined }) {
    dataSource.filterPredicate = (data: UserData, filter: string) => {
      let filterObject: { [key: string]: string | undefined }; // Explicitly type filterObject
      try {
        filterObject = JSON.parse(filter);
        console.log('Parsed Filter Object:', filterObject);
      } catch (e) {
        console.error('Error parsing filter object:', e);
        return false; // If parsing fails, return false to exclude the item
      }

      // Handle date range filtering
      const dateInRange = this.applyDateRangeFilter(new Date(data.Date), filterObject['fromDate'], filterObject['toDate']);

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

      return dateInRange && otherFilters;
    };

    dataSource.filter = JSON.stringify(filters);
    console.log('Data Source Filter:', dataSource.filter);
  }

  applyDateRangeFilter(createdAt: Date, fromDate: string | undefined, toDate: string | undefined): boolean {
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    console.log('Applying Date Range Filter:', 'Created At:', createdAt, 'From:', from, 'To:', to);

    if (from && to) {
      return createdAt >= from && createdAt <= to;
    } else if (from) {
      return createdAt >= from;
    } else if (to) {
      return createdAt <= to;
    }

    return true;
  }



  ngAfterViewInit() {
    // Set paginator and sort for referral table
    this.candidatesDataSource.paginator = this.referralPaginator;
    this.candidatesDataSource.sort = this.referralSort;


      // Listen for changes in the page size
      this.referralPaginator.page.subscribe((event: PageEvent) => {
        if (event.pageSize !== this.pageSize) {
          this.pageSize = event.pageSize;
          this.getAllReferral(); // Call getAllReferral with updated pageSize
        }
      });
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

  resetDatePickers() {
    this.filterModel.fromDate = null;
    this.filterModel.toDate = null;
    this.applyFilters(); // Optionally reapply filters after reset
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

  async viewRow(data: any) {
    let id = data.id;
    try {
      let response = await this.adminService.getReferralById(id)
      //  let response= await this.adminService.getEmployeeReferralByEmailId('')
      if (response) {
        this.rowData = response
       this. companyDetails=await this.adminService.getCompanyById(data.companyId);
       if(this.companyDetails){
        const inputString = data.PK;
        const email = inputString.split('#').pop();
        this.userDetails=await this.adminService.getUserByEmailId(email);
       }
         this.openModal(ModalType.ADMINDETAIL_POPUP, "", "", this.rowData,this.companyDetails,this.userDetails);
      }
    } catch (error: any) {
      this.spinner.hide()
      this.successmessage = "Something went wrong. Please try again after sometime"
      this.successtitle = "Error"
      this.openModal(ModalType.SUCCESS_MESSAGE)
    }
  }

  /**
* Open modal.
*
* @param {ModalType} modalType
* @param {string} [message = ""]
* @param {string} [title = ""]
* @returns {void}
*/
  openModal(modalType: ModalType, message: string = "", title: string = "", rowData: any = null,companyDetails:any=null,userDetails:any=NgPluralCase): void {
    this.showModal = modalType;
    this.modalMessage = message;
    this.modalTitle = title;
    this.rowData = rowData;
    this.companyDetails=companyDetails;
    this.userDetails=userDetails
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
