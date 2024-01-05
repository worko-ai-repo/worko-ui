import { Component, OnInit } from '@angular/core';
import { CandidateProfileService } from '../../services/candidate-profile.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';

@Component({
  selector: 'app-user-profile-complete',
  templateUrl: './user-profile-complete.component.html',
  styleUrls: ['./user-profile-complete.component.scss']
})
export class UserProfileCompleteComponent implements OnInit {
  candidateLogos:any[]=[];
  emailAddress: string = "";
  constructor(private candidateSrv : CandidateProfileService , private Storage : StorageService){}

  ngOnInit(): void {
    this.emailAddress = this.Storage.get("useremail");
    this.getprofilelogo()
  }


  getprofilelogo(){
    this.candidateSrv.getUserProfile(this.emailAddress).subscribe ({
          next:(response)=>{
             this.candidateLogos = response;
             console.log(response)
            }

})
 
}
}
