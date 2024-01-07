import { Component } from '@angular/core';
import { CandidateProfileService } from '../../services/candidate-profile.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
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
  candidateImage: any = {};
  certificationList:any;
  coreSkillsLists: any;
  constructor(private candidateSrv: CandidateProfileService, private storage: StorageService) { }

  ngOnInit(): void {
    this.emailAddress = this.storage.get("useremail");
    this.getCandidateDetails()

  }

  async getCandidateDetails() {
    await this.candidateSrv.getUserDetails(this.emailAddress).then(async (response) => {
      if (response) {
        this.candidateList = response
        this.candidateDetails = this.candidateList[0];
        console.log(response);
        await this.getEducationDetails();
      }
    })
  }

  async getEducationDetails() {
    await this.candidateSrv.getCandidateEducation(this.emailAddress).then(async (response) => {
      if (response) {
        this.educationList = response;
        this.educationDetails = this.educationList[1];
        console.log(response + "1");
        this.getAchievements();
      }
    })
  }

  async getAchievements() {
    await this.candidateSrv.getCandidateAchievements(this.emailAddress).then(async (response) => {
      if (response) {
        this.achievementsList = response[0].achievements;
        this.coreSkillsLists = response[0].coreSkills;
        this.getprofilelogo();
      }
    })
  }

  async getprofilelogo() {
    await this.candidateSrv.getUserProfile(this.emailAddress).then(async (response) => {
      if (response) {
        this.candidateImage = response;
        console.log(response);
        this.userCertifications();
      }

    })

  }

  async userCertifications(){
    await this.candidateSrv.getCandidateSkills(this.emailAddress).then(async(response)=>{
       if(response){
         this.certificationList=response[0];
         
       }
     })
   }
}
