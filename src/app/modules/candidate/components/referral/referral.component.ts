import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CandidateDropdownService } from 'src/app/modules/services/candidate-dropdown.service';
import { CandidateProfileService } from '../../services/candidate-profile.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.scss']
})
export class ReferralComponent implements OnInit {
  referralList:any="";
  emailAddress:any="";
  selectedStatus: string = 'Awaiting';
  constructor( private candidateSrv : CandidateProfileService, private storage : StorageService ){}
  ngOnInit(): void {
    this.emailAddress = this.storage.get("useremail");
      this.getReferral();
  }
 async getReferral(){
   await this.candidateSrv.getReferral(this.emailAddress).then(async(responose)=>{
    if(responose){
      this.referralList = responose;
      console.log(this.referralList + '123');
    }
   })
  }
  // async getCoreSkills(){
  //   await this.candidateSrv.getCandidateSkills(this.emailAddress).then(async(response)=>{
  //     if(response){
  //       this.coreSkillList = response[0].coreSkills;
  //       console.log(this.coreSkillList);
  //     } else{
  //       console.log(error)
  //     }
  //   })
  // };

  onStatusSelected(status: string): void {
    this.selectedStatus = status;
  }
  
}
