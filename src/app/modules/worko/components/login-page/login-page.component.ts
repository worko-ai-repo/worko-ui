
import { Component, EventEmitter, Output, ViewChild, AfterViewInit  } from '@angular/core';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
// import { getCurrentUser, fetchAuthSession  } from 'aws-amplify/auth';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
// import { map, startWith } from 'rxjs/operators';
// import { NgFor, AsyncPipe } from '@angular/common';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
// import { MatInputModule } from '@angular/material/input';
// import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
// import { delay } from 'rxjs/operators';
// import { of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
declare var bootstrap: any;

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})

export class LoginPageComponent implements AfterViewInit  {
  @Output() userTypeSelected = new EventEmitter<string>();
  @Output() onSuccess: EventEmitter<void> = new EventEmitter<void>();
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
  resetVerificationScreen: boolean = false;
  isDivOpen: boolean = false;
  isDivClose: boolean = true
  hideDiv: boolean = true
  errorMessage: string = "";
  // checkboxChecked:boolean=false;
  agreeTerms:boolean=false;
  auto: any;

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
    checkboxChecked:false
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
    companySK:"",
    agreeTerms: false,
    

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
  companySK: string="";
  subscription: Subscription = new Subscription();
  constructor(private cdr: ChangeDetectorRef,private storage: StorageService, private amplify: CognitoService, private router: Router, private authService: AuthService) {


  
 
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

  
 
  onOptionSelected(event: any): void {
    this.selectedCompany = event.option.value;
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
  
 
  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value: any) => {
        if (value && value.length >= 1) {
          return this.authService.getCompanyName(value);
        } else {
          // If value.length is less than 1, return an empty array or null
          return [];
        }
      })
    
    );
  
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
  }

  toggleHover(fieldName: string, isHovered: boolean) {
    this.hoveredField = isHovered ? fieldName : null;
  }

  resetPasswordScreen() {
    this.displayResetPassword = true;
    this.confirmationCodeScreen = false;
  }

  passwordChange() {
    // this.currentAuthenticatedUser();
    // this.currentSession();
    console.log(this.resetForm)
  }

  async currentSession() {
    try {
      // const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
      const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
      // console.log(accessToken, "Acces");
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
    this.showSignInRow = false;
    this.displayResetPassword = false;
    this.resetVerificationScreen= false;
  }

  toggleSignUpRow() {
    this.setErrorMessage("");

    this.showSignInRow = true;
  }

  resetPassword(form: any) {
    this.confirmationEmail = this.maskEmail(this.resetForm.emailId);
    this.resetVerificationScreen = true;

  }



  async createEmployee(form: any): Promise<void> {
    try {
      this.setErrorMessage("");
      this.confirmationEmail = this.maskEmail(this.employeeForm.emailId);
      const { response, error } = await this.createUser(this.employeeForm);
      if (response) {
        let employeeData = {
          name: this.employeeForm.name,
          email: this.employeeForm.emailId,
          number: this.employeeForm.phoneNumber,
          linkedinUrl: this.employeeForm.linkdinProfile,
          YOE: Number(this.employeeForm.experience),
          designation: this.employeeForm.designation,
          department: this.employeeForm.department,
          companyEmailId: this.employeeForm.companyEmailID,
          companyName: this.selectedCompany.name,
          companySK: this.selectedCompany.SK,
          userId: response.userId,
          designationTag: Number(this.employeeForm.designationTag)
        }

        this.authService.createEmployee(employeeData).then(async () => {
          try {
            this.confirmationCodeScreen = true;
          } catch (error: any) {
            console.log(error);
          }
        })
          .catch(error => {
            this.setErrorMessage(error.error?.errors[0].message);
            console.error('Create Employee Error:', error);

          });
      }

      if (error && error.message) {
        this.errorMessage = error.message;
      }


    } catch (error) {
      console.log('Error signing up candidate createEmployee:', error);
    }
  }


  async createCandidate(form: any): Promise<void> {
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
            userId: response.userId
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
              console.log(error);
            }
          })
            .catch(error => {
              this.setErrorMessage(error.error?.errors[0].message);
              console.error('File upload error:', error);



            });


        } catch (error: any) {
          this.setErrorMessage(error.error?.errors[0].message);
          console.error('File upload error:', error);
        }


      }

      if (error && error.message) {
        this.errorMessage = error.message;
      }

    } catch (error) {
      console.log('Error signing up candidate createCandidate:', error);
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
          } catch (error: any) {
            debugger;
            if (error && error.error.message) {
              // this.errorMessage = error.error.message;
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
          this.fileToUpload = file;
          this.fileName = file.name;
          this.fileType = file.type;
          console.log('Selected PDF file:', file);
        } else {
          // Display an error for invalid file type
          console.error('Invalid file type. Please upload a PDF file.');
          // Optionally, you can reset the input to clear the invalid selection
          inputElement.value = '';
          this.fileToUpload = null;
        }
      }
    }
  }


  async confirmSignUp(form: any): Promise<void> {
    try {
      if (this.selectedUserType === "candidate") {
        const { response, error } = await this.createUserWithConfirmation(this.candidateForm, this.verificationForm);
        if (response) {
          this.toggleSignInRow();
        }

        if (error) {
          this.errorMessage = error.message;
        }
      }

      if (this.selectedUserType === "employee") {
        const { response, error } = await this.createUserWithConfirmation(this.employeeForm, this.verificationForm);

        if (response) {
          this.toggleSignInRow();
        }

        if (error) {
          this.errorMessage = error.message;
        }
      }
    } catch (error) {
      console.log('Error signing up candidate confirmSignUp:', error);
    }
  }


  async submit(form: any): Promise<void> {
    const loginData = {
      email: this.form.email,
      password: this.form.password
    }
    let login = await this.amplify.handleSignIn(loginData);
    if (login && login.error && login.error.message) {
      this.setErrorMessage(login.error.message);
    }
    if (login!.response!.isSignedIn) {
      this.authService.getProfile(this.form.email).then(async (response) => {

        let userType = response.data.lastAccessedDash;
        this.currentSession();
        this.currentAuthenticatedUser();
        this.onSuccess.emit(userType);
        // if (userType == "CAND") {
        //   this.router.navigate(['/candidate/candidate-dashboard']);
        // } else {
        //   this.router.navigate(['/employee/employee-dashboard']);
        // }

      })
        .catch(error => {
          console.error('Create Employee Error:', error);
        });
    }
  }

  setErrorMessage(message: string) {
    this.errorMessage = message;
  }

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

}
