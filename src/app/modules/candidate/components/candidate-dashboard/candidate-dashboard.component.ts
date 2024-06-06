import { Component } from '@angular/core';
import { CandidateProfileService } from '../../services/candidate-profile.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
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
  userName:any;

  constructor( private candidateSrv: CandidateProfileService, private router: Router,private storage: StorageService,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.emailAddress = this.storage.get("useremail");
    
    this.getCandidateDetails()

  }

  getSlicedValue(value: string): string {
    const parts = value?.split('#');
    if (parts && parts.length > 1) {
        return parts.length > 2 ? parts[2] : parts[1];
    }
    return '';
  }

  async getCandidateDetails() {
    this.spinner.show();
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
    if(error.status==401){
      this.spinner.hide();
     this.router.navigate(['/']);
   }
  }
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
         this.spinner.hide();
        //  console.log(  this.profileCompletion);
      //  }
     })
   }
}
