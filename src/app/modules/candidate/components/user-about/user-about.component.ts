import { Component, OnInit, Input } from '@angular/core';
import { CandidateProfileService } from '../../services/candidate-profile.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';

@Component({
  selector: 'app-user-about',
  templateUrl: './user-about.component.html',
  styleUrls: ['./user-about.component.scss']
})
export class UserAboutComponent implements OnInit {
 @Input() certificationList:any;




  constructor( ){}

  ngOnInit(): void {
      // this.emailAddress= this.storage.get("useremail")
      // this.userCertifications();
  }

  // async userCertifications(){
  //  await this.candidateSrv.getCandidateSkills(this.emailAddress).then(async(response)=>{
  //     if(response){
  //       this.certificationList=response;
        
  //     }
  //   })
  // }
}



