import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fetchAuthSession, getCurrentUser } from '@aws-amplify/auth';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { CorpInviteStatusEnum } from 'src/app/modules/shared/enums/corporate-usr-invt.enum';
import { CorporateUserInviteCreateApiDto, CorporateUserInviteCreateDto, CorporateUserInviteUpdateApiDto } from 'src/app/modules/shared/interfaces/corporate-usr-invite.interface';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { AuthService } from 'src/app/modules/worko/services/auth.service';

@Component({
  selector: 'app-login-user-for-corporate',
  templateUrl: './login-user-for-corporate.component.html',
  styleUrls: ['./login-user-for-corporate.component.scss']
})
export class LoginUserForCorporateComponent {
 // Invite-details
 inviteDetails = {} as CorporateUserInviteCreateDto ;

 // FrontEnd Variables
 isBlinking = true;
 blinkTimer: any; //timer reference
 currentWordIndex = 0;
 EmployeeWords = ["Reward", "Sell Services", "Earn Money", "Priority Job Access"];
 currentWord = '';

 userLoginForm: FormGroup;

 // Modal Variables
 @ViewChild(ModalComponent) modal!: ModalComponent;
 @Output() onSuccess: EventEmitter<void> = new EventEmitter<void>();
 modalType = ModalType;
 showModal: ModalType | undefined;
 modalMessage: string = "";
 modalTitle: string = "";

 // Redirect Timer
 timer: number = 5;
 countdownInterval: any; // Holds the interval reference
 countdownStarted: boolean = false; // Track if countdown has started


 // Properties related to modal messages
 successtitle: string = "";
 redirectTitle: string = "";
 modalSize: string = "";
 errorMessage = "";
 redirectMessage = "";
 errorTitle = "Error";
 userId: any;
confirmationEmail: any;
currentLoggedInUser: any;
currentUserSessionToken: any;
forgotPasswordScreen: boolean = false;


