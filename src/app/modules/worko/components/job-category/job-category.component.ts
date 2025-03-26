import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CompanyListingService } from '../../services/company-listing.service';
import { ReferralRequestComponent } from '../referral-request/referral-request.component';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { RequestGuidenceComponent } from '../request-guidence/request-guidence.component';
import { Subscription } from 'rxjs';
// import { LoginPageComponent } from '../login-page/login-page.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { CandidateProfileService } from 'src/app/modules/candidate/services/candidate-profile.service';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import * as industryTypes from '../../../../../assets/industry-types.json';
import { LoginFormComponent } from '../login-form/login-form.component';

@Component({
  selector: 'app-job-category',
  templateUrl: './job-category.component.html',
  styleUrls: ['./job-category.component.scss']
})
export class JobCategoryComponent implements OnInit, AfterViewInit, OnDestroy {

  private eventSubscription!: Subscription;
  @ViewChild(ModalComponent) modal!: ModalComponent;
  @ViewChild(ReferralRequestComponent) referrralComponent!: ReferralRequestComponent;
  @ViewChild(RequestGuidenceComponent) referrralguidanceComponent!: RequestGuidenceComponent;
  @ViewChild(LoginFormComponent) LoginFormComponent!: LoginFormComponent;
  @ViewChild(NavbarComponent) navbarComponent!: NavbarComponent;

  successmessage: string = "";
  successtitle: string = "";
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;

  userLoggedIn: boolean = false;
  triggerReferral: boolean = false;
  triggerGuidance: boolean = false;

  jobCategory!: string;
  pageSize = 50;
  lastKey: string | undefined = undefined;
  sortOrder: string | undefined = undefined;
  loadedOnce: boolean = true;
  companyList: any[] = [];
  isNoLoadData: boolean = true;
  teamSize = "";
  industryType = "";
  companyName = "";
  isIndustryType = false;  // New property to determine if the category is an industry type
  count: number = 0;

  selectedData: any;
  profileCompletion: any;
  cvCurPerc: any;
  totalPercentage: any;
  profileCompletionRequired: boolean = false;

  userDetails: any;
  emailAddress: any;

  assetLogos: string[] = [];

  loading: boolean = true;

  industryTypeOptions: any[] = (industryTypes as any).default;

  baseURL = environment.baseUrl;

  constructor(private route: ActivatedRoute, private router: Router, private spinner: NgxSpinnerService, private companyListing: CompanyListingService, private storage: StorageService, private cdr: ChangeDetectorRef, private cognitoService: CognitoService, private candidateSrv: CandidateProfileService, private location: Location, private http: HttpClient) { }

  async ngOnInit() {
    this.http.get<any[]>('assets/industry-types.json').subscribe(data => {
      this.industryTypeOptions = data;
    });
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
    if (this.userLoggedIn) {
      this.getUserDetails();
    }
    this.getProfilePercentage();
    this.route.url.subscribe(urlSegments => {
      const fullCategory = urlSegments.map(segment => segment.path).join('/');
      this.jobCategory = this.extractCategory(fullCategory);
      this.processCategory(this.jobCategory);
    });

    this.assetLogos = await this.generateLogoFilenames(1, 1045);
  }

