import { Component } from '@angular/core';
import { CandidateProfileService } from '../../services/candidate-profile.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-candidate-dashboard',
  templateUrl: './candidate-dashboard.component.html',
  styleUrls: ['./candidate-dashboard.component.scss']
})
export class CandidateDashboardComponent {
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
  profileCompletion:any="";
  userType="Candidate";

  constructor( private candidateSrv: CandidateProfileService, private storage: StorageService,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.emailAddress = this.storage.get("useremail");
    this.spinner.show();
    this.getCandidateDetails()

  }

  async getCandidateDetails() {
    await this.candidateSrv.getUserDetails(this.emailAddress).then(async (response) => {
      if (response) {
        this.candidateList = response
        this.candidateDetails = this.candidateList[0];
        this.userDescription = this.candidateList[0].about;
        await this.getEducationDetails();
      }
    })
  }

  async getEducationDetails() {
    await this.candidateSrv.getCandidateEducation(this.emailAddress).then(async (response) => {
      if (Array.isArray(response) && response.length > 0 ) {
        this.educationList = response;
        this.educationDetails = this.educationList[0];
      }
      this.getWorkExperienceDetails();
    })
  }

  async getWorkExperienceDetails() {
    await this.candidateSrv.getWorkExperience(this.emailAddress).then(async (response) => {
      if (Array.isArray(response) && response.length > 0 ) {
        this.workExperienceDetails = response;
       
      }
      this.getAchievements();
    })
  }


  async getAchievements() {
    await this.candidateSrv.getCandidateAchievements(this.emailAddress).then(async (response) => {
      if (Array.isArray(response) && response.length > 0 ) {
        this.achievementsList = response[0]?.achievements;
      }
      this.getSocialProfile();
    })
  }

  async getSocialProfile() {
    await this.candidateSrv.getUserProfile(this.emailAddress).then(async (response) => {
      if (Array.isArray(response) && response.length > 0 ) {
        this.candidateSocial = response; 
      }
      this.userCertifications();
    })

  }

  async userCertifications(){
    await this.candidateSrv.getCandidateSkills(this.emailAddress).then(async(response)=>{
      if (Array.isArray(response) && response.length > 0 ) {
         this.certificationList=response[0];
         this.coreSkillsLists = response[0]?.coreSkills;
         this.softSkillsLists = response[0]?.softSkills;
       }
       this.userProfileComplete();
     })
   }

   async userProfileComplete(){
    await this.candidateSrv.getProfileComplete(this.emailAddress).then(async(response)=>{
      // if (Array.isArray(response) ) {
         this.profileCompletion=response;
         console.log(  this.profileCompletion);
      //  }
     })
   }
}
