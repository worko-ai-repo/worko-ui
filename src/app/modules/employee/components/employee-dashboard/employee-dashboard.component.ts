import { Component } from '@angular/core';
import { CandidateProfileService } from '../../../candidate/services/candidate-profile.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { EmployeeProfileService } from '../../services/employee-profile.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { CognitoService } from 'src/app/modules/services/cognito.service';
@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss']
})
export class EmployeeDashboardComponent {

  candidateList: any[] = [];
  educationList: any = "";
  emailAddress: string = "";
  candidateDetails: any = {};
  educationDetails: any = {};
  achievementsList: any = "";
  candidateSocial: any = {};
  certificationList:any;
  coreSkillsLists: any;
  softSkillsLists: any;
  workExperienceDetails: any;
  userDescription: string = "";
  profileCompletion: any;
  bankDetails: any;
  userType = "Employee"
  userName:any;
  key:any='';
  value:any=""
  successtitle: string="";
  successmessage: string="";
  constructor(private candidateSrv: CandidateProfileService,private cognitoService: CognitoService, private router: Router, private spinner:NgxSpinnerService,private storage: StorageService, private empService: EmployeeProfileService) { }

  ngOnInit(): void {
    // this.emailAddress = this.storage.get("useremail");
    this.emailAddress = this.storage.get("useremail");
    this.getCandidateDetails();
  }

  getSlicedValue(value: string): string {
    const parts = value?.split('#');
    if (parts && parts.length > 1) {
        return parts.length > 2 ? parts[2] : parts[1];
    }
    return '';
  }

  
  async getCandidateDetails() {
    this.spinner.show()
    try{
    await this.candidateSrv.getUserDetails(this.emailAddress).then(async (response) => {
      if (response) {
        this.candidateList = response
        if(response[0].id)
        {
        this.storage.set('userId', response[0].id);
        }
        else
        {
          let userId = this.getSlicedValue(response[0].SK);
          this.storage.set('userId', userId);
        }
        this.candidateDetails = this.candidateList[0];
        this.userName = this.candidateDetails.name;
        this.storage.set('userName', this.userName);
        this.userDescription = this.candidateList[0].about;
        await this.getEducationDetails();
      }
    })
  }catch(error:any ){
    //if(error.status==404 || error.status==401){
      this.spinner.hide()
      if (error.status==404) { 
        this.spinner.hide()
        this.router.navigate(['/auth/logout']);
      }else{
     
       this.router.navigate(['/']);
      }
  
  
  }
  }

  async getEducationDetails() {
    try{
    await this.candidateSrv.getCandidateEducation(this.emailAddress).then(async (response) => {
      if (response) {
        this.educationList = response;
        this.educationDetails = this.educationList[0];
       
      this.getWorkExperienceDetails();
          }
    })
  }catch(error:any ){
    //if(error.status==404 || error.status==401){
      this.spinner.hide()
      if (error.status==404) { 
        this.spinner.hide()
        this.router.navigate(['/auth/logout']);
      }else{
     
       this.router.navigate(['/']);
      }
  
  
  }
  }

  async getWorkExperienceDetails() {
    try{
    await this.candidateSrv.getWorkExperience(this.emailAddress).then(async (response) => {
      if (response) {
        this.workExperienceDetails = response;
        this.workExperienceDetails.forEach((element: any) => {
          if (element.isCurrent == true) {
            // this.storage.set('currentCompanySK', element.companySK);
            this.storage.set('currentCompanyId', element?.companyId);
          }
        });
        this.getSocialProfile();
      }
    })
  }catch(error:any ){
    //if(error.status==404 || error.status==401){
      this.spinner.hide()
      if (error.status==404) { 
        this.spinner.hide()
        this.router.navigate(['/auth/logout']);
      }else{
     
       this.router.navigate(['/']);
      }
  
  
  }
  }


   async getSocialProfile() {
    try{
    await this.candidateSrv.getUserProfile(this.emailAddress).then(async (response) => {
      if (response) {
        this.candidateSocial = response;
        this.getBankDetails();
      
      }
    })
  }catch(error:any ){
    //if(error.status==404 || error.status==401){
      this.spinner.hide()
      if (error.status==404) { 
        this.spinner.hide()
        this.router.navigate(['/auth/logout']);
      }else{
     
       this.router.navigate(['/']);
      }
  
  
  }
  }

  async getBankDetails() {
    try{
    await this.empService.getBankDetails(this.emailAddress).then(async (response) => {
      if (response) {
        this.bankDetails = response;
       
        this.userProfileComplete();
      }
    })
  }catch(error:any ){
    if (error.status==404) { 
      this.spinner.hide()
      this.router.navigate(['/auth/logout']);
    }else{
   
     this.router.navigate(['/']);
    }
  
  
  }
  }
  async userProfileComplete(){
    try{
    await this.candidateSrv.getProfileComplete(this.emailAddress).then(async(response)=>{
       if(response){
         this.profileCompletion=response;
        //  this.getSocialProfile();
         this.spinner.hide()
         //debugger
      //    for (let i = 0; i < localStorage.length; i++) {
      
      //     this.key = localStorage.key(i);
      //   if (this.key.startsWith('CognitoIdentityServiceProvider.') && this.key.includes('.accessToken')) {
      //        this.value = localStorage.getItem(this.key);
      //        console.log(this.value)
      //        this.storage.set('accessToken', this.value);
      //   }
      // }
       }
     })
    }catch(error:any ){
      //if(error.status==404 || error.status==401){
        this.spinner.hide()
        if (error.status==404) { 
          this.spinner.hide()
          this.router.navigate(['/auth/logout']);
        }else{
       
         this.router.navigate(['/']);
        }
    
    
    }
   }
  

}
