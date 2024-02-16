import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { CompanyListingService } from '../../services/company-listing.service';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { ReferralRequestComponent } from '../referral-request/referral-request.component';
import { RequestGuidenceComponent } from '../request-guidence/request-guidence.component';
@Component({
  selector: 'app-company-listing',
  templateUrl: './company-listing.component.html',
  styleUrls: ['./company-listing.component.scss']
})
export class CompanyListingComponent implements OnInit {
  @ViewChild(ModalComponent) modal!: ModalComponent;
  @ViewChild(ReferralRequestComponent) referrralComponent! : ReferralRequestComponent;
  @ViewChild(RequestGuidenceComponent) referrralguidanceComponent! : RequestGuidenceComponent;

  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  selectedCompany: any;
  selectedItem: any = null;
  showdiv: boolean = false;
  hidediv: boolean = true;
  isDivOpen: boolean = false;
  selectedData: any;
  pageSize = 100;
  lastKey: string | undefined = undefined;
  loadedOnce: boolean = true;
  reqGuidanceData: any
  companyList: any[] = [];
  userLoggedIn: boolean = false;
  triggerReferral: boolean = false;
  triggerGuidance: boolean = false;
  showReferrelRow: boolean= false;
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    // Handle scroll event
    this.detectScroll();
  }
  searchTerm: string = '';
  filteredCompanyList: any[] = [];


  constructor(private companyListing: CompanyListingService, private cognitoService: CognitoService) {

  }
  async ngOnInit(): Promise<void> {
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
    this.getCompanyDetails();
    this.filteredCompanyList = this.companyList;
   


  }
  filterCompanies(): void {
    this.filteredCompanyList = this.companyList.filter(company =>
      company.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  detectScroll(): void {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );

    // Check if the user has scrolled to the bottom

    if (scrollPosition + windowHeight >= documentHeight) {
      // Load more data
      this.getCompanyDetails();
    }
  }

  async getCompanyDetails() {
    if (this.lastKey || this.loadedOnce) {
      await this.companyListing.getCompanyListing(this.pageSize, this.lastKey).then(async (response) => {
        if (response) {
          console.log("Helo11");
          this.companyList = this.companyList.concat(response.data);
          this.lastKey = response.pagination.lastKey;
          this.loadedOnce = false;
          this.filterCompanies(); // Filter companies after updating companyList
        }
      })
      .catch(error => {
        console.error('Display Company Listing Error:', error);
      });
    }
  }
  
  // onMouseOver(item: any, event: any) {
  //   this.showdiv = true;
  //   this.selectedItem = item;
  // }

  // onMouseOut(event: any) {
  //   this.showdiv = false;
  // }
  isSelected(item: any) {
    return this.selectedItem === item;
  }


  async openReferralPage(event: Event, item: any): Promise<void> {
    event.preventDefault();
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
    this.selectedData = item;
    this.triggerReferral = true;
    this.triggerGuidance = false;
    if (this.userLoggedIn) {
      this.openModal(ModalType.REQUEST_REFERRAL);
    } else {
      this.openModal(ModalType.LOGIN_SIGNUP);
    }


  }
  async openGuidancePage(event: Event,item: any): Promise<void> {
    event.preventDefault();
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
    this.reqGuidanceData = item;
    this.triggerReferral = false;
    this.triggerGuidance = true;
    if (this.userLoggedIn) {
      this.openModal(ModalType.REQUEST_GUIDANCE);
    } else {
      this.openModal(ModalType.LOGIN_SIGNUP);
    }
  
  }



  async receiveDataFromChild(data: any){
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
    // this.closeModal();
    if(this.triggerReferral && this.userLoggedIn){
      this.openModal(ModalType.REQUEST_REFERRAL);
    }
    if(this.triggerGuidance && this.userLoggedIn){
       this.openModal(ModalType.REQUEST_GUIDANCE);
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
  openModal(modalType: ModalType, message: string = "", title: string = ""): void {
    if (this.referrralComponent) {
      this.referrralComponent.showReferrelRow = true;
      this.referrralComponent.showScore = false;
    }
    if(ModalType.REQUEST_GUIDANCE){
if(this.referrralguidanceComponent){
  this.referrralguidanceComponent.isButtonScreen=true;
  this.referrralguidanceComponent.requestSentScreen=false;
  this.referrralguidanceComponent.selectedService='';
  this.referrralguidanceComponent.reqGuidanceForm = {
    mentorLevel: 0,
    slot1Date: '',
    slot1Time: '',
    slot2Date: '',
    slot2Time: '',
    slot3Date: '',
    slot3Time: '',
    details: '',
    masterServiceId: ''
};

this.referrralguidanceComponent.interviewGuidanceForm= {
  mentorLevel:0,
  slot1:'',
  details:'',
  masterServiceId: '',
  companySK:'',
  role:'',
};
}
    }
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
  // closeModal(): void {
  //   // Show referral request form after closing the modal
  
  //   this.modal.cancel();
  // }
}
