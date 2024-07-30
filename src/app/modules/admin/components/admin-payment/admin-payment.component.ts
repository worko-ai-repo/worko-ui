import { Component } from '@angular/core';
import { ChangeDetectorRef, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table';
import { ViewEncapsulation } from '@angular/core';
export interface UserData {
  Name: string;
  emailId: number;
  orderId: number;
  packageName:string
  purchaseDate: Date;
  expiryDate: Date;
  Paymentstatus: string;
  creditedReferrals: Date;
  requestedReferrals: Date;
  acceptedReferrals: string;

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

  displayedColumns: string[] = ['name', 'emailId', 'orderId', 'packageName', 'purchaseDate', 'expiryDate','requestedReferrals','creditedReferrals','acceptedReferrals'];
  candidatesDataSource: MatTableDataSource<UserData>;
  servicesDataSource: MatTableDataSource<UserData>;
  isFilterPopupOpen: boolean = true;
  isDropdownOpen: boolean = false;
  nameslist:any[]=[];
  constructor(private elementRef: ElementRef) {
    this.candidatesDataSource = new MatTableDataSource<UserData>(this.nameslist);
    this.servicesDataSource = new MatTableDataSource<UserData>(this.nameslist);
  }

  
  filterModel: any = {
    Name: '',
    emailId: '',
    orderId: '',
    packageName: '',
    purchaseDate: '',
    expiryDate: '',
    creditedReferrals: '',
    requestedReferrals: '',
    acceptedReferrals: '',
  };
  applyFilters() {
    // Gather selected filter options
    const selectedFilters = {
      name: this.filterModel.Name,
      candidateId: this.filterModel.CandidateID,
      employeeId: this.filterModel.EmployeeID,
      date: this.filterModel.Date,
      packageStatus: this.filterModel.packagestatus,
      paymentStatus: this.filterModel.Paymentstatus,
      serviceRequestDate: this.filterModel.ServiceRequestDate,
      serviceStartDate: this.filterModel.ServiceStartDate,
      requestStatus: this.filterModel.RequestStatus,
      packageBalance: this.filterModel.PackageBalance,
      rating: this.filterModel.Rating,
      accountType: this.filterModel.AccountType
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
  
  applyDataSourceFilters(dataSource: MatTableDataSource<UserData>, filters: any) {
    dataSource.filterPredicate = (data: UserData, filter: string) => {
      const searchString = Object.keys(filters)
        .map(key => filters[key])
        .join('');
      return searchString.trim().toLowerCase().split(' ').every(term =>
        Object.values(data).join('').toLowerCase().includes(term)
      );
    };
    dataSource.filter = 'activate';
  }
  

  
  ngAfterViewInit() {
    // Set paginator and sort for referral table
    this.candidatesDataSource.paginator = this.referralPaginator;
    this.candidatesDataSource.sort = this.referralSort;

    // Set paginator and sort for service table
    this.servicesDataSource.paginator = this.servicePaginator;
    this.servicesDataSource.sort = this.serviceSort;
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

  
  
}
