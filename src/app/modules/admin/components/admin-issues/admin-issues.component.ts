import { Component } from '@angular/core';
import { ChangeDetectorRef, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table';
import { ViewEncapsulation } from '@angular/core';
import { AdminService } from '../../services/admin.service';
export interface UserData {

  name: string;
  contextId: number;
  contextType: string;
  createdAt: Date;
  userMessage: string;
  userRole: string;
  userSupportType: string;
  userEmail: string;

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

  displayedColumns: string[] = ['name', 'ID', 'contextType', 'date', 'userMessage', 'userRole', 'userSupportType', 'userEmail'];
  candidatesDataSource: MatTableDataSource<UserData>;
  // servicesDataSource: MatTableDataSource<UserData>;
  isFilterPopupOpen: boolean = true;
  isDropdownOpen: boolean = false;
  issueList: any[] = [];


  filterModel: any = {
    userFirstName: '',
    contextId: '',
    contextType: '',
    createdAt: '',
    userMessage: '',
    userRole: '',

    userSupportType: '',
    userEmail: '',

  };
  filterData: any = {
  
    issuesStatus: "",
    
  }
  constructor(private elementRef: ElementRef, private adminService: AdminService) {
    this.candidatesDataSource = new MatTableDataSource<UserData>(this.issueList);
    // this.servicesDataSource = new MatTableDataSource<UserData>(this.nameslist);
  }
  async ngOnInit(): Promise<void> {
    this.getAllIssues();
  }

  ondateRangeChange($event: Event) {
    throw new Error('Method not implemented.');
  }

  async onissuesStatusChange(selectedIssueStatus: string) {
    this.filterData.issuesStatus = selectedIssueStatus;
    await this.getAllIssues();
  }



  async getAllIssues() {
    await this.adminService.getAllIssues(this.filterData.issuesStatus).then(async (response: any) => {
      if (response) {
        this.issueList = response;
        //console.log("Issue list:", this.issueList);
        this.updateData(this.issueList);
        //this.candidatesDataSource = new MatTableDataSource<UserData>(this.issueList);
        // console.log("Issue  status 0:";
      }
    })
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
      name: this.filterModel.userFirstName,
      contextId: this.filterModel.contextId,
      contextType: this.filterModel.contextType,
      createdAt: this.filterModel.createdAt,
      userMessage: this.filterModel.userMessage,
      userRole: this.filterModel.userRole,
      userSupportType: this.filterModel.userSupportType,
      userEmail: this.filterModel.userEmail
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

  applyDataSourceFilters(dataSource: MatTableDataSource<UserData>, filters: Partial<UserData>) {
    dataSource.filterPredicate = (data: UserData, filter: string) => {
      const filterObject: Partial<UserData> = JSON.parse(filter);
      return Object.keys(filterObject).every(key => {
        const filterKey = key as keyof UserData;
        if (!filterObject[filterKey]) {
          return true;
        }
        const dataValue = data[filterKey] ? data[filterKey].toString().toLowerCase() : '';
        const filterValue = filterObject[filterKey] ? filterObject[filterKey]!.toString().toLowerCase() : '';
        return dataValue.includes(filterValue);
      });
    };
    dataSource.filter = JSON.stringify(filters);
  }


  ngAfterViewInit() {

    // Set paginator and sort for referral table
    this.candidatesDataSource.paginator = this.referralPaginator;
    this.candidatesDataSource.sort = this.referralSort;

    // Set paginator and sort for service table
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
