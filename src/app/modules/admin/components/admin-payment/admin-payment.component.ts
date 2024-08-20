import { Component } from '@angular/core';
import { ChangeDetectorRef, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table';
import { ViewEncapsulation } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { NgxSpinnerService } from 'ngx-spinner';
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
  @ViewChild('referralSort') referralSort!: MatSort;

  // ViewChild declarations for paginator and sort for service table
  @ViewChild('servicePaginator') servicePaginator!: MatPaginator;
  @ViewChild('serviceSort') serviceSort!: MatSort;
  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;

  displayedColumns: string[] = ['serialnumber', 'orderId', 'packageName', 'purchaseDate', 'expiryDate', 'creditedReferrals', 'requestedReferrals', 'acceptedReferrals', 'status', 'action'];
  candidatesDataSource: MatTableDataSource<UserData>;
  servicesDataSource: MatTableDataSource<UserData>;
  isFilterPopupOpen: boolean = true;
  isDropdownOpen: boolean = false;
  nameslist: any[] = [];
  rowData: any;
  successmessage: string = '';
  successtitle: string = '';
  copiedContextId: string | null = null; // Stores the last copied context ID
  pageSize: number = 25;
  lastKey: string | undefined = undefined;
  iconTimeout: any;
  constructor(private elementRef: ElementRef, private adminService: AdminService, private spinner: NgxSpinnerService) {
    this.candidatesDataSource = new MatTableDataSource<UserData>(this.nameslist);
    this.servicesDataSource = new MatTableDataSource<UserData>(this.nameslist);
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
    this.getAllSubscriptions();
  }
  async getAllSubscriptions() {
    this.spinner.show()
    await this.adminService.getAllSubscriptions(this.pageSize, this.lastKey).then(async (response: any) => {
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
      name: this.filterModel.name,
      userEmail: this.filterModel.userEmail,
      orderId: this.filterModel.orderId,
      packageName: this.filterModel.packageName,
      purchaseDate: this.filterModel.purchaseDate,
      expiryDate: this.filterModel.expiryDate,
      creditedReferrals: this.filterModel.creditedReferrals,
      requestedReferrals: this.filterModel.requestedReferrals,
      acceptedReferrals: this.filterModel.acceptedReferrals,
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

      } catch (e) {

        return false; // If parsing fails, return false to exclude the item
      }

      // Handle date range filtering
      const dateInRange = this.applyDateRangeFilter(new Date(data.purchaseDate), filterObject['fromDate'], filterObject['toDate']);

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

  }

  applyDateRangeFilter(createdAt: Date, fromDate: string | undefined, toDate: string | undefined): boolean {
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;



    if (from && to) {
      return createdAt >= from && createdAt <= to;
    } else if (from) {
      return createdAt >= from;
    } else if (to) {
      return createdAt <= to;
    }

    return true;
  }

  resetDatePickers() {
    this.filterModel.fromDate = null;
    this.filterModel.toDate = null;
    this.applyFilters(); // Optionally reapply filters after reset
  }

  ngAfterViewInit() {
    // Set paginator and sort for referral table
    this.candidatesDataSource.paginator = this.referralPaginator;
    this.candidatesDataSource.sort = this.referralSort;

    // Set paginator and sort for service table
    this.servicesDataSource.paginator = this.servicePaginator;
    this.servicesDataSource.sort = this.serviceSort;

    // Listen for changes in the page size
    this.referralPaginator.page.subscribe((event: PageEvent) => {
      if (event.pageSize !== this.pageSize) {
        this.pageSize = event.pageSize;
        this.getAllSubscriptions(); // Call getAllReferral with updated pageSize
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
      this.successmessage = "Something went wrong. Please try again after sometime"
      this.successtitle = "Error"
      this.openModal(ModalType.SUCCESS_MESSAGE)
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


  /**
  * Open modal.
  *
  * @param {ModalType} modalType
  * @param {string} [message = ""]
  * @param {string} [title = ""]
  * @returns {void}
  */
  openModal(modalType: ModalType, message: string = "", title: string = "", rowData: any = null): void {
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





}
