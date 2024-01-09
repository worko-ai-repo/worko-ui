import { Component, Input, OnInit } from '@angular/core';
import { CandidateProfileService } from '../../services/candidate-profile.service';
import * as data from 'src/assets/data/data.json';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { error } from 'jquery';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit{
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
  userDescription: string = "";
currentStep: number = 1;
// emailAddress:any="";
candidatePersonalDetails:any={};
candidateProfessionalDetails:any={};
candidateUploadDetails:any={};

constructor(private candidateSrv:CandidateProfileService , private storage: StorageService){}
ngOnInit(): void {
  
  this.emailAddress = this.storage.get("useremail");
  this.getCandidateDetails();
}
// post //
async createEducationDetails(){
  let data = 
    [
    {
    "passingYear": this.candidatePersonalDetails.passingYear,
    "collage":this.candidatePersonalDetails.collegeName ,
    "degree": this.candidatePersonalDetails.collegeDegree,
    },
     
    {
      "passingYear": this.candidatePersonalDetails.passingYear1,
    "collage": this.candidatePersonalDetails.collegeName1,
    "degree": this.candidatePersonalDetails.collegeDegree1,
    }
  ]
  await this.candidateSrv.createEducation(this.emailAddress , data).then(async(response)=>{
    
   })
 
};
 async createUserDetails(){
  let userDetails:any =
  
    {
        "ECTC": this.candidatePersonalDetails.ectc,  
        "location":this.candidateProfessionalDetails.location ,
        "coverLetter": this.candidateUploadDetails.coverLetter,
        "name": this.candidatePersonalDetails.name,
        "CTC": this.candidatePersonalDetails.ctc,
        "emailList": {
            "primary": this.candidatePersonalDetails.email,
        },
        "CV":this.candidateUploadDetails.uploadCV ,
        "about":this.candidatePersonalDetails.about ,
        "number":this.candidatePersonalDetails.phoneNo ,
        "noticePeriod": this.candidateProfessionalDetails.noticePeriod,
        
    }

await this.candidateSrv.createUserDetails(this.emailAddress, userDetails).then(async(response)=>{
    
})

 };

 async createAchievements(){
  let userAchievements =
  {
    "achievements": [
      {
        "title":this.candidateProfessionalDetails.title,
        "achievDate":  this.candidateProfessionalDetails.date
      },
    
    ]
  }
 
   await this.candidateSrv.createAchievments(this.emailAddress, userAchievements).then(async(response)=>{

   })
 }
 async createSkills(){
  let skills = 
  {
    "coreSkills": [
      {
        "skillName": this.candidateProfessionalDetails.skill,
        "years": this.candidateProfessionalDetails.year,
      },
     
    ],
    "softSkills": [
      {
        "skillName": this.candidateProfessionalDetails.softSkills,
      },
      
    ],
    "certifications": [
      {
        "certName":this.candidateProfessionalDetails.certificationNames,
      },
     
    ]
  }

  await this.candidateSrv.createUserSkills(this.emailAddress , skills).then(async(response)=>{

  })
 }

 async creatSocialProfile(){
  let socialProfile= 
  {
    "twitter": [
   this.candidatePersonalDetails.socialLinktwitter
    ],
    "github": [
    this.candidatePersonalDetails.socialLinkGithub
    ],
    "linkedin": [
    this.candidatePersonalDetails.socialLinklinkdin
    ]
  }
  await this.candidateSrv.createUserProfile(this.emailAddress , socialProfile).then(async(response)=>{

  })
} 

// get//


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
      this.getAchievements();
    }
  })
}

async getAchievements() {
  await this.candidateSrv.getCandidateAchievements(this.emailAddress).then(async (response) => {
    if (response) {
      this.achievementsList = response[0].achievements;
      console.log(  this.achievementsList);
      this.getprofilelogo();
    }
  })
}

async getprofilelogo() {
  await this.candidateSrv.getUserProfile(this.emailAddress).then(async (response) => {
    if (response) {
      this.candidateSocial = response;
      console.log(response);
      this.userCertifications();
    }

  })

}

async userCertifications(){
  await this.candidateSrv.getCandidateSkills(this.emailAddress).then(async(response)=>{
     if(response){
       this.certificationList=response[0];
       this.coreSkillsLists = response[0].coreSkills;
       this.softSkillsLists = response[0].softSkills;
       console.log(  this.coreSkillsLists);
       
     }
   })
 }






  nextStep(){
  
    console.log(this.candidatePersonalDetails)
    
    console.log(this.candidateProfessionalDetails)
    if (this.currentStep < 3) {
      
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  onSuccess(){
    this.createEducationDetails()
    this.createUserDetails()
    this.createAchievements()
    this.createSkills()
    this.creatSocialProfile()
  }

}
