import { Component, OnInit, Input } from '@angular/core';
import { CandidateProfileService } from '../../services/candidate-profile.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';

@Component({
  selector: 'app-user-profile-complete',
  templateUrl: './user-profile-complete.component.html',
  styleUrls: ['./user-profile-complete.component.scss']
})
export class UserProfileCompleteComponent implements OnInit {
  @Input() candidateImage: any = "";
  // candidateLogos:any[]=[];
  // emailAddress: string = "";
  constructor(private candidateSrv : CandidateProfileService , private Storage : StorageService){}

  ngOnInit(): void {
    // this.emailAddress = this.Storage.get("useremail");
    // this.getprofilelogo()
  }


//   async getprofilelogo(){
//    await this.candidateSrv.getUserProfile(this.emailAddress).then(async (response)=> {
//           if(response) {
//              this.candidateLogos = response;
//              console.log(response)
//             }

// })
 
// }

}
