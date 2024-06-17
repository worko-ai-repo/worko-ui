import { Component, OnInit, ViewChild, HostListener, Renderer2, ElementRef, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CompanyListingService } from '../../services/company-listing.service';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { ReferralRequestComponent } from '../referral-request/referral-request.component';
import { RequestGuidenceComponent } from '../request-guidence/request-guidence.component';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { FormControl, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { error, event } from 'jquery';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { CandidateProfileService } from 'src/app/modules/candidate/services/candidate-profile.service';
import { LoginPageComponent } from '../login-page/login-page.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-company-listing',
  templateUrl: './company-listing.component.html',
  styleUrls: ['./company-listing.component.scss']
})
export class CompanyListingComponent implements OnInit, AfterViewInit, OnDestroy {

  private eventSubscription!: Subscription;
  @ViewChild(ModalComponent) modal!: ModalComponent;
  @ViewChild(ReferralRequestComponent) referrralComponent!: ReferralRequestComponent;
  @ViewChild(RequestGuidenceComponent) referrralguidanceComponent!: RequestGuidenceComponent;
  @ViewChild('autoCompleteInput', { static: false, read: MatAutocompleteTrigger }) trigger!: MatAutocompleteTrigger;
  @ViewChild('company') companyFormDirective!: NgForm;
  @ViewChild(LoginPageComponent) LoginPageComponent!: LoginPageComponent;
  @ViewChild(NavbarComponent) navbarComponent!: NavbarComponent;
  userName: string = "";
  letter: string = ""
  successmessage: string = "";
  successtitle: string = "";
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
  indexData: any = "";
  myControl = new FormControl<any>('');
  filteredOptions!: Observable<any[]>;
  filterData: any = {
    teamSize: "",
    industryType: "",
    companyName: ""
  }
  companyData: any = [];
  form!: NgForm;
  assetLogos: string[] = [];
  emailAddress: any;
  profileCompletion: any;
  cvCurPerc: any;
  totalPercentage: any;
  profileCompletionRequired: boolean = false;

  companyForm = {
    CompanyName: "",
    industry: 'Industry',
    carrierPage: "",
    linkedIn: "",
    personalemailid: "",
    contactNumber: ""
  }

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


