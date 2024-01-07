import { Component, OnInit } from '@angular/core';
import { CandidateProfileService } from '../../services/candidate-profile.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { error } from 'jquery';

@Component({
  selector: 'app-user-skills',
  templateUrl: './user-skills.component.html',
  styleUrls: ['./user-skills.component.scss']
})
export class UserSkillsComponent implements OnInit {
  achievementsList:any[]=[];
  emailAddress:any="";
  coreSkillList:any[]=[];
  
    
      
  
  constructor( private candidateSrv:CandidateProfileService , private storage : StorageService ){}

  ngOnInit(): void {
      this.emailAddress = this.storage.get("useremail");
      this.getAchievements();
      this.getCoreSkills();
  }

 async  getAchievements(){
    await this.candidateSrv.getCandidateAchievements(this.emailAddress).then(async(response)=>{
       if(response){
             this.achievementsList = response[0].achievements;

             console.log(response)
             console.log(this.achievementsList)
            }
    })
  };
  async getCoreSkills(){
    await this.candidateSrv.getCandidateSkills(this.emailAddress).then(async(response)=>{
      if(response){
        this.coreSkillList = response[0].coreSkills;
        console.log(this.coreSkillList);
      } else{
        console.log(error)
      }
    })
  };
    

}
