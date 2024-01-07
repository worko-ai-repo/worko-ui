import { Component, OnInit, Input } from '@angular/core';
import { CandidateProfileService } from '../../services/candidate-profile.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
// import { StorageService } from 'src/app/modules/app-core/services/storage.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  @Input() candidateDetails: any = "";
  @Input() educationDetails: any = "";

  // candidateList:any[]=[];
  // educationList:any="";
  emailAddress: string = "";
  // candidateDetails:any={
  //       "ECTC": 0,
  //       "referralCount": 0,
  //       "name": "",
  //       "number": 0,
  //       "emailList": {
  //         "primary": "prashant@worko.ai"
  //     },
        
    
  // }
  // edjucationDetails:any={
  //   "degree": "",
  //   "passingYear":"",
  // }
  constructor(private candidateSrv : CandidateProfileService , private Storage : StorageService ){}

  ngOnInit(): void {
    // this.emailAddress = this.Storage.get("useremail");
      // this.getCandidateDetails()
      // this.getEducationDetails();
  }
  // getCandidateDetails(){
  //   this.candidateSrv.getUserDetails(this.emailAddress).{

  //   }
  //  async getCandidateDetails() {
  //   await  this.candidateSrv.getUserDetails(this.emailAddress).then(async(response)=> {
  //      if(response){
  //         this.candidateList = response
  //         this.candidateDetails = this.candidateList[0];
  //         console.log(response)
  //      }
        
        
  //     })
  //   }
  
  
  //  async getEducationDetails(){
  //   await  this.candidateSrv.getCandidateEducation(this.emailAddress).then(async(response)=>{
  //       if(response){
  //         this.educationList = response;
  //         this.edjucationDetails=this.educationList[0];
  //         console.log(response + "1")
  //       }
  //     })
  //   }
}

