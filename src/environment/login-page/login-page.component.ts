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
  showSignInRow: boolean = true;
  isCandidateEmailVerified: boolean = false;
  isEmployeeEmailVerified: boolean = false;
  form = {
    email: '',
    password: ''
  };

  candidateForm = {
    candidateName: '',
    emailId: '',
    password: '',
    candidateOtp: '',
    linkdinProfile: '',
    experience: '',
    expectedCtc: '',
  }
  employeeForm = {
    employeeName: '',
    commuEmailId: '',
    companyName: '',
    phoneNumber: '',
    companyEmailID: '',
    employeeOtp: '',
    linkdinProfile: '',
    experience: '',
    department: '',
    designation: '',

  }
  constructor(private amplify: CognitoService) { }

  selectUserType(userType: string) {
    this.selectedUserType = userType;
    this.userTypeSelected.emit(userType);
  }


  toggleSignInRow() {
    this.showSignInRow = false;
  }

  async createCandidate(): Promise<void> {
    try {
      let a = this.createUser(this.candidateForm);
      this.isCandidateEmailVerified = true;
    } catch (error) {
      console.log('Error signing up candidate:', error);
    }
  }

  async confirmSignUpCandidate(form: any): Promise<void> {
    try {
      let userDetails = this.createUserWithConfirmation(this.candidateForm);
      console.log(userDetails);

    } catch (error) {
      console.log('Error signing up candidate:', error);
    }
  }




  async createEmployee(): Promise<void> {
    try {
      let a = this.createUser(this.employeeForm);
      this.isEmployeeEmailVerified = true;
    } catch (error) {
      console.log('Error signing up candidate:', error);
    }
  }


  async confirmSignUpEmployee(form: any): Promise<void> {
    try {
      let userDetails = this.createUserWithConfirmation(this.employeeForm);
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
        name: form.candidateName,
        phone_number: form.experience
      }
      return await this.amplify.handleSignUp(signupform);
    } catch (error) {
      console.log('Error signing up candidate:', error);
    }
  }

  async createUserWithConfirmation(form: any) {
    try {
      let signupform = {
        username: form.emailId,
        confirmationCode: form.candidateOtp,
      }
      return this.amplify.handleSignUpConfirmation(signupform);
    }
    catch (error) {
      console.log('Error signing up candidate:', error);
    }

  }



}
