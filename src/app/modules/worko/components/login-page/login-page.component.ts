
import { Component, EventEmitter, Output, ViewChild, AfterViewInit, OnDestroy, Input, ElementRef, HostListener, SimpleChanges } from '@angular/core';
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
import { FormControl, FormsModule, NgForm, NgModel, ReactiveFormsModule } from '@angular/forms';
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
import { ConfirmResetPasswordInput, fetchDevices, ResetPasswordOutput, confirmResetPassword, fetchAuthSession, getCurrentUser, rememberDevice, resetPassword, FetchDevicesOutput, confirmSignUp, fetchUserAttributes, } from '@aws-amplify/auth';
import { event } from 'jquery';
import { CompanyListingService } from '../../services/company-listing.service';
import { NavbarToggleSwitchService } from 'src/app/modules/candidate/services/navbar-toggle-switch.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
declare var bootstrap: any;


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})



export class LoginPageComponent implements AfterViewInit, OnDestroy {

  @Output() userTypeSelected = new EventEmitter<string>();
  @Output() onSuccess: EventEmitter<void> = new EventEmitter<void>();
  @Input() userType: any;
  @Input() userLoggedInData: any
  @ViewChild('company')
  companyFormDirective!: NgForm;
  @ViewChild('candidate')
  candidateFormDirective!: NgForm;
  @ViewChild('employee')
  employeeFormDirective!: NgForm;

