import { Component } from '@angular/core';
import { CandidateProfileService } from '../../../candidate/services/candidate-profile.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { EmployeeProfileService } from '../../services/employee-profile.service';
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
  constructor(private candidateSrv: CandidateProfileService, private storage: StorageService, private empService: EmployeeProfileService) { }

  ngOnInit(): void {
    // this.emailAddress = this.storage.get("useremail");
    this.emailAddress = "prashant@worko.ai";
    this.getCandidateDetails();

  }

  
  async getCandidateDetails() {
    await this.candidateSrv.getUserDetails(this.emailAddress).then(async (response) => {
      if (response) {
        this.candidateList = response
        this.candidateDetails = this.candidateList[0];
        this.userDescription = this.candidateList[0].about;
        console.log(response);
        await this.getEducationDetails();
      }
    })
  }

  async getEducationDetails() {
    await this.candidateSrv.getCandidateEducation(this.emailAddress).then(async (response) => {
      if (response) {
        this.educationList = response;
        this.educationDetails = this.educationList[0];
        console.log(response + "1");
      this.getWorkExperienceDetails();
          }
    })
  }

  async getWorkExperienceDetails() {
    await this.candidateSrv.getWorkExperience(this.emailAddress).then(async (response) => {
      if (response) {
        this.workExperienceDetails = response;
        this.getSocialProfile();
      }
    })
  }

  async userProfileComplete(){
    await this.candidateSrv.getProfileComplete(this.emailAddress).then(async(response)=>{
       if(response){
         this.profileCompletion=response;
         this.getSocialProfile();
         console.log(  this.profileCompletion);
         
       }
     })
   }
   async getSocialProfile() {
    await this.candidateSrv.getUserProfile(this.emailAddress).then(async (response) => {
      if (response) {
        this.candidateSocial = response;
        this.getBankDetails();
        console.log(response);
      }
    })
  }

  async getBankDetails() {
    await this.empService.getBankDetails(this.emailAddress).then(async (response) => {
      if (response) {
        this.bankDetails = response;
        console.log(response);
      }
    })
  }


}