 constructor(
   private router: Router,
   private fb: FormBuilder,
   private route: ActivatedRoute,
   private http: HttpClient,
   private authService: AuthService,
   private spinner: NgxSpinnerService,
   private cdr: ChangeDetectorRef,
   private amplify: CognitoService, 
   private storage: StorageService,
 ) {
   this.userLoginForm = this.fb.group(
     {
       email: ['', [Validators.required, Validators.email]],
       password: [
         '',
         [
           /** 
           * Password Policy: Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
           * @see {AmazonCognito>Userpools>worko>Authentication_methods} at AWS Console
           */
           Validators.required,
           Validators.minLength(8),
           Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/)
         ]
       ],
     }
   );    
 }


 ngOnDestroy() {
   this.clearBlinkTimer();

   // Clear the interval to prevent memory leaks
   if (this.countdownInterval) {
     clearInterval(this.countdownInterval);
   }
 }

 ngOnInit() {

    this.currentUserSessionToken = this.amplify.getAccessToken();
    this.currentLoggedInUser = this.storage.get('cognitoUserId');
    window.alert('UserType is :'+ this.currentLoggedInUser );

    // Ckeck If the user is already logged in
    this.isUserLoggedIn();

   // start the blinking animation in the form container text
   this.blinkAndChangeWord()
 }

 
  // Check if the user is already logged in
  isUserLoggedIn() {
    if (this.currentLoggedInUser === 'Corporate' && this.currentUserSessionToken) {
      this.router.navigate(['/corporate/cJobs']);
    } else if (this.currentUserSessionToken) {
      this.router.navigate(['/']);
    }
  }

   // Validation function for common and specific checks
   isInvalid(controlName: string): boolean {
     const control = this.userLoginForm.get(controlName);
 
     if (!control) {
       return false;
     }
     // Common validation: control should be invalid and touched/dirty
     return control.invalid && (control.dirty || control.touched);
   }

   getErrorMessage(controlName: string): string | null {
     const control = this.userLoginForm.get(controlName);
 
     // Check if the control is invalid and touched/dirty
     if (this.isInvalid(controlName)) {
       // Check and return specific validation error messages
       if (control?.errors) {
         if (control.errors["required"]) {
           return "This field is required";
         }
         if (control.errors["pattern"]) {
           return "Invalid format , allowed symbols [.,?!-'\"]";
         }
         if (control.errors["minlength"]) {
           return `Minimum length is ${control.errors["minlength"].requiredLength} characters`;
         }
         // Check for the Password Match
         if (control.errors["passwordsMismatch"] && controlName === 'retypePassword') {
           return "Passwords do not match";
         }
       }
     }
 
     return null;
   }
   async currentSession() {
    await this.amplify.removeAccessToken()
    try {
      // const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
      //const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
      const response = await fetchAuthSession({ forceRefresh: true })

      await this.amplify.setAccessToken()
      const authToken = response.tokens?.idToken?.toString();
      // console.log(accessToken, "Acces");

    } catch (err) {
      // console.log(err);
    }
  }

  async currentAuthenticatedUser() {
    try {
      const { signInDetails } = await getCurrentUser();

      if (signInDetails) {
        // console.log('The signInDetails:', signInDetails);
      } else {
        //console.log('No signInDetails available.');
      }
    } catch (err) {
      console.error('Error fetching current authenticated user:', err);
    }
  }

   /**
  * Form Submission Handler
  */
   async onSubmit(): Promise<void> {
    if (this.userLoginForm.invalid) return; // Prevent submission if form is invalid

    this.spinner.show();
    const loginData = {
      email: this.userLoginForm.get('email')?.value,
      password: this.userLoginForm.get('password')?.value,
    };

    try {
      let login = await this.amplify.handleSignIn(loginData);
      debugger;
      if (login?.response?.isSignedIn) {
        // Fetch user profile after successful sign-in
        const response = await this.authService.getCorporateUser(loginData.email.toLowerCase());

        this.onLoginSuccess(response);
      }
    } catch (error) {
      this.spinner.hide();
      console.log(error)
    }
  }

  private async onLoginSuccess(response: any): Promise<void> {
    debugger;
    const userType = response.data?.lastAccessedDash ?? 'Corporate'; //CORP emp
    const userName = response.data?.name;
    window.alert('UserType is :'+ this.storage.get('userId') );
    this.storage.set('lastAccessedDash', userType);
    this.storage.set('userName', userName);

    await this.currentSession();
    await this.currentAuthenticatedUser();
    //worko user>> emp CORP
    this.onSuccess.emit(userType);
 
    this.spinner.hide();
    debugger;
    this.router.navigate([userType === 'Corporate' ? '/corporate/cJobs' : '/']);
  }

  setSuccessMessage(arg0: string) {
    throw new Error('Method not implemented.');
  }
   /**
    * Prepare Form Data for Submission
    */
   private prepareFormData(): any {
     const { password, email,name,phoneNumber } = this.userLoginForm.value;
     return {
     username: email.toLowerCase(),
       password,
       name,
       phone_number: `+91${phoneNumber}`
     };
   }


 
 // Modal Functions
 openModal(modalType: ModalType, message: string = "", title: string = ""): void {
   this.showModal = modalType;
   // Reset modal size every time you open the modal
   if (modalType === this.modalType.SUCCESS_MESSAGE) {
     this.modalSize = "md";
   }
   this.cdr.detectChanges();
   this.modalMessage = message;
   this.modalTitle = title;
   this.modal.open();
 }

 // Closes the currently opened modal
 closeModal(): void {
   this.resetModal();
   this.modal.cancel();
 }

 // Opens the job Form modal
 openModalone(): void {
   this.openModal(ModalType.ADMINJOBS_POPUP);
 }
 // Modal Functions End Here

 // Reset the job Form modal
 resetModal(): void {
   
 }

 // Forgot Password section starts here
 initiateFpScreen(): void {
  this.forgotPasswordScreen = true;
}

 // Css functions for the blinking animation
 blinkAndChangeWord() {
   const words = this.EmployeeWords;
   this.currentWord = words[this.currentWordIndex];
   this.isBlinking = false;

   this.blinkTimer = setTimeout(() => {
     this.isBlinking = true;
     this.currentWordIndex = (this.currentWordIndex + 1) % words.length;
     this.blinkAndChangeWord();
   }, 3000); // timeout based on our animation duration
 }
 clearBlinkTimer() {
   if (this.blinkTimer) {
     clearTimeout(this.blinkTimer);
   }
 }


 // Redirect to the worko page
 startCountdown(): void {
   if (!this.countdownStarted) {
     this.countdownStarted = true;
     
     this.countdownInterval = setInterval(() => {
       this.timer--;
     }, 1000);

     setTimeout(() => {
       console.log('Redirecting to login page...');
       this.closeModal();
       this.router.navigate(['/']); // Redirects to home or login page
     }, 5000);
   }
 }
}
