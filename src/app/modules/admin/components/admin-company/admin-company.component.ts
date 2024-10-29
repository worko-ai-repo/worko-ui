import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import * as industryTypes from '../../../../../assets/industry-types.json';

export interface UserData {

  companyID:string;
  companyName:string;
  status:string;
  companyDate:string;  
 
}


@Component({
  selector: 'app-admin-company',
  templateUrl: './admin-company.component.html',
  styleUrls: ['./admin-company.component.scss']
})
export class AdminCompanyComponent {

  @ViewChild('dropdown') dropdown!: ElementRef;
  @ViewChild('referralPaginator') referralPaginator!: MatPaginator;
  @ViewChild('referralSort') referralSort!: MatSort;

  // ViewChild declarations for paginator and sort for service table
  @ViewChild('servicePaginator') servicePaginator!: MatPaginator;
  @ViewChild('serviceSort') serviceSort!: MatSort;

  displayedColumns: string[] = ['serialNumber','companyID', 'companyName','status', 'companyDate', 'action'];
  candidatesDataSource: MatTableDataSource<UserData>;
  servicesDataSource: MatTableDataSource<UserData>;
  isFilterPopupOpen: boolean = true;
  isDropdownOpen: boolean = false;
  nameslist: any[] = [];
  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  modalSize: string = 'lg';
  status: any;
  @ViewChild('company')companyFormDirective!: NgForm;

  constructor(private elementRef: ElementRef,private spinner:NgxSpinnerService, private router: Router,private http: HttpClient) {
    this.candidatesDataSource = new MatTableDataSource<UserData>(this.nameslist);
    this.servicesDataSource = new MatTableDataSource<UserData>(this.nameslist);

  }
  companyForm = {


    CompanyName: "",
    industry: '',

    carrierPage: "",
    linkedIn: "",
    emailid: "",
    website:"",
    teamSize:"",
    logoUrl:"",
    aboutCompany:"",

  }
  industryTypeOptions: any[] = (industryTypes as any).default;
  async ngOnInit() {
    this.http.get<any[]>('assets/industry-types.json').subscribe(data => {
      this.industryTypeOptions = data;
      console.log(this.industryTypeOptions)
    });
  }

  handleFilterChange(arg0: string,$event: any) {
  
    }
    

  addCompany(){

    this.openModal(ModalType.ADMINJOBS_POPUP);
  }
  requestCampanyData(form:any){

  }
  editCompanyDetails() {
   
    }

    resetForm(){
      this.companyFormDirective.resetForm()
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
      //this.cdr.detectChanges();
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
      this.companyFormDirective.resetForm();
      this.modal.cancel();
    }
  

 

  

}
