
import { Component, EventEmitter, Output, ViewChild, AfterViewInit, OnDestroy, Input, ElementRef } from '@angular/core';
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
import { FormControl, FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
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
import { ConfirmResetPasswordInput,fetchDevices,ResetPasswordOutput, confirmResetPassword, fetchAuthSession, getCurrentUser, rememberDevice, resetPassword, FetchDevicesOutput,} from '@aws-amplify/auth';
import { event } from 'jquery';
import { CompanyListingService } from '../../services/company-listing.service';
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

  @ViewChild(ModalComponent) modal!: ModalComponent;
  // @ViewChild('autocompleteInput') autocompleteInput: any; 
  @ViewChild('autoCompleteInput', { static: false, read: MatAutocompleteTrigger }) trigger!: MatAutocompleteTrigger;
  myControl = new FormControl<any>('');
  filteredOptions!: Observable<any[]>;
  allOptions: any[] = [];
  selectedUserType: string = 'candidate'; // Default to 'candidate'
  showSignInRow: boolean = true;
  isCandidateEmailVerified: boolean = false;
  isEmployeeEmailVerified: boolean = false;
  confirmationCodeScreen: boolean = false;
  confirmationEmail: string = '';
  displayResetPassword: boolean = false;
  acceptedTermsAndConditions: boolean = false;
  resetVerificationScreen: boolean = false;
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
  rememberMe:boolean=false
  // checkboxChecked:boolean=false;
  agreeTerms: boolean = false;
  auto: any;

  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;

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
    linkdinProfile: '',
    experience: '',
    expectedCtc: '',
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
  companyData:any=[];
  form1:any;
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
  successmessage: string="";
  successtitle: string="";
  
  constructor(private cdr: ChangeDetectorRef,private companyListingService:CompanyListingService,private storage: StorageService, private amplify: CognitoService, private router: Router, private authService: AuthService, private spinner: NgxSpinnerService) {
  
  


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
        console.log('OTP verification successful');

      })
      .catch(error => {
        console.error('OTP verification failed:', error);
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
  //       debugger;
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
    this.trigger.panelClosingActions
      .subscribe(e => {
        this.myControl.setValue(null);
      });
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })
  }


  async ngOnInit() {
    //Added check to pass userType to show enabled candidate and employee fromn index page
    if(this.userType){
      this.selectedUserType = this.userType;
    }
    this.blinkAndChangeWord()
    this.filteredOptions = this.myControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value: any) => {
        // Edited by KA:
        // if (value && value.length >= 1) {
        //   return this.authService.getCompanyName(value);
        // }
        if (value && value.length >= 1) {
          return this.authService.getCompanyName(value).pipe(
            map((results: any[]) => [
              ...results,
              { id: 'add_new', name: "Add new company" } // Static option
            ])
          );
        } 
        // End of edit by KA
        else {
          // If value.length is less than 1, return an empty array or null
          return [];
        }
      })

    );


   
    //console.log(fieldType2);
  
  }
 



  displayFn(option: any): string {
    if (option) {
      this.companyName = option.name;
      this.companySK = option.SK;
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
    this.displayResetPassword = true;
    this.confirmationCodeScreen = false;
   
  }
  
  async handleRememberDevice() {

    console.log("inside remeber me"+this.rememberMe)
    try {
      if(this.rememberMe){
        debugger
      
    const response= await rememberDevice()
   
      await fetchAuthSession({forceRefresh:true})
 
   
  
      }
    } catch (error) {
      console.log(error);
    }
  }
 

  passwordChange() {
    // this.currentAuthenticatedUser();
    // this.currentSession();
    console.log(this.resetForm)
    this.handleConfirmResetPassword({username:this.resetForm.emailId,confirmationCode:this.resetForm.code,newPassword:this.resetForm.password})
  }
 

  async currentSession() {
    await this.amplify.removeAccessToken()
    try {
      // const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
      //const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
      const response=await fetchAuthSession({forceRefresh:true})
      
      await this.amplify.setAccessToken()
      const authToken=response.tokens?.idToken?.toString();
      // console.log(accessToken, "Acces");
      console.log(response)
      console.log(authToken, "authToken");
    } catch (err) {
      console.log(err);
    }
  }

  async currentAuthenticatedUser() {
    try {
      const { username, userId, signInDetails } = await getCurrentUser();
      console.log(`The username: ${username}`);
      console.log(`The userId: ${userId}`);
    

      if (signInDetails) {
        console.log('The signInDetails:', signInDetails);
        

        
      } else {
        console.log('No signInDetails available.');
      }
    } catch (err) {
      console.error('Error fetching current authenticated user:', err);
    }
  }

  toggleSignInRow() {
    this.setErrorMessage("");
    // this.currentSession();
    // this.currentAuthenticatedUser();
    // const autocompleteValue1 = "email";
    // const fieldType1 = this.FieldTypeFromAutocompleteAttributeValue(autocompleteValue1);
    // console.log(fieldType1); // Output: "email"
    
    // const autocompleteValue2 = "current-password";
    // const fieldType2 = this.FieldTypeFromAutocompleteAttributeValue(autocompleteValue2);
    this.showSignInRow = false;
    this.displayResetPassword = false;
    this.resetVerificationScreen = false;
  }

  toggleSignUpRow() {
    this.setErrorMessage("");

    this.showSignInRow = true;
  }

  resetPassword(form: any) {
    debugger
    this.confirmationEmail = this.maskEmail(this.resetForm.emailId);
    this.resetVerificationScreen = true;
    this.handleResetPassword(this.resetForm.emailId)

  }
  async  handleResetPassword(username: string) {
    try {
     
      const output = await resetPassword({ username });
      this.handleResetPasswordNextSteps(output);
    } catch (error) {
      console.log(error);
    }
  }
  
  async  handleResetPasswordNextSteps(output: ResetPasswordOutput) {
    const { nextStep } = output;
    switch (nextStep.resetPasswordStep) {
      case 'CONFIRM_RESET_PASSWORD_WITH_CODE':
        const codeDeliveryDetails = nextStep.codeDeliveryDetails;
        console.log(
          `Confirmation code was sent to ${codeDeliveryDetails.deliveryMedium}`
        );  
    }
  }
  
async  handleConfirmResetPassword({
 
  username,
  confirmationCode,
  newPassword
}: ConfirmResetPasswordInput) {
  debugger
  try {
    await confirmResetPassword({ username, confirmationCode, newPassword });
    console.log(username, confirmationCode, newPassword)
    this.toggleSignInRow()
    
   
  } catch (error) {
    console.log(error);
    this.errorMessage="Invalid verification code provided, please try again."
  }
}



  async createEmployee(form: any): Promise<void> {
    this.spinner.show();
    try {
      this.setErrorMessage("");
      this.confirmationEmail = this.maskEmail(this.employeeForm.emailId);
      const { response, error } = await this.createUser(this.employeeForm);
      if (response) {
        let employeeData = {
          name: this.employeeForm.name,
          email: this.employeeForm.emailId,
          number: this.employeeForm.phoneNumber,
          // linkedinUrl: this.employeeForm.linkdinProfile,
          YOE: Number(this.employeeForm.experience),
          // designation: this.employeeForm.designation,
          department: this.employeeForm.department,
          companyEmailId: this.employeeForm.companyEmailID,
          companyName: this.selectedCompany.name,
          companySK: this.selectedCompany.SK,
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
            console.log(error);
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


    } catch (error) {
      this.spinner.hide();
      console.log('Error signing up candidate createEmployee:', error);
    }
  }


  async createCandidate(form: any): Promise<void> {
    this.spinner.show();
    try {
      this.setErrorMessage("");
      this.confirmationEmail = this.maskEmail(this.candidateForm.emailId);

      const { response, error } = await this.createUser(this.candidateForm);
      console.log(response);
      console.log(error);

      if (response) {
        try {
          let candidateData = {
            name: this.candidateForm.name,
            email: this.candidateForm.emailId,
            number: this.candidateForm.phoneNumber,
            linkedinUrl: this.candidateForm.linkdinProfile,
            ECTC: Number(this.candidateForm.expectedCtc),
            YOE: Number(this.candidateForm.experience),
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
                console.log(docResult);

                this.uploadedCvName = docResult.cloudFileName;
                this.uploadCVonS3Bucket(docResult);

              }
            } catch (error) {
              this.spinner.hide();
              console.log(error);
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
      console.log('Error signing up candidate createCandidate:', error);
    }


  }

  addNewCompany(event: MouseEvent, option: any): void {
   
    console.log("CLicked to add new company:",event);
    // this.openModal(ModalType.ADD_COMPANY);
    
  }
  companyForm={


    CompanyName: "",
      industry: 'Industry',
     
      carrierPage:"",
      linkedIn: "",
      emailid:"",
      personalemailid:"",
      contactNumber:""
  
  
  }
  
  
  async requestCampanyData(form:any){
    this.spinner.show()
 
    this.companyData={
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
    await this.companyListingService.requestNewCompany(this.companyData)
    let response= await this.companyListingService.getAllNewCompany()
    if(response){
      this.spinner.hide()
      this.openModal(ModalType.SUCCESS_MESSAGE);
    }
    
    
  
  }
  cancel(){
    window.location.reload()
  }
  openModal(modalType: ModalType, message: string = "", title: string = ""): void {
    this.showModal = modalType;
    this.modalMessage = message;
    this.modalTitle = title;
    this.modal.open();
  }


  
  onOptionSelected(event: any): void {
    // this.selectedCompany = event.option.value;
    
    // Edited by KA:
    if (event.option.value.id == "add_new"){
      console.log("Add new company")
      console.log("add_new = ", event.option.value.id);
      this.openModal(ModalType.ADD_COMPANY);
      this.selectedCompany='';
      this.myControl.reset();
    }else{
      this.selectedCompany = event.option.value;
    }
  }

  uploadCVonS3Bucket(docResult: any) {
    try {
      this.authService.uploadFileOnS3Bucket(this.fileToUpload!, docResult.awsS3SignedUrl, docResult.awsS3Tag)
        .then(async () => {
          console.log('File uploaded successfully.');
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
      console.log(error)
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
          console.log('Selected PDF file:', file);
        } else {
          // Display an error for invalid file type
          console.error('Invalid file type. Please upload a PDF file.');
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
    this.spinner.show();
    try {
      if (this.selectedUserType === "candidate") {
        const { response, error } = await this.createUserWithConfirmation(this.candidateForm, this.verificationForm);
        if (response) {

          this.otpVerification(this.candidateForm.emailId);
          this.toggleSignInRow();
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
          this.toggleSignInRow();
          this.spinner.hide();
        }

        if (error) {
          this.errorMessage = error.message;
          this.spinner.hide();
        }
      }
    } catch (error) {
      console.log('Error signing up candidate confirmSignUp:', error);
      this.spinner.hide();
    }
  }


  async submit(form: any): Promise<void> {
    this.spinner.show();
    const loginData = {
      email: this.form.email,
      password: this.form.password
    }
    let login = await this.amplify.handleSignIn(loginData);
    if (login.response?.nextStep?.signInStep === "CONFIRM_SIGN_UP") {
      this.spinner.hide();
      this.setErrorMessage("User is not confirmed.");
    }
    if (login && login.error && login.error.message) {
      this.spinner.hide();
      this.setErrorMessage(login.error.message);
    }
    if (login!.response!.isSignedIn) {
      this.authService.getProfile(this.form.email).then(async (response) => {

        let userType = response.data.lastAccessedDash;
        let userName=response.data.name
        this.storage.set('lastAccessedDash', userType);
        this.storage.set('userName', userName);
        console.log(userName)

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
//       debugger
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
        phone_number: form.phoneNumber
      }
      const { response, error } = await this.amplify.handleSignUp(signupform);

      if (response) {
        // Handle the successful sign-up response

        this.userId = response.userId;
        console.log('Sign-up successful. UserId:  New method', response.userId);
        return { response: response };
      }

      if (error) {
        // Handle the sign-up error
        console.error('Sign-up error: New method', error.message);
        return { error: error };
      }
    } catch (error) {
      console.log('Error signing up candidate: createUser', error);
    }

    // If an error occurs or no response is received, return an object with an undefined response and error properties
    return {};
  }


  async createUserWithConfirmation(form: any, verificationForm: any): Promise<{ response?: any; error?: Error }> {
    try {
      let signupform = {
        username: form.emailId,
        confirmationCode: verificationForm.code,
      }

      // Call handleSignUpConfirmation and await the result
      const { response, error } = await this.amplify.handleSignUpConfirmation(signupform);

      // Check if the confirmation was successful
      if (response) {
        console.log('Sign up confirmed:', response);
        // Handle the confirmed sign-up as needed
        return { response: response };
      } else if (error) {
        // Handle confirmation error
        console.error('Error confirming sign up:', error);
        return { error: error };
      }

      // If no response or error was encountered, return a default value
      return { error: new Error('Unexpected error: No response or error.') };
    } catch (error) {
      console.error('Unexpected error:', error);
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
  }

  signUpWithLinkedin(usertype:any) {
    this.storage.set('LinkedinUserType', usertype);
    console.log( window.location.origin )
    console.log(usertype);
    // Show a spinner or perform any other necessary actions
    this.spinner.show();
   
//"https://worko.auth.ap-south-1.amazoncognito.com/oauth2/authorize?identity_provider=LinkedIn&redirect_uri=https://localhost:4200/&response_type=CODE&client_id=5evf019rrkaijtnjf2j1vvdf33&state=h8HvXvQ2W4QvOE18H68wwcgWh3pIkANy&code_challenge=kI8A-NbOUiZw9Iv14YltZO5iTk6MTkK2Lu1PVAEsOyI&code_challenge_method=S256&scope=email%20openid%20phone";
    // Redirect to the specified URL
    //window.location.href =
       // "https://worko.auth.ap-south-1.amazoncognito.com/oauth2/authorize?identity_provider=LinkedIn&redirect_uri=http://localhost:4200/auth/checkRedirection&response_type=CODE&client_id=5evf019rrkaijtnjf2j1vvdf33&state=h8HvXvQ2W4QvOE18H68wwcgWh3pIkANy&code_challenge=kI8A-NbOUiZw9Iv14YltZO5iTk6MTkK2Lu1PVAEsOyI&code_challenge_method=S256&scope=email%20openid%20phone";
  //debugger



  this.amplify.handleSocialSignIn()

  }

}