  ngAfterViewInit(): void {
    this.eventSubscription = this.navbarComponent.event$.subscribe(eventData => {
      this.triggerReferral = false;
      this.triggerGuidance = false;
      if (eventData) {
        this.receiveDataFromChild(eventData);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }

  private extractCategory(fullCategory: string): string {
    // Remove '-jobs' from the end of the string
    let category = fullCategory.replace(/-jobs$/, '');

    // Replace dashes '-' with spaces ' ' and capitalize each word
    category = category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return category;
  }

  private processCategory(category: string): void {

    // // Convert category to lowercase for case-insensitive comparison
    // const lowerCategory = category.toLowerCase();

    // // Filter industryTypeOptions to find matches that include the category
    // const industryMatches = this.industryTypeOptions.filter((option: any) =>
    //   option.name.toLowerCase().includes(lowerCategory)
    // );

    // if (industryMatches.length > 0) {
    //   // Pick the first match
    //   const industryMatch = industryMatches[0];
    //   this.industryType = industryMatch.value;
    //   this.companyName = "";
    //   this.isIndustryType = true;  // Set to true if it's an industry type
    // }

    const industryMatch = this.industryTypeOptions.find((option: any) => option.name.toLowerCase() === category.toLowerCase());
    if (industryMatch) {
      this.industryType = industryMatch.value;
      this.companyName = "";
      this.isIndustryType = true;  // Set to true if it's an industry type
    }
    else {
      this.companyName = category;
      this.industryType = "";
      this.isIndustryType = false;  // Set to false if it's not an industry type
    }
    this.getCompanyDetails();
  }

  async getCompanyDetails() {
    if ((this.lastKey || this.loadedOnce) && this.isNoLoadData) {
      this.spinner.show();
      await this.companyListing.getCompanyListing(this.pageSize, this.sortOrder, this.lastKey, this.teamSize, encodeURIComponent(this.industryType), this.companyName).then(async (response) => {
        this.spinner.hide();
        if (response && response.data.length > 0) {
          if (this.loadedOnce) {
            this.companyList = [];
          }
          this.companyList = this.companyList.concat(response.data);
          this.lastKey = response.pagination.lastKey;
          this.loadedOnce = false;
          this.count = response.pagination.count;
          this.pageSize = response.pagination.pageSize;
          if (this.count < this.pageSize) {
            this.isNoLoadData = false;
          }
        } else {
          this.handleNoCompanyFound();
        }
        this.loading = false; // Set loading to false when data is fetched
      })
        .catch(error => {
          console.error('Display Company Listing Error:', error);
          this.spinner.hide();
          this.handleNoCompanyFound();
          this.loading = false; // Set loading to false when data is fetched
        });
    }
  }

  private handleNoCompanyFound() {
    // console.log('No company found');
    // Display a message or take any other action when no companies are found
  }

  async getUserDetails() {
    this.emailAddress = this.storage.get("userEmail");
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

  async openReferralPage(event: Event, item: any): Promise<void> {
    event.preventDefault();
    this.userLoggedIn = await this.cognitoService.isLoggedIn();

    this.selectedData = item;
    this.storage.set('selectedCompanySK', this?.selectedData?.SK);
    this.storage.set('type', "referral");

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
      this.storage.remove("type");    // Removing 'type' and 'selectedCompanySK' from localStorage to prevent the popup from opening automatically on the next page refresh
      this.storage.remove("selectedCompanySK");
    }
    else {
      this.userLoggedIn = true
      this.openModal(ModalType.LOGIN_SIGNUP);
    }
  }
  navigateToJobLink(event: MouseEvent, data: any): void {
    event.preventDefault(); // Prevent the default anchor behavior
    this.getJobLink(data);

  }

  getJobLink(data:any): void {
  //   const  companyName=encodeURIComponent(data.name);
  //   const route = `/companies/${companyName.toLowerCase()}-jobs`;
  //  // console.log(route);
  //   this.router.navigate([route],{
  //     state: { companySK: data.SK}
  //   });;
  const  companyName= data.name.toLowerCase().replace(/\(.*?\)/g, '').replace(/\s*&\s*/g, '&').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  const companyID=data.SK.replace("ID#", "");
  const route = `/company/jobs/${companyName}-jobs-${companyID}`;
  this.router.navigate([route]);
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
      // else if (this.triggerAddCompany) {
      //   this.openModal(ModalType.ADD_COMPANY);
      // }
      const url = this.router.url.split('?')[0];
      this.location.replaceState(url);
    }
    // if (this.triggerGuidance && this.userLoggedIn) {
    //   this.openModal(ModalType.REQUEST_GUIDANCE);
    // }
  }

  checkProfileCompletion(): any {
    if (this.totalPercentage > 60 && this.cvCurPerc !== 0) {
      return true;
    }
    else {
      return false;
    }
  }

  async getProfilePercentage() {
    if (this.userLoggedIn) {
      this.emailAddress = this.storage.get("userEmail");
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

  //logic to show assest image 
  generateLogoFilenames(start: number, end: number) {
    const logos = [];
    for (let i = start; i <= end; i++) {

      logos.push(`${i}.jpg`);

    }
    return logos;
  }

  completeProfile() {
    this.closeModal();
    // this.profileCompletionRequired = false;
    this.router.navigate(['/candidate/edit-profile']);
  }

  navigateToIndex() {
    // window.location.href = environment.crossOriginUrl + '/';
    this.router.navigateByUrl('/');
  }

  cancel() {
    // this.companyFormDirective.resetForm()
    this.modal.cancel();
  }

  onModalClose() {
    this.storage.remove("type");
    this.storage.remove("selectedCompanySK");
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

}
