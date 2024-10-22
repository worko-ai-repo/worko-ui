import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyListingService } from '../../../services/company-listing.service';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';

import { NavbarComponent } from '../../navbar/navbar.component';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { CandidateProfileService } from 'src/app/modules/candidate/services/candidate-profile.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginFormComponent } from '../../login-form/login-form.component';
import { ReferralProgressBarComponent } from '../../referral-progress-bar/referral-progress-bar.component';

@Component({
  selector: 'app-mini-job-portal-job-description',
  templateUrl: './mini-job-portal-job-description.component.html',
  styleUrls: ['./mini-job-portal-job-description.component.scss']
})
export class MiniJobPortalJobDescriptionComponent {

  @ViewChild(ModalComponent) modal!: ModalComponent;
  @ViewChild(LoginFormComponent) loginFormComponent!: LoginFormComponent
  @ViewChild(ReferralProgressBarComponent) referralProgressBarComponent!: ReferralProgressBarComponent;
  @ViewChild(NavbarComponent) navbarComponent!: NavbarComponent;
  companyName!: string;
  jobID!: string;
  showSubscription: boolean = false;
  showReferrelRow: boolean = true;
  showContent: boolean = true;
  showLoading: boolean = false;
  showScore: boolean = false;
  matchingScore: number = 0;
  referralRequestId: string = "";
  errorMsg: string | undefined;
  showErrorMsg: boolean | undefined;
  companyID: any = "";
  userLoggedIn: boolean = false;
  profileCompletion: any;
  jobClosed: any
  cvCurPerc: any;
  totalPercentage: any;
  profileCompletionRequired: boolean = false;
  successMessage: string = "";
  successTitle: string = "";
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  emailAddress: any;
  userDetails: any;
  showsubscriptionPlan: boolean = false;
  userName: any;
  letter: any;
  jobDescriptionDetails: any;
  otherJobDetails: any[] = [];
  showFeedback!: boolean;
  isShowCloseButton: boolean = true;
  modalSize: string = 'lg';

  constructor(private route: ActivatedRoute, private router: Router, private cognitoService: CognitoService, private http: HttpClient,
    private spinner: NgxSpinnerService, private companyListing: CompanyListingService, private cdr: ChangeDetectorRef, private candidateSrv: CandidateProfileService, private storage: StorageService) { }

  async ngOnInit(): Promise<void> {
    this.route.url.subscribe(urlSegments => {
      const fullCategory = decodeURIComponent(urlSegments.map(segment => segment.path).join('/')); // Decode the URL
      // this.companyName = this.extractCompanyName(fullCategory);
      this.jobID = this.extractJobID(fullCategory); // Extract the job ID if needed
    });
    await this.getJobDescriptionDetails(this.jobID);
  }

  private extractCompanyName(fullCategory: string): string {
    // Extract and decode the company name from the URL
    const companyMatch = fullCategory.match(/companies\/([^-]+(?:-[^-]+)*)-jobs/);
    return companyMatch ? decodeURIComponent(companyMatch[1]).replace(/-/g, ' ') : ''; // Replace dashes with spaces
  }

  private extractJobID(fullCategory: string): string {
    // Extract the job ID from the URL
    const jobIDMatch = fullCategory.match(/-jobs\/.+-([A-Za-z0-9]+)$/);
    return jobIDMatch ? jobIDMatch[1] : ''; // Return the job ID
  }


  async initializeUserSession() {
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
    if (this.userLoggedIn) {
      this.userName = this.storage.get('userName');

      // this.letter=this.getInitials(this.userName)
      // console.log(this.letter);
      this.letter = this.userName.charAt(0).toUpperCase();
    }
  }

