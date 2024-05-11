import { Component, OnInit, ViewChild, HostListener, Renderer2, ElementRef } from '@angular/core';
import { CompanyListingService } from '../../services/company-listing.service';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { ReferralRequestComponent } from '../referral-request/referral-request.component';
import { RequestGuidenceComponent } from '../request-guidence/request-guidence.component';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner'; 
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { event } from 'jquery';
@Component({
  selector: 'app-company-listing',
  templateUrl: './company-listing.component.html',
  styleUrls: ['./company-listing.component.scss']
})
export class CompanyListingComponent implements OnInit {

  @ViewChild(ModalComponent) modal!: ModalComponent;
  @ViewChild(ReferralRequestComponent) referrralComponent!: ReferralRequestComponent;
  @ViewChild(RequestGuidenceComponent) referrralguidanceComponent!: RequestGuidenceComponent;
  @ViewChild('autoCompleteInput', { static: false, read: MatAutocompleteTrigger }) trigger!: MatAutocompleteTrigger;
  successmessage:string="";
  successtitle:string="";
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
  pageSize = 50;
  lastKey: string | undefined = undefined;
  loadedOnce: boolean = true;
  reqGuidanceData: any
  companyList: any[] = [];
  userLoggedIn: boolean = false;
  triggerReferral: boolean = false;
  triggerGuidance: boolean = false;
  showReferrelRow: boolean = false;
  appliedFilter: boolean = false;
  companyName: string = "";
  companySK: string = "";
  myControl = new FormControl<any>('');
  filteredOptions!: Observable<any[]>;
  filterData: any = {
    teamSize: "",
    industryType: "",
    companyName: ""
  }
  companyData:any=[];
  form:any;
  assetLogos: string[]=[];
  teamSizeOptions: any = [
    {
      name: "<100",
      value: "0-100"
    },
    {
      name: "100-500",
      value: "100-500"
    },
    {
      name: "500-1000",
      value: "500-1000"
    },
    {
      name: "1000-5000",
      value: "1000-5000"
    },
    {
      name: "5000-10000",
      value: "5000-10000"
    },
    {
      name: "10000-50000",
      value: "10000-50000"
    },
    {
      name: "50000-100000",
      value: "50000-100000"
    },
    {
      name: "100000+",
      value: "100000"
    },
  ]


