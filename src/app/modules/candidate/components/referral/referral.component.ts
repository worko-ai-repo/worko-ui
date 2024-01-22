import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
// import { CandidateDropdownService } from 'src/app/modules/services/candidate-dropdown.service';
import { CandidateProfileService } from '../../services/candidate-profile.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.scss']
})
export class ReferralComponent implements OnInit {
  referralList: any = "";
  emailAddress: any = "";
  selectedStatus: string = 'AWAITING';
  selectedReferral: any;
  constructor(private candidateSrv: CandidateProfileService, private storage: StorageService) { }
 
  ngOnInit(): void {
    this.emailAddress = this.storage.get("useremail");
    this.getReferral();
  }
  
  async getReferral() {
    await this.candidateSrv.getReferral(this.emailAddress, this.selectedStatus).then(async (response) => {
      if (response) {
        this.referralList = response;
        console.log(this.referralList + '123');
      }
    })
  }

  onStatusSelected(status: string): void {
    this.selectedStatus = status;
    this.getReferral();
  }

  showReferralDetails(data:any){
    this.selectedReferral = data;
  }

  getSlicedValue(value: string): string {
    const parts = value.split('#');
    return parts.length > 2 ? parts[2] : '';
  }


  async referralMarkAsDone(data: any){
    let referralId = this.getSlicedValue(data.SK);
    await this.candidateSrv.markasDoneReferral(this.emailAddress, "DONE", referralId).then(async (response) => {
      if (response) {
        // this.referralList = response;
        // console.log(this.referralList + '123');
      }
    })
  }
}
