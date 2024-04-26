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
  userEmail:any;
  userName:any;
  pictureUrl:any;
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
  companyData: any=[];
form1: any;

  constructor( private storage: StorageService,private amplify: CognitoService, private authService: AuthService, private spinner: NgxSpinnerService,private router: Router) {}

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
    this.filteredOptions = this.myControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value: any) => {
        console.log(value)
        
        if (value && value.length >= 1) {
          return this.authService.getCompanyName(value).pipe(
            map((results: any[]) => [
              ...results,
              { id: 'add_new', name: "Add new company" } // Static option
            ])
          );

        } else {
          // If value.length is less than 1, return an empty array or null
          return [];
        }
      })

    );
    this.getCandidateData()

  }

  async getCandidateData(){
    const {
      tokens,
     
      userSub
  } = await fetchAuthSession();
  console.log(tokens)
     this.userEmail=tokens?.idToken?.payload['email']?.toString()
     this.userName=tokens?.idToken?.payload['name']?.toString()
     this.pictureUrl=tokens?.idToken?.payload['picture']
 console.log(this.userEmail,this.userName,this.pictureUrl)

 const {
  username,
  userId: id
} = await getCurrentUser();
    this.userId=id
    console.log(id)

   // this.storage.set("useremail", this.userEmail);

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

  async createEmployee(form: any): Promise<void> {
    //this.spinner.show();
 debugger
 try{
        let employeeData = {
          name: this.userName,
          email: this.userEmail,
          number: this.employeeForm.phoneNumber,
          // linkedinUrl: this.employeeForm.linkdinProfile,
          YOE: Number(this.employeeForm.experience),
          // designation: this.employeeForm.designation,
          department: this.employeeForm.department,
          companyEmailId: this.employeeForm.companyEmailID,
          companyName: this.selectedCompany.name,
          companySK: this.selectedCompany.SK,
          userId: this.userId,
          acceptedTermsAndConditions: this.employeeForm.acceptedTermsAndConditions // Include the acceptedTermsAndConditions field


          // designationTag: Number(this.employeeForm.designationTag)
        }
        
     
        this.authService.createEmployee(employeeData).then(async (response) => {
          this.storage.set("useremail", this.userEmail);
          console.log(this.userEmail);
          this.router.navigate(['/employee/Dashboard']);
     
        })
      }catch(error:any){
        if(error.status==409){
        this.errorMessage='user Already exist'
        console.log("errror")
        }else if(error.status==401){
          this.router.navigate(['/']);
        }else{
          this.errorMessage='something went wrong'
        }

      }
    }


    addNewCompany(): void {
      // this.
      this.myControl.reset();
      this.openModal(ModalType.ADD_COMPANY);
      
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
    
    
    requestCampanyData(form:any){
      this.companyData={
        userType: "EMP",
        companyDetail: {
          name: this.companyForm.CompanyName,
          //industry: 'Industry',
          emailid: this.companyForm.emailid,
          carrierPage: this.companyForm.carrierPage,
          linkedIn: this.companyForm.linkedIn,
          personalemailid:this.companyForm.personalemailid,
          contactnumber:this.companyForm.contactNumber
        }
      }
      
      this.openModal(ModalType.SUCCESS_MESSAGE);
    }
    cancel(){
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



     
      
     

