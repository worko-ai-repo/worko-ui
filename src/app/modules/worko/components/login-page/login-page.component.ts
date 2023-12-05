
import { Component, EventEmitter, Output } from '@angular/core';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { Router } from '@angular/router';
// import { Router, router } from '@angular/router';
import { CandidateComponent } from '../../../candidate/candidate.component';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})

export class LoginPageComponent {
  @Output() userTypeSelected = new EventEmitter<string>();
  selectedUserType: string = 'candidate'; // Default to 'employee'
  showSignInRow: boolean = true;
  isCandidateEmailVerified: boolean = false;
  isEmployeeEmailVerified: boolean = false;
  confirmationCodeScreen: boolean = false;
  confirmationEmail: string='';
  isDivOpen:boolean=false;
  isDivClose:boolean=true
  hideDiv:boolean=true
 
  form = {
    email: '',
    password: ''
  };

  candidateForm = {
    name: '',
    emailId: '',
    password: '',
    candidateOtp: '',
    newPassword:'',
    linkdinProfile: '',
    experience: '',
    expectedCtc: '',
    phoneNumber: ''
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
    newPassword:'',
    password:''

  }
  verificationForm = {
    code: ''
  }

  constructor(private amplify: CognitoService , private router : Router ) { }

  selectUserType(userType: string) {
    this.selectedUserType = userType;
    this.userTypeSelected.emit(userType);
  }


  toggleSignInRow() {
    this.showSignInRow = false;
  }

  toggleSignUpRow() {
    this.showSignInRow = true;
  }
  

  signInC(){
    this.router.navigate(['/candidate/candidate-dashboard'])
  }
  signInE(){
    this.router.navigate(['/employee/employee-dashboard'])
  }
  
  async createCandidate(form: any): Promise<void> {
    try {
      this.confirmationEmail = this.maskEmail(this.candidateForm.emailId);
      let a = this.createUser(this.candidateForm);
      this.confirmationCodeScreen= true;
    } catch (error) {
      console.log('Error signing up candidate:', error);
      
    }
  }

  async confirmSignUp(form: any): Promise<void> {
    try {
      console.log(this.candidateForm, "Candidate Forms end----------");
      console.log(this.verificationForm);
      if(this.selectedUserType === "candidate"){
        let userDetails = this.createUserWithConfirmation(this.candidateForm, this.verificationForm);
        console.log(userDetails);
        this.signInC();
      }
      
      if(this.selectedUserType === "employee"){
       let userDetails = this.createUserWithConfirmation(this.employeeForm, this.verificationForm);
       console.log(userDetails);
       this.signInE();
      }

    } catch (error) {
      console.log('Error signing up candidate:', error);
      
    }
 
  }

  async createEmployee(form: any): Promise<void> {
    try {
      let a = this.createUser(this.employeeForm);
      this.confirmationCodeScreen= true;
    } catch (error) {
      console.log('Error signing up candidate:', error);
    }
  }


  async confirmSignUpEmployee(form: any): Promise<void> {
    try {
      let userDetails = this.createUserWithConfirmation(this.employeeForm, this.verificationForm);
      console.log(userDetails);

    } catch (error) {
      console.log('Error signing up candidate:', error);
    }
  }

  async submit(form: any): Promise<void> {
    const loginData = {
      email: this.form.email,
      password: this.form.password

    }
    console.log(loginData);
    let login = await this.amplify.handleSignIn(loginData);
    console.log(login, "LoginDetails");
  }

  async signOut(): Promise<void> {
    let login = await this.amplify.handleSignOut();
  }

  async createUser(form: any) {
    try {
      let signupform = {
        password: form.password,
        username: form.emailId,
        name: form.name,
        phone_number: "+91"+form.phoneNumber
      }
      return await this.amplify.handleSignUp(signupform);
    } catch (error) {
      debugger;
      console.log('Error signing up candidate:', error);
    }
  }

  async createUserWithConfirmation(form: any, verificationForm: any) {
    try {
      let signupform = {
        username: form.emailId,
        confirmationCode: verificationForm.code,
      }
      return this.amplify.handleSignUpConfirmation(signupform);
    }
    catch (error) {
      debugger;
      console.log('Error signing up candidate:', error);
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

}
