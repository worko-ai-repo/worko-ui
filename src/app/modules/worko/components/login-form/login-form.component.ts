import { Component, EventEmitter, Output, ViewChild, AfterViewInit, OnDestroy, Input, ElementRef, HostListener, SimpleChanges, ViewChildren, QueryList } from '@angular/core';
// import { CognitoService } from 'src/app/modules/services/cognito.service';


import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { NgxSpinnerService } from 'ngx-spinner';
// import { getCurrentUser, fetchAuthSession  } from 'aws-amplify/auth';

// import { map, startWith } from 'rxjs/operators';
// import { NgFor, AsyncPipe } from '@angular/common';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
// import { MatInputModule } from '@angular/material/input';
// import { MatFormFieldModule } from '@angular/material/form-field';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, NgForm, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
// import { delay } from 'rxjs/operators';
// import { of } from 'rxjs';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { debounceTime, distinctUntilChanged, switchMap, filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { CognitoService } from '../../../services/cognito.service';
import 'aws-amplify/auth/enable-oauth-listener';
import { Hub } from 'aws-amplify/utils';
import { ConfirmResetPasswordInput, fetchDevices, ResetPasswordOutput, confirmResetPassword, fetchAuthSession, getCurrentUser, rememberDevice, resetPassword, FetchDevicesOutput, confirmSignUp, fetchUserAttributes, ResendSignUpCodeInput, } from '@aws-amplify/auth';
import { event } from 'jquery';
import { CompanyListingService } from '../../services/company-listing.service';
import { NavbarToggleSwitchService } from 'src/app/modules/candidate/services/navbar-toggle-switch.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
declare var bootstrap: any;

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements AfterViewInit, OnDestroy {

  @Output() userTypeSelected = new EventEmitter<string>();
  @Output() onSuccess: EventEmitter<void> = new EventEmitter<void>();
  @Input() userType: any;
  @Input() userLoggedInData: any
  @Input() isApplyBtnClicked = false;
  @ViewChild('company')
  companyFormDirective!: NgForm;
  @ViewChild('candidate')
  candidateFormDirective!: NgForm;
  @ViewChild('employee')
  employeeFormDirective!: NgForm;

  @ViewChild(ModalComponent) modal!: ModalComponent;
  // @ViewChild('autocompleteInput') autocompleteInput: any; 
  @ViewChild('autoCompleteInput', { static: false, read: MatAutocompleteTrigger }) trigger!: MatAutocompleteTrigger;
  @ViewChild('codeInput') codeInputRef!: ElementRef;
  myControl = new FormControl<any>('');
  filteredOptions!: Observable<any[]>;
  allOptions: any[] = [];
  selectedUserType: string = 'candidate'; // Default to 'candidate'
  showSignInRow: boolean = false; //default to 'login'
  isCandidateEmailVerified: boolean = false;
  isEmployeeEmailVerified: boolean = false;
  confirmationCodeScreen: boolean = false;
  confirmationEmail: string = '';
  displayResetPassword: boolean = false;
  acceptedTermsAndConditions: boolean = false;
  resetVerificationScreen: boolean = false;
  successPasswordMessage: boolean = false;
  isDivOpen: boolean = false;
  isDivClose: boolean = true
  hideDiv: boolean = true
  errorMessage: string = "";
  fileErr: string = "";
  CandidateWords = ["Referral", "Career Guidance", "Interview Mentorship", "Mock Interview"];
  EmployeeWords = ["Reward", "Sell Services", "Earn Money", "Priority Job Access"];
  currentWordIndex = 0;
  currentWord = '';
  isBlinking = true;
  blinkTimer: any; //timer reference
  rememberMe: boolean = false
  // checkboxChecked:boolean=false;
  agreeTerms: boolean = false;
  auto: any;
  codeErrorScreen: boolean = false;

  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  showAddCompanyScreen: boolean = false;
  showErrorMessageScreen: boolean = false;
  companyNameError: string = '';
  form = {
    email: '',
    password: ''
  };
  fileToUpload: File | null = null;
  candidateForm = {
    name: '',
    emailId: '',
    password: '',
    candidateOtp: '',
    // linkdinProfile: '',
    // experience: '',
    // expectedCtc: '',
    phoneNumber: '',
    confirmPassword: '',
    checkboxChecked: false,
    acceptedTermsAndConditions: false


  }
  employeeForm = {
    name: '',
    emailId: '',
    companyName: '',
    phoneNumber: '',
    companyEmailID: '',
    employeeOtp: '',
    linkdinProfile: '',
    experience: '',
    department: '',
    designation: '',
    confirmPassword: '',
    password: '',
    designationTag: '',
    companySK: "",
    agreeTerms: false,
    acceptedTermsAndConditions: false,


  }
  fileString: string = "";
  verificationForm = {
    code: '',

  }
  resetForm = {
    emailId: '',
    code: '',
    confirmPassword: '',
    password: '',
  }
  hoveredField: string | null = null;
  companyData: any = [];
  form1: any;
  designationTagList: any = [
    {
      name: "Assistant Manager / Team Lead",
      value: "1"
    },
    {
      name: "Manager / Sr. Manager",
      value: "5"
    },
    {
      name: "Asst. GM / GM",
      value: "10"
    },
    {
      name: "Asst. Director / Director",
      value: "15"
    },
    {
      name: "Sr. Director / AVP",
      value: "20"
    },
    {
      name: "VP / CXO",
      value: "25"
    },
  ]
  selectedCompany: any; // Update the type based on your data structure
  userId: string = "";
  fileName: string = "";
  fileType: string = "";
  uploadedCvName: string = "";
  companyName: string = "";
  companySK: string = "";
  subscription: Subscription = new Subscription();
  deviceKey: any;
  deviceGroupKey: any;
  randomPassword: any;
  successmessage: string = "";
  successtitle: string = "";
  userLoggedIn: boolean = false;
  emailAddress: any;
  showLoginScreen: boolean = false;
  touched: boolean = false;

  showOtpInput: boolean = false; // Initially hide the OTP field
  otpForm: FormGroup;
  isResendDisabled = false;
  successMsg: string = "";
  cvErr: string = "";


  constructor(private cdr: ChangeDetectorRef, private modalService: NgbModal, private companyListingService: CompanyListingService, private storage: StorageService, private amplify: CognitoService, private router: Router, private authService: AuthService, private spinner: NgxSpinnerService, private navbarToggleSwitchService: NavbarToggleSwitchService, private fb: FormBuilder) {
    this.otpForm = this.fb.group({
      otpArray: this.fb.array(Array(6).fill('').map(() => new FormControl('', [Validators.required, Validators.pattern('[0-9]')])))
    });
  }





  candidate = {
    submitted: false
  };
  @ViewChild('nameInput') nameInput!: NgModel;

  validateName() {
    if (!this.candidateForm.name) {
      this.nameInput.control.setErrors({ 'required': true });
    }
  }

  otpVerification(emailId: string): void {
    // if (this.resetForm && this.resetForm.code && this.resetForm.code === otp) {
    this.authService.otpVerification(emailId)
      .then(response => {
        // console.log('OTP verification successful');

      })
      .catch(error => {
        // console.error('OTP verification failed:', error);
      });
    // } else {
    //   console.log('OTP is not valid');
    // }
  }

  get otpControls(): FormControl[] {
    return (this.otpForm.get('otpArray') as FormArray).controls as FormControl[];
  }

  // Helper to check if all OTP values are filled
  otpValuesFilled(): boolean {
    return this.otpControls.every(control => control.value !== '');
  }

  // onInputChange(): void {
  //   // Check if the input value matches any of the options
  //   const inputValue = this.autocompleteInput.nativeElement.value;
  //   const matchingOption = this.allOptions.find((option:any) => option.name === inputValue);

  //   if (!matchingOption) {
  //     // Clear the input value if no matching option is found
  //     this.autocompleteInput.nativeElement.value = '';
  //   }
  // }

  // ngAfterViewInit(): void {
  //   this.trigger.panelClosingActions
  //     // .pipe(
  //     //   switchMap(() => this.filteredOptions),
  //     //   filter((filteredOptions: any) => !filteredOptions.some((option: any) => option.name === this.selectedCompany.name))
  //     // )
  //     .subscribe(() => {
  //       
  //       this.myControl.setValue(null);
  //     });

  //     // ngAfterViewInit() {
  //     //   this.trigger.panelClosingActions
  //     //     .subscribe(e => {
  //     //       this.selectedData.setValue(null);
  //     //     });
  //     // }
  // }

  ngAfterViewInit() {
    // this.trigger.panelClosingActions
    //   .subscribe(e => {
    //     this.myControl.setValue(null);
    //   });
    // This is to ensure the tooltip works
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })


  }


  // isVerifyButtonVisible(form: NgForm): boolean {
  //   // Ensure all necessary fields are filled and valid
  //   return form.valid &&
  //     this.employeeForm.name &&
  //     this.employeeForm.emailId &&
  //     this.isValidEmail(this.employeeForm.emailId) && // Check email validity
  //     this.employeeForm.phoneNumber &&
  //     !this.employeeForm.companyEmailID &&
  //     !this.employeeForm.department &&
  //     this.employeeForm.password &&
  //     this.employeeForm.confirmPassword &&
  //     (this.employeeForm.password === this.employeeForm.confirmPassword) && // Ensure passwords match
  //     this.employeeForm.acceptedTermsAndConditions &&
  //     this.selectedCompany?.name &&
  //     this.selectedCompany?.id;
  // }

  // isValidEmail(email: string): boolean {
  //   const emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|aol\.com|yahoo\.com|icloud\.com|protonmail\.com|zoho\.com|yandex\.com|gmx\.com|hubspot\.com|mail\.com|tutanota\.com|10minutemail\.com|outlook\.in|worko\.ai)$/;
  //   return emailPattern.test(email);
  // }

  async ngOnInit() {
    //Added check to pass userType to show enabled candidate and employee from index page
    //debugger

    // this.selectedUserType = this.userType;
    //console.log(this.selectedUserType)

    this.blinkAndChangeWord()
    // this.filteredOptions = this.myControl.valueChanges.pipe(
    //   debounceTime(300),
    //   distinctUntilChanged(),
    //   switchMap((value: any) => {
    //     // Edited by KA:
    //     // if (value && value.length >= 1) {
    //     //   return this.authService.getCompanyName(value);
    //     // }
    //     if (value && value.length >= 1) {
    //       return this.authService.getCompanyName(value).pipe(
    //         map((results: any[]) => [
    //           ...results,
    //           { id: 'add_new', name: "Add new company" } // Static option
    //         ])
    //       );
    //     }
    //     // End of edit by KA
    //     else {
    //       // If value.length is less than 1, return an empty array or null
    //       return [];
    //     }
    //   })

    // );

    this.filteredOptions = this.myControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value: any) => {
        if (value && value.length >= 1) {
          return this.authService.getCompanyName(value).pipe(
            // map((results: any[]) => {
            map((response: any) => {
              const results = Array.isArray(response.data) ? response.data : []; // Ensure results is an array
              if (results.length === 0) {
                this.companyNameError = 'Company name not found. Please add company name by selecting "Add new company" in the dropdown.';
              } else {
                this.companyNameError = '';
              }
              return [

                // ...results,
                ...results.map((company: any) => ({
                  id: company.SK,
                  name: company.name
                })),
                { id: 'add_new', name: "Add new company" } // Static option
              ];
            })
          );
        } else {
          this.companyNameError = '';
          return [];
        }
      })
    );

    //user select input from dropdown and  then clears the input 
    this.myControl.valueChanges.subscribe(value => {
      if (value === '' && this.myControl.touched) {
        this.selectedCompany = null;
        this.companyNameError = 'Please select a Company name from the dropdown';

      }
    });


    //console.log(fieldType2);
  }


  //ensure the user selects a company from the dropdown.
  onBlur(control: any) {
    if (!this.selectedCompany && control.touched) {
      this.companyNameError = 'Please select a Company name from the dropdown';
      //control.setValue("")
    }
  }


  displayFn(option: any): string {
    if (option) {
      this.companyName = option.name;
      this.companySK = option.id;
      return option.name;
    } else {
      return '';
    }
  }

  selectUserType(userType: string) {
    this.selectedUserType = userType;
    this.errorMessage = "";
    this.successMsg = "";
    this.userTypeSelected.emit(userType);

    // Clearing any OTP-related status if the user switches tabs
    if (this.showOtpInput) {
      this.resetOtpField(); // Method to clear/reset OTP fields
      this.showOtpInput = false; // Hide OTP field on tab switch
      this.myControl.enable();
    }
    this.clearBlinkTimer();
    this.currentWordIndex = 0;
    this.blinkAndChangeWord();
  }

  resetOtpField() {
    this.otpControls.forEach(control => control.reset()); // Clear each OTP input
  }

  toggleHover(fieldName: string, isHovered: boolean) {
    this.hoveredField = isHovered ? fieldName : null;
  }

  resetPasswordScreen() {
    this.setErrorMessage("");
    this.displayResetPassword = true;
    this.confirmationCodeScreen = false;

  }

  async handleRememberDevice() {


    try {
      if (this.rememberMe) {


        const response = await rememberDevice()

        await fetchAuthSession({ forceRefresh: true })



      }
    } catch (error) {

    }
  }


  passwordChange() {
    // this.currentAuthenticatedUser();
    // this.currentSession();

    this.handleConfirmResetPassword({ username: this.resetForm.emailId, confirmationCode: this.resetForm.code, newPassword: this.resetForm.password })
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
      const { username, userId, signInDetails } = await getCurrentUser();



      if (signInDetails) {
        // console.log('The signInDetails:', signInDetails);



      } else {
        //console.log('No signInDetails available.');
      }
    } catch (err) {
      console.error('Error fetching current authenticated user:', err);
    }
  }
  closeFunction() {
    this.toggleSignInRow()
  }

  toggleSignInRow() {
    // debugger
    this.setErrorMessage("");
    this.setSuccessMessage("");
    // this.currentSession();
    // this.currentAuthenticatedUser();
    // const autocompleteValue1 = "email";
    // const fieldType1 = this.FieldTypeFromAutocompleteAttributeValue(autocompleteValue1);
    // console.log(fieldType1); // Output: "email"

    // const autocompleteValue2 = "current-password";
    // const fieldType2 = this.FieldTypeFromAutocompleteAttributeValue(autocompleteValue2);
    // this.isUserLoggedIn=true
    this.showSignInRow = false;
    this.displayResetPassword = false;
    this.resetVerificationScreen = false;
    this.successPasswordMessage = false;
    this.showAddCompanyScreen = false;
    this.showErrorMessageScreen = false;
  }

  toggleSignUpRow() {
    this.setErrorMessage("");
    this.setSuccessMessage("");
    this.showSignInRow = true;
  }

  // STEP 1 : This will be opened Once you set the email and clicked on the forgot password, it will open the handleResetPassword page and pass your email to next function
  async resetPassword(form: any) {
    this.setErrorMessage("");
    this.confirmationEmail = this.maskEmail(this.resetForm.emailId);

    this.resetVerificationScreen = true;

    this.handleResetPassword(this.resetForm.emailId)

  }
  // STEP 2: Cognito is accepting username as email so we are using calling resetPassword function and passing the email to the next function
  async handleResetPassword(username: string) {
    try {

      const output = await resetPassword({ username });
      this.handleResetPasswordNextSteps(output);

    } catch (error) {
      // console.log(error);
    }
  }
  // STEP 3: After requesting Cognito the reset password request we will confirm reset with code (otp)
  async handleResetPasswordNextSteps(output: ResetPasswordOutput) {
    const { nextStep } = output;
    switch (nextStep.resetPasswordStep) {
      case 'CONFIRM_RESET_PASSWORD_WITH_CODE':
        /**
         * @example
         *{
         *   "resetPasswordStep": "CONFIRM_RESET_PASSWORD_WITH_CODE",
         *   "codeDeliveryDetails": {
         *       "deliveryMedium": "EMAIL",
         *       "destination": "a***@g***",
         *       "attributeName": "email"
         *   }
         *}
         */
        const codeDeliveryDetails = nextStep.codeDeliveryDetails;
      // console.log(
      //   `Confirmation code was sent to ${codeDeliveryDetails.deliveryMedium}`
      // );
    }
  }
  // STEP 4: After getting the code from the user we will confirm the reset password from cognito, and we have already match the password with confirm password of verification
  async handleConfirmResetPassword({

    username,
    confirmationCode,
    newPassword
  }: ConfirmResetPasswordInput) {

    try {
      await confirmResetPassword({ username, confirmationCode, newPassword });



      // this.successPasswordMessage=true;
      //this.toggleSignInRow()
      this.showSignInRow = false
      this.showAddCompanyScreen = false
      this.showErrorMessageScreen = true
      this.successtitle = 'success'
      this.successmessage = 'Your password has been successfully reset!!'
      //this.openModal(this.modalType.SUCCESS_MESSAGE)


    } catch (error) {

      this.errorMessage = "Invalid verification code provided, please try again."
    }
  }



  async createEmployee(form: NgForm): Promise<void> {
    this.spinner.show();
    try {
      this.setErrorMessage("");
      this.setSuccessMessage("");
      this.confirmationEmail = this.maskEmail(this.employeeForm.emailId);
      const { response, error } = await this.createUser(this.employeeForm);
      if (response) {
        let employeeData = {
          name: this.employeeForm.name,
          email: this.employeeForm.emailId,
          number: "+91" + this.employeeForm.phoneNumber,
          // linkedinUrl: this.employeeForm.linkdinProfile,
          YOE: Number(this.employeeForm.experience),
          // designation: this.employeeForm.designation,
          // department: this.employeeForm.department,
          // companyEmailId: this.employeeForm.companyEmailID,
          companyName: this.selectedCompany.name,
          companySK: this.selectedCompany.id,
          userId: response.userId,
          acceptedTermsAndConditions: this.employeeForm.acceptedTermsAndConditions // Include the acceptedTermsAndConditions field
          // designationTag: Number(this.employeeForm.designationTag)
        }

        this.authService.createEmployee(employeeData).then(async () => {
          try {
            // this.confirmationCodeScreen = true;
            // this.showLoader = true;
            this.showOtpInput = true;
            this.myControl.disable();
            this.setSuccessMessage("Registration successful! A verification code has been sent to your email. Please enter the code below to verify your account.");
            this.spinner.hide();
          } catch (error: any) {
            this.spinner.hide();

          }
        })
          .catch(error => {
            this.spinner.hide();
            // this.setErrorMessage(error.error?.errors[0].message);
            console.error('Create Employee Error:', error);
            this.employeeFormDirective?.resetForm();
            this.myControl?.reset()
            if (error.status === 409) {
              this.setErrorMessage("It looks like you already have an account with us.  Please log in to continue. If you’ve forgotten your password, use the 'Forgot Password' link to reset it.");
            }


          });
      }

      if (error && error.message) {
        this.spinner.hide();
        this.errorMessage = error.message;

      }


    } catch (error: any) {

      this.spinner.hide();
      // this.setErrorMessage("It looks like you already have an account with us.  Please log in to continue.If you’ve forgotten your password, use the 'Forgot Password' link to reset it.")

    }

  }


  async createCandidate(form: NgForm): Promise<void> {
    this.spinner.show();
    this.cvErr = "";
    try {
      this.setErrorMessage("");
      this.setSuccessMessage("");
      this.confirmationEmail = this.maskEmail(this.candidateForm.emailId);

      // Step 1: Register user in Cognito
      const { response, error } = await this.createUser(this.candidateForm);

      if (response) {

        // Step 2: Register candidate in the backend
        let candidateData = {
          name: this.candidateForm.name,
          email: this.candidateForm.emailId,
          number: "+91" + this.candidateForm.phoneNumber,
          // linkedinUrl: this.candidateForm.linkdinProfile,
          // ECTC: Number(this.candidateForm.expectedCtc),
          // YOE: Number(this.candidateForm.experience),
          userId: response.userId,
          acceptedTermsAndConditions: this.candidateForm.acceptedTermsAndConditions
        }

        try {
          await this.authService.createCandidate(candidateData);
        } catch (backendError) {
          console.error("Backend registration error:", backendError);
          this.setErrorMessage("An error occurred while saving your details. Please try again later.");
          return; // Stop here if backend registration fails
        }

        // Step 3: Check if a file was uploaded

        if (this.fileName) {

          try {
            // Prepare document details if file is uploaded
            const documentDetails = {
              userId: response.userId,
              resumeUserFileName: this.fileName,
              resumeFileMimeType: this.fileType
            };

            // Upload CV metadata and get document details
            let docResult = await this.authService.uploadCV(documentDetails);
            this.uploadedCvName = docResult.cloudFileName;

            // Step 3a: Upload CV to S3 Bucket
            await this.uploadCVonS3Bucket(docResult);
          }
          catch (cvError) {
            // Handle CV upload/link error: show an error but continue to OTP step
            console.error('CV upload/link error:', cvError);
            // this.setErrorMessage("Your registration was successful, but there was an issue uploading your CV. You can try uploading it again later.");
            this.cvErr = "There was an issue uploading your CV. You can try uploading it again later.";
          }

        }

        // Step 4: Show OTP input and confirmation message
        this.showOtpInput = true;
        this.myControl.disable();
        this.setSuccessMessage("Registration successful! A verification code has been sent to your email. Please enter the code below to verify your account.");

      }
      else if (error && error.message) {
        // Handle any errors from Cognito registration
        this.errorMessage = error.message;
      }

    } catch (error) {
      console.error("Error in createCandidate:", error);
      this.setErrorMessage("An unexpected error occurred during registration. Please try again.");
    } finally {
      // Ensure the spinner is hidden once all actions are complete
      this.spinner.hide();
    }


    // if (response) {
    //   try {
    //     let candidateData = {
    //       name: this.candidateForm.name,
    //       email: this.candidateForm.emailId,
    //       number: "+91" + this.candidateForm.phoneNumber,
    //       // linkedinUrl: this.candidateForm.linkdinProfile,
    //       // ECTC: Number(this.candidateForm.expectedCtc),
    //       // YOE: Number(this.candidateForm.experience),
    //       userId: response.userId,
    //       acceptedTermsAndConditions: this.candidateForm.acceptedTermsAndConditions

    //     }
    //     this.authService.createCandidate(candidateData).then(async () => {
    //       try {
    //         if (response && response.userId && this.fileName) {

    //           let documentDetails = {
    //             userId: this.userId,
    //             resumeUserFileName: this.fileName,
    //             resumeFileMimeType: this.fileType
    //           }
    //           let docResult = await this.authService.uploadCV(documentDetails);


    //           this.uploadedCvName = docResult.cloudFileName;
    //           this.uploadCVonS3Bucket(docResult);

    //         }
    //       } catch (error) {
    //         this.spinner.hide();

    //       }
    //     })
    //       .catch(error => {
    //         //this.setErrorMessage(error.error?.errors[0].message);
    //         this.spinner.hide();
    //         console.error('File upload error:', error);
    //         if (error.status === 409) {
    //           this.candidateFormDirective?.resetForm();
    //           this.fileName = "";

    //           this.setErrorMessage("It looks like you already have an account with us.  Please log in to continue.If you’ve forgotten your password, use the 'Forgot Password' link to reset it.");
    //         }



    //       });


    //   } catch (error: any) {
    //     this.setErrorMessage(error.error?.errors[0].message);
    //     this.spinner.hide();
    //     console.error('File upload error:', error);
    //   }


    // }

    // if (error && error.message) {
    //   this.errorMessage = error.message;
    //   this.spinner.hide();
    // }

    // } catch (error) {
    //   this.spinner.hide();
    //   // console.log('Error signing up candidate createCandidate:', error);
    // }


  }

  addNewCompany(event: MouseEvent, option: any): void {

    // console.log("CLicked to add new company:", event);
    // // this.openModal(ModalType.ADD_COMPANY);
    // console.log(this.showModal)

  }





  companyForm = {


    CompanyName: "",
    industry: 'Industry',

    carrierPage: "",
    linkedIn: "",
    emailid: "",
    personalemailid: "",
    contactNumber: ""


  }
  modalOpenCount: number = 0;
  openModalCount() {
    //this.showModal = true;
    this.modalOpenCount++; // Increment the counter when opening the modal
  }

  async requestCampanyData(form: NgForm) {
    this.spinner.show()

    try {
      this.companyData = {
        userType: "EMP",
        companyDetail: {
          name: this.companyForm.CompanyName,
          industry: 'Industry',
          //emailid: this.companyForm.emailid,
          carrierPage: this.companyForm.carrierPage,
          linkedIn: this.companyForm.linkedIn,
          //personalemailid:this.companyForm.personalemailid,
          //contactnumber:this.companyForm.contactNumber
        }
      }
      // debugger
      await this.companyListingService.requestNewCompany(this.companyData)
      let response = await this.companyListingService.getAllNewCompany()
      if (response) {
        this.spinner.hide()
        this.companyFormDirective.resetForm()
        this.showSignInRow = !this.showSignInRow
        this.showAddCompanyScreen = !this.showAddCompanyScreen
        this.showErrorMessageScreen = !this.showErrorMessageScreen

        // this.openModal(ModalType.SUCCESS_MESSAGE);
      }
    } catch (error: any) {
      this.companyFormDirective.resetForm()
      if (error.status === 409) {
        this.spinner.hide()
        this.showSignInRow = false
        this.showAddCompanyScreen = false
        this.showErrorMessageScreen = true
        this.successtitle = "Alert"
      } else {
        this.spinner.hide()
        this.showSignInRow = false
        this.showAddCompanyScreen = false
        this.showErrorMessageScreen = true
        this.successmessage = "Something went wrong. Please try again after sometime"
        this.successtitle = "Error"
      }
      // this.modal.cancel();
      //this.openModal(ModalType.LOGIN_SIGNUP);
    }


  }
  routeToLogin() {

    this.showOtpInput = false;
    this.myControl.enable();
    this.confirmationCodeScreen = false
    this.toggleSignInRow();
  }

  cancel() {
    //this.closeModal();
    //window.location.reload()
    //this.showErrorMessageScreen=!this.showErrorMessageScreen
    this.successmessage = "";
    this.successtitle = "";
    this.showSignInRow = true
    this.showAddCompanyScreen = false
    this.showErrorMessageScreen = false
    //console.log(this.isUSerLoggedIn)

  }

  // openModal(modalType: ModalType, message: string = "", title: string = ""): void {
  //   this.showModal = modalType;
  //   this.modalMessage = message;
  //   this.modalTitle = title;
  //   this.modal.open();

  // }
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
    this.modalMessage = message;
    this.modalTitle = title;
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




  onOptionSelected(event: any): void {

    // this.selectedCompany = event.option.value;
    // debugger
    // Edited by KA:
    if (event.option.value.id == "add_new") {

      this.showAddCompanyScreen = true
      //this.openModal(ModalType.ADD_COMPANY);
      this.selectedCompany = '';
      this.myControl.reset();
    } else {
      this.selectedCompany = event.option.value;
    }

  }

  uploadCVonS3Bucket(docResult: any) {
    this.cvErr = "";
    this.setErrorMessage("");
    return this.authService.uploadFileOnS3Bucket(this.fileToUpload!, docResult.awsS3SignedUrl, docResult.awsS3Tag)
      .then(async () => {
        try {
          await this.authService.linkResumewithUser(this.candidateForm.emailId.toLowerCase(), this.uploadedCvName);
        } catch (error: any) {
          console.error('File Link error linkResumewithUser:', error);
          // this.setErrorMessage('File Link error: ' + (error.error?.message || 'Error linking resume'));
          // this.setErrorMessage('Your registration was successful, but there was an issue linking your CV. You can try linking it again later.');
          this.cvErr = 'There was an issue linking your CV. You can try linking it again later.';
        }
      })
      .catch(error => {
        console.error('File upload error:', error);
        // this.setErrorMessage("Your registration was successful, but there was an issue uploading your file to the server. Please try again later.");
        this.cvErr = 'There was an issue uploading your file to the server. Please try again later.';
      });
  }

  // uploadCVonS3Bucket(docResult: any) {
  //   this.setErrorMessage("");
  //   try {
  //     this.authService.uploadFileOnS3Bucket(this.fileToUpload!, docResult.awsS3SignedUrl, docResult.awsS3Tag)
  //       .then(async () => {

  //         try {
  //           let a = await this.authService.linkResumewithUser(this.candidateForm.emailId.toLowerCase(), this.uploadedCvName);
  //           // this.confirmationCodeScreen = true;
  //           this.showOtpInput = true;
  //           this.myControl.disable();
  //           this.setSuccessMessage("Registration successful! A verification code has been sent to your email. Please enter the code below to verify your account.");
  //           this.spinner.hide();
  //         } catch (error: any) {
  //           if (error && error.error.message) {
  //             // this.errorMessage = error.error.message;
  //             this.spinner.hide();
  //             this.setErrorMessage('File Link error linkResumewithUser:- ' + error.error.message);
  //           }
  //           console.error('File Link error linkResumewithUser:', error);
  //         }

  //       })
  //       .catch(error => {

  //         console.error('File upload error:', error);


  //       });

  //   } catch (error) {
  //     //console.log(error)
  //   }
  // }

  handleFileInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files) {
      const files: FileList | null = inputElement.files;

      if (files && files.length > 0) {
        const file: File = files[0];

        // Check if the file type is PDF
        if (file.type === 'application/pdf') {
          // Process the PDF file as needed
          this.fileErr = "";
          this.fileToUpload = file;
          this.fileName = file.name;
          this.fileType = file.type;

        } else {
          // Display an error for invalid file type

          this.fileErr = "Invalid file type. Please upload a PDF file."
          this.fileName = "";
          // Optionally, you can reset the input to clear the invalid selection
          inputElement.value = '';
          this.fileToUpload = null;
        }
      }
    }
  }


  async confirmSignUp(form?: any): Promise<void> {
    this.setErrorMessage("");
    this.setSuccessMessage("");
    this.spinner.show();
    try {
      if (this.selectedUserType === "candidate") {

        // Retrieve the OTP value, using either the otp form controls or verification form code
        const otp = this.otpControls.map(control => control.value).join('') || this.verificationForm?.code;
        if (otp) {
          const { response, error } = await this.createUserWithConfirmation(this.candidateForm, otp);
          if (response) {
            // this.otpVerification(this.candidateForm.emailId);
            // this.showSignInRow = false  commented to pervent the user to togggle to sign in 
            this.showAddCompanyScreen = false;
            this.showOtpInput = false;
            this.myControl.enable();
            // this.showErrorMessageScreen = true
            // this.successtitle = 'Verification Successful' // success message displaying after verifing code
            // this.successmessage = 'Your account has been successfully created. Please log in to continue.'

            // this.toggleSignInRow();

            // redirect user to dashboard or edit profile with direct login
            await this.submit(this.candidateForm)

            this.spinner.hide();
          }
          else if (error) {
            this.errorMessage = error.message;
            this.spinner.hide();
          }

        } else {
          // Handle missing OTP error
          this.errorMessage = 'Please enter a valid OTP.';
          this.spinner.hide();
        }


      }

      if (this.selectedUserType === "employee") {
        // Retrieve the OTP value, using either the otp form controls or verification form code
        const otp = this.otpControls.map(control => control.value).join('') || this.verificationForm?.code;
        if (otp) {
          const { response, error } = await this.createUserWithConfirmation(this.employeeForm, otp);

          if (response) {
            // Successful verification, update UI and navigate
            this.showAddCompanyScreen = false;
            // this.showLoader = false;
            this.showOtpInput = false;
            this.myControl.enable();

            // Redirect user to dashboard or edit profile with direct login
            await this.submit(this.employeeForm);

          } else if (error) {
            // Handle API error message
            this.errorMessage = error.message;
            this.spinner.hide();
          }
        } else {
          // Handle missing OTP error
          this.errorMessage = 'Please enter a valid OTP.';
          this.spinner.hide();
        }

      }
    } catch (error) {
      // console.log('Error signing up candidate confirmSignUp:', error);
      this.errorMessage = 'An unexpected error occurred. Please try again.';
      this.spinner.hide();
    }

    // if(this.codeErrorScreen){
    //   const { response, error } = await this.createUserWithConfirmation(this.form.email, this.verificationForm);
    // try{
    //   const { isSignUpComplete, nextStep } = await confirmSignUp({

    //     username: this.form.email,
    //     confirmationCode: this.verificationForm.code,
    //   });

    // }catch{
    //   this.setErrorMessage("User is not confirmed.");
    //   this.toggleSignInRow();
    // }

    // if (response) {
    //   this.toggleSignInRow();
    //   this.spinner.hide();
    // }

    // if (error) {
    //   this.errorMessage = error.message;
    //   this.spinner.hide();
    // }


    // }
  }


  async submit(form: any): Promise<void> {
    this.setErrorMessage("");
    this.setSuccessMessage("");
    this.spinner.show();
    const loginData = {
      email: this.form.email || form.emailId,
      password: this.form.password || form.password
    }
    let login = await this.amplify.handleSignIn(loginData);

    let userType = this.storage.get('userType');
    if (userType === 'Corporate') {
      this.spinner.hide();
      this.successmessage = "Oops! You don't have access to log in to this portal. Please contact support for assistance.";
      this.successtitle = "Alert";
      this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
      this.amplify.handleSignOut();
      return;
    }
    if (login.response?.nextStep?.signInStep === "CONFIRM_SIGN_UP") {
      this.spinner.hide();
      this.confirmationEmail = this.maskEmail(this.form.email || form.emailId);
      this.showSignInRow = !this.showSignInRow;
      this.confirmationCodeScreen = !this.confirmationCodeScreen;
      this.resetOtpField();
      // this.codeErrorScreen=!this.codeErrorScreen
      // this.setErrorMessage("User is not confirmed.");
    }
    if (login && login.error && login.error.message) {
      this.spinner.hide();
      this.setErrorMessage(login.error.message);
    }
    if (login!.response!.isSignedIn) {
      await this.authService.getProfile(this.form.email.toLowerCase() || form.emailId.toLowerCase()).then(async (response) => {

        let userType = response.data.lastAccessedDash; //??
        let userName = response.data.name;//??
        this.storage.set('lastAccessedDash', userType);//??
        this.storage.set('userName', userName);
        this.navbarToggleSwitchService.intializeToggleStatus();


        await this.currentSession();
        await this.currentAuthenticatedUser();
        this.onSuccess.emit(userType);
        this.spinner.hide();
        // if (userType == "CAND") {
        //   this.router.navigate(['/candidate/candidate-dashboard']);
        // } else {
        //   this.router.navigate(['/employee/employee-dashboard']);
        // }

      })
        .catch(error => {
          console.error('Create Employee Error:', error);
          this.spinner.hide();
        });
    }
  }

  setErrorMessage(message: string) {
    this.errorMessage = message;
  }

  setSuccessMessage(message: string) {
    this.successMsg = message;
  }

  // verifyEmail(form: NgForm) {
  //   if (form.valid) {
  //     this.createEmployee(form);
  //   } else {
  //     this.errorMessage = "Please fill out all required fields";
  //   }
  // }


  //   async FieldTypeFromAutocompleteAttributeValue(autocompleteAttributeValue: string): Promise<any> {

  //     let fieldType: HtmlFieldType = HtmlFieldType.UNKNOWN;
  //     console.log(this.showSignInRow)
  //     //if(this.showSignInRow){
  //       
  //     if (autocompleteAttributeValue === "email" ) {
  //       return fieldType=HtmlFieldType.EMAIL;
  //     } else if (autocompleteAttributeValue === "current-password") {
  //       return fieldType=HtmlFieldType.PASSWORD;
  //     }
  //   //}
  //     return fieldType;





  // }

  async signOut(): Promise<void> {
    await this.amplify.handleSignOut();
    this.onSuccess.emit();
  }

  async createUser(form: any): Promise<{ response?: any; error?: Error }> {
    try {
      let signupform = {
        password: form.password,
        username: form.emailId.toLowerCase(),
        name: form.name,
        phone_number: "+91" + form.phoneNumber
      }
      const { response, error } = await this.amplify.handleSignUp(signupform);

      if (response) {
        // Handle the successful sign-up response

        this.userId = response.userId;

        return { response: response };
      }

      if (error) {
        // Handle the sign-up error

        return { error: error };
      }
    } catch (error: any) {
      // debugger
      this.candidateFormDirective?.resetForm();
      this.fileName = "";
      this.fileErr = "";
      this.cvErr = "";
      this.employeeFormDirective?.resetForm();
      this.myControl?.reset()
      if (error.message === 'User already exists') {
        this.spinner.hide();
        this.setErrorMessage("It looks like you already have an account with us.  Please log in to continue.If you’ve forgotten your password, use the 'Forgot Password' link to reset it.");
      }
    }

    // If an error occurs or no response is received, return an object with an undefined response and error properties
    return {};
  }


  async createUserWithConfirmation(form: any, otp: any): Promise<{ response?: any; error?: Error }> {
    this.setErrorMessage("");

    try {
      let signupform = {
        username: form.emailId || this.form.email,
        confirmationCode: otp,
      }

      // Call handleSignUpConfirmation and await the result
      const { response, error } = await this.amplify.handleSignUpConfirmation(signupform);

      // Check if the confirmation was successful
      if (response) {

        // Handle the confirmed sign-up as needed
        return { response: response };
      } else if (error) {
        // Handle confirmation error

        return { error: error };
      }

      // If no response or error was encountered, return a default value
      return { error: new Error('Unexpected error: No response or error.') };
    } catch (error) {
      // console.error('Unexpected error:', error);
      // Return the unexpected error
      // return { error: error };
    }
    return {};
  }

  async resendOtp(context?: string) {
    this.successMsg = "";
    if (this.isResendDisabled) return; // Prevent multiple clicks
    this.isResendDisabled = true;      // Disable button temporarily
    this.spinner.show();

    try {

      let username: any;

      // Check if `context` is "isSignInPage" for sign-in scenario
      if (context === "isSignInPage") {
        username = this.form.email.toLowerCase();
      }
      // Else block will handle the sign-up scenario
      else {

        if (this.selectedUserType === 'candidate') {
          // signupform = {
          //   username: this.candidateForm.emailId.toLowerCase()
          //   }
          username = this.candidateForm.emailId.toLowerCase();
        } else if (this.selectedUserType === 'employee') {
          username = this.employeeForm.emailId.toLowerCase();
        }

      }

      // Call resendOtp with the user's email (username)
      const { response, error } = await this.amplify.resendOtp({ username });
      // const { response, error } = await this.amplify.resendOtp(signupform as ResendSignUpCodeInput);

      if (response) {
        // Handle successful resend
        this.setSuccessMessage("A new verification code has been sent to your email. Please check your inbox and spam folder.");
        // console.log("OTP resent:", response);
        if (context === "isSignInPage") {
          this.verificationForm.code = '';  // Clear the verification code
          this.codeInputRef.nativeElement.focus();  // Set focus on the code input
        }
      } else if (error) {
        // Handle any error from the resend call
        this.setErrorMessage("Error resending OTP. Please try again.");
        console.error("Resend OTP Error:", error);
      }
    } catch (error) {
      this.setErrorMessage("An unexpected error occurred.");
      console.error("Unexpected error in resendOtp:", error);
    } finally {
      this.spinner.hide(); // Hide loading indicator
      setTimeout(() => (this.isResendDisabled = false), 30000); // Re-enable after 30 seconds
    }
  }


  maskEmail(email: string): string {
    const parts = email.split('@');
    if (parts.length !== 2) {
      // Invalid email format
      return email;
    }

    const username = parts[0];
    const domain = parts[1];

    const maskedUsername = username.length > 1 ? `${username.charAt(0)}${'*'.repeat(username.length - 1)}` : username;
    const maskedDomain = domain.length > 1 ? `${domain.charAt(0)}${'*'.repeat(domain.length - 1)}` : domain;

    return `${maskedUsername}@${maskedDomain}`;
  }

  blinkAndChangeWord() {
    const words = this.selectedUserType === "candidate" ? this.CandidateWords : this.EmployeeWords;
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

  ngOnDestroy() {
    this.clearBlinkTimer();
    this.modalService.dismissAll();
  }

  signUpWithLinkedin(usertype: any) {
    // if (this.router.url.includes('/companies')) {
    //   this.storage.set('isCompanyListingRoute', true);
    // } 

    const currentUrl = this.router.url;

    // // Check if the URL is in any of the expected job-related patterns
    // const isJobListing = /\/companies\/[^/]+-jobs/.test(currentUrl);
    // const isJobDescriptionRoute = /\/companies\/[^/]+-jobs\/[^/]+-[0-9]+/.test(currentUrl);
    // const isJobRoute = /\/[^/]+-jobs/.test(currentUrl);
    // const isCompanyListingRoute=this.router.url.includes('/companies')

    // if (isCompanyListingRoute || isJobDescriptionRoute || isJobRoute ||isJobListing) {

    // Define a single regular expression to match job-related routes and company routes
    const jobRoutePattern = /^(\/company\/jobs\/[^/]+-jobs(?:\/[^/]+-[A-Za-z0-9]+)?|\/company\/jobs\/[^/]+-jobs-[A-Za-z0-9]+|\/[^/]+-jobs)$/;
    // const jobRoutePattern = /^(\/company\/[^/]+-jobs(?:\/[^/]+-[A-Za-z0-9]+)?|\/[^/]+-jobs|\/company)$/;

    // Check if the URL matches any of the job-related or company-related routes
    const isCompanyRoute = jobRoutePattern.test(currentUrl);
    if (isCompanyRoute) {
      this.storage.set('isCompanyListingRoute', true);
      this.storage.set('dynamicRoute', currentUrl);  // Store the full job details route if necessary

      if (this.isApplyBtnClicked) {
        this.storage.set('applyJobAfterLogin', true);
      }
    }

    else {
      const isCompanyListingRoute = this.storage.get('isCompanyListingRoute');
      if (isCompanyListingRoute !== null && isCompanyListingRoute !== undefined) {
        this.storage.remove('isCompanyListingRoute');
        this.storage.remove('dynamicRoute');
      }
    }
    this.storage.set('LinkedinUserType', usertype);

    // Show a spinner or perform any other necessary actions
    this.spinner.show();

    //"https://worko.auth.ap-south-1.amazoncognito.com/oauth2/authorize?identity_provider=LinkedIn&redirect_uri=https://localhost:4200/&response_type=CODE&client_id=5evf019rrkaijtnjf2j1vvdf33&state=h8HvXvQ2W4QvOE18H68wwcgWh3pIkANy&code_challenge=kI8A-NbOUiZw9Iv14YltZO5iTk6MTkK2Lu1PVAEsOyI&code_challenge_method=S256&scope=email%20openid%20phone";
    // Redirect to the specified URL
    //window.location.href =
    // "https://worko.auth.ap-south-1.amazoncognito.com/oauth2/authorize?identity_provider=LinkedIn&redirect_uri=http://localhost:4200/auth/checkRedirection&response_type=CODE&client_id=5evf019rrkaijtnjf2j1vvdf33&state=h8HvXvQ2W4QvOE18H68wwcgWh3pIkANy&code_challenge=kI8A-NbOUiZw9Iv14YltZO5iTk6MTkK2Lu1PVAEsOyI&code_challenge_method=S256&scope=email%20openid%20phone";
    //



    this.amplify.handleSocialSignIn()

  }

}
