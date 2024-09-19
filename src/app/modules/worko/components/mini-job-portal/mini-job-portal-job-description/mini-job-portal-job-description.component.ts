import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyListingService } from '../../../services/company-listing.service';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { LoginPageComponent } from '../../login-page/login-page.component';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { CandidateProfileService } from 'src/app/modules/candidate/services/candidate-profile.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';

@Component({
  selector: 'app-mini-job-portal-job-description',
  templateUrl: './mini-job-portal-job-description.component.html',
  styleUrls: ['./mini-job-portal-job-description.component.scss']
})
export class MiniJobPortalJobDescriptionComponent {

  @ViewChild(ModalComponent) modal!: ModalComponent;
  @ViewChild(LoginPageComponent) LoginPageComponent!: LoginPageComponent;
  @ViewChild(NavbarComponent) navbarComponent!: NavbarComponent;
  companyName!: string;
  jobDescription!: string;
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
  userName: any;
  letter: any;
  constructor(private route: ActivatedRoute, private router: Router, private cognitoService: CognitoService, private http: HttpClient,
    private companyListing: CompanyListingService, private cdr: ChangeDetectorRef, private candidateSrv: CandidateProfileService, private storage: StorageService) { }

  ngOnInit(): void {
    this.route.url.subscribe(urlSegments => {
      const fullCategory = urlSegments.map(segment => segment.path).join('/');
      this.companyName = this.extractCompanyName(fullCategory);
      this.jobDescription = this.extractJobDescription(fullCategory);
    });
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
  private extractCompanyName(fullCategory: string): string {
    // Extract the company name from the URL
    const companyMatch = fullCategory.match(/companies\/([^-]+(?:-[^-]+)*)-jobs/);;
    return companyMatch ? this.formatCategory(companyMatch[1]) : '';
  }

  private extractJobDescription(fullCategory: string): string {
    // Extract the job description from the URL
    const jobDescriptionMatch = fullCategory.match(/-jobs\/(.+)/);
    return jobDescriptionMatch ? this.formatCategory(jobDescriptionMatch[1]) : '';
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

    //if (this.requestForm.valid) {
    this.companyListing.getReferralCount(this.emailAddress).then(async (response) => {

      let count = response.referralCount;

      if (count == 0) {
        this.showsubscriptionPlan = true;

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


  createRequest() {
    debugger
    let jobUrl=''
    let jobDescription=""
    if (this.companyID) {
      let data = {
        "companyId": this.companyID,
        "jobUrl":jobUrl ,
        "jdExtracted":jobDescription
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
    this.modal.cancel()
    //this.onOkBtn.emit();
  }

  cancel() {
    this.modal.cancel();
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

}
