import { Component } from '@angular/core';
import { ChangeDetectorRef, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table';
import { ViewEncapsulation } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { Router } from '@angular/router';
export interface UserData {
  Name: string;
  CandidateID: number;
  EmployeeID: number;
  Date: Date;
  packagestatus: string;
  Paymentstatus: string;
  ServiceRequestDate: Date;
  ServiceStartDate: Date;
  RequestStatus: string;
  PackageBalance: number;
  Rating: number;
  AccountType: string;



  
 
}

@Component({
  selector: 'app-admin-service',
  templateUrl: './admin-service.component.html',
  styleUrls: ['./admin-service.component.scss']
})
export class AdminServiceComponent {

  @ViewChild('dropdown') dropdown!: ElementRef;
  @ViewChild('referralPaginator') referralPaginator!: MatPaginator;
  @ViewChild('referralSort') referralSort!: MatSort;

  // ViewChild declarations for paginator and sort for service table
  @ViewChild('servicePaginator') servicePaginator!: MatPaginator;
  @ViewChild('serviceSort') serviceSort!: MatSort;

  displayedColumns: string[] = ['candidateId', 'employeeId', 'name', 'date', 'packageStatus', 'paymentStatus','requestStatus','packageBalance','rating','accountType','serviceRequestDate','serviceStartDate'];
  candidatesDataSource: MatTableDataSource<UserData>;
  servicesDataSource: MatTableDataSource<UserData>;
  isFilterPopupOpen: boolean = true;
  isDropdownOpen: boolean = false;
  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  successmessage: string = "";
  successtitle: string = "";
  constructor(private elementRef: ElementRef,private spinner:NgxSpinnerService, private router: Router) {
    this.candidatesDataSource = new MatTableDataSource<UserData>(this.nameslist);
    this.servicesDataSource = new MatTableDataSource<UserData>(this.nameslist);

  }

  
  filterModel: any = {
    Name: '',
    CandidateID: '',
    EmployeeID: '',
    Date: '',
    packagestatus: '',
    Paymentstatus: '',
    ServiceRequestDate: '',
    ServiceStartDate: '',
    RequestStatus: '',
    PackageBalance: '',
    Rating: '',
    AccountType: ''
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


  ngOnInit(): void {
   
    this.spinner.show();
    this.successtitle = 'Alert!';
    this.successmessage = "This section is currently in progress. Please check back later!";
    setTimeout(()=> {
      this.spinner.hide();
      this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
    }, 2000);
    // this.getServices();
  }

  ngOnDestroy(): void {
    this.spinner.hide();
    this.closeModal();
  }
  okBtn(){
    this.spinner.hide();
    this.closeModal();
    this.router.navigate(['/admin/aCandidate']);
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

  
  nameslist: UserData[] = [
    {
      Name: 'aniket', CandidateID: 1, EmployeeID: 1, Date: new Date(), packagestatus: 'valid', Paymentstatus: 'payed',
       ServiceRequestDate: new Date(), ServiceStartDate: new Date(), RequestStatus: 'Pending', PackageBalance: 100, Rating: 4.5, AccountType: 'Savings',
    },
    { Name: 'vishal', CandidateID: 2, EmployeeID: 2, Date: new Date(), packagestatus: 'valid', Paymentstatus: 'payed',
    ServiceRequestDate: new Date(), ServiceStartDate: new Date(), RequestStatus: 'Pending', PackageBalance: 100, Rating: 4.5, AccountType: 'Savings',
    },
    { Name: 'rohit', CandidateID: 3, EmployeeID: 3, Date: new Date(), packagestatus: 'valid', Paymentstatus: 'payed',
    ServiceRequestDate: new Date(), ServiceStartDate: new Date(), RequestStatus: 'Pending', PackageBalance: 100, Rating: 4.5, AccountType: 'Savings',
    },
    { Name: 'shubham', CandidateID: 4, EmployeeID: 4, Date: new Date(), packagestatus: 'valid', Paymentstatus: 'payed',
    ServiceRequestDate: new Date(), ServiceStartDate: new Date(), RequestStatus: 'Pending', PackageBalance: 100, Rating: 4.5, AccountType: 'Savings',
    },
    { Name: 'aniket', CandidateID: 1, EmployeeID: 1, Date: new Date(), packagestatus: 'valid', Paymentstatus: 'payed',       ServiceRequestDate: new Date(), ServiceStartDate: new Date(), RequestStatus: 'Pending', PackageBalance: 100, Rating: 4.5, AccountType: 'Savings',
    },
    { Name: 'vishal', CandidateID: 2, EmployeeID: 2, Date: new Date(), packagestatus: 'valid', Paymentstatus: 'payed',        ServiceRequestDate: new Date(), ServiceStartDate: new Date(), RequestStatus: 'Pending', PackageBalance: 100, Rating: 4.5, AccountType: 'Savings',
    },
    { Name: 'rohit', CandidateID: 3, EmployeeID: 3, Date: new Date(), packagestatus: 'Invalid', Paymentstatus: 'payed',
    ServiceRequestDate: new Date(), ServiceStartDate: new Date(), RequestStatus: 'Pending', PackageBalance: 100, Rating: 4.5, AccountType: 'Savings',
    },
    { Name: 'shubham', CandidateID: 4, EmployeeID: 4, Date: new Date(), packagestatus: 'valid', Paymentstatus: 'unpayed',
    ServiceRequestDate: new Date(), ServiceStartDate: new Date(), RequestStatus: 'Pending', PackageBalance: 100, Rating: 4.5, AccountType: 'Savings',
    },
    { Name: 'aniket', CandidateID: 1, EmployeeID: 1, Date: new Date(), packagestatus: 'valid', Paymentstatus: 'payed',
    ServiceRequestDate: new Date(), ServiceStartDate: new Date(), RequestStatus: 'Pending', PackageBalance: 100, Rating: 4.5, AccountType: 'Savings',
    },
    { Name: 'vishal', CandidateID: 2, EmployeeID: 2, Date: new Date(), packagestatus: 'valid', Paymentstatus: 'payed',
    ServiceRequestDate: new Date(), ServiceStartDate: new Date(), RequestStatus: 'Pending', PackageBalance: 100, Rating: 4.5, AccountType: 'Savings',
    },
    { Name: 'rohit', CandidateID: 12, EmployeeID: 3, Date: new Date(), packagestatus: 'valid', Paymentstatus: 'payed',
    ServiceRequestDate: new Date(), ServiceStartDate: new Date(), RequestStatus: 'Pending', PackageBalance: 100, Rating: 4.5, AccountType: 'Savings',
    },
    { Name: 'shubham', CandidateID: 4, EmployeeID: 4, Date: new Date(), packagestatus: 'valid', Paymentstatus: 'payed',
    ServiceRequestDate: new Date(), ServiceStartDate: new Date(), RequestStatus: 'Pending', PackageBalance: 100, Rating: 4.5, AccountType: 'Savings',
    },
    { Name: 'aniket', CandidateID: 10, EmployeeID: 1, Date: new Date(), packagestatus: 'valid', Paymentstatus: 'payed',
    ServiceRequestDate: new Date(), ServiceStartDate: new Date(), RequestStatus: 'Pending', PackageBalance: 100, Rating: 4.5, AccountType: 'Savings',
    },
    { Name: 'vishal', CandidateID: 2, EmployeeID: 2, Date: new Date(), packagestatus: 'valid', Paymentstatus: 'payed',
    ServiceRequestDate: new Date(), ServiceStartDate: new Date(), RequestStatus: 'Pending', PackageBalance: 100, Rating: 4.5, AccountType: 'Savings',
    },
    { Name: 'rohit', CandidateID: 3, EmployeeID: 3, Date: new Date(), packagestatus: 'valid', Paymentstatus: 'payed',
    ServiceRequestDate: new Date(), ServiceStartDate: new Date(), RequestStatus: 'Pending', PackageBalance: 100, Rating: 4.5, AccountType: 'Savings',
    },
    { Name: 'shubham', CandidateID: 4, EmployeeID: 4, Date: new Date(), packagestatus: 'valid', Paymentstatus: 'payed',
    ServiceRequestDate: new Date(), ServiceStartDate: new Date(), RequestStatus: 'Pending', PackageBalance: 100, Rating: 4.5, AccountType: 'Savings',
    },
  ];
   /**
 * Open modal.
 *
 * @param {ModalType} modalType
 * @param {string} [message = ""]
 * @param {string} [title = ""]
 * @returns {void}
 */
   openModal(modalType: ModalType, message: string = "", title: string = ""): void {
    this.showModal = modalType;
    this.modalMessage = message;
    this.modalTitle = title;
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
