import { Component, OnInit } from '@angular/core';
import { CandidateProfileService } from '../../services/candidate-profile.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';

@Component({
  selector: 'app-user-skills',
  templateUrl: './user-skills.component.html',
  styleUrls: ['./user-skills.component.scss']
})
export class UserSkillsComponent implements OnInit {
  achievementsList:any="";
  emailAddress:any="";
  achievementsDetails:any={

  }
  constructor( private candidateSrv:CandidateProfileService , private storage : StorageService ){}

  ngOnInit(): void {
      this.emailAddress = this.storage.get("useremail");
      this.getAchievements();
  }

  getAchievements(){
    this.candidateSrv.getCandidateAchievements(this.emailAddress).subscribe({
       next:(response)=>{
             this.achievementsList = response;
             console.log(response)
            }
    })
  }

}