  industryTypeOptions:any=[
    
        {name: "E-commerce", value: "E-commerce"},
        {name: "Education", value: "e-Learning / EdTech"},
        {name: "Training", value: "e-Learning / EdTech"},
        {name: "IT Services & Consulting", value: "IT Services & Consulting"},
        {name: "Financial Services", value: "Financial Services"},
        {name: "Electronic Components", value: "Electronic Components / Semiconductors"},
        {name: "Semiconductors", value: "Electronic Components / Semiconductors"},
        {name: "Electronics Manufacturing", value: "Electronics Manufacturing"},
        {name: "Internet", value: "Internet"},
        {name: "Automobile", value: "Automobile"},
        {name: "Chemicals", value: "Chemicals"},
        {name: "Banking", value: "Banking"},
        {name: "Consumer Electronics & Appliances", value: "Consumer Electronics & Appliances"},
        {name: "Telecom", value: "Telecom / ISP"},
        {name: "ISP", value: "Telecom / ISP"},
        {name: "Food Processing", value: "Food Processing"},
        {name: "E-Learning", value: "E-Learning / EdTech"},
        {name: "EdTech", value: "E-Learning / EdTech"},
        {name: "Engineering & Construction", value: "Engineering & Construction"},
        {name: "Beverage", value: "Beverage"},
        {name: "FMCG", value: "FMCG"},
        {name: "FinTech", value: "FinTech / Payments"},
        {name: "Payments", value: "FinTech / Payments"},
        {name: "Travel & Tourism", value: "Travel & Tourism"},
        {name: "Courier", value: "Courier / Logistics"},
        {name: "Logistics", value: "Courier / Logistics"},
        {name: "Building Material", value: "Building Material"},
        {name: "Architecture", value: "Architecture / Interior Design"},
        {name: "Interior Design", value: "Architecture / Interior Design"},
        {name: "Auto Components", value: "Auto Components"},
        {name: "Analytics", value: "Analytics / KPO / Research"},
        {name: "KPO", value: "Analytics / KPO / Research"},
        {name: "Research", value: "Analytics / KPO / Research"},
        {name: "Professional Services", value: "Professional Services / Project Management"},
        {name: "Project Management", value: "Professional Services / Project Management"},
        {name: "Advertising & Marketing", value: "Advertising & Marketing"},
        {name: "Accounting", value: "Accounting / Auditing"},
        {name: "Auditing", value: "Accounting / Auditing"},
        {name: "Software Product", value: "Software Product"},
        {name: "Industrial Equipment", value: "Industrial Equipment / Machinery"},
        {name: "Machinery", value: "Industrial Equipment / Machinery"},
        {name: "NBFC", value: "NBFC"},
        {name: "Retail", value: "Retail"},
        {name: "Medical Services", value: "Medical Services / Hospital"},
        {name: "Hospital", value: "Medical Services / Hospital"},
        {name: "SAAS", value: "SAAS"},
        {name: "Manufacturing", value: "Manufacturing"},
        {name: "Gaming", value: "Gaming"},
        {name: "Beauty & Personal Care", value: "Beauty & Personal Care"},
        {name: "Management Consulting", value: "Management Consulting"},
        {name: "Medical Devices & Equipment", value: "Medical Devices & Equipment"},
        {name: "BPO", value: "BPO / Call Centre"},
        {name: "Call Centre", value: "BPO / Call Centre"},
        {name: "Fitness & Wellness", value: "Fitness & Wellness"},
        {name: "Agriculture", value: "Agriculture / Forestry / Fishing"},
        {name: "Forestry", value: "Agriculture / Forestry / Fishing"},
        {name: "Fishing", value: "Agriculture / Forestry / Fishing"},
        {name: "Metals & Mining", value: "Metals & Mining"},
        {name: "Electrical Equipment", value: "Electrical Equipment"},
        {name: "Textile & Apparel", value: "Textile & Apparel"},
        {name: "Urban Transport", value: "Urban Transport"},
        {name: "Furniture & Furnishing", value: "Furniture & Furnishing"},
        {name: "Printing & Publishing", value: "Printing & Publishing"},
        {name: "Hotels & Restaurants", value: "Hotels & Restaurants"},
        {name: "Film", value: "Film / Music / Entertainment"},
        {name: "Music", value: "Film / Music / Entertainment"},
        {name: "Entertainment", value: "Film / Music / Entertainment"},
        {name: "Biotechnology", value: "Biotechnology"},
        {name: "Real Estate", value: "Real Estate"},
        {name: "Transport", value: "Transport / Logistics"},
        {name: "Logistics", value: "Transport / Logistics"},
        {name: "Insurance", value: "Insurance"},
        {name: "Sports", value: "Sports / Leisure & Recreation"},
        {name: "Leisure & Recreation", value: "Sports / Leisure & Recreation"},
        {name: "Recruitment", value: "Recruitment / Staffing"},
        {name: "Staffing", value: "Recruitment / Staffing"},
        {name: "Stock Broking", value: "Stock Broking"},
        {name: "Power", value: "Power"},
        {name: "NGO ", value: "NGO / Social Services / Industry Associations"},
        {name: "Social Services", value: "NGO / Social Services / Industry Associations"},
        {name: "Industry Associations", value: "NGO / Social Services / Industry Associations"},
        {name: "Events", value: "Events / Live Entertainment"},
        {name: "Live Entertainment", value: "Events / Live Entertainment"},
        {name: "Investment Banking", value: "Investment Banking / Venture Capital / Private Equity"},
        {name: "Venture Capital", value: "Investment Banking / Venture Capital / Private Equity"},
        {name: "Private Equity", value: "Investment Banking / Venture Capital / Private Equity"},
        {name: "Warehousing", value: "Warehousing"},
        {name: "D2C", value: "D2C"},
        {name: "Software Product", value: "Software Product"},
        {name:"Electronics Manufacturing", value: "Electronics Manufacturing"},
        {name: "Consumer Electronics & Appliances", value: "Consumer Electronics & Appliances"},
        {name: "Insurance", value: "Insurance"},
        {name: "Internet", value:" Internet"},
        {name: "Manufacturing", value: "Manufacturing"}
        
        
      ]
   

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    // Handle scroll event
    this.detectScroll();
  }
  searchTerm: string = '';
  filteredCompanyList: any[] = [];
  searchQuery: string = '';
  private searchTerms = new Subject<string>();

  constructor(private spinner: NgxSpinnerService,private authService: AuthService,private http: HttpClient, private renderer: Renderer2, private el: ElementRef,private companyListing: CompanyListingService, private cognitoService: CognitoService) {
    this.searchTerms
      .pipe(
        debounceTime(300), // Adjust the debounce time as needed (300 milliseconds in this example)
        distinctUntilChanged()
      )
      .subscribe((query: string) => {
        // Call your API here with the query string
        this.callApiWithSearchQuery(query);
      });
  }
  async ngOnInit(): Promise<void> {
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
    await this.getCompanyDetails();
    this.filteredCompanyList = this.companyList;
    // this.assetLogos = this.generateLogoFilenames(57, 1045);
    // console.log(this.assetLogos)
    const excludedNumbers = [83,87,90,101,103,108,110,140,147,150,158,161,177,179,217,218,224,231,243,256,289,291,298,301,308,317,323,328,334,337,354,359,362,382,403,405,431,442,452,457,477,489,503,513,520,521,525,528,531,536,540,563,566,567,579,583,585,631,634,636,638,659,660,677,689,697,704,716,720,738,757,770,796,798,809,823,828,837,843,850,852,932,935,947,949,954,971,983,984,986,992,1024,1040];

 this.assetLogos = await this.generateLogoFilenames(57, 1045, excludedNumbers);

//console.log(this.assetLogos)


this.filteredOptions = this.myControl.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap((value: any) => {
    if (value && value.length >= 1) {
      return this.authService.getCompanyName(value);
    } else {
      // If value.length is less than 1, return an empty array or null
      return [];
    }
  })

);
//this.getData()
//debugger
await this.companyListing.getReferralData().subscribe((item: any) => {
  // Open modal for the corresponding company
  debugger
  console.log(item)
  this.selectedData = item;
  console.log(this.selectedData)
  if(item){
  this.openModalForCompany(item);
  }
});
await this.companyListing.getGuidanceData().subscribe((item: any) => {
  // Open modal for the corresponding company
  debugger
  console.log(item)
  this.selectedData = item;
  console.log(this.selectedData)
  if(item){
    this.openModal(ModalType.REQUEST_GUIDANCE)
  }
});




  }

  // async ngOnChanges() {
  //   await this.companyListing.referralRequested$.subscribe(item => {
  //     // Open modal for the corresponding company
  //     debugger
  //     console.log(item)
  //     this.openModalForCompany(item);
  //   });
  // }


  async openModalForCompany(item:any){
   // debugger
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
   
    this.selectedData = item;
    console.log( this.selectedData)
    this.triggerReferral = true;
     this.triggerGuidance = false;
    if (this.userLoggedIn) {
      debugger
      this.openModal(ModalType.REQUEST_REFERRAL);
    } else {
      this.openModal(ModalType.LOGIN_SIGNUP);
    }
  }


 
  // openReferralPage(item: any) {
  //   // Your function logic here
  //   console.log('Referral requested for:', item);
  // }
