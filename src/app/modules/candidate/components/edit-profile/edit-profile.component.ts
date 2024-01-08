import { Component, OnInit } from '@angular/core';
import { CandidateProfileService } from '../../services/candidate-profile.service';
import * as data from 'src/assets/data/data.json';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent{
currentStep: number = 1;



// createRequest() {
//   // "jobUrl":"https://jobs.netflix.com/jobs/306631088"
//   let data = {
//     "companySK": this.selectedCompany.SK,
//     "jobUrl": this.requestForm.jobUrl
//   }

//   this.companyListing.createReferralRequest(this.emailId, data).then(async (response) => {
//     if (response) {
//       console.log("Helo11");

//       if (response.referralRequestId) {
//         this.referralRequestId = response.referralRequestId;
//         this.showLoading = true;
//         this.showReferrelRow = false;
//         this.getScore(this.referralRequestId);
//       }
//     }
//   })

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

}
