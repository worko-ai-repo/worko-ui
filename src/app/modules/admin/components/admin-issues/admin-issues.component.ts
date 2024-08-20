import { Component } from '@angular/core';
import { ChangeDetectorRef, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table';
import { ViewEncapsulation } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
export interface UserData {

  name: string;
  contextId: number;
  contextType: string;
  createdAt: Date;
  userMessage: string;
  userRole: string;
  userSupportType: string;
  userEmail: string;
  status:string;

};

@Component({
  selector: 'app-admin-issues',
  templateUrl: './admin-issues.component.html',
  styleUrls: ['./admin-issues.component.scss']
})
export class AdminIssuesComponent {

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

  displayedColumns: string[] = ['serialnumber','name', 'ID', 'contextType', 'date', 'userRole', 'userEmail','status','action'];
  candidatesDataSource: MatTableDataSource<UserData>;
  // servicesDataSource: MatTableDataSource<UserData>;
  isFilterPopupOpen: boolean = true;
  isDropdownOpen: boolean = false;
  issueList: any[] = [];
  copiedContextId: string | null = null; // Stores the last copied context ID
  iconTimeout: any;

  filterModel: any = {
    userFirstName: '',
    contextId: '',
    contextType: '',
    createdAt: '',
    userMessage: '',
    userRole: '',
    userSupportType: '',
    userEmail: '',
    fromDate: '',
    toDate: ''

  };
  filterData: any = {

    issuesStatus: "",

  }
  pageSize: number=25;
  lastKey: string | undefined = undefined;
  rowData: any;
  issuesData: any;
  successmessage: string='';
  successtitle: string='';
  constructor(private elementRef: ElementRef, private adminService: AdminService,private spinner: NgxSpinnerService) {
    this.candidatesDataSource = new MatTableDataSource<UserData>(this.issueList);
    // this.servicesDataSource = new MatTableDataSource<UserData>(this.nameslist);
  }
  async ngOnInit(): Promise<void> {
    this.getAllIssues();
  }

  // ondateRangeChange($event: Event) {
  //   throw new Error('Method not implemented.');
  // }

  // async onissuesStatusChange(selectedIssueStatus: string) {
  //   this.filterData.issuesStatus = selectedIssueStatus;
  //   await this.getAllIssues();
  // }



  async getAllIssues() {
    this.spinner.show()
    await this.adminService.getAllIssues(this.pageSize, this.lastKey).then(async (response: any) => {
      if (response) {
        this.spinner.hide()
        this.issueList = response.data;
        //console.log("Issue list:", this.issueList);
        this.updateData(this.issueList);
        this.lastKey = response.pagination.lastKey;
        this.pageSize = response.pagination.pageSize;
        //this.candidatesDataSource = new MatTableDataSource<UserData>(this.issueList);
        // console.log("Issue  status 0:";
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
    const selectedFilters: { [key: string]: string | undefined }={
      name: this.filterModel.userFirstName,
      contextId: this.filterModel.contextId,
      contextType: this.filterModel.contextType,
      createdAt: this.filterModel.createdAt,
      userMessage: this.filterModel.userMessage,
      userRole: this.filterModel.userRole,
      userSupportType: this.filterModel.userSupportType,
      userEmail: this.filterModel.userEmail,
      fromDate: this.filterModel.fromDate,
      toDate: this.filterModel.toDate,
    };

    // Apply filters to both data sources
    this.applyDataSourceFilters(this.candidatesDataSource, selectedFilters);
    // this.applyDataSourceFilters(this.servicesDataSource, selectedFilters);

    // Reset pagination to navigate to first page
    if (this.candidatesDataSource.paginator) {
      this.candidatesDataSource.paginator.firstPage();
    }
    // if (this.servicesDataSource.paginator) {
    //   this.servicesDataSource.paginator.firstPage();
    // }
  }

  applyDataSourceFilters(dataSource: MatTableDataSource<UserData>, filters: { [key: string]: string | undefined }) {
    dataSource.filterPredicate = (data: UserData, filter: string) => {
      let filterObject: { [key: string]: string | undefined }; // Explicitly type filterObject
      try {
        filterObject = JSON.parse(filter);
       // console.log('Parsed Filter Object:', filterObject);
      } catch (e) {
        // console.error('Error parsing filter object:', e);
        return false; // If parsing fails, return false to exclude the item
      }
  
      // Handle date range filtering
      const dateInRange = this.applyDateRangeFilter(new Date(data.createdAt), filterObject['fromDate'], filterObject['toDate']);
  
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
  
      //return dateInRange && otherFilters;
   
     // Combine the filters: date range, other fields, and the search input
     const searchInput = filterObject['searchInput'] || '';

     // Ensure data.name is defined before applying the search filter
     const searchFilterPass = data.name ? data.name.toLowerCase().includes(searchInput.toLowerCase()) : true;
 
     const combinedFilters = dateInRange && otherFilters && searchFilterPass;
     return combinedFilters;
    };
   
    dataSource.filter = JSON.stringify(filters);
  }
  
  applyDateRangeFilter(createdAt: Date, fromDate: string | undefined, toDate: string | undefined): boolean {
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
  
    // console.log('Applying Date Range Filter:', 'Created At:', createdAt, 'From:', from, 'To:', to);
  
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
    this.filterModel.fromDate =null;
    this.filterModel.toDate = null;
    // this.candidatesDataSource.filter = ''; 
    this.applyFilters(); // Optionally reapply filters after reset
  }
  
  ngAfterViewInit() {

    // Set paginator and sort for referral table
    this.candidatesDataSource.paginator = this.referralPaginator;
    this.candidatesDataSource.sort = this.referralSort;

    // Set paginator and sort for service table
    // this.servicesDataSource.paginator = this.servicePaginator;
    // this.servicesDataSource.sort = this.serviceSort;
      // Listen for changes in the page size
      this.referralPaginator.page.subscribe((event: PageEvent) => {
        if (event.pageSize !== this.pageSize) {
          this.pageSize = event.pageSize;
          this.getAllIssues(); // Call getAllReferral with updated pageSize
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
  clearSearchInput(input:any,dataSource: MatTableDataSource<UserData>){
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


  async viewRow(issuesDatas: any) {
    this.spinner.show()
    await this.adminService.getIssuesById(issuesDatas.id) .then(async (response: any) => {
      this.spinner.hide()
      // if(response && response.length > 0){
        this.issuesData=response
        // console.log(this.issuesData)
        this.openModal(ModalType.ADMINDETAIL_POPUP,"","",this.issuesData);
     
      }).catch((error: any) => {
        this.spinner.hide()
        this.successmessage = "Something went wrong. Please try again after sometime"
          this.successtitle = "Error"
          this.openModal(ModalType.SUCCESS_MESSAGE)
      });
    
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

  ngOnDestroy() {
    if (this.iconTimeout) {
      clearTimeout(this.iconTimeout);
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
  openModal(modalType: ModalType, message: string = "", title: string = "",issuesData: any = null): void {
    this.showModal = modalType;
    this.modalMessage = message;
    this.modalTitle = title;
    this.issuesData = issuesData;
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
