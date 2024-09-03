import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { fetchAuthSession, getCurrentUser } from '@aws-amplify/auth';

import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { AuthService } from 'src/app/modules/worko/services/auth.service';

@Component({
  selector: 'app-create-employee-for-linkedin',
  templateUrl: './create-employee-for-linkedin.component.html',
  styleUrls: ['./create-employee-for-linkedin.component.scss']
})
export class CreateEmployeeForLinkedinComponent {

  @ViewChild('autoCompleteInput', { static: false, read: MatAutocompleteTrigger }) trigger!: MatAutocompleteTrigger;
  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;

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
  userEmail: any;
  userName: any;
  pictureUrl: any;
  selectedCompany: any; // Update the type based on your data structure
  userId: string = "";
  companyName: string = "";
  companySK: string = "";
  myControl = new FormControl<any>('');
  filteredOptions!: Observable<any[]>;
  allOptions: any[] = [];
  errorMessage: string = "";
  isBlinking = true;
  blinkTimer: any; //timer reference
  currentWordIndex = 0;
  EmployeeWords = ["Reward", "Sell Services", "Earn Money", "Priority Job Access"];
  currentWord = '';
  form: any;
  companyData: any = [];
  form1: any;
  successmessage: string = "";
  successtitle: string = "";
  companyNameError: string = '';
  groupType: any;

  constructor(private storage: StorageService, private cognitoService: CognitoService, private authService: AuthService, private spinner: NgxSpinnerService, private router: Router) { }

  onOptionSelected(event: any): void {
    this.selectedCompany = event.option.value;
  }
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

  ngOnDestroy() {
    this.clearBlinkTimer();
  }
  ngOnInit() {
    this.blinkAndChangeWord()
    // this.filteredOptions = this.myControl.valueChanges.pipe(
    //   debounceTime(300),
    //   distinctUntilChanged(),
    //   switchMap((value: any) => {


    //     if (value && value.length >= 1) {
    //       return this.authService.getCompanyName(value).pipe(
    //         map((results: any[]) => [
    //           ...results,
    //           { id: 'add_new', name: "Add new company" } // Static option
    //         ])
    //       );

    //     } else {
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
                this.companyNameError = 'Company name not found. Please  add company name by selecting "Add new company" in the dropdown.';
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


    this.getCandidateData()

  }

  //ensure the user selects a company from the dropdown.
  onBlur(control: any) {
    if (!this.selectedCompany && control.touched) {
      this.companyNameError = 'Please select a Company name from the dropdown';
      //control.setValue("")
    }
  }

  async getCandidateData() {
    const {
      tokens,

      userSub
    } = await fetchAuthSession();

    this.userEmail = tokens?.idToken?.payload['email']?.toString()
    this.userName = tokens?.idToken?.payload['name']?.toString()
    this.pictureUrl = tokens?.idToken?.payload['picture']

    this.groupType=tokens?.idToken?.payload['cognito:groups']

    if (Array.isArray(this.groupType) && this.groupType.includes('admin')) {
     this.storage.set('userType', 'Admin');
   }
    const {
      username,
      userId: id
    } = await getCurrentUser();
    this.userId = id

    // this.storage.set("useremail", this.userEmail);

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

  async createEmployee(form: any): Promise<void> {
    this.spinner.show();


    let employeeData = {
      name: this.userName,
      email: this.userEmail,
      number: "+91" + this.employeeForm.phoneNumber,
      // linkedinUrl: this.employeeForm.linkdinProfile,
      YOE: Number(this.employeeForm.experience),
      // designation: this.employeeForm.designation,
      department: this.employeeForm.department,
      companyEmailId: this.employeeForm.companyEmailID,
      companyName: this.selectedCompany.name,
      companySK: this.selectedCompany.id,
      userId: this.userId,
      acceptedTermsAndConditions: this.employeeForm.acceptedTermsAndConditions // Include the acceptedTermsAndConditions field


      // designationTag: Number(this.employeeForm.designationTag)
    }

    try {
      let response = await this.authService.createEmployee(employeeData)
      if (response) {
        this.otpVerification(this.userEmail);
      }

      // this.storage.set("useremail", this.userEmail);
      // console.log(this.userEmail);
      // this.router.navigate(['/employee/Dashboard']);


    } catch (error: any) {
      if (error.status == 409) {
        this.spinner.hide()
        this.successmessage = "It looks like you already have an account with us.  Please Sign In with Linkedin to continue."
        this.successtitle = "Error"
        this.openModal(ModalType.SUCCESS_MESSAGE)
      } else if (error.status == 401) {
        this.spinner.hide()
        this.cognitoService.handleSignOut()
      } else {
        this.spinner.hide()
        this.successmessage = "Something went wrong. Please try again after sometime"
        this.successtitle = "Error"
        this.openModal(ModalType.SUCCESS_MESSAGE)
      }

    }

  }


  //To make isVerified Flag as true
  otpVerification(emailId: string): void {

    this.authService.otpVerification(emailId)
      .then(response => {
        this.spinner.hide()
        this.storage.set("useremail", this.userEmail);
        this.storage.set("isLinkedinUser", 'true');
        const isCompanyListingRoute = this.storage.get('isCompanyListingRoute');
        if (isCompanyListingRoute) {
          // this.userName = this.storage.get('userName');
          // console.log(this.userName);
          // this.storage.set("useremail", this.userEmail);

          //this.letter = this.userName.charAt(0).toUpperCase();

          // Redirect to the company listing page


          this.router.navigate(['/companies']);
        }else if(this.groupType.includes('admin')){
          this.router.navigate(['/switcher']);
    
        }  else {
          this.router.navigate(['/employee/Dashboard']);

        }
      })
      .catch(error => {
        this.spinner.hide()
        console.error('OTP verification failed:', error);
        this.successmessage = "Something went wrong. Please try again after sometime"
        this.successtitle = "Error"
        this.openModal(ModalType.SUCCESS_MESSAGE)
      });
  }



  addNewCompany(): void {
    // this.
    this.myControl.reset();
    this.openModal(ModalType.ADD_COMPANY);

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


  requestCampanyData(form: any) {
    this.companyData = {
      userType: "EMP",
      companyDetail: {
        name: this.companyForm.CompanyName,
        //industry: 'Industry',
        emailid: this.companyForm.emailid,
        carrierPage: this.companyForm.carrierPage,
        linkedIn: this.companyForm.linkedIn,
        personalemailid: this.companyForm.personalemailid,
        contactnumber: this.companyForm.contactNumber
      }
    }

    this.openModal(ModalType.SUCCESS_MESSAGE);
  }
  cancel() {
    this.modal.cancel()
  }

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
    // this.referrralComponent.showReferrelRow = true;
    this.modal.cancel();
  }
}