  private formatCategory(category: string): string {
    // Decode URL components and replace hyphens with spaces
    return decodeURIComponent(category)
      .replace(/-/g, ' ') // Replace hyphens with spaces
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  async handleRequestReferral() {

    // Check if the job is  published 
    if (this.jobDescriptionDetails.status === 'PUBLISHED') {
      this.handleLogin()

    } else {
      this.isShowCloseButton = false
      this.modalSize = 'md'
      this.jobClosed = true;
      this.openModal(ModalType.SUCCESS_MESSAGE)
     
    }


  }
  async handleLogin() {
    // Step 2: Check if the user is logged in
    this.userLoggedIn = await this.cognitoService.isLoggedIn();

    if (!this.userLoggedIn) {
      // Step 3: If not logged in, show login/signup modal
      this.openModal(ModalType.LOGIN_SIGNUP);
      return;
    }

    // Step 4: If logged in, check profile completion
    await this.handlePostLoginProcess();
  }

  // Function to handle post-login process (check profile and subscription)
  async handlePostLoginProcess(): Promise<void> {

    await this.getProfilePercentage();

    // Step 5: Check if the profile is complete
    if (!this.checkProfileCompletion()) {
      this.profileCompletionRequired = true;
      this.isShowCloseButton = false
      this.successMessage = "";
      this.successTitle = "";
      this.openModal(ModalType.SUCCESS_MESSAGE); // Profile completion modal
      return;
    }

    // Step 6: If profile is complete, check subscription/referral count
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

    //if (this.requestForm.valid) {
    this.companyListing.getReferralCount(this.emailAddress).then(async (response) => {

      let count = response.referralCount;

      if (count == 0) {
        this.isShowCloseButton = false
        this.showsubscriptionPlan = true;
        this.openModal(ModalType.SUCCESS_MESSAGE);

      }
      else {

        this.createRequest();
        // this.requestForm.reset();

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

    //}
  }
  upgradeNow() {

    this.router.navigate(['/candidate/subscription'])

  }

  stripHtmlTags(html: string): string {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;
    return tempElement.innerText || tempElement.textContent || '';
  }

  // Function to concatenate job description and skills
  async getFormattedJobDescription(jobDetails: any) {

    //convert job Description from HTML to Plain Text
    const jobDescriptionPlainText = await this.stripHtmlTags(jobDetails.jobDescription || '');

    // Extract the job title, with a fallback in case it's not provided
    const jobTitle = jobDetails.jobTitle || 'Job Title not specified';

    // Combining all the skills arrays into a single array
    let allSkills = [
      ...(jobDetails.technicalSkills || []),
      ...(jobDetails.coreSkills || []),
      ...(jobDetails.softSkills || []),
      ...(jobDetails.mislaneiousSkills || [])
    ].join(', ');  // Joining all skills with a comma and space

    // Extracting experience range
    let experience = `${jobDetails.experienceRange?.min} - ${jobDetails.experienceRange?.max} years of experience`;
    // console.log(experience)

    // Construct the jdExtracted field with job description and skills
    let jdExtracted = `
    ${jobDescriptionPlainText}
    \n Job Title: ${jobTitle}
     \n\nExperience Required: ${experience}
    \n\nSkills Required: ${allSkills}
  `;

    return jdExtracted.trim();  // Return the concatenated job description and skills
  }

  async createRequest() {
    this.spinner.show()

    if (this.jobDescriptionDetails.companyId) {
      let data = {
        "companyId": this.jobDescriptionDetails.companyId,
        "jobUrl": window.location.href,
        //"jdExtracted": this.jobDescriptionDetails.jobDescription 
        "jdExtracted": await this.getFormattedJobDescription(this.jobDescriptionDetails),
        "jobId": this.jobDescriptionDetails.id,
        "jobPortal": 'worko',

      }

      this.companyListing.createReferralRequest(this.emailAddress, data).then(async (response) => {
        if (response) {


          if (response.referralRequestId) {
            this.spinner.hide()

            this.referralRequestId = response.referralRequestId;
            this.showLoading = true;
            this.showReferrelRow = false;
            this.showFeedback = false;
            this.showScore = true;
            this.openModal(ModalType.SUCCESS_MESSAGE);
            // this.getScore(this.referralRequestId);
          }
        }
      }).catch(error => {
        this.handleError(error);
      });
    } else {
      this.successMessage = "job not found"
      this.openModal(this.modalType.SUCCESS_MESSAGE)
    }
  }

  getScore(referralRequestId: string) {
    this.companyListing.getMatchingScore(this.emailAddress, referralRequestId).then(async (response) => {
      if (response) {
        this.matchingScore = response.matchingScore;
        this.showLoading = false;
        this.showScore = true;
        this.openModal(ModalType.SUCCESS_MESSAGE);
      }
    })
      .catch(error => {
        if (error.status == 404) {
          this.router.navigate(['/auth/logout']);
        } else if (error.status == 401) {

          this.router.navigate(['/']);
        }
        // console.error('Create Employee Error:', error);
      });
  }

  handleError(error: any) {
    this.spinner.hide()
    switch (error.status) {

      case 403:
        this.showErrorMsg = true;
        this.showReferrelRow = false;
        this.showScore = false;
        this.isShowCloseButton = false
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
        this.isShowCloseButton = false
        this.modalSize = 'md'
        this.successMessage = "Something went wrong. Please try again after sometime"
        this.successTitle = "Error"
        this.openModal(ModalType.SUCCESS_ERROR_MESSAGE)
        break;
    }
  }

  okBtn() {
    // this.showErrorMsg = false;

    this.modal.cancel()
    this.router.navigate(['/candidate/referral']);
    //this.onOkBtn.emit();
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

  async receiveDataFromChild(data?: any) {

    // User has successfully logged in
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
    this.navbarComponent.initializeUserSession();
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

  async getJobDescriptionDetails(jobID: any) {
    this.spinner.show();
    try {
      if (jobID) {

        let response = await this.companyListing.getJobByJobID(jobID)
        if (response) {
          this.spinner.hide();
          this.jobDescriptionDetails = response[0];
          this.companyName = this.jobDescriptionDetails.companyDetails.name.toLowerCase();
          this.getJobByCompanyId(this.jobDescriptionDetails.companyId, jobID);

          // // Check if the job is published
          // if (this.jobDescriptionDetails.status === 'PUBLISHED') {
          //   this.companyName = this.jobDescriptionDetails.companyDetails.name.toLowerCase();
          //   this.getJobByCompanyId(this.jobDescriptionDetails.companyId, jobID);
          // } else {

          //   this.isShowCloseButton = false
          //   this.modalSize = 'md'
          //   this.jobClosed=true;
          //   this.openModal(ModalType.SUCCESS_MESSAGE)
          // }

        }

      }
    } catch (error:any) {
      this.spinner.hide();
      if(error.status===404){
        this.isShowCloseButton = false
        this.modalSize = 'md'
        this.jobClosed = true;
        this.openModal(ModalType.SUCCESS_MESSAGE)

      }else{
   
      this.isShowCloseButton = false
      this.modalSize = 'md'
      this.successMessage = "Something went wrong. Please try again after sometime"
      this.successTitle = "Error"
      this.openModal(ModalType.SUCCESS_ERROR_MESSAGE)
      }
    }

  }

  // to get other jobs which was lisited for same company name
  async getJobByCompanyId(companyID: any, currentJobID: any) {
    this.spinner.show();
    try {
      let response = await this.companyListing.getJobByCompanyID(companyID);
      this.spinner.hide();

      if (response.data) {
        // Filter out the current job listing
        this.otherJobDetails = response.data.filter((job: { id: any; }) => job.id !== currentJobID);
      }
    } catch (error) {
      this.spinner.hide();
      this.isShowCloseButton = false
      this.modalSize = 'md'
      this.successMessage = "Something went wrong. Please try again after sometime";
      this.successTitle = "Error";
      this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
    }
  }





  onModalClose() {
    this.showFeedback = false
    this.showScore=false;
    this.profileCompletionRequired=false;
    this.showsubscriptionPlan=false
    this.showErrorMsg=false
    this.showReferrelRow=false
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
      if (this.loginFormComponent) {
        this.loginFormComponent.showSignInRow = false;
        this.loginFormComponent.showAddCompanyScreen = false;
        this.loginFormComponent.showErrorMessageScreen = false;
        this.loginFormComponent.showLoginScreen = true
      }
    }
    if (this.referralProgressBarComponent) {
      this.referralProgressBarComponent.showFeedback = false;
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

}