// getData(){
//   debugger
//  const response= this.companyListing.getrequestReferralData()
//  console.log(response)
//  this.openReferralPage(event,item)
// }

  onOptionSelected(event: any): void {
    this.selectedCompany = event.option.value;
  }

  displayFn(option: any): string {
    if (typeof option === 'string') {

      //   this.companyName = option;
      // this.companySK ="";
      return option;
    } else if (typeof option === 'object' && option.name) {

      this.companyName = option.name;
      this.companySK = option.SK;
      return option.name;
    } else {

      return '';
    }
  }

generateLogoFilenames(start: number, end: number, excludedNumbers:any[]) {
  const logos = [];
  for (let i = start; i <= end; i++) {
      if (!excludedNumbers.includes(i)) {
          logos.push(`${i}.jpg`);
      }
  }
  logos.push('1.jpg','10.jpg','15.jpg','25.jpg','30.jpg','47.jpg')
  return logos;
}

 
  onSearchInputChange(): void {
    if (this.searchQuery.length >3) {
    this.lastKey = "";
    this.loadedOnce = true;
    this.searchTerms.next(this.searchQuery);
    }
  }

  callApiWithSearchQuery(query: string): void {
    this.filterData.companyName = query;
    this.getCompanyDetails();
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

  clearSearchInput(): void {
    this.lastKey = "";
    this.loadedOnce = true;
    this.searchQuery = '';
    this.filterData.companyName = "";
    this.getCompanyDetails();
  }
  async getCompanyDetails() {
    if (this.lastKey || this.loadedOnce) {
      this.spinner.show();
      await this.companyListing.getCompanyListing(this.pageSize, this.lastKey, this.filterData.teamSize, this.filterData.industryType, this.filterData.companyName).then(async (response) => {
        if (response) {
          console.log("Helo11");
          this.spinner.hide();
          if (this.loadedOnce) {
            this.companyList = [];
          }
          this.companyList = this.companyList.concat(response.data);
          this.lastKey = response.pagination.lastKey;
          this.loadedOnce = false;

          //  this.filterCompanies(); // Filter companies after updating companyList
        }
      })
        .catch(error => {
          console.error('Display Company Listing Error:', error);
          this.spinner.hide();
        });
    }
  }

  async onTeamSizeChange(selectedTeamSize: string) {
    this.lastKey = "";
    this.loadedOnce = true;
    this.filterData.teamSize = selectedTeamSize;
    // if(selectedTeamSize){
    //    // Assuming selectedTeamSize is a string representation of the selected team size value
    //    const [min, max] = selectedTeamSize.split('-').map(Number); // Assuming team size format is 'min-max'
    //    // Update the filterData object with the new teamSize values
    //    this.filterData.teamSize = { min, max };   
    // }else{
    //   this.filterData.teamSize = "";
    // }

    // Call getCompanyDetails to fetch filtered companies
    await this.getCompanyDetails();
  }

  async onIndustryNameChange(selectedIndustryName: string) {
    this.lastKey = "";

    this.loadedOnce = true;
    // this.appliedFilter = true;
    this.filterData.industryName = selectedIndustryName;
    // Call getCompanyDetails to fetch filtered companies
    await this.getCompanyDetails();
  }
  async onIndustryTypeChange(selectedIndustryType: string) {
    this.lastKey = "";

    this.loadedOnce = true;
    // this.appliedFilter = true;
    this.filterData.industryType= selectedIndustryType;
    console.log(this.filterData.industryType)
    // Call getCompanyDetails to fetch filtered companies
    await this.getCompanyDetails();
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
    debugger
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
   
    this.selectedData = item;
    console.log( this.selectedData)
    this.triggerReferral = true;
    this.triggerGuidance = false;
    if (this.userLoggedIn) {
      this.openModal(ModalType.REQUEST_REFERRAL);
    } else {
      this.openModal(ModalType.LOGIN_SIGNUP);
    }


  }
  async openGuidancePage(event: Event, item: any): Promise<void> {
    event.preventDefault();
    // this.userLoggedIn = await this.cognitoService.isLoggedIn();
    // this.reqGuidanceData = item;
    // this.triggerReferral = false;
    // this.triggerGuidance = true;
    // if (this.userLoggedIn) {
    //   // this.openModal(ModalType.REQUEST_GUIDANCE);
    
    // } else {
    //   this.openModal(ModalType.LOGIN_SIGNUP);
    // }

    //this.successmessage="Our guidance service is launching soon, connecting you with first-hand, experienced experts for invaluable insights. Stay tuned for updates.Need urgent assistance, like interview preparation from insiders?\n Email us at Guidance@worko.ai for support";
    // this.successtitle="Congratulations!";
     this.openModal(ModalType.REQUEST_GUIDANCE)

  }
  cancel(){
   
    this.modal.cancel()
  }


  openCompanyForm($event: MouseEvent) {
    
    this.openModal(ModalType.ADD_COMPANY)
  }

  async receiveDataFromChild(data: any) {
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
    // this.closeModal();
    if (this.triggerReferral && this.userLoggedIn) {
      this.openModal(ModalType.REQUEST_REFERRAL);
    }
    if (this.triggerGuidance && this.userLoggedIn) {
      this.openModal(ModalType.REQUEST_GUIDANCE);
    }
  }

  companyForm={


    CompanyName: "",
      industry: 'Industry',
     
      carrierPage:"",
      linkedIn: "",
      personalemailid:"",
      contactNumber:""
  
  
  }
  
  
  async requestCampanyData(form:any){
    try{
    this.companyData={
      userType: "EMP",
      companyDetail: {
        name: this.companyForm.CompanyName,
        industry: 'Industry',
      
        carrierPage: this.companyForm.carrierPage,
        linkedIn: this.companyForm.linkedIn,
        //personalemailid:this.companyForm.personalemailid,
        //contactnumber:this.companyForm.contactNumber
      }
    }
    console.log(this.companyData)
    await this.companyListing.requestNewCompany(this.companyData)
    this.spinner.hide()
    this.openModal(this.modalType.SUCCESS_MESSAGE)
  }catch(error){
    this.spinner.hide()
    this.successmessage="Something went wrong. Please try again after sometime"
    this.successtitle="Error"
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
  openModal(modalType: ModalType, message: string = "", title: string = ""): void {
    if (this.referrralComponent) {
      this.referrralComponent.showReferrelRow = true;
      this.referrralComponent.requestForm.reset();
      this.referrralComponent.showScore = false;
    }
    if (ModalType.REQUEST_GUIDANCE) {
      if (this.referrralguidanceComponent) {
        this.referrralguidanceComponent.isButtonScreen = true;
        this.referrralguidanceComponent.requestSentScreen = false;
        this.referrralguidanceComponent.scheduleScreen = false;
        this.referrralguidanceComponent.pendingScreen = false;
        this.referrralguidanceComponent.rejectedScreen = false;
        this.referrralguidanceComponent.isFormVisible = false;
        // this.referrralguidanceComponent.selectedService='';
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

        this.referrralguidanceComponent.interviewGuidanceForm = {
          mentorLevel: 0,
          slot1: '',
          details: '',
          masterServiceId: '',
          companySK: '',
          role: '',
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
