import { Component } from '@angular/core';
import { ChangeDetectorRef, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table';
import { ViewEncapsulation } from '@angular/core';
import { AdminService } from '../../services/admin.service';
export interface UserData {
  name: string;
  userEmail: string;
  orderId: string;
  packageName:string
  purchaseDate: Date;
  expiryDate: Date;
  Paymentstatus: string;
  creditedReferrals: string;
  requestedReferrals: string;
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

  displayedColumns: string[] = ['name', 'userEmail','orderId', 'packageName', 'purchaseDate', 'expiryDate', 'requestedReferrals', 'creditedReferrals', 'acceptedReferrals'];
  candidatesDataSource: MatTableDataSource<UserData>;
  servicesDataSource: MatTableDataSource<UserData>;
  isFilterPopupOpen: boolean = true;
  isDropdownOpen: boolean = false;
  nameslist:any[]=[];
  constructor(private elementRef: ElementRef, private adminService: AdminService) {
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
    await this.adminService.getAllSubscriptions().then(async (response: any) => {
      if (response) {
        this.nameslist = response;
        this.updateData(this.nameslist);
      }
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
        console.log('Parsed Filter Object:', filterObject);
      } catch (e) {
        console.error('Error parsing filter object:', e);
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
