import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { CorpInviteStatusEnum } from 'src/app/modules/shared/enums/corporate-usr-invt.enum';
import { CorporateUserInviteCreateApiDto, CorporateUserInviteCreateDto, CorporateUserInviteUpdateApiDto } from 'src/app/modules/shared/interfaces/corporate-usr-invite.interface';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { AuthService } from 'src/app/modules/worko/services/auth.service';

@Component({
  selector: 'app-create-user-for-corporate',
  templateUrl: './create-user-for-corporate.component.html',
  styleUrls: ['./create-user-for-corporate.component.scss']
})
export class CreateUserForCorporateComponent {
  // Invite-details
  inviteDetails = {} as CorporateUserInviteCreateDto;

  // FrontEnd Variables
  isBlinking = true;
  blinkTimer: any; //timer reference
  currentWordIndex = 0;
  EmployeeWords = ["Reward", "Sell Services", "Earn Money", "Priority Job Access"];
  currentWord = '';

  userForm: FormGroup;

  // Modal Variables
  @ViewChild(ModalComponent) modal!: ModalComponent;
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
  isLoggedIn: boolean = false;
  currentLoggedInUser: string = "";
  redirectModalType: string = "error";

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private amplify: CognitoService,
  ) {
    this.userForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        accessType: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        companyName: ['', Validators.required],
        phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
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
        retypePassword: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator() } // Apply the custom validator
    );
  }


  ngOnDestroy() {
    this.clearBlinkTimer();

    // Clear the interval to prevent memory leaks
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

 async  ngOnInit() {

    // Ckeck If the user is already logged in
    this.isLoggedIn = await this.amplify.isLoggedIn();

    // If the user is already logged in, log them out
    if(this.isLoggedIn) {
      this.amplify.handleSignOut()
    }
    
    // start the blinking animation in the form container text
    this.blinkAndChangeWord()

    //  Fetch the invite details from the local storage
    this.fetchInviteDetails();

  }


  // Fetch the invite details from the local storage\
  async fetchInviteDetails() {
    try {
      this.spinner.show();
      const inviteId = this.route.snapshot.paramMap.get('inviteId');
      if (!inviteId) {
        throw new Error("Invite ID not found in the URL");
      }

      const response = await this.authService.getInviteById(inviteId);
      if (response) {
        this.inviteDetails = response; // Assign the first object
        console.log('Fetched Invite Details:', this.inviteDetails); // Log for debugging
      
        this.updateForm(this.inviteDetails); // Populate the form with data
        
        // check if the invitation that we got has expired or not
        this.inviteDetails.inviteStatus === CorpInviteStatusEnum.EXPIRED ? this.openModal(ModalType.CORPORATE_USER_INVITE_EXPIRED) : null;

      }
    } catch (error: any) {
      this.spinner.hide();
      if (error.status === 404 || error.status === 401) {
        this.redirectTitle = "Invalid Invite";
        this.modalSize = "lg";
        this.redirectMessage = "Oops! The invite you are trying to access is not valid. Please contact the company administrator for a new invite.";
      
        this.openModal(ModalType.CORPORATE_USER_INVITE_REDIRECT);
        this.startCountdown('home');
      } else {
        this.modalSize = "md";
        this.errorMessage = "Something went wrong. Please try again later.";
        this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
      }
    } finally {
      this.spinner.hide();
    }
  }

  /**
   * Update Form Values
   */
  updateForm(inviteDetails: any): void {
    console.log('Invite Details:', inviteDetails);
    this.userForm.patchValue({
      firstName: inviteDetails.firstName,
      lastName: inviteDetails.lastName,
      email: inviteDetails.email,
      companyName: inviteDetails.companyName,
      accessType: inviteDetails.corporateUserType
    });
  }
  // Check if the current form is invalid or not

  // Validation function for common and specific checks
  isInvalid(controlName: string): boolean {
    const control = this.userForm.get(controlName);

    if (!control) {
      return false;
    }
    // Common validation: control should be invalid and touched/dirty
    return control.invalid && (control.dirty || control.touched);
  }
  /**
   * Custom Validator for Password Match
   */
  passwordMatchValidator() {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('password')?.value;
      const retypePassword = formGroup.get('retypePassword')?.value;
  
      return password && retypePassword && password !== retypePassword
        ? { mismatch: true }
        : null;
    };
  }

  getErrorMessage(controlName: string): string | null {
    const control = this.userForm.get(controlName);

    // Check if the control is invalid and touched/dirty
    if (this.isInvalid(controlName)) {
      // Check and return specific validation error messages
      if (control?.errors) {
        if (control.errors["required"]) {
          return "This field is required";
        }
        if (control.errors["pattern"]) {
          return "Invalid format";
        }
        if (control.errors["minlength"]) {
          return `Minimum length is ${control.errors["minlength"].requiredLength} characters`;
        }
        // Check for the Password Match
        if (this.userForm.hasError('mismatch') && controlName === 'retypePassword') {
          return 'Passwords do not match.';
        }
      }
    }

    return null;
  }


  /**
 * Form Submission Handler
 */
  async onSubmit(): Promise<void> {
    this.spinner.show(); // Ensure spinner is shown at the start

    try {
      if(
        this.inviteDetails.inviteStatus === CorpInviteStatusEnum.EXPIRED ||
        this.inviteDetails.inviteStatus === CorpInviteStatusEnum.DELETED 
      ) {
        this.openModal(ModalType.CORPORATE_USER_INVITE_EXPIRED);
        return;
        };
        if(
          this.inviteDetails.inviteStatus === CorpInviteStatusEnum.ACCEPTED){
            this.errorMessage = "Invite has already been accepted";
            this.modalSize = "md";
            this.modalTitle = "Error";
            this.openModal(ModalType.SUCCESS_ERROR_MESSAGE)
            return;
          }

      const signupData = {
        password: this.userForm.get('password')?.value,
        username: this.userForm.get('email')?.value.toLowerCase(),
        name: `${this.userForm.get('firstName')?.value} ${this.userForm.get('lastName')?.value}`,
        phone_number: "+91" + this.userForm.get('phoneNumber')?.value
      };

      const { response, error } = await this.amplify.handleSignUp(signupData);
      if (error) {
        // Throw error to be caught in the catch block
        throw new Error(error.message);
      }

      if (response) {
        // Successful sign-up handling
        this.userId = response.userId;

        const requestPayload = this.prepareDataforDB(signupData, response.userId);

        const DBResponse = await this.authService.createCorporateUser(requestPayload);
        if (DBResponse) {
          this.modalMessage = "Sign-up successful! Please check your email to verify your account.";
          this.redirectModalType = "success"
          this.redirectTitle = "Sign-Up Successful";
          this.modalSize = "md";
          this.redirectMessage = "Your Account has been created successfully \u{1F389} .";

          this.openModal(ModalType.CORPORATE_USER_INVITE_REDIRECT);
          this.startCountdown('login');
        }
      }

    } catch (error: any) {
      this.spinner.hide();
      // Handle specific errors
      if(error.message === 'Invite has expired') {
        this.openModal(ModalType.CORPORATE_USER_INVITE_EXPIRED)
      }
      if (error.message === 'User already exists') {
        this.errorMessage =
          "It looks like you already have an account with us. Please log in to continue. If you’ve forgotten your password, use the 'Forgot Password' link to reset it.";
        this.modalSize = "lg";
        this.modalTitle = "User Already Exists";
      } else {
        this.errorMessage = "An error occurred during sign-up. Please try again later.";
        this.modalSize = "md";
        this.modalTitle = "Sign-Up Error";
      }
      this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
    } finally {
      this.redirectModalType = "error";
      this.spinner.hide(); // Ensure spinner is hidden in all cases
    }
  }

  /**
   * Prepare Form Data for Submission
   */
  private prepareDataforDB(signupData: any, cognitoId: string): any {
    return {
      cognitoUserId: cognitoId, // This is the cognito id of the user
      companyId: this.inviteDetails.companyId,
      email: this.inviteDetails.email,
      inviteId: this.inviteDetails.id,
      firstName: this.userForm.get('firstName')?.value,
      lastName: this.userForm.get('lastName')?.value,
      corporateUserType: this.inviteDetails.corporateUserType,
    }
  }

  /**
   * renewInviteRequest
   * 
   * Generate request for the re-invitation of the user
   */
  async renewInviteRequest(): Promise<void> {
    try {
      this.spinner.show();

      // Prepare the data for the request
      const updateData: CorporateUserInviteUpdateApiDto = {
        renewInvite: true
      };

      const response = await this.authService.renewInviteRequest(this.inviteDetails.id, updateData);
      if (response) {
        this.redirectTitle = "Invite Renewed";
        this.modalSize = "md";
        this.redirectMessage = "Your Invite request has been sent successfully \u{1F389} .";

        this.openModal(ModalType.CORPORATE_USER_INVITE_REDIRECT);
        this.startCountdown('home');
      }
    } catch (error: any) {
      console.log('Error:', error);
    }
    finally {
      this.spinner.hide();
    }
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
  startCountdown(route: string): void {
    if (!this.countdownStarted) {
      this.countdownStarted = true;

      this.countdownInterval = setInterval(() => {
        this.timer--;
      }, 1000);

      setTimeout(() => {
        console.log('Redirecting to login page...');
        this.closeModal();
        if (route === 'home') {
          this.router.navigate(['/']); // Redirects to home or login page
        }
        else {
          this.router.navigate([`/auth/corporate/login`]); // Redirects to home or login page
        }
      }, 5000);
    }
  }

}
