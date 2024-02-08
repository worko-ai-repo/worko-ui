import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { CandidateProfileService } from 'src/app/modules/candidate/services/candidate-profile.service';
import { PublicProfileService } from '../../services/public-profile.service';
import { ReqGuidanceService } from '../../services/req-guidance.service';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.scss']
})
export class PublicProfileComponent implements OnInit {
  emailAddress: string = "";
  publicUserList:any[]=[];
  publicUserExperience:any="";
  publicUserSocial:any="";
  publicServiceList:any="";
  

  publicServiceDetails:any={};
  publicUserSocialDetails:any={};
  publicUserExperienceDetails:any={};
  publicUserDetails:any={};
 
 

  constructor(private candidateSrv:CandidateProfileService , private publicSrv:PublicProfileService, private storage: StorageService){}
  ngOnInit(): void {
    this.emailAddress = this.storage.get("useremail");
    
    this.getPubllicUserDetails();
    
  }

  async getPubllicUserDetails(){
    await this.candidateSrv.getUserDetails(this.emailAddress).then(async(response)=>{
      this.publicUserList = response;
      this.publicUserDetails = this.publicUserList[0];
    })
    this.getPublicUserExperience();
  }

  async getPublicUserExperience(){
    await this.candidateSrv.getWorkExperience(this.emailAddress).then(async(response)=>{
      this.publicUserExperience = response;
      this.publicUserExperienceDetails=this.publicUserExperience[0];
    })
    this.getPublicUserSocial();
  }

  async getPublicUserSocial(){
    await this.candidateSrv.getUserProfile(this.emailAddress).then(async(response)=>{
      this.publicUserSocial=response;
      this.publicUserSocialDetails=this.publicUserSocial[0];
      
    })
    this.publicServices();
  }
  async publicServices(){
    await this.publicSrv.getPublicServices(this.emailAddress).then(async(response)=>{
      this.publicServiceList=response;
      this.publicServiceDetails=this.publicServiceList[0];
     
    })
    
    
  }
  
  
}
