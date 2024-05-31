// import { Component, HostListener, ViewChild } from '@angular/core';
// import { CognitoService } from 'src/app/modules/services/cognito.service';
// import { Router } from '@angular/router';
// import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
// import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
// import * as data from 'src/assets/data/data.json';
// import Globe from 'globe.gl';
// import { assetUrl } from 'src/asset-url';
// import { CompanyListingService } from '../../services/company-listing.service';
// import { event } from 'jquery';

import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { FormControl, NgModel } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { ConfirmResetPasswordInput, ResetPasswordOutput, confirmResetPassword, fetchAuthSession, getCurrentUser, resetPassword } from '@aws-amplify/auth';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subscription, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { CandidateProfileService } from 'src/app/modules/candidate/services/candidate-profile.service';
import { NavbarToggleSwitchService } from 'src/app/modules/candidate/services/navbar-toggle-switch.service';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { AuthService } from 'src/app/modules/worko/services/auth.service';
import { CompanyListingService } from 'src/app/modules/worko/services/company-listing.service';
declare var bootstrap: any;

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {

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
  codeErrorScreen: boolean = false;
  emailAddress: string = "";
  profileCompletion: any = "";
  employeeTotalPercentage: any;
  candidateTotalPercentage: any;
  candidateProfile: any;
 userName:string='profile'
 userLoggedIn: boolean = false;
 isUSerLoggedIn:boolean=false;

  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  showAddCompanyScreen:boolean=false;
  showErrorMessageScreen:boolean=false;
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


  // @HostListener('window:message', ['$event'])
  // onMessage(e: { origin: string; data: any; }) {
  //   debugger 
  //   console.log(e.data);
  //   if (e.origin ==='http://localhost:64555') { console.log("afasfaasffafafaa");
  //     localStorage.setItem('companyid', e.data);
  //   } 
  // }
  
  constructor(private cdr: ChangeDetectorRef,private modalService: NgbModal,private companyListingService:CompanyListingService,private storage: StorageService, private amplify: CognitoService, private router: Router, private authService: AuthService, private spinner: NgxSpinnerService, private navbarToggleSwitchService : NavbarToggleSwitchService,private candidateSrv: CandidateProfileService,) {
  
  


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
   // await this.userTypeCheck()
   debugger
  
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
    this.checkUserLoggedIn();
    
  
  }



  async checkUserLoggedIn(){
    debugger
    this.userLoggedIn = await this.amplify.isLoggedIn();
    this.userType=localStorage.getItem('crossDomainData')
    // if (this.userType.startsWith('"') && this.userType.endsWith('"')) {
    //   this.userType = this.userType.substring(1, this.userType.length - 1); // Extract substring excluding the first and last characters
    // }
 console.log(this.userType);

    this.emailAddress = this.storage.get("useremail");
    if (this.userLoggedIn) {
      debugger
      if (this.router.url.includes('/company-listing')) {
        // Redirect to the company listing page
        this.router.navigate(['/company-listing']);
        this.modal.cancel();
      }
      else {
        const response = await this.candidateSrv.getProfileComplete(this.emailAddress);
      
        if (response) {
          this.profileCompletion = response;
          console.log(this.profileCompletion);
          if(this.userType==='employee'){
            this.router.navigate(['/employee/Referral']);
          }else if (this.profileCompletion) {
            const profileType = this.userType === "CAND" ? this.profileCompletion.candidate : this.profileCompletion.employee;
            const totalPercentage = profileType.reduce((sum: any, element: any) => sum + element.curPerc, 0);

            if (this.userType === "CAND" && totalPercentage > 60) {
              this.router.navigate(['/candidate/dashboard']);
            } else if (this.userType === "CAND" && totalPercentage < 60) {
              this.router.navigate(['/candidate/edit-profile']);
            } else if (this.userType !== "CAND" && totalPercentage > 60) {
              this.router.navigate(['/employee/dashboard']);
            } else if (this.userType !== "CAND" && totalPercentage < 60) {
              this.router.navigate(['/employee/Edit-profile']);
            }
          }
          this.modal.cancel();
        }
      }
    }else{

      this.isUSerLoggedIn=!this.isUSerLoggedIn
      this.router.navigate(['/'])
   if(this.userType==='employee'){
   
      this.selectedUserType = this.userType;
    
  }else{
    //this.selectedUserType = 'candidate';
    this.router.navigate(['/'])
  }
    }

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
    this.setErrorMessage("");
    this.displayResetPassword = true;
    this.confirmationCodeScreen = false;
   
  }
  
  // async handleRememberDevice() {

  //   console.log("inside remeber me"+this.rememberMe)
  //   try {
  //     if(this.rememberMe){
  //       debugger
      
  //   const response= await rememberDevice()
   
  //     await fetchAuthSession({forceRefresh:true})
 
   
  
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
 

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
    this.setErrorMessage("");
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
    localStorage.removeItem('crossDomainData')
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
    localStorage.removeItem('crossDomainData')
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
    console.log(this.showModal)
    
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
  modalOpenCount:number=0;
  openModalCount() {
    //this.showModal = true;
    this.modalOpenCount++; // Increment the counter when opening the modal
  }
  
  async requestCampanyData(form:any){
    this.spinner.show()
debugger
try{
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
      this.showSignInRow=!this.showSignInRow
      this.showAddCompanyScreen=!this.showAddCompanyScreen
      this.showErrorMessageScreen=!this.showErrorMessageScreen
     
     // this.openModal(ModalType.SUCCESS_MESSAGE);
    }
  }catch{
    this.spinner.hide()
    this.showSignInRow=false
    this.showAddCompanyScreen=false
    this.showErrorMessageScreen=true
    this.successmessage="Something went wrong. Please try again after sometime"
    this.successtitle="Error"
   // this.modal.cancel();
    //this.openModal(ModalType.LOGIN_SIGNUP);
  }
    
  
  }
  

  cancel(){
    //this.closeModal();
  //window.location.reload()
  //this.showErrorMessageScreen=!this.showErrorMessageScreen
  this.showSignInRow=true
  this.showAddCompanyScreen=false
  this.showErrorMessageScreen=false
  console.log(this.isUSerLoggedIn)

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
    openModal(modalType: ModalType, message: string ="", title: string="" ): void {

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
    
    // Edited by KA:
    if (event.option.value.id == "add_new"){
      console.log("Add new company")
      console.log("add_new = ", event.option.value.id);
      this.showAddCompanyScreen=!this.showAddCompanyScreen
      //this.openModal(ModalType.ADD_COMPANY);
      this.selectedCompany='';
      this.myControl.reset();
    }else{
      this.selectedCompany = event.option.value;
    }
  }

  uploadCVonS3Bucket(docResult: any) {
    this.setErrorMessage("");
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
    this.setErrorMessage("")
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
  localStorage.removeItem('crossDomainData')
    this.setErrorMessage("");
    this.spinner.show();
    const loginData = {
      email: this.form.email,
      password: this.form.password
    }
    let login = await this.amplify.handleSignIn(loginData);
    if (login.response?.nextStep?.signInStep === "CONFIRM_SIGN_UP") {
      this.spinner.hide();
      debugger
      this.showSignInRow=!this.showSignInRow;
      this.confirmationCodeScreen=!this.confirmationCodeScreen;
    // this.codeErrorScreen=!this.codeErrorScreen
     // this.setErrorMessage("User is not confirmed.");
    }
    if (login && login.error && login.error.message) {
      this.spinner.hide();
      this.setErrorMessage(login.error.message);
    }
    if (login!.response!.isSignedIn) {
      await this.authService.getProfile(this.form.email).then(async (response) => {

         this.userType = response.data.lastAccessedDash;
        let userName=response.data.name
        this.storage.set('lastAccessedDash', this.userType);
        this.storage.set('userName', userName);
        this.navbarToggleSwitchService.intializeToggleStatus();
        console.log(userName)

       await this.currentSession();
       await this.currentAuthenticatedUser();
       debugger
        this.onSuccess.emit(this.userType);
        if(this.userType==='EMP'|| this.userType==='CAND'){
          this.checkUserLoggedIn()
        }else{
          this.router.navigate(['/'])
        }
    //     console.log(userType)
    //     this.userLoggedIn = await this.amplify.isLoggedIn();
    // this.emailAddress = this.storage.get("useremail");
    // if (this.userLoggedIn) {
    //   if (this.router.url.includes('/company-listing')) {
    //     // Redirect to the company listing page
    //     this.router.navigate(['/company-listing']);
    //     this.modal.cancel();
    //   }
    //   else {
    //     const response = await this.candidateSrv.getProfileComplete(this.emailAddress);

    //     if (response) {
    //       this.profileCompletion = response;
    //       console.log(this.profileCompletion);

    //       if (this.profileCompletion) {
    //         const profileType = userType === "CAND" ? this.profileCompletion.candidate : this.profileCompletion.employee;
    //         const totalPercentage = profileType.reduce((sum: any, element: any) => sum + element.curPerc, 0);

    //         if (userType === "CAND" && totalPercentage > 60) {
    //           this.router.navigate(['/candidate/dashboard']);
    //         } else if (userType === "CAND" && totalPercentage < 60) {
    //           this.router.navigate(['/candidate/edit-profile']);
    //         } else if (userType !== "CAND" && totalPercentage > 60) {
    //           this.router.navigate(['/employee/dashboard']);
    //         } else if (userType !== "CAND" && totalPercentage < 60) {
    //           this.router.navigate(['/employee/Edit-profile']);
    //         }
    //       }
    //       this.modal.cancel();
    //     }
    //   }
    // }else{
    //   this.router.navigate(['/'])
    // }

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
    this.setErrorMessage("");
   debugger
    try {
      let signupform = {
        username: form.emailId ||this.form.email,
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
    this.modalService.dismissAll();
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



  // @ViewChild(ModalComponent) modal!: ModalComponent;
  // getReferral: boolean = true;
  // giveReferral: boolean = false;
  // userLoggedIn: boolean = false;
  // modalType = ModalType;
  // showModal: ModalType | undefined;
  // modalMessage: string = "";
  // modalTitle: string = "";
  // userType :  string = "";
  // countryData: any = data;
  // // refereeBenefits: any;
  // // purposeList: any;
  // // candidateBenefits: any;
  // private intervalId: any;
  // private intervalClient: any;
  // private world: any;
  // isShow: any = true;
  // @ViewChild('slickModal1') public slickModal1: any;
  // @ViewChild('slickModal2') public slickModal2: any;
  // pageSize = 50;
  // lastKey: string | undefined = undefined;
  // loadedOnce: boolean = true;
  // filterData: any = {
  //   teamSize: "",
  //   industryType: "",
  //   companyName: ""
  // }
  // companyList: any[] = [];
  // triggerGudianceValue:boolean=false;
  // constructor(private router: Router, private cognitoService: CognitoService,private companyListing: CompanyListingService) { }

  // // private readonly preventDefault = function (e: any) {
  // //   e.preventDefault();
  // //   e.stopPropagation();
  // //   return false;
  // // };
  // // ngAfterViewInit() {
  // //   this.createGlobe();
  // //   this.focusOnCountry();
  // //   //this.clientInfo();
  // // }

  //   // Reviews carousel section starts:

  //   reviews = [
  //     {
  //       "image": "/assets/index-images-KA/card-img1.png",
  //       "content": "After reaching out to numerous connections on LinkedIn without much success, I turned to Worko for help. The team went above and beyond to assist me in securing referrals, and within a few weeks, I started receiving interview calls from some of the companies I applied to.",
  //       "name": "Sneha Gupta",
  //       "company": "EY"
  //     },
  //     {
  //       "image": "/assets/index-images-KA/card-img2.png",
  //       "content": "Worko not only helped me secure referrals at my dream companies but also provided invaluable support during the interview process. The Interview Handholding service from a senior employee was immensely helpful and aided me greatly in my preparation.",
  //       "name": "Aditya Raj",
  //       "company": "Flipkart"
  //     },
  //     {
  //       "image": "/assets/index-images-KA/card-img3.png",
  //       "content": "Worko's Peer 2 Peer hiring approach is truly revolutionary. Unlike other platforms, they never bombard me with random CVs. Instead, I find top-tier candidates perfectly matched to our requirements. Not only have I earned a significant referral bonus, but my HR team is also thrilled with the quality of candidates I refer.",
  //       "name": "A referee from Paytm",
  //       "company": "Paytm"
  //     },
  //     {
  //       "image": "/assets/index-images-KA/card-img1.png",
  //       "content": "Despite applying to jobs on various portals like Naukri and IIMjobs, I wasn't making any headway. Thanks to Worko, not only did I secure strong referrals, but I also received interview calls, which was a game-changer for me.",
  //       "name": "Avijit Sarkar",
  //       "company": "Amazon"
  //     },
  //     {
  //       "image": "/assets/index-images-KA/card-img2.png",
  //       "content": "When I faced rejection for not receiving a referral on Worko, I reached out to their team for assistance. I was impressed by the detailed help I received, from CV preparation to finding the right job opportunities. Thanks to Worko, I found the platform to be a much-needed blessing.",
  //       "name": "Rahul Kumar",
  //       "company": "Swiggy"
  //     },
  //     {
  //       "image": "/assets/index-images-KA/card-img3.png",
  //       "content": "I initially referred candidates on Worko out of goodwill, even though my previous company lacked a referral policy. Little did I know that this act of kindness would come full circle. When I found myself laid off months later, Worko stepped in, offering their services free of charge. Their empathy, honesty, and transparency ultimately helped me secure a new job within just two months. Worko's support proved invaluable, showcasing their commitment to their users' success.",
  //       "name": "A Referee from Amazon",
  //       "company": "Amazon"
  //     },
  //     {
  //       "image": "/assets/index-images-KA/card-img1.png",
  //       "content": "I want to express my gratitude for creating Worko. It's a much-needed platform today. The website experience and referral process are seamless. Your personalized approach to engaging with job seekers is commendable and will likely lead to positive word-of-mouth marketing. Achieving so much in such a short time is impressive. Best of luck to your team!",
  //       "name": "Amit Jetwani",
  //       "company": "CareEdge group"
  //     },
  //     {
  //       "image": "/assets/index-images-KA/card-img1.png",
  //       "content": "Unlike other chaotic platforms, Worko's Peer 2 Peer hiring approach has made finding quality candidates a breeze. No longer do I have to sift through unfiltered resumes. With Worko, I easily find experienced and vetted candidates, maximizing my referral bonus.",
  //       "name": "A Referee from Muthoot Fincorp",
  //       "company": "Muthoot Fincorp"
  //     },
  //     {
  //       "image": "/assets/index-images-KA/card-img2.png",
  //       "content": "I had been struggling to make headway in my job search, especially at the companies I aspired to work for. Worko came to my rescue, offering not only referral but also personalized guidance on resume improvement. With Worko's assistance, I finally managed to land an interview & then job at my dream company!",
  //       "name": "Sancheti Kaur",
  //       "company": "Walmart"
  //     },
  //     {
  //       "image": "/assets/index-images-KA/card-img3.png",
  //       "content": "My lack of attendance at a Tier-1 college posed challenges in securing interviews at top companies. Thanks to Worko, I found someone who not only referred me to Google but also provided invaluable guidance throughout the interview process. Worko truly opened doors for me at Google.",
  //       "name": "Rohan Kumar",
  //       "company": "Google"
  //     },
  //     {
  //       "image": "/assets/index-images-KA/card-img2.png",
  //       "content": "I appreciated the transparency and effort at Worko. Previously, I was referred to a few jobs but didn't receive any calls. Later on, with the help of the Worko team, I was able to find the right set of jobs for me. Their support throughout the process landed me quite a few good interviews and, eventually, a job.",
  //       "name": "Shruti Rai",
  //       "company": "Makemytrip"
  //     },
  //     {
  //       "image": "/assets/index-images-KA/card-img3.png",
  //       "content": "Beyond just revolutionizing recruitment, Worko excels in providing exceptional post-referral services. I've had the opportunity to offer guidance to candidates, and the experience has been incredibly rewarding. Not only am I helping others, but I'm also being compensated generously for my time and expertise.",
  //       "name": "A Referee from Google",
  //       "company": "Google"
  //     }
  //   ]

  //   marginLeft: number = -25; 
  //   marginLeftmd: number = -66;
  //   marginLeftsm: number = -78;
  //   currentIndex: number = 0;
  //   prevButtonDisabled: boolean = false;
  //   nextButtonDisabled: boolean = false;

  //   previousReview() {
  //     console.log(this.currentIndex);
  //     if (this.currentIndex > 0) {
  //       this.currentIndex--;
  //       this.nextButtonDisabled = false;
  //       this.adjustMarginLeft();
  //     }else {
          
  //         this.prevButtonDisabled = true;
  //         this.marginLeft = 3;
  //         this.marginLeftmd = 3;
  //         this.marginLeftsm = 6;
  //         // const lastReview = this.reviews.pop()!;
  //         // this.reviews.unshift(lastReview);
  //       }
  //       // this.adjustMarginLeft();
  //   }

  //   nextReview() {
  //     if (this.currentIndex < this.reviews.length - 3) {
  //       this.currentIndex++;
  //       this.prevButtonDisabled = false;
  //       this.adjustMarginLeft();
  //     } else {
        
  //       this.nextButtonDisabled = true;
  //       // const lastReview = this.reviews.pop()!;
  //       // this.reviews.unshift(lastReview);
  //       this.marginLeft = -15 -(this.currentIndex) * 50 -55;
  //       this.marginLeftmd =  -(this.currentIndex + 1) * 80 - 70;
  //       this.marginLeftsm = -(this.currentIndex + 1) * 80 - 140;
  //     }
  //     // this.adjustMarginLeft();
  //   }

  //   adjustMarginLeft() {
  //     this.marginLeft = -27 -this.currentIndex * 51 - this.currentIndex; 
  //     this.marginLeftmd = -66 - this.currentIndex * 80 - this.currentIndex;
  //     this.marginLeftsm = -78 - this.currentIndex * 86 - this.currentIndex;
  //   }

//   async ngOnInit(): Promise<void> {
//     this.getCompanyDetails();
//     // setInterval(() => {
//     //   this.swapValues();
//     // }, 3000);
//     this.intervalId = setInterval(() => {
//       this.swapValues();
//   }, 3000);

//     this.userLoggedIn = await this.cognitoService.isLoggedIn();
//       // $(".home-banner .btn-dark").addClass("active");
//       // this.startInterval();
  

//   }

//   swapValues() {
//     const temp = this.getReferral;
//     this.getReferral = this.giveReferral;
//     this.giveReferral = temp;
//   }
//   stopSwapping() {
//     clearInterval(this.intervalId);
// }

// // Function to resume swapping when leaving buttons
// resumeSwapping() {
//     this.intervalId = setInterval(() => {
//         this.swapValues();
//     }, 3000);
// }

//   openGetReferral() {
//     if (this.userLoggedIn) {
//       this.redirectToEmployeeReferral();
//     } else {
//       this.userType = "employee";
//       this.openModal(ModalType.LOGIN_SIGNUP);
//     }
//   }

//   async redirectToCompanyListing() {
//     this.router.navigateByUrl('/company-listing');
//   }

//   async redirectToEmployeeReferral() {
//     this.router.navigateByUrl('/employee/Referral');
//   }
  //old commented code ends

  // gData = [
  //   {
  //     lat: 19.076090,
  //     lng: 72.877426,
  //     size: 20,
  //     color: ['white'],
  //     id: String(Math.random()),
  //     popupHtml: "<div class='globe-content-wtap'><div class='top-header d-flex justify-content-between agline-items-center'><span class='img-wrap left-img'></span><span class='img-wrap right-img'></span></div><div class='heading'> Hi Kunal here !</div><p>SDE 2 From Google Looking for some great developers -> See you soon Here!</p></div>"
  //   },
  //   {
  //     lat: 28.644800,
  //     lng: 77.216721,
  //     size: 20,
  //     color: ['white'],
  //     id: String(Math.random()),
  //     popupHtml: "<div class='globe-content-wtap'><div class='top-header d-flex justify-content-between agline-items-center'><span class='img-wrap left-img'></span><span class='img-wrap right-img'></span></div><div class='heading'> Hi Kunal here !</div><p>SDE 2 From Google Looking for some great developers -> See you soon Here!</p></div>"
  //   },
  //   {
  //     lat: 22.719568,
  //     lng: 90.857727,
  //     size: 20,
  //     color: ['white'],
  //     id: String(Math.random()),
  //     popupHtml: "<div class='globe-content-wtap'><div class='top-header d-flex justify-content-between agline-items-center'><span class='img-wrap left-img'></span><span class='img-wrap right-img'></span></div><div class='heading'> Hi Kunal here !</div><p>SDE 2 From Google Looking for some great developers -> See you soon Here!</p></div>"
  //   },
  //   {
  //     lat: 40.732998,
  //     lng: 74.864273,
  //     size: 20,
  //     color: ['white'],
  //     id: String(Math.random()),
  //     popupHtml: "<div class='globe-content-wtap'><div class='top-header d-flex justify-content-between agline-items-center'><span class='img-wrap left-img'></span><span class='img-wrap right-img'></span></div><div class='heading'> Hi Kunal here !</div><p>SDE 2 From Google Looking for some great developers -> See you soon Here!</p></div>"
  //   },
  //   {
  //     lat: 39.916668,
  //     lng: 100.383331,
  //     size: 20,
  //     color: ['white'],
  //     id: String(Math.random()),
  //     popupHtml: "<div class='globe-content-wtap'><div class='top-header d-flex justify-content-between agline-items-center'><span class='img-wrap left-img'></span><span class='img-wrap right-img'></span></div><div class='heading'> Hi Kunal here !</div><p>SDE 2 From Google Looking for some great developers -> See you soon Here!</p></div>"
  //   },
  //   {
  //     lat: 38.889805,
  //     lng: -90.009056,
  //     size: 20,
  //     color: ['white'],
  //     id: String(Math.random()),
  //     popupHtml: "<div class='globe-content-wtap'><div class='top-header d-flex justify-content-between agline-items-center'><span class='img-wrap left-img'></span><span class='img-wrap right-img'></span></div><div class='heading'> Hi Kunal here !</div><p>SDE 2 From Google Looking for some great developers -> See you soon Here!</p></div>"
  //   }

  // ]


  // onClickShow(isShow: any) {
  //   this.getReferral = isShow;

  //   if (this.getReferral == true) {
  //     $(".home-banner .btn-dark").addClass("active");
  //     $(".home-banner .btn-light").removeClass("active");
  //   }
  //   else {
  //     $(".home-banner .btn-light").addClass("active");
  //     $(".home-banner .btn-dark").removeClass("active");
  //   }


  // }
  //old commented code starts
  // slideConfig = {
  //   slidesToShow: 1,
  //   slidesToScroll: 1,
  //   dots: false,
  //   prevArrow: false,
  //   nextArrow: false,
  //   vertical: true,
  //   verticalScrolling: true,
  //   speed: 1000,
  //   infinite: true,
  // };

//old commented code end
  // startInterval(): void {
  //   this.intervalId = setInterval(() => {

  //     if (this.getReferral == true) {
  //       this.getReferral = false;
  //       $(".home-banner .btn-light").addClass("active");
  //       $(".home-banner .btn-dark").removeClass("active");

  //     }
  //     else {
  //       this.getReferral = true;
  //       $(".home-banner .btn-dark").addClass("active");
  //       $(".home-banner .btn-light").removeClass("active");

  //     }

  //   }, 3000);
  // }

  // stopInterval(): void {
  //   if (this.intervalId) {
  //     clearInterval(this.intervalId);
  //     this.intervalId = null;
  //   }
  //   if (this.intervalClient) {
  //     clearInterval(this.intervalClient);
  //     this.intervalClient = null;
  //   }
  // }
  // createGlobe(): void {

  //   const earthImg = assetUrl('earth-dark.jpg');
  //   const markerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 32 30" fill="none">
  //   <path fill="currentColor" d="M8 3.77796C8 1.78467 9.435 0.164062 11.2 0.164062H28.8C30.565 0.164062 32 1.78467 32 3.77796V20.0405C32 22.0338 30.565 23.6544 28.8 23.6544H16.84C16.25 22.2145 15.345 20.9722 14.22 20.0405H19.2V18.2335C19.2 17.2341 19.915 16.4266 20.8 16.4266H24C24.885 16.4266 25.6 17.2341 25.6 18.2335V20.0405H28.8V3.77796H11.2V6.55049C10.26 5.935 9.165 5.5849 8 5.5849V3.77796ZM8 7.39185C8.63035 7.39185 9.25452 7.53206 9.83688 7.80449C10.4192 8.07691 10.9484 8.4762 11.3941 8.97958C11.8398 9.48295 12.1934 10.0805 12.4346 10.7382C12.6758 11.3959 12.8 12.1008 12.8 12.8127C12.8 13.5246 12.6758 14.2295 12.4346 14.8872C12.1934 15.5448 11.8398 16.1424 11.3941 16.6458C10.9484 17.1492 10.4192 17.5485 9.83688 17.8209C9.25452 18.0933 8.63035 18.2335 8 18.2335C7.36966 18.2335 6.74548 18.0933 6.16312 17.8209C5.58076 17.5485 5.05161 17.1492 4.60589 16.6458C4.16017 16.1424 3.8066 15.5448 3.56538 14.8872C3.32416 14.2295 3.2 13.5246 3.2 12.8127C3.2 12.1008 3.32416 11.3959 3.56538 10.7382C3.8066 10.0805 4.16017 9.48295 4.60589 8.97958C5.05161 8.4762 5.58076 8.07691 6.16312 7.80449C6.74548 7.53206 7.36966 7.39185 8 7.39185ZM6.665 20.0405H9.33C13.015 20.0405 16 23.4116 16 27.5675C16 28.3976 15.405 29.0752 14.665 29.0752H1.335C0.595 29.0752 0 28.4032 0 27.5675C0 23.4116 2.985 20.0405 6.665 20.0405Z" fill="white"/>
  //   </svg>`;
  //   // console.log(earthImg, markerSvg);
  //   this.world = Globe()
  //     .width(1200).height(1200).backgroundColor("#fff0")
  //     .globeImageUrl(earthImg)
  //     .htmlElementsData(this.gData)
  //     .htmlElement((d: any) => {
  //       const el = document.createElement('div');
  //       el.innerHTML = "<div id='" + d.id + "' style='visibility: hidden'>" + d.popupHtml + "</div>" + markerSvg;
  //       el.style.color = d.color;
  //       el.style.width = `${d.size}px`;
  //       el.style.pointerEvents = 'auto';
  //       el.style.cursor = 'pointer';
  //       el.onclick = () => { this.clickOnMarker(d) };
  //       return el;
  //     })
  //     .hexPolygonsData(this.countryData.features)
  //     .hexPolygonResolution(3)
  //     .hexPolygonMargin(0.5)
  //     // .hexPolygonUseDots(true)
  //     .hexPolygonColor(() => "#57e1ff")
  //     // .hexPolygonLabel(({ properties: d }) => `
  //     //   <b>${d.ADMIN} (${d.ISO_A2})</b> <br />
  //     //   Population: <i>${d.POP_EST}</i>
  //     // `)

  //     (document.getElementById("globeViz")!);
  //   this.world.controls().autoRotate = true;
  //   this.world.controls().autoRotateSpeed = 0.4;
  //   this.world.controls().enableZoom = false;
  // }
  // clickOnMarker(d: any): any {
  //   this.gData.forEach((element: any) => {
  //     let elem = document.getElementById(element.id);
  //     if (elem) {
  //       if (element.id == d.id) {
  //         elem!.style.visibility = "visible";
  //       } else {
  //         elem!.style.visibility = "hidden";
  //       }
  //     }
  //   });
  // }

  // private focusOnCountry(): void {
  //   if (this.world) {
  //     // Set the initial camera position to focus on the country
  //     this.world.pointOfView({ lat: 39.916668, lng: 116.38333 }, 300);
  //   }
  // }
  // clientInfo(): void {
  //   setTimeout(() => {
  //     this.intervalClient = setInterval(() => {
  //       var elements: any[] = [];
  //       this.gData.forEach((element: any) => {
  //         let elem = document.getElementById(element.id);
  //         if (elem) {
  //           elem!.style.visibility = "hidden";
  //           elements.push(element.id);
  //         }
  //       });
  //       const randomIndex = Math.floor(Math.random() * elements.length);
  //       let elemVisible = document.getElementById(elements[randomIndex]);
  //       elemVisible!.style.visibility = "visible";

  //       // console.log(randomIndex, elements);

  //       elements = [];

  //     }, 2000);
  //   }, 1000);

  // }
  //old commented code starts
  // async getCompanyDetails() {
   
     
  //     await this.companyListing.getCompanyListing(this.pageSize, this.lastKey, this.filterData.teamSize, this.filterData.industryType, this.filterData.companyName).then(async (response) => {
  //       if (response) {
  //         console.log("Helo11");
  //         //this.spinner.hide();
  //         // if (this.loadedOnce) {
  //         //   this.companyList = [];
  //         // }
  //         this.companyList = this.companyList.concat(response.data);
  //         this.lastKey = response.pagination.lastKey;
  //         this.loadedOnce = false;
  //         console.log(this.companyList)
  //         //  this.filterCompanies(); // Filter companies after updating companyList
  //       }
  //     })
  //       .catch(error => {
  //         console.error('Display Company Listing Error:', error);
  //         //this.spinner.hide();
  //       });
  //   }
  //   openReferralPage(item: any) {
  //     // Trigger the event when referral is requested
  //     this.companyListing.setReferralData(item);
  //     //this.companyListing.setrequestReferralData(event,item);
  //     this.router.navigateByUrl('/company-listing');
  //   }
  //   openGudiancePage(item:any){
      
  //     if(item){
  //       this.triggerGudianceValue=!this.triggerGudianceValue
  //       console.log(this.triggerGudianceValue)
  //       this.companyListing.setGuidanceData(this.triggerGudianceValue);
  //       this.router.navigateByUrl('/company-listing');
  //     }
  //   }


  // /**
  //  * Open modal.
  //  *
  //  * @param {ModalType} modalType
  //  * @param {string} [message = ""]
  //  * @param {string} [title = ""]
  //  * @returns {void}
  //  */
  // openModal(modalType: ModalType, message: string = "", title: string = ""): void {
  //   this.showModal = modalType;
  //   this.modalMessage = message;
  //   this.modalTitle = title;
  //   this.modal.open();
  // }
  // /**
  //  * Close modal.
  //  *
  //  * @returns {void}
  //  */
  // closeModal(): void {
  //   this.modal.cancel();
  // }

  // async receiveDataFromChild(userType: any) {
  //   console.log(userType);
  //   this.closeModal();
  //   this.userLoggedIn = await this.cognitoService.isLoggedIn();
  //   if (this.userLoggedIn) {
  //     if (userType == "CAND") {
  //       this.router.navigate(['/candidate/dashboard']);
  //     } else {
  //       this.router.navigate(['/employee/Dashboard']);
  //     }
  //   }
  // }

  // purposeList = [
  //   {
  //     image: '/assets/index-images-KA/purpose1.png', title: "Peer-to-Peer Hiring", text: "We facilitate connections between candidates and employees, helping candidates secure referrals and employees maximise referral bonuses."
  //   },
  //   {
  //     image: '/assets/index-images-KA/purpose2.png', title: " Interview Hand Holding", text: "During the hiring process, have an internal employee vouch and follow-up for you and provide guidance at each step"
  //   },
  //   {
  //     image: '/assets/index-images-KA/purpose3.png', title: "Feedback & Transparency", text: "We offer comprehensive job application analysis, recruiter feedback for every referral, and an application status report"
  //   },
  //   {
  //     image: '/assets/index-images-KA/purpose4.png', title: "Career Guidance", text: "While candidates can get guidance from industry experts, employees can offer their services and earn, creating a win-win path to success."
  //   },
  //   {
  //     image: '/assets/index-images-KA/purpose5.png', title: "Smart Matching Algorithm", text: "Our advanced algorithm provides detailed feedback and scores to candidates, highlighting their suitability. It informs employees why a referral would be ideal, enhancing the quality of recommendations"
  //   },
  //   {
  //     image: '/assets/index-images-KA/purpose6.png', title: " Access to Hidden Job", text: "Get access to hidden jobs that are not available on any other platform"
  //   }
  // ]

  // refereeBenefits = [
  //   {
  //     image: '/assets/index-images-KA/rbenefits1.png', text: " Get pre-vetted candidates for referral through our smart matching algorithm."
  //   },
  //   {
  //     image: '/assets/index-images-KA/rbenefits2.png', text: "Refer best of talent and maximise corporate referral bonus."
  //   },
  //   {
  //     image: '/assets/index-images-KA/rbenefits3.png', text: " Earn through mock interviews, referrals and mentorship."
  //   },
  //   {
  //     image: '/assets/index-images-KA/rbenefits4.png', text: "Extend a hand today, and when you need it, the universe echoes your kindness."
  //   },
  //   {
  //     image: '/assets/index-images-KA/rbenefits5.png', text: " Your anonymity, assured and preserved"
  //   },
  // ]

  // candidateBenefits = [
  //   {
  //     image: '/assets/index-images-KA/cbenefits1.png', text: "Get reviewed and referred by the best employees."
  //   },
  //   {
  //     image: '/assets/index-images-KA/cbenefits2.png', text: " Increase chances of interview calls by 20X!"
  //   },
  //   {
  //     image: '/assets/index-images-KA/cbenefits3.png', text: " Support and guidance from an internal employee throughout the hiring process."
  //   },
  //   {
  //     image: '/assets/index-images-KA/cbenefits4.png', text: " AI-powered profile analysis to provide feedback and guidance on the right job"
  //   },
  //   {
  //     image: '/assets/index-images-KA/cbenefits5.png', text: " Get resume reviewed, career guidance, mock interview from senior industry professionals"
  //   },
  // ]





}

