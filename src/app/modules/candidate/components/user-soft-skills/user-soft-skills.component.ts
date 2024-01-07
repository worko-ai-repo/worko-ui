import { Component, OnInit } from '@angular/core';
import { CandidateProfileService } from '../../services/candidate-profile.service';

@Component({
  selector: 'app-user-soft-skills',
  templateUrl: './user-soft-skills.component.html',
  styleUrls: ['./user-soft-skills.component.scss']
})
export class UserSoftSkillsComponent implements OnInit {
  softSkillsList:any[]=[];
  emailAddress:any= "";

  constructor(private candidateSrv:CandidateProfileService){}

  ngOnInit(): void {
      this.getsoftSkills();
  }

  async getsoftSkills(){
    await this.candidateSrv.getCandidateSkills(this.emailAddress).then(async(response)=>{
      if(response){
        this.softSkillsList = response[0].softSkills;
        console.log(this.softSkillsList);
      }
    })
  }



  // async getCoreSkills(){
  //   await this.candidateSrv.getCandidateSkills(this.emailAddress).then(async(response)=>{
  //     if(response){
  //       this.coreSkillList = response[0].coreSkills;
  //       console.log(this.coreSkillList);
  //     }
  //   })
  // }
}
