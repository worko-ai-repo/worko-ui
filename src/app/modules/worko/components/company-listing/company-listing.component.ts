import { Component, OnInit, ViewChild, Renderer2, ElementRef, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CompanyListingService } from '../../services/company-listing.service';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { ReferralRequestComponent } from '../referral-request/referral-request.component';
import { RequestGuidenceComponent } from '../request-guidence/request-guidence.component';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
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
// import { LoginPageComponent } from '../login-page/login-page.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { debounce } from 'lodash';
import { LoginFormComponent } from '../login-form/login-form.component';
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
  @ViewChild(LoginFormComponent) LoginFormComponent!: LoginFormComponent;
  @ViewChild(NavbarComponent) navbarComponent!: NavbarComponent;
  @ViewChild('scrollTrigger') scrollTrigger!: ElementRef;

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
  hundreadCompanies: any[] = [];
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
  assetLogos: any = [];

  emailAddress: any;
  profileCompletion: any;
  cvCurPerc: any;
  totalPercentage: any;
  profileCompletionRequired: boolean = false;
  isCompanyNameFilterActive: boolean = false;
  companyForm = {
    CompanyName: "",
    industry: 'Industry',
    carrierPage: "",
    linkedIn: "",
    personalemailid: "",
    contactNumber: ""
  }
  count: number = 0;
  isNoLoadData: boolean = true
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

    { name: "Accounting / Auditing", value: "Accounting / Auditing" },
    { name: "Advertising & Marketing", value: "Advertising & Marketing" },
    { name: "Agriculture / Forestry / Fishing", value: "Agriculture / Forestry / Fishing" },
    { name: "Analytics / KPO / Research", value: "Analytics / KPO / Research" },
    { name: "Animation & VFX", value: "Animation & VFX" },
    { name: "Architecture / Interior Design", value: "Architecture / Interior Design" },
    { name: "Auto Components", value: "Auto Components" },
    { name: "Aviation", value: "Aviation" },
    { name: "Automobile", value: "Automobile" },
    { name: "Banking", value: "Banking" },
    { name: "Beauty & Personal Care", value: "Beauty & Personal Care" },
    { name: "Beverage", value: "Beverage" },
    { name: "Biotechnology", value: "Biotechnology" },
    { name: "BPO / Call Centre", value: "BPO / Call Centre" },
    { name: "Building Material", value: "Building Material" },
    { name: "Chemicals", value: "Chemicals" },
    { name: "Clinical Research / Contract Research", value: "Clinical Research / Contract Research" },
    { name: "Consumer Electronics & Appliances", value: "Consumer Electronics & Appliances" },
    { name: "Content Development / Language", value: "Content Development / Language " },
    { name: "Courier / Logistics", value: "Courier / Logistics" },
    { name: "Defence & Aerospace", value: "Defence & Aerospace" },
    { name: "Design", value: "Design" },
    { name: "E-commerce", value: "E-commerce" },
    { name: "E-Learning / EdTech", value: "e-Learning / EdTech" },
    { name: "Education / Training", value: "Education / Training" },
    { name: "Electrical Equipment", value: "Electrical Equipment" },
    { name: "Electronic Components / Semiconductors", value: "Electronic Components / Semiconductors" },
    { name: "Electronics Manufacturing", value: "Electronics Manufacturing" },
    { name: "Emerging Technologies", value: "Emerging Technologies" },
    { name: "Engineering & Construction", value: "Engineering & Construction" },
    { name: "Events / Live Entertainment", value: "Events / Live Entertainment" },
    { name: "D2C", value: "D2C" },
    { name: "Facility Management Services", value: "Facility Management Services" },
    { name: "Fertilizers / Pesticides / Agro chemicals", value: "Fertilizers / Pesticides / Agro chemicals" },
    { name: "Film / Music / Entertainment", value: "Film / Music / Entertainment" },
    { name: "Financial Services", value: "Financial Services" },
    { name: "FinTech / Payments", value: "FinTech / Payments" },
    { name: "Fitness & Wellness", value: "Fitness & Wellness" },
    { name: "FMCG", value: "FMCG" },
    { name: "Food Processing", value: "Food Processing" },
    { name: "Furniture & Furnishing", value: "Furniture & Furnishing" },
    { name: "Gaming", value: "Gaming" },
    { name: "Gems & Jewellery", value: "Gems & Jewellery" },
    { name: "Hardware & Networking", value: "Hardware & Networking" },
    { name: "Hospitality", value: "Hospitality" },
    { name: "Hotels & Restaurants", value: "Hotels & Restaurants" },
    { name: "Import & Export", value: "Import & Export" },
    { name: "Industrial Automation", value: "Industrial Automation" },
    { name: "Industrial Equipment / Machinery", value: "Industrial Equipment / Machinery" },
    { name: "Insurance", value: "Insurance" },
    { name: "Internet", value: "Internet" },
    { name: "Investment Banking / Venture Capital / Private Equity", value: "Investment Banking / Venture Capital / Private Equity" },
    { name: "Manufacturing", value: "Manufacturing" },
    { name: "Iron & Steel", value: "Iron & Steel" },
    { name: "IT Services & Consulting", value: "IT Services & Consulting" },
    { name: "Law Enforcement / Security Services", value: "Law Enforcement / Security Services" },
    { name: "Leather", value: "Leather" },
    { name: "Legal", value: "Legal" },
    { name: "Management Consulting", value: "Management Consulting" },
    { name: "Manufacturing", value: "Manufacturing" },
    { name: "Medical Devices & Equipment", value: "Medical Devices & Equipment" },
    { name: "Medical Services / Hospital", value: "Medical Services / Hospital" },
    { name: "Metals & Mining", value: "Metals & Mining" },
    { name: "Miscellaneous", value: "Miscellaneous" },
    { name: "NBFC", value: "NBFC" },
    { name: "NGO / Social Services / Industry Associations", value: "NGO / Social Services / Industry Associations" },
    { name: "Oil & Gas", value: "Oil & Gas" },
    { name: "Packaging & Containers", value: "Packaging & Containers" },
    { name: "Petrochemical / Plastics / Rubber", value: "Petrochemical / Plastics / Rubber" },
    { name: "Pharmaceutical & Life Sciences", value: "Pharmaceutical & Life Sciences" },
    { name: "Ports & Shipping", value: "Ports & Shipping" },
    { name: "Power", value: "Power" },
    { name: "Professional Services / Project Management", value: "Professional Services / Project Management" },
    { name: "Printing & Publishing", value: "Printing & Publishing" },
    { name: "Pulp & Paper", value: "Pulp & Paper" },
    { name: "Railways", value: "Railways" },
    { name: "Real Estate", value: "Real Estate" },
    { name: "Recruitment / Staffing", value: "Recruitment / Staffing" },
    { name: "Retail", value: "Retail" },
    { name: "SAAS", value: "SAAS" },
    { name: "Software Product", value: "Software Product" },
    { name: "Sports / Leisure & Recreation", value: "Sports / Leisure & Recreation" },
    { name: "Stock Broking", value: "Stock broking" },
    { name: "Telecom / ISP", value: "Telecom / ISP" },
    { name: "Textile & Apparel ", value: "Textile & Apparel" },
    { name: "Travel & Tourism", value: "Travel & Tourism" },
    { name: "Taxi / Mobility", value: "Taxi / Mobility" },
    { name: "TV / Radio", value: "TV / Radio" },
    { name: "Transport / Logistics", value: "Transport / Logistics" },
    { name: "Warehousing", value: "Warehousing" },
    { name: "Water Treatment / Waste Management", value: "Water Treatment / Waste Management" },

  ]
  companySKFormUrl: any;
  typeFromUrl: any;
  triggerAddCompany: boolean = false;
  userDetails: any;
  sortOrder: string = 'ascending';
  searchTerm: string = '';
  filteredCompanyList: any[] = [];
  searchQuery: string = '';
  private searchTerms = new Subject<string>();
  debouncedGetCompanyDetails: () => void;
  observer: IntersectionObserver | undefined;
  userType: any;

  constructor(private spinner: NgxSpinnerService, private location: Location, private activatedRoute: ActivatedRoute, private cdr: ChangeDetectorRef,
    private storage: StorageService, private router: Router, private authService: AuthService, private http: HttpClient, private renderer: Renderer2, private el: ElementRef, private companyListing: CompanyListingService, private cognitoService: CognitoService, private candidateSrv: CandidateProfileService) {

    this.debouncedGetCompanyDetails = debounce(this.getCompanyDetails.bind(this), 400); // Created a debounced version of the getCompanyDetails method to handle the scroll event.
    // This ensures that API calls are triggered only once within a 400 millisecond interval during scrolling.

    this.searchTerms
      .pipe(
        debounceTime(300), // Adjust the debounce time as needed (300 milliseconds in this example)
        //distinctUntilChanged()
      )
      .subscribe((query: string) => {

        // Call your API here with the query string
        this.callApiWithSearchQuery(query);
      });


    this.companySKFormUrl = this.activatedRoute.snapshot.queryParams['companyID'] ? this.activatedRoute.snapshot.queryParams['companyID'] : this.storage.get("selectedCompanySK");
    this.typeFromUrl = this.activatedRoute.snapshot.queryParams['Type'] ? this.activatedRoute.snapshot.queryParams['Type'] : this.storage.get("type");

    if (this.activatedRoute.snapshot.queryParams['companyID'] && this.activatedRoute.snapshot.queryParams['Type']) {
      let companySKFromUrl = this.activatedRoute.snapshot.queryParams['companyID'];
      let type = this.activatedRoute.snapshot.queryParams['Type'];
      this.storage.set('selectedCompanySK', companySKFromUrl);
      this.storage.set('type', type);
    }

  }

  ngAfterViewInit(): void {
    this.eventSubscription = this.navbarComponent.event$.subscribe(eventData => {
      this.triggerReferral = false;
      this.triggerGuidance = false;
      this.triggerAddCompany = false;
      if (eventData) {
        this.receiveDataFromChild(eventData);
      }
    });

    // Setting up the IntersectionObserver here
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && this.lastKey && this.isNoLoadData) {
        this.debouncedGetCompanyDetails(); // Fetch more companies when the trigger is visible
      }
    });

    // observing the scroll trigger element here
    this.observer.observe(this.scrollTrigger.nativeElement);
  }

  async ngOnInit(): Promise<void> {
    this.userType = this.storage.get("lastAccessedDash");
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
    if (this.userLoggedIn) {
      this.getUserDetails();
    }
    await this.getProfilePercentage();

    await this.getCompanyDetails();
    // await this.getCompanyDetails(100);
    this.filteredCompanyList = this.companyList;


    // this.assetLogos = await this.generateLogoFilenames(1, 2000);
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
    if (this.companySKFormUrl && this.typeFromUrl) {
      if (this.companySKFormUrl.startsWith('ID#')) {
        this.indexData = this.companySKFormUrl;
      } else {
        this.indexData = 'ID#' + this?.companySKFormUrl;
      }
      this.selectedData = this.filterCompanyBySk(this.indexData);

      // debugger
      if (this.typeFromUrl === 'referral') {
        this.triggerReferral = true;
        this.triggerGuidance = false;
        this.openModalForCompany();
      } else {
        this.triggerReferral = false;
        this.triggerGuidance = true;
        this.openModalForCompany()
      }

    }



    window.scrollTo(0, 0);
  }

  checkImageExists(imageName: string): Promise<boolean> {
    // debugger
    const imageUrl = `assets/company-logo/${imageName}`;
    return this.http.get(imageUrl, { observe: 'response' }).toPromise()
      .then(response => {
        if (response && response.status === 200) {
          return true;
        } else {
          return false;
        }
      })
      .catch(() => false);
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
      this.storage.remove("type");
      this.storage.remove("selectedCompanySK");

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


      this.storage.remove("type");
      this.storage.remove("selectedCompanySK");
      this.openModal(ModalType.REQUEST_GUIDANCE)
      const url = this.router.url.split('?')[0];
      this.location.replaceState(url);

    } else {
      this.userLoggedIn = true;
      this.openModal(this.modalType.LOGIN_SIGNUP)
    }

  }

  async getUserDetails() {
    this.emailAddress = this.storage.get("useremail");
    try {
      await this.candidateSrv.getUserDetails(this.emailAddress).then(async (response) => {
        if (response) {
          this.userDetails = response;
        }
      })
    } catch (error: any) {
      //console.log("error:", error);
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
  // generateLogoFilenames(start: number, end: number) {
  //   const logos = [];
  //   for (let i = start; i <= end; i++) {

  //     logos.push(`${i}.jpg`);

  //   }
  //   return logos;
  // }


  onSearchInputChange(): void {

    if (this.searchQuery.length >= 3) {
      this.pageSize = 50;
      this.lastKey = "";
      this.loadedOnce = true;
      this.isCompanyNameFilterActive = true;
      this.searchTerms.next(this.searchQuery);
    } else if (this.searchQuery.length <= 0) {
      this.clearSearchInput()
    }
  }

  onSearchInputEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter') { // Checking if the pressed key is Enter
      this.isNoLoadData = true
      this.pageSize = 50;
      this.lastKey = "";
      this.loadedOnce = true;
      this.searchTerms.next(this.searchQuery);
    }
  }

  callApiWithSearchQuery(query: string): void {
    this.lastKey = "";
    this.loadedOnce = true;
    this.isNoLoadData = true;
    const encodedQuery = encodeURIComponent(query); // Encoding the query string
    this.filterData.companyName = encodedQuery; // Setting here encoded query to filterData
    this.filterData.teamSize = "",
      this.filterData.industryType = "",

      this.getCompanyDetails();

  }

  filterCompanies(): void {
    this.filteredCompanyList = this.companyList.filter(company =>
      company.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  //filter company data by using Sk
  filterCompanyBySk(companySk: string) {
    return this.hundreadCompanies.find(company => company.SK === companySk);
  }

  async clearSearchInput(): Promise<void> {
    this.pageSize = 50
    this.lastKey = "";
    this.loadedOnce = true;
    this.searchQuery = '';
    this.searchTerms.next('')
    this.filterData.companyName = "";
    this.isNoLoadData = true
    this.isCompanyNameFilterActive = false;
    await this.getCompanyDetails();


  }
  navigateToJobLink(event: MouseEvent, data: any): void {
    event.preventDefault(); // Prevent the default anchor behavior
    this.getJobLink(data);

  }

  getJobLink(data:any): void {
    const companyName = data.name
  .toLowerCase()                        // Convert to lowercase
  .replace(/\(.*?\)/g, '')               // Remove content inside parentheses
  .replace(/\s*&\s*/g, '&')              // Remove spaces around the '&' symbol
  .replace(/\s+/g, '-')                  // Replace remaining spaces with hyphen
  .replace(/-+/g, '-')                   // Ensure there's only one hyphen in between
  .replace(/^-|-$/g, '');                 // Remove hyphen at start or end
    const companyID=data.SK.replace("ID#", "");
    const route = `/company/jobs/${companyName}-jobs-${companyID}`;
    this.router.navigate([route]);
   // console.log(route);
    // this.router.navigate([route],{
    //   state: { companySK: data.SK}
    // });;
  }
  async getCompanyDetails(pageSize?: any) {
    // console.log(this.lastKey, this.loadedOnce, this.isNoLoadData)

    if (pageSize === 100) {
      let lastKey = undefined;
      const filterData = {
        teamSize: "",
        industryType: "",
        companyName: ""
      }
      await this.companyListing.getCompanyListing(pageSize, lastKey, filterData.teamSize, filterData.industryType, filterData.companyName).then(async (response) => {
        if (response) {
          this.hundreadCompanies = response.data;
        }
      })
        .catch(error => {
          // console.error('Display Company Listing Error:', error);
        });
    }

    else if ((this.lastKey || this.loadedOnce) && this.isNoLoadData) {
      // if (this.lastKey || this.loadedOnce ) {
      this.spinner.show();
      // const encodedCompanyName = encodeURIComponent(this.filterData.companyName); // Encode the company name
      await this.companyListing.getCompanyListing(this.pageSize, this.sortOrder, this.lastKey, this.filterData.teamSize, encodeURIComponent(this.filterData.industryType), this.filterData.companyName).then(async (response) => {
        if (response) {

          this.spinner.hide();
          if (this.loadedOnce) {
            this.companyList = [];
          }
          this.companyList = this.companyList.concat(response.data);
          // this.checkLogos();
          this.lastKey = response.pagination.lastKey;
          this.loadedOnce = false;
          this.count = response.pagination.count;
          this.pageSize = response.pagination.pageSize;

          if (this.count < this.pageSize) { //check to pervent multiple api call
            // debugger
            this.isNoLoadData = false;
          }
          // this.isNoLoadData=this.lastKey? true : false //check to pervent multiple api call
          //  this.filterCompanies(); // Filter companies after updating companyList
        }
      })
        .catch(error => {
          // console.error('Display Company Listing Error:', error);
          this.spinner.hide();
        });
    }
  }

  // checkLogos(): void {
  //   this.companyList.forEach(company => {

  //     // Skipping the check here if the logo is already in the assetLogos array
  //     if (this.assetLogos.includes(company.logo)) {
  //       return; // Exiting early here if logo is already present
  //     }

  //     const logoPath = `assets/company-logo/${company.logo}`;
  //     this.http.get(logoPath, { responseType: 'blob' }).pipe(
  //       catchError(() => of(false)) // Return false if logo doesn't exist
  //     ).subscribe(exists => {
  //       if (exists) {
  //         this.assetLogos.push(company.logo); // Add to array if logo exists
  //       }
  //     });
  //   });
  // }
  // isLogoAvailable(logo: string): boolean {

  //   return this.assetLogos.includes(logo); // Check if the logo is available in assets
  // }

  async onTeamSizeChange(selectedTeamSize: string) {
    // if (selectedTeamSize !== "") {
    //   this.pageSize = 100;
    // } else {
    //   this.pageSize = 50;
    // }
    this.pageSize = selectedTeamSize !== "" ? 100 : 50; // if the selectIndustryType is selected then passing pageSize as 100
    this.isNoLoadData = true

    this.lastKey = "";
    this.loadedOnce = true;
    if (this.filterData.companyName !== "") {
      this.filterData.teamSize = "";
      (document.getElementById('teamSize') as HTMLSelectElement).value = "";
    } else {
      this.filterData.teamSize = selectedTeamSize;
      await this.getCompanyDetails();
    }
    /// this.filterData.teamSize = selectedTeamSize;
    // if(selectedTeamSize){
    //    // Assuming selectedTeamSize is a string representation of the selected team size value
    //    const [min, max] = selectedTeamSize.split('-').map(Number); // Assuming team size format is 'min-max'
    //    // Update the filterData object with the new teamSize values
    //    this.filterData.teamSize = { min, max };   
    // }else{
    //   this.filterData.teamSize = "";
    // }

    // Call getCompanyDetails to fetch filtered companies

  }

  async onIndustryNameChange(selectedIndustryName: string) {
    this.loadedOnce = true;
    this.lastKey = "";

    this.loadedOnce = true;
    // this.appliedFilter = true;
    this.filterData.industryName = selectedIndustryName;
    // Call getCompanyDetails to fetch filtered companies
    await this.getCompanyDetails();
  }
  async onIndustryTypeChange(selectedIndustryType: string) {

    this.isNoLoadData = true
    this.lastKey = "";
    // if (selectedIndustryType !== "" ) {  // if the selectIndustryType is selected then passing pageSize as 100
    //   this.pageSize = 100;
    // } else {
    //   this.pageSize = 50;
    // }
    this.loadedOnce = true;
    this.pageSize = selectedIndustryType !== "" ? 100 : 50; // if the selectIndustryType is selected then passing pageSize as 100
    if (this.filterData.companyName !== "") {
      this.filterData.industryType = "";
      (document.getElementById('industryType') as HTMLSelectElement).value = "";
    } else {
      this.filterData.industryType = selectedIndustryType;
      await this.getCompanyDetails();
    }

    // this.appliedFilter = true;
    // const encodedQuery = encodeURIComponent(selectedIndustryType);
    // this.filterData.industryType = selectedIndustryType; //commented now --working flow

    // Call getCompanyDetails to fetch filtered companies

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
    this.storage.set('selectedCompanySK', this?.selectedData?.SK);
    this.storage.set('type', "referral");

    this.triggerReferral = true;
    this.triggerGuidance = false;
    this.triggerAddCompany = false;

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
      this.storage.remove("type");    // Removing 'type' and 'selectedCompanySK' from localStorage to prevent the popup from opening automatically on the next page refresh
      this.storage.remove("selectedCompanySK");
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
    this.storage.set('type', "guidance");
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
    this.modal.cancel();
  }

  onModalClose() {
    this.storage.remove("type");
    this.storage.remove("selectedCompanySK");
  }


  async openCompanyForm($event: MouseEvent) {
    this.triggerReferral = false;
    this.triggerGuidance = false;
    this.triggerAddCompany = true;
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
    if (this.userLoggedIn) {
      this.openModal(ModalType.ADD_COMPANY);
    }
    else {
      this.userLoggedIn = true
      this.openModal(ModalType.LOGIN_SIGNUP);
    }
  }

  async receiveDataFromChild(data?: any) {
    this.storage.remove("type");
    this.storage.remove("selectedCompanySK");
    //window.location.reload()
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
    this.closeModal();
    if (this.userLoggedIn) {
      await this.getUserDetails();
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
      else if (this.triggerAddCompany) {
        this.openModal(ModalType.ADD_COMPANY);
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
        userType: this.userType,
        companyDetail: {
          name: this.companyForm.CompanyName,
          industry: 'Industry',


          carrierPage: this.companyForm.carrierPage,
          linkedIn: this.companyForm.linkedIn,

        },
        userEmail: this.companyForm.personalemailid,
        userContactNumber: this.companyForm.contactNumber
      }

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
    if (this.showModal === ModalType.REQUEST_REFERRAL) {
      if (this.referrralComponent) {
        this.referrralComponent.showFeedback = false;
        this.referrralComponent.showReferrelRow = true;
        this.referrralComponent.requestForm.reset();
        this.referrralComponent.showScore = false;
        this.referrralComponent.showErrorMsg = false;
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
    if (this.showModal === ModalType.ADD_COMPANY) {
      this.companyForm = {


        CompanyName: "",
        industry: '',

        carrierPage: "",
        linkedIn: "",
        personalemailid: this.userDetails[0]?.email,
        contactNumber: this.userDetails[0]?.number


      }

      this.myControl.reset();

    }
    if (ModalType.LOGIN_SIGNUP) {
      if (this.LoginFormComponent) {
        this.LoginFormComponent.showSignInRow = false;
        this.LoginFormComponent.showAddCompanyScreen = false;
        this.LoginFormComponent.showErrorMessageScreen = false;
        this.LoginFormComponent.showLoginScreen = true
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
    this.storage.remove("type");
    this.storage.remove("selectedCompanySK");
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

    if (this.observer) {
      this.observer.disconnect(); // Cleaning up the IntersectionObserver here
    }
  }
}
