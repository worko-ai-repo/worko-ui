import { Component, OnInit } from '@angular/core';
import { CandidateProfileService } from '../../services/candidate-profile.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
// import { StorageService } from 'src/app/modules/app-core/services/storage.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  candidateList:any[]=[];
  emailAddress: string = "";
  candidateDetails:any={
        "ECTC": 0,
        "referralCount": 0,
        "name": "",
        "number": 0,
        
    
  }
  constructor(private candidateSrv : CandidateProfileService , private Storage : StorageService ){}

  ngOnInit(): void {
    this.emailAddress = this.Storage.get("useremail");
      this.getCandidateDetails()
  }
  // getCandidateDetails(){
  //   this.candidateSrv.getUserDetails(this.emailAddress).{

  //   }
    getCandidateDetails() {
      this.candidateSrv.getUserDetails(this.emailAddress).subscribe ({
       next:(response)=>{
          this.candidateList = response
          this.candidateDetails = this.candidateList[0];
          console.log(response)
       },
        
        
      })
    }
}

