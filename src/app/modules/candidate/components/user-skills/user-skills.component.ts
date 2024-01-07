import { Component, OnInit, Input } from '@angular/core';
import { CandidateProfileService } from '../../services/candidate-profile.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';

@Component({
  selector: 'app-user-skills',
  templateUrl: './user-skills.component.html',
  styleUrls: ['./user-skills.component.scss']
})
export class UserSkillsComponent implements OnInit {
   @Input() achievementsList : any = "";
   @Input() coreSkillsLists : any = "";
  // achievementsList:any="";
  // emailAddress:any="";
    
      
  
  constructor( ){}

  ngOnInit(): void {
    console.log(this.coreSkillsLists);
    console.log(this.achievementsList);
      // this.emailAddress = this.storage.get("useremail");
      // this.getAchievements();
  }

//  async  getAchievements(){
//     await this.candidateSrv.getCandidateAchievements(this.emailAddress).then(async(response)=>{
//        if(response){
//              this.achievementsList = response[0].achievements;

//              console.log(response)
//              console.log(this.achievementsList)
//             }
//     })
//   }
    

}