  industryTypeOptions: any = [

    { name: "E-commerce", value: "E-commerce" },
    { name: "Education", value: "e-Learning / EdTech" },
    { name: "Training", value: "e-Learning / EdTech" },
    { name: "IT Services & Consulting", value: "IT Services & Consulting" },
    { name: "Financial Services", value: "Financial Services" },
    { name: "Electronic Components", value: "Electronic Components / Semiconductors" },
    { name: "Semiconductors", value: "Electronic Components / Semiconductors" },
    { name: "Electronics Manufacturing", value: "Electronics Manufacturing" },
    { name: "Internet", value: "Internet" },
    { name: "Automobile", value: "Automobile" },
    { name: "Chemicals", value: "Chemicals" },
    { name: "Banking", value: "Banking" },
    { name: "Consumer Electronics & Appliances", value: "Consumer Electronics & Appliances" },
    { name: "Telecom", value: "Telecom / ISP" },
    { name: "ISP", value: "Telecom / ISP" },
    { name: "Food Processing", value: "Food Processing" },
    { name: "E-Learning", value: "E-Learning / EdTech" },
    { name: "EdTech", value: "E-Learning / EdTech" },
    { name: "Engineering & Construction", value: "Engineering & Construction" },
    { name: "Beverage", value: "Beverage" },
    { name: "FMCG", value: "FMCG" },
    { name: "FinTech", value: "FinTech / Payments" },
    { name: "Payments", value: "FinTech / Payments" },
    { name: "Travel & Tourism", value: "Travel & Tourism" },
    { name: "Courier", value: "Courier / Logistics" },
    { name: "Logistics", value: "Courier / Logistics" },
    { name: "Building Material", value: "Building Material" },
    { name: "Architecture", value: "Architecture / Interior Design" },
    { name: "Interior Design", value: "Architecture / Interior Design" },
    { name: "Auto Components", value: "Auto Components" },
    { name: "Analytics", value: "Analytics / KPO / Research" },
    { name: "KPO", value: "Analytics / KPO / Research" },
    { name: "Research", value: "Analytics / KPO / Research" },
    { name: "Professional Services", value: "Professional Services / Project Management" },
    { name: "Project Management", value: "Professional Services / Project Management" },
    { name: "Advertising & Marketing", value: "Advertising & Marketing" },
    { name: "Accounting", value: "Accounting / Auditing" },
    { name: "Auditing", value: "Accounting / Auditing" },
    { name: "Software Product", value: "Software Product" },
    { name: "Industrial Equipment", value: "Industrial Equipment / Machinery" },
    { name: "Machinery", value: "Industrial Equipment / Machinery" },
    { name: "NBFC", value: "NBFC" },
    { name: "Retail", value: "Retail" },
    { name: "Medical Services", value: "Medical Services / Hospital" },
    { name: "Hospital", value: "Medical Services / Hospital" },
    { name: "SAAS", value: "SAAS" },
    { name: "Manufacturing", value: "Manufacturing" },
    { name: "Gaming", value: "Gaming" },
    { name: "Beauty & Personal Care", value: "Beauty & Personal Care" },
    { name: "Management Consulting", value: "Management Consulting" },
    { name: "Medical Devices & Equipment", value: "Medical Devices & Equipment" },
    { name: "BPO", value: "BPO / Call Centre" },
    { name: "Call Centre", value: "BPO / Call Centre" },
    { name: "Fitness & Wellness", value: "Fitness & Wellness" },
    { name: "Agriculture", value: "Agriculture / Forestry / Fishing" },
    { name: "Forestry", value: "Agriculture / Forestry / Fishing" },
    { name: "Fishing", value: "Agriculture / Forestry / Fishing" },
    { name: "Metals & Mining", value: "Metals & Mining" },
    { name: "Electrical Equipment", value: "Electrical Equipment" },
    { name: "Textile & Apparel", value: "Textile & Apparel" },
    { name: "Urban Transport", value: "Urban Transport" },
    { name: "Furniture & Furnishing", value: "Furniture & Furnishing" },
    { name: "Printing & Publishing", value: "Printing & Publishing" },
    { name: "Hotels & Restaurants", value: "Hotels & Restaurants" },
    { name: "Film", value: "Film / Music / Entertainment" },
    { name: "Music", value: "Film / Music / Entertainment" },
    { name: "Entertainment", value: "Film / Music / Entertainment" },
    { name: "Biotechnology", value: "Biotechnology" },
    { name: "Real Estate", value: "Real Estate" },
    { name: "Transport", value: "Transport / Logistics" },
    { name: "Logistics", value: "Transport / Logistics" },
    { name: "Insurance", value: "Insurance" },
    { name: "Sports", value: "Sports / Leisure & Recreation" },
    { name: "Leisure & Recreation", value: "Sports / Leisure & Recreation" },
    { name: "Recruitment", value: "Recruitment / Staffing" },
    { name: "Staffing", value: "Recruitment / Staffing" },
    { name: "Stock Broking", value: "Stock Broking" },
    { name: "Power", value: "Power" },
    { name: "NGO ", value: "NGO / Social Services / Industry Associations" },
    { name: "Social Services", value: "NGO / Social Services / Industry Associations" },
    { name: "Industry Associations", value: "NGO / Social Services / Industry Associations" },
    { name: "Events", value: "Events / Live Entertainment" },
    { name: "Live Entertainment", value: "Events / Live Entertainment" },
    { name: "Investment Banking", value: "Investment Banking / Venture Capital / Private Equity" },
    { name: "Venture Capital", value: "Investment Banking / Venture Capital / Private Equity" },
    { name: "Private Equity", value: "Investment Banking / Venture Capital / Private Equity" },
    { name: "Warehousing", value: "Warehousing" },
    { name: "D2C", value: "D2C" },
    { name: "Software Product", value: "Software Product" },
    { name: "Electronics Manufacturing", value: "Electronics Manufacturing" },
    { name: "Consumer Electronics & Appliances", value: "Consumer Electronics & Appliances" },
    { name: "Insurance", value: "Insurance" },
    { name: "Internet", value: " Internet" },
    { name: "Manufacturing", value: "Manufacturing" }


  ]
  companySKFormUrl: any;
  typeFromUrl: any;



  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    // Handle scroll event
    this.detectScroll();
  }




  searchTerm: string = '';
  filteredCompanyList: any[] = [];
  searchQuery: string = '';
  private searchTerms = new Subject<string>();





  constructor(private spinner: NgxSpinnerService, private location: Location, private activatedRoute: ActivatedRoute, private cdr: ChangeDetectorRef, private storage: StorageService, private router: Router, private authService: AuthService, private http: HttpClient, private renderer: Renderer2, private el: ElementRef, private companyListing: CompanyListingService, private cognitoService: CognitoService, private candidateSrv: CandidateProfileService) {
    this.searchTerms
      .pipe(
        debounceTime(300), // Adjust the debounce time as needed (300 milliseconds in this example)
        distinctUntilChanged()
      )
      .subscribe((query: string) => {
        // Call your API here with the query string
        this.callApiWithSearchQuery(query);
      });


    this.companySKFormUrl = this.activatedRoute.snapshot.queryParams['companyID'];
    this.typeFromUrl = this.activatedRoute.snapshot.queryParams['Type'];

  }

  ngAfterViewInit(): void {
    this.eventSubscription = this.navbarComponent.event$.subscribe(eventData => {
      this.triggerReferral = false;
      this.triggerGuidance = false;
      if(eventData) {
        this.receiveDataFromChild(eventData);
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
    this.getProfilePercentage();

    await this.getCompanyDetails();
    this.filteredCompanyList = this.companyList;


    this.assetLogos = await this.generateLogoFilenames(1, 1045);
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
    //check if the url contain data and initialize variables accordingly
    if (this?.companySKFormUrl && this?.typeFromUrl) {
      this.indexData = 'ID#' + this.companySKFormUrl
      this.selectedData = this.filterCompanyBySk(this.indexData);
      console.log(this.selectedData);
      debugger
      if (this.typeFromUrl === 'referral') {
        this.triggerReferral = true;
        this.triggerGuidance = false;
        this.openModalForCompany()
      } else {
        this.triggerReferral = false;
        this.triggerGuidance = true;
        this.openModalForCompany()
      }

    }

    window.scrollTo(0, 0);
  }

  //receive data from static page

  // async openModalFromIndex() {
  //   console.log(this.typeFromIndex)
  //   // if ( this.typeFromIndex) {
  //   this.userLoggedIn = await this.cognitoService.isLoggedIn();
  //   if (this.userLoggedIn) {
  //     if (this.typeFromIndex === 'referral') {
  //       this.indexData = 'ID#' + this.companySKFormIndex
  //       this.selectedData = this.filterCompanyBySk(this.indexData);
  //       console.log(this.selectedData);
  //       this.triggerReferral = true;
  //       this.triggerGuidance = false;
  //       this.openModal(ModalType.REQUEST_REFERRAL);
  //     } else {


  //       this.triggerReferral = false;
  //       this.triggerGuidance = true;
  //       this.openModal(ModalType.REQUEST_GUIDANCE)


  //     }
  //     this.userLoggedIn = true
  //     this.openModal(ModalType.LOGIN_SIGNUP);
  //   } else {


  //   }
  //   // }
  // }

  // open modal if user click on request referral and request guidance  from worko.ai
  async openModalForCompany() {
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
    if (this.typeFromUrl === 'referral' && this.userLoggedIn) {

      if (this.checkProfileCompletion()) {
        this.openModal(ModalType.REQUEST_REFERRAL);
      }
      else {
        this.profileCompletionRequired = true;
        this.successmessage = "";
        this.successtitle = "";
        this.openModal(ModalType.SUCCESS_MESSAGE);
      }
      const url = this.router.url.split('?')[0];
      this.location.replaceState(url);

    } else if (this.typeFromUrl === 'guidance') {

      this.openModal(ModalType.REQUEST_GUIDANCE)
      const url = this.router.url.split('?')[0];
      this.location.replaceState(url);

    } else {
      this.userLoggedIn = true;
      this.openModal(this.modalType.LOGIN_SIGNUP)
    }

  }





  onOptionSelected(event: MatAutocompleteSelectedEvent): void {

    this.selectedCompany = event.option.value;

    this.successmessage = "The company you entered is already in our referral network. Please check the listing page and try again."
    this.successtitle = "alert";
    this.openModal(this.modalType.SUCCESS_MESSAGE)
    // console.log(this.selectedCompany)

    //this.router.navigate([]);
    //this.router.navigate(['/company-listing']);
    // this.cancel();
    //this.router.navigateByUrl('/company-listing');
  }

  displayFn(option: any): string {
    if (typeof option === 'string') {

      //   this.companyName = option;
      // this.companySK ="";
      return option;
    } else if (typeof option === 'object' && option?.name) {

      this.companyName = option.name;
      this.companySK = option.SK;
      return option.name;
    } else {

      return '';
    }



  }

  //logic to show assest image 
  generateLogoFilenames(start: number, end: number) {
    const logos = [];
    for (let i = start; i <= end; i++) {

      logos.push(`${i}.jpg`);

    }
    return logos;
  }


  onSearchInputChange(): void {
    if (this.searchQuery.length >= 3) {
      this.lastKey = "";
      this.loadedOnce = true;
      this.searchTerms.next(this.searchQuery);
    }
  }

  onSearchInputEnter(event: KeyboardEvent): void {
    console.log(this.searchQuery);
    if (event.key === 'Enter') { // Checking if the pressed key is Enter
      this.lastKey = "";
      this.loadedOnce = true;
      this.searchTerms.next(this.searchQuery);
    }
  }

  callApiWithSearchQuery(query: string): void {
    const encodedQuery = encodeURIComponent(query); // Encoding the query string
    this.filterData.companyName = encodedQuery; // Setting here encoded query to filterData
    this.getCompanyDetails();
  }

  filterCompanies(): void {
    this.filteredCompanyList = this.companyList.filter(company =>
      company.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  //filter company data by using Sk
  filterCompanyBySk(companySk: string) {

    return this.companyList.find(company => company.SK === companySk);


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
    const footer = document.querySelector('app-footer');
    const footerHeight = footer ? (footer as HTMLElement).offsetHeight : 0;

    // Check if the user has scrolled to the bottom

    if (scrollPosition + windowHeight >= documentHeight - footerHeight) {
      // Load more data
      console.log("inside scroll")
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
      // const encodedCompanyName = encodeURIComponent(this.filterData.companyName); // Encode the company name
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
    this.pageSize = 100;
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
    this.pageSize = 100;
    this.loadedOnce = true;
    // this.appliedFilter = true;
    this.filterData.industryType = selectedIndustryType;
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
    this.userLoggedIn = await this.cognitoService.isLoggedIn();

    this.selectedData = item;
    console.log(this.selectedData);
    this.triggerReferral = true;
    this.triggerGuidance = false;

    if (this.userLoggedIn) {
      if (this.checkProfileCompletion()) {
        this.openModal(ModalType.REQUEST_REFERRAL);
      }
      else {
        this.profileCompletionRequired = true;
        this.successmessage = "";
        this.successtitle = "";
        this.openModal(ModalType.SUCCESS_MESSAGE);
      }
    }
    else {
      this.userLoggedIn = true
      this.openModal(ModalType.LOGIN_SIGNUP);
    }
  }

  checkProfileCompletion(): any {
    if (this.totalPercentage > 60 && this.cvCurPerc !== 0) {
      return true;
    }
    else {
      return false;
    }
  }
  async openGuidancePage(event: Event, item: any): Promise<void> {


    event.preventDefault();
    // this.userLoggedIn = await this.cognitoService.isLoggedIn();
    // this.reqGuidanceData = item;
    this.triggerReferral = false;
    this.triggerGuidance = true;
    // if (this.userLoggedIn) {
    //   // this.openModal(ModalType.REQUEST_GUIDANCE);

    // } else {
    //   this.openModal(ModalType.LOGIN_SIGNUP);
    // }

    //this.successmessage="Our guidance service is launching soon, connecting you with first-hand, experienced experts for invaluable insights. Stay tuned for updates.Need urgent assistance, like interview preparation from insiders?\n Email us at Guidance@worko.ai for support";
    // this.successtitle="Congratulations!";\\

    this.openModal(ModalType.REQUEST_GUIDANCE)


  }

  // ngAfterViewInit() {
  //   
  //   this.trigger.panelClosingActions
  //     .subscribe(e => {
  //       this.myControl.setValue(null);
  //     });
  // }
  cancel() {
    // this.companyFormDirective.resetForm()

    this.modal.cancel()

  }


  openCompanyForm($event: MouseEvent) {

    this.openModal(ModalType.ADD_COMPANY)
  }

  async receiveDataFromChild(data: any) {
    
    //window.location.reload()
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
    this.closeModal();
    if (this.userLoggedIn) {
      await this.getProfilePercentage();
      this.navbarComponent.initializeUserSession();
      if (this.triggerReferral || this.triggerGuidance) {   // Logic for auto-opening the request referral module once the user signed In successfully and his candidate profile is above 60% and cv is uploaded
        if (this.checkProfileCompletion()) {
          if (this.triggerReferral) {
            this.openModal(ModalType.REQUEST_REFERRAL);
          }
          if (this.triggerGuidance) {
            this.openModal(ModalType.REQUEST_GUIDANCE);
          }
        }
        else {
          this.profileCompletionRequired = true;
          this.successmessage = "";
          this.successtitle = "";
          this.openModal(ModalType.SUCCESS_MESSAGE);
        }
      }
      const url = this.router.url.split('?')[0];
      this.location.replaceState(url);
    }
    // if (this.triggerGuidance && this.userLoggedIn) {
    //   this.openModal(ModalType.REQUEST_GUIDANCE);
    // }
  }

  async requestCampanyData(form: NgForm) {
    try {
      this.companyData = {
        userType: "CAND",
        companyDetail: {
          name: this.companyForm.CompanyName,
          industry: 'Industry',

          carrierPage: this.companyForm.carrierPage,
          linkedIn: this.companyForm.linkedIn,

        },
        userEmail: this.companyForm.personalemailid,
        userContactNumber: this.companyForm.contactNumber
      }
      console.log(this.companyData)
      await this.companyListing.requestNewCompany(this.companyData)
      this.spinner.hide()
      this.companyFormDirective.resetForm()
      this.openModal(this.modalType.SUCCESS_MESSAGE)
    } catch (error) {
      this.spinner.hide()
      this.companyFormDirective.resetForm()
      this.successmessage = "Something went wrong. Please try again after sometime"
      this.successtitle = "Error"
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
    this.showModal = modalType;
    this.cdr.detectChanges(); // This resolves an issue where the ViewChild reference was sometimes undefined
    this.modalMessage = message;
    this.modalTitle = title;
    if (ModalType.REQUEST_REFERRAL) {
      if (this.referrralComponent) {
        this.referrralComponent.showReferrelRow = true;
        this.referrralComponent.requestForm.reset();
        this.referrralComponent.showScore = false;
      }
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
    if (ModalType.ADD_COMPANY) {
      this.companyForm = {


        CompanyName: "",
        industry: '',

        carrierPage: "",
        linkedIn: "",
        personalemailid: "",
        contactNumber: ""


      }

      this.myControl.reset();

    }
    if (ModalType.LOGIN_SIGNUP) {
      if (this.LoginPageComponent) {
        this.LoginPageComponent.showSignInRow = true;
        this.LoginPageComponent.showAddCompanyScreen = false;
        this.LoginPageComponent.showErrorMessageScreen = false;
        this.LoginPageComponent.showLoginScreen = true
      }
    }
    this.modal.open();

  }
  // if (ModalType.LOGIN_SIGNUP) {
  //   if (this.LoginPageComponent) {
  //     this.LoginPageComponent.showSignInRow = true;
  //     this.LoginPageComponent.showAddCompanyScreen = false;
  //     this.LoginPageComponent.showErrorMessageScreen = false;
  //     this.LoginPageComponent.isUserLoggedIn = true

  //   }
  // }
  // this.modal.open();

  /**
   * Close modal.
   *
   * @returns {void}
   */
  closeModal(): void {
    // Show referral request form after closing the modal
    this.modal.cancel();
  }

  async getProfilePercentage() {
    if (this.userLoggedIn) {
      this.emailAddress = this.storage.get("useremail");
      const response = await this.candidateSrv.getProfileComplete(this.emailAddress);

      if (response) {
        this.profileCompletion = response;
        // console.log(this.profileCompletion);

        if (this.profileCompletion) {
          const profileType = this.profileCompletion.candidate;
          this.totalPercentage = profileType.reduce((sum: any, element: any) => sum + element.curPerc, 0);
          this.cvCurPerc = profileType[2].curPerc;

          console.log("Total percentage == ", this.totalPercentage);
          console.log("CV CurPer === ", this.cvCurPerc);
        }
      }
    }
  }

  completeProfile() {
    this.closeModal();
    // this.profileCompletionRequired = false;
    this.router.navigate(['/candidate/edit-profile']);
  }

  ngOnDestroy(): void {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }
}
