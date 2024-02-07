import { ChangeDetectorRef, Component, ElementRef, ViewChild,AfterViewInit  } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table';
import { ViewEncapsulation } from '@angular/core';

export interface UserData {
  Name: string;
  CandidateID: number;
  EmployeeID: number;
  Date: Date;
  packagestatus: string;
  Paymentstatus: string;
}

/** Constants used to fill up our data base. */
// const FRUITS: string[] = [
//   'blueberry',
//   'lychee',
//   'kiwi',
//   'mango',
//   'peach',
//   'lime',
//   'pomegranate',
//   'pineapple',
// ];
// const NAMES: string[] = [
//   'Maia',
//   'Asher',
//   'Olivia',
//   'Atticus',
//   'Amelia',
//   'Jack',
//   'Charlotte',
//   'Theodore',
//   'Isla',
//   'Oliver',
//   'Isabella',
//   'Jasper',
//   'Cora',
//   'Levi',
//   'Violet',
//   'Arthur',
//   'Mia',
//   'Thomas',
//   'Elizabeth',
// ];


@Component({
  selector: 'app-admin-candidate',
  templateUrl: './admin-candidate.component.html',
  styleUrls: ['./admin-candidate.component.scss'],
  encapsulation: ViewEncapsulation.None  // Disable view encapsulation

})
export class AdminCandidateComponent {
  displayedColumns: string[] = [ 'candidateId',  'employeeId', 'name', 'date', 'packageStatus', 'paymentStatus'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private elementRef: ElementRef) {
    this.dataSource = new MatTableDataSource<UserData>(this.nameslist);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

   
  }

  applyFilter(event: Event, field: string) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data: UserData, filter: string) => {
      return data.Name.toLowerCase().includes(filter) ||
             data.CandidateID.toString().toLowerCase().includes(filter) ||
             data.EmployeeID.toString().toLowerCase().includes(filter) ||
             data.Date.toString().toLowerCase().includes(filter) ||
             data.packagestatus.toLowerCase().includes(filter) ||
             data.Paymentstatus.toLowerCase().includes(filter);
    };
    this.dataSource.filter = filterValue.trim().toLowerCase();
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  nameslist: UserData[] = [
    { Name: 'aniket', CandidateID: 1, EmployeeID: 1, Date: new Date(), packagestatus: 'valid', Paymentstatus: 'payed' },
    { Name: 'vishal', CandidateID: 2, EmployeeID: 2, Date: new Date(), packagestatus: 'valid', Paymentstatus: 'payed' },
    { Name: 'rohit', CandidateID: 3, EmployeeID: 3, Date: new Date(), packagestatus: 'valid', Paymentstatus: 'payed' },
    { Name: 'shubham', CandidateID: 4, EmployeeID: 4, Date: new Date(), packagestatus: 'valid', Paymentstatus: 'payed' },
    { Name: 'aniket', CandidateID: 1, EmployeeID: 1, Date: new Date(), packagestatus: 'valid', Paymentstatus: 'payed' },
    { Name: 'vishal', CandidateID: 2, EmployeeID: 2, Date: new Date(), packagestatus: 'valid', Paymentstatus: 'payed' },
    { Name: 'rohit', CandidateID: 3, EmployeeID: 3, Date: new Date(), packagestatus: 'Invalid', Paymentstatus: 'payed' },
    { Name: 'shubham', CandidateID: 4, EmployeeID: 4, Date: new Date(), packagestatus: 'valid', Paymentstatus: 'unpayed' },
    { Name: 'aniket', CandidateID: 1, EmployeeID: 1, Date: new Date(), packagestatus: 'valid', Paymentstatus: 'payed' },
    { Name: 'vishal', CandidateID: 2, EmployeeID: 2, Date: new Date(), packagestatus: 'valid', Paymentstatus: 'payed' },
    { Name: 'rohit', CandidateID: 12, EmployeeID: 3, Date: new Date(), packagestatus: 'valid', Paymentstatus: 'payed' },
    { Name: 'shubham', CandidateID: 4, EmployeeID: 4, Date: new Date(), packagestatus: 'valid', Paymentstatus: 'payed' },
    { Name: 'aniket', CandidateID: 10, EmployeeID: 1, Date: new Date(), packagestatus: 'valid', Paymentstatus: 'payed' },
    { Name: 'vishal', CandidateID: 2, EmployeeID: 2, Date: new Date(), packagestatus: 'valid', Paymentstatus: 'payed' },
    { Name: 'rohit', CandidateID: 3, EmployeeID: 3, Date: new Date(), packagestatus: 'valid', Paymentstatus: 'payed' },
    { Name: 'shubham', CandidateID: 4, EmployeeID: 4, Date: new Date(), packagestatus: 'valid', Paymentstatus: 'payed' },
  ];
}
