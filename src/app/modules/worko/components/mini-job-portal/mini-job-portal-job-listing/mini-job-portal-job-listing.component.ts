import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { LoginPageComponent } from '../../login-page/login-page.component';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CandidateProfileService } from 'src/app/modules/candidate/services/candidate-profile.service';
import { error, event } from 'jquery';
import { CompanyListingService } from '../../../services/company-listing.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-mini-job-portal-job-listing',
  templateUrl: './mini-job-portal-job-listing.component.html',
  styleUrls: ['./mini-job-portal-job-listing.component.scss']
})
export class MiniJobPortalJobListingComponent {

  companyName!: string;
  @ViewChild(ModalComponent) modal!: ModalComponent;
  @ViewChild(LoginPageComponent) LoginPageComponent!: LoginPageComponent;
  @ViewChild(NavbarComponent) navbarComponent!: NavbarComponent;
  @Output() onOkBtn: EventEmitter<any> = new EventEmitter<any>();
  userLoggedIn: boolean = false;
  profileCompletion: any;
  cvCurPerc: any;
  totalPercentage: any;
  profileCompletionRequired: boolean = false;
  successmessage: string = "";
  successtitle: string = "";
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  emailAddress: any;
  userDetails: any;
  showsubscriptionPlan: boolean = false;
  jobDetails: any = [];
  showSubscription: boolean = false;
  showReferrelRow: boolean = true;
  showContent: boolean = true;
  showLoading: boolean = false;
  requestForm!: FormGroup;
  showScore: boolean = false;
  matchingScore: number = 0;
  referralRequestId: string = "";
  errorMsg: string | undefined;
  showErrorMsg: boolean | undefined;
  companyID: any = "";
  isResponseEmpty: boolean = false; // True if response is empty, maximized by default
  isJobContainerVisible: boolean = true; // True means form is visible (maximized)
  isJobListing: boolean = true
  allJobList: any[] = [];
  filteredJobs: any;
  companyDetail: any;
  companyNameDetail: any;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private cognitoService: CognitoService, private storage: StorageService, private authService: AuthService,
    private spinner: NgxSpinnerService, private cdr: ChangeDetectorRef, private candidateSrv: CandidateProfileService, private companyListing: CompanyListingService, private formBuilder: FormBuilder
  ) { }

  async ngOnInit() {
    this.initializeForm();

    //extract the compant name from url
    await this.route.url.subscribe(async urlSegments => {
      const fullCategory = urlSegments.map(segment => segment.path).join('/');
      this.companyName = await this.extractCategory(fullCategory);

    });

    await this.getCompanyDetails()


  }
  private extractCategory(fullCategory: string): string {

    // Extract the company name from the URL
    const companyMatch = fullCategory.match(/companies\/(.+)-jobs/);
    return companyMatch ? this.formatCategory(companyMatch[1]) : '';
  }

  private formatCategory(category: string): string {
    // Decode URL components and replace hyphens with spaces
    return decodeURIComponent(category)
      // .replace(/---/g, ' - ') // Handle cases like "cheil---samsung"
      // .replace(/--/g, '-')     // Handle cases like "foo--bar"
      // .replace(/-/g, ' ') // Replace hyphens with spaces
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  toggleJobContainer() {
    this.isJobContainerVisible = !this.isJobContainerVisible; // Toggle visibility
  }

  async getCompanyDetails() {


    this.spinner.show()
    try {
      if (this.companyName.length > 0) {

        // Fetch company details and handle the response
        let response = await this.authService.getCompanyName(this.companyName).toPromise();

        if (response) {


          this.companyDetail = response.data; // Store the company details

          // Remove hyphens from the company name for comparison
          const cleanedCompanyName = this.companyName.replace(/-/g, ' ').toLowerCase();

          this.companyNameDetail = this.companyDetail.filter((job: any) =>
            job.name?.replace(/-/g, ' ').toLowerCase() === cleanedCompanyName
          );
          this.companyDetail = this.companyNameDetail[0]
          this.companyName = this.companyNameDetail[0].name.toLowerCase()
          this.companyID = this.companyDetail.SK.split('#')[1];
          //  console.log( this.companyID,this.companyName )


          await this.getAllJob(); // Fetch jobs
        }


      } else {
        this.spinner.hide();
        this.successmessage = "Something went wrong. Please try again after sometime"
        this.successtitle = "Error"
        this.openModal(ModalType.SUCCESS_MESSAGE)
      }
    } catch (error) {

      this.spinner.hide();
      this.successmessage = "Something went wrong. Please try again after sometime"
      this.successtitle = "Error"
      this.openModal(ModalType.SUCCESS_MESSAGE)
    }

  }

  async getAllJob() {
    try {
      this.spinner.show()
      let response = await this.companyListing.getAllJob();

      if (response) {

        // Ensure that response is an array or extract the array of jobs
        if (Array.isArray(response.data)) {
          this.allJobList = response.data; // If response is already an array
          // Now filter by company name
          await this.filterByCompanyName(this.companyName);



        }
      }
    } catch (error: any) {
      this.spinner.hide()
      if (error.status == 404) {

        this.router.navigate(['/auth/logout']);
      } else {

        this.spinner.hide();
        this.successmessage = "Something went wrong. Please try again after sometime"
        this.successtitle = "Error"
        this.openModal(ModalType.SUCCESS_MESSAGE)
      }
    }




  }

  async filterByCompanyName(companyName: any) {

    if (Array.isArray(this.allJobList) && companyName) {
      // const filteredJobs = this.allJobList.filter((job: any) => 
      //   job.companyDetails?.name?.toLowerCase() === companyName.toLowerCase()
      // );

      // Remove hyphens from the company name for comparison
      const cleanedCompanyName = companyName.replace(/-/g, ' ').toLowerCase();

      this.filteredJobs = this.allJobList.filter((job: any) =>
        job.companyDetails?.name?.replace(/-/g, ' ').toLowerCase() === cleanedCompanyName
      );


      if (this.filteredJobs.length > 0) {

        // Extract company ID and perform further operations
        const companyID = this.filteredJobs[0].companyId;
        this.companyID = companyID;

        // Set the referral form to minimized
        this.isResponseEmpty = false;
        this.isJobContainerVisible = false;
        this.isJobListing = true

        // Fetch jobs by company ID
        await this.getJobByCompanyID();
      } else {

        this.spinner.hide();
        // Maximize the referral form if no jobs are found
        this.isResponseEmpty = true;
        this.isJobContainerVisible = true;
        this.isJobListing = false
      }
    }

  }
  async getJobByCompanyID() {
    try {
      let response = await this.companyListing.getJobByCompanyID(this.companyID)


      if (response.data.length > 0) {
        this.spinner.hide();
        this.jobDetails = response.data
        this.isResponseEmpty = false; // Minimize if there is data
        this.isJobContainerVisible = false; // Start minimized if data exists
        this.isJobListing = true



      } else if (response.data.length === 0) {
        this.spinner.hide();
        this.isResponseEmpty = true; // Maximize if no data
        this.isJobContainerVisible = true; // Start maximized if no data
        this.isJobListing = false


      }
    } catch (error) {

      this.spinner.hide();
      this.successmessage = "Something went wrong. Please try again after sometime"
      this.successtitle = "Error"
      this.openModal(ModalType.SUCCESS_MESSAGE)

    }


  }

  initializeForm(): void {
    this.requestForm = this.formBuilder.group({
      jobUrl: ['', [Validators.required, Validators.pattern('^https:\/\/.*$')]],
      jobDescription: ['', [Validators.required, this.jobDescriptionValidator()]]
    });
  }

  jobDescriptionValidator() {
    return (control: { value: any; }) => {
      const text = control.value || '';
      const keywords = ['experience', 'education', 'skills', 'certifications', 'Preferred Skills', 'job description', 'responsibilities', 'role', 'Employment', 'Department'];

      const containsKeywords = this.countKeywords(text, keywords) >= 5;
      return containsKeywords ? null : { notEnoughKeywords: true };
    };
  }

  countKeywords(text: string, keywords: string[]): number {
    const regex = new RegExp(keywords.join('|'), 'ig');
    const matches = text.match(regex);
    return matches ? matches.length : 0;
  }




  async openReferralPage(): Promise<void> {

    //  event.preventDefault();

    // Step 1: Check if the user is logged in
    this.userLoggedIn = await this.cognitoService.isLoggedIn();

    if (!this.userLoggedIn) {
      // Step 2: If not logged in, show login/signup modal
      this.openModal(ModalType.LOGIN_SIGNUP);
      return;
    }

    // Step 3: If logged in, check profile completion
    await this.handlePostLoginProcess();
  }

  // Function to handle post-login process (check profile and subscription)
  async handlePostLoginProcess(): Promise<void> {

    await this.getProfilePercentage();

    // Step 4: Check if the profile is complete
    if (!this.checkProfileCompletion()) {
      this.profileCompletionRequired = true;
      this.successmessage = "";
      this.successtitle = "";
      this.openModal(ModalType.SUCCESS_MESSAGE); // Profile completion modal
      return;
    }

    // Step 5: If profile is complete, check subscription/referral count
    this.checkRequestReferral();
  }

  checkProfileCompletion(): any {

    if (this.totalPercentage > 60 && this.cvCurPerc !== 0) {
      return true;
    }
    else {
      return false;
    }
  }

  checkRequestReferral(): void {

    if (this.requestForm.valid) {
      this.companyListing.getReferralCount(this.emailAddress).then(async (response) => {
        let count = response.referralCount;

        if (count == 0) {
          this.showsubscriptionPlan = true;
          this.openModal(ModalType.SUCCESS_MESSAGE);

        }
        else {

          this.createRequest();


        }
      }
      ).catch((error: any) => {
        if (error.status == 404) {
          this.router.navigate(['/auth/logout']);
        } else if (error.status == 401) {

          this.router.navigate(['/']);
        } else {

          //console.error('Error:', error);
        }
      });

    }
  }
  upgradeNow() {

    this.router.navigate(['/candidate/subscription'])

  }


  createRequest() {
    let jobUrl = this.requestForm.value.jobUrl;

    // Extract the domain name from the job URL
    let domainName = new URL(jobUrl).hostname;

    // Update the "jobPortal" field with the extracted domain name (e.g., "naukri" from "www.naukri.com")
    let jobPortal = domainName.split('.')[1];

    if (this.companyID) {
      let data = {
        "companyId": this.companyID,
        "jobUrl": this.requestForm.value.jobUrl,
        "jdExtracted": this.requestForm.value.jobDescription,
        "jobId": "",
        "jobPortal": jobPortal,

      }

      this.companyListing.createReferralRequest(this.emailAddress, data).then(async (response) => {
        if (response) {


          if (response.referralRequestId) {

            this.referralRequestId = response.referralRequestId;
            this.showLoading = true;
            this.showReferrelRow = false;
            this.showScore = true;
            this.openModal(ModalType.SUCCESS_MESSAGE);
            // this.getScore(this.referralRequestId);
          }
        }
      }).catch(error => {
        this.handleError(error);
      });
    } else {
      this.successmessage = "job not found"
      this.openModal(this.modalType.SUCCESS_MESSAGE)
    }
  }

  handleResponse() {
    this.requestForm.reset();
  }

  handleError(error: any) {
    this.requestForm.reset();
    switch (error.status) {
      case 400:
        this.showErrorMsg = true;
        this.showReferrelRow = false;
        this.showScore = false;
        this.errorMsg = "You have already requested a referral for this job. Check your dashboard for reference.";
        this.openModal(ModalType.SUCCESS_MESSAGE);
        break;
      case 404:
        this.router.navigate(['/auth/logout']);
        break;
      case 401:
        this.router.navigate(['/']);
        break;
      default:
        console.error('Unexpected Error:', error);
        break;
    }
  }

  okBtn() {
    // this.showErrorMsg = false;
    this.requestForm.reset();
    this.modal.cancel()
    this.onOkBtn.emit();
  }

  cancel() {

    this.modal.cancel();
    this.router.navigate(['/companies']);

  }

  completeProfile() {
    this.closeModal();
    // this.profileCompletionRequired = false;
    this.router.navigate(['/candidate/edit-profile']);
  }

  onModalClose() {
    this.storage.remove("type");
    this.storage.remove("selectedCompanySK");
  }

  //   async receiveDataFromChild(data?: any) {
  //     this.userLoggedIn = await this.cognitoService.isLoggedIn();
  //     this.closeModal();
  //     if (this.userLoggedIn) {
  //       await this.getUserDetails();
  //       await this.getProfilePercentage();
  //       this.navbarComponent.initializeUserSession();

  //   }
  // }

  async receiveDataFromChild(data?: any) {

    // User has successfully logged in
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
    this.closeModal();

    if (this.userLoggedIn) {

      // Step 3: Check profile completion after login
      await this.handlePostLoginProcess();
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

    if (ModalType.LOGIN_SIGNUP) {
      if (this.LoginPageComponent) {
        this.LoginPageComponent.showSignInRow = false;
        this.LoginPageComponent.showAddCompanyScreen = false;
        this.LoginPageComponent.showErrorMessageScreen = false;
        this.LoginPageComponent.showLoginScreen = true
      }
    }
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



  // async openReferralPage(event: Event): Promise<void> {
  //   event.preventDefault();
  //   this.userLoggedIn = await this.cognitoService.isLoggedIn();

  //   // this.storage.set('selectedCompanySK', this?.selectedData?.SK);
  //   // this.storage.set('type', "referral");

  //   // this.triggerReferral = true;
  //   // this.triggerGuidance = false;
  //   // this.triggerAddCompany = false;

  //   if (this.userLoggedIn) {
  //     if (this.checkProfileCompletion()) {
  //       this.openModal(ModalType.SUCCESS_MESSAGE);
  //     }
  //     else {
  //       this.profileCompletionRequired = true;
  //       this.successmessage = "";
  //       this.successtitle = "";
  //       this.openModal(ModalType.SUCCESS_MESSAGE);
  //     }
  //     this.storage.remove("type");    // Removing 'type' and 'selectedCompanySK' from localStorage to prevent the popup from opening automatically on the next page refresh
  //     this.storage.remove("selectedCompanySK");
  //   }
  //   else {
  //     this.userLoggedIn = true
  //     this.openModal(ModalType.LOGIN_SIGNUP);
  //   }
  // }

}
