import { animate, animation } from '@angular/animations';
import { Component, EventEmitter, Output } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { signUp } from 'aws-amplify/auth';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})

export class LoginPageComponent {
  @Output() userTypeSelected = new EventEmitter<string>();
  selectedUserType: string = 'candidate'; // Default to 'employee'

  // verifyOtp:string='verify';
  // FormControlDirective.form: FormControl
  isVerificationTriggered: boolean = false;
  emailverify: boolean = false;
  showSignInRow: boolean = true;
  isEmailVerified: boolean = false;
  form = {
    email: '',
    password: ''
  };

  candidateForm = {
    candidateName : '',
    emailId : '',
    password : '',
    candidateOtp : '',
    linkdinProfile : '',
    experience : '',
    expectedCtc : '',
  }
  employeeForm ={
    employeeName : '',
    commuEmailId : '',
    companyName : '',
    phoneNumber : '',
    companyEmailID : '',
    otp : '',
    linkdinProfile : '',
    experience : '',
    dapartment : '',
    designation : '',

  }
  


constructor (private amplify: CognitoService){}
  selectUserType(userType: string) {
    this.selectedUserType = userType;


    this.userTypeSelected.emit(userType);
  }

  // verifyOtp()
  // handleVerifyClick() {
  //   // Set the variable to true to show the OTP input
  //   this.isVerificationTriggered = true;
  // }
  handleVerifyClick1() {
    // Set the variable to true to show the OTP input
    this.emailverify = true;
  }
  toggleSignInRow() {
    this.showSignInRow = false;
  }

  async createUserCoginto(): Promise<void> {
    try {
      let signupform = {
        password: this.candidateForm.password,
        username: this.candidateForm.emailId,
      }
      // let a = await this.amplify.handleSignUp(signupform);
      this.isEmailVerified = true;
      // console.log(a);
    } catch (error) {
      console.log('Error signing up candidate:', error);
    }
  }

  async confirmSignUpCandidate(form: any): Promise<void> {
   
    try {
      let signupform = {
        username: this.candidateForm.emailId,
        confirmationCode: this.candidateForm.candidateOtp,
      }
      let userDetails = this.amplify.handleSignUpConfirmation(signupform);
      console.log(userDetails);

    } catch (error) {
      console.log('Error signing up candidate:', error);
    }
  }

  async signUpEmployee(): Promise<void> {
    try {
      // Your custom logic for employee sign-up
      console.log('Employee Sign Up:', this.employeeForm);

      // Simulate sending OTP to the entered phone number and email
      const otpResponse = await this.sendOTP(this.employeeForm.phoneNumber, this.employeeForm.companyEmailID);

      if (otpResponse.success) {
        // Set the variable to true to show the OTP input
        this.isVerificationTriggered = true;
      } else {
        console.log('Error sending OTP:', otpResponse.error);
        // Handle error, show a message, etc.
      }
    } catch (error) {
      console.log('Error signing up employee:', error);
    }
  }

  async sendOTP(phoneNumber: string, email: string): Promise<{ success: boolean; error?: string }> {
    // Simulate sending OTP (Replace this with your actual OTP service/API call)
    try {
      // Your logic for sending OTP (e.g., using a third-party service)
      console.log(`Sending OTP to ${phoneNumber} and ${email}`);

      // Simulate success
      return { success: true };
    } catch (error) {
      console.log('Error sending OTP:', error);
      return { success: false, error: 'Error sending OTP' };
    }
  }

  



  
  










  async submit(form: any): Promise<void> {
    // console.log(form);
    const studentData = {
      email: this.form.email,
      password: this.form.password

    }
    console.log(studentData);
    let login = await this.amplify.handleSignIn(studentData);
    console.log(login, "LoginDetails");
  }

  async signOut(): Promise<void>{
    let login = await this.amplify.handleSignOut();
  }




}