  @ViewChild(ModalComponent) modal!: ModalComponent;
  // @ViewChild('autocompleteInput') autocompleteInput: any; 
  @ViewChild('autoCompleteInput', { static: false, read: MatAutocompleteTrigger }) trigger!: MatAutocompleteTrigger;
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
  touched:boolean=false
  constructor(private cdr: ChangeDetectorRef, private modalService: NgbModal, private companyListingService: CompanyListingService, private storage: StorageService, private amplify: CognitoService, private router: Router, private authService: AuthService, private spinner: NgxSpinnerService, private navbarToggleSwitchService: NavbarToggleSwitchService) {




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
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })

   
  }


  async ngOnInit() {
    console.log("In login Component");
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
  onBlur(control:any) {
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
    this.userTypeSelected.emit(userType);
    this.clearBlinkTimer();
    this.currentWordIndex = 0;
    this.blinkAndChangeWord();
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

    this.showSignInRow = true;
  }

  async resetPassword(form: any) {
    this.setErrorMessage("");
    this.confirmationEmail = this.maskEmail(this.resetForm.emailId);

    this.resetVerificationScreen = true;

    this.handleResetPassword(this.resetForm.emailId)

  }
  async handleResetPassword(username: string) {
    try {

      const output = await resetPassword({ username });
      this.handleResetPasswordNextSteps(output);

    } catch (error) {
     // console.log(error);
    }
  }

  async handleResetPasswordNextSteps(output: ResetPasswordOutput) {
    const { nextStep } = output;
    switch (nextStep.resetPasswordStep) {
      case 'CONFIRM_RESET_PASSWORD_WITH_CODE':
        const codeDeliveryDetails = nextStep.codeDeliveryDetails;
        // console.log(
        //   `Confirmation code was sent to ${codeDeliveryDetails.deliveryMedium}`
        // );
    }
  }

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
          department: this.employeeForm.department,
          companyEmailId: this.employeeForm.companyEmailID,
          companyName: this.selectedCompany.name,
          companySK: this.selectedCompany.id,
          userId: response.userId,
          acceptedTermsAndConditions: this.employeeForm.acceptedTermsAndConditions // Include the acceptedTermsAndConditions field


          // designationTag: Number(this.employeeForm.designationTag)
        }

        this.authService.createEmployee(employeeData).then(async () => {
          try {
            this.confirmationCodeScreen = true;
            this.spinner.hide();
          } catch (error: any) {
            this.spinner.hide();
           
          }
        })
          .catch(error => {
            this.spinner.hide();
            this.setErrorMessage(error.error?.errors[0].message);
            console.error('Create Employee Error:', error);

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
    try {
      this.setErrorMessage("");
      this.confirmationEmail = this.maskEmail(this.candidateForm.emailId);

      const { response, error } = await this.createUser(this.candidateForm);
   

      if (response) {
        try {
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
          this.authService.createCandidate(candidateData).then(async () => {
            try {
              if (response && response.userId && this.fileName) {

                let documentDetails = {
                  userId: this.userId,
                  resumeUserFileName: this.fileName,
                  resumeFileMimeType: this.fileType
                }
                let docResult = await this.authService.uploadCV(documentDetails);
               

                this.uploadedCvName = docResult.cloudFileName;
                this.uploadCVonS3Bucket(docResult);

              }
            } catch (error) {
              this.spinner.hide();
          
            }
          })
            .catch(error => {
              this.setErrorMessage(error.error?.errors[0].message);
              this.spinner.hide();
              console.error('File upload error:', error);



            });


        } catch (error: any) {
          this.setErrorMessage(error.error?.errors[0].message);
          this.spinner.hide();
          console.error('File upload error:', error);
        }


      }

      if (error && error.message) {
        this.errorMessage = error.message;
        this.spinner.hide();
      }

    } catch (error) {
      this.spinner.hide();
     // console.log('Error signing up candidate createCandidate:', error);
    }


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
    this.setErrorMessage("");
    try {
      this.authService.uploadFileOnS3Bucket(this.fileToUpload!, docResult.awsS3SignedUrl, docResult.awsS3Tag)
        .then(async () => {
        
          try {
            let a = await this.authService.linkResumewithUser(this.candidateForm.emailId, this.uploadedCvName);
            this.confirmationCodeScreen = true;
            this.spinner.hide();
          } catch (error: any) {
            if (error && error.error.message) {
              // this.errorMessage = error.error.message;
              this.spinner.hide();
              this.setErrorMessage('File Link error linkResumewithUser:- ' + error.error.message);
            }
            console.error('File Link error linkResumewithUser:', error);
          }

        })
        .catch(error => {

          console.error('File upload error:', error);


        });

    } catch (error) {
      //console.log(error)
    }
  }

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


  async confirmSignUp(form: any): Promise<void> {
    this.setErrorMessage("")
    this.spinner.show();
    try {
      if (this.selectedUserType === "candidate") {
        const { response, error } = await this.createUserWithConfirmation(this.candidateForm, this.verificationForm);
        if (response) {
          // this.otpVerification(this.candidateForm.emailId);
         // this.showSignInRow = false  commented to pervent the user to togggle to sign in 
          this.showAddCompanyScreen = false
          // this.showErrorMessageScreen = true
          // this.successtitle = 'Verification Successful' // success message displaying after verifing code
          // this.successmessage = 'Your account has been successfully created. Please log in to continue.'

          // this.toggleSignInRow();

            // redirect user to dashboard or edit profile with direct login
          await this.submit(this.candidateForm)

          this.spinner.hide();
        }

        if (error) {
          this.errorMessage = error.message;
          this.spinner.hide();
        }
      }

      if (this.selectedUserType === "employee") {
        const { response, error } = await this.createUserWithConfirmation(this.employeeForm, this.verificationForm);

        if (response) {
       //   this.showSignInRow = false commented to pervent the user to togggle to sign in 
          this.showAddCompanyScreen = false
          // this.showErrorMessageScreen = true commented to pervent the user to togggle to sign in 
          // this.successtitle = 'Verification Successful'
          // this.successmessage = 'Your account has been successfully created. Please log in to continue.'
          // this.toggleSignInRow();

          // redirect user to dashboard or edit profile with direct login
          await this.submit(this.employeeForm)
        
        }

        if (error) {
          this.errorMessage = error.message;
          this.spinner.hide();
        }
      }
    } catch (error) {
      // console.log('Error signing up candidate confirmSignUp:', error);
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
    this.spinner.show();
    const loginData = {
      email: this.form.email || form.emailId,
      password: this.form.password || form.password
    }
    let login = await this.amplify.handleSignIn(loginData);
    if (login.response?.nextStep?.signInStep === "CONFIRM_SIGN_UP") {
      this.spinner.hide();
      this.confirmationEmail= this.maskEmail(this.form.email || form.emailId);
      this.showSignInRow = !this.showSignInRow;
      this.confirmationCodeScreen = !this.confirmationCodeScreen;
      // this.codeErrorScreen=!this.codeErrorScreen
      // this.setErrorMessage("User is not confirmed.");
    }
    if (login && login.error && login.error.message) {
      this.spinner.hide();
      this.setErrorMessage(login.error.message);
    }
    if (login!.response!.isSignedIn) {
      await this.authService.getProfile(this.form.email || form.emailId).then(async (response) => {

        let userType = response.data.lastAccessedDash;
        let userName = response.data.name;
        this.storage.set('lastAccessedDash', userType);
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
        username: form.emailId,
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
      this.fileName="";
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


  async createUserWithConfirmation(form: any, verificationForm: any): Promise<{ response?: any; error?: Error }> {
    this.setErrorMessage("");

    try {
      let signupform = {
        username: form.emailId || this.form.email,
        confirmationCode: verificationForm.code,
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
    if (this.router.url.includes('/companies')) {
      this.storage.set('isCompanyListingRoute', true);
    } else {
      const isCompanyListingRoute = this.storage.get('isCompanyListingRoute');
      if (isCompanyListingRoute !== null && isCompanyListingRoute !== undefined) {
        this.storage.remove('isCompanyListingRoute');
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
