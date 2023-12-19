import { Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import { CompanyListingService } from '../../services/company-listing.service';
@Component({
  selector: 'app-referral-request',
  templateUrl: './referral-request.component.html',
  styleUrls: ['./referral-request.component.scss']
})
export class ReferralRequestComponent implements OnInit {
  @ViewChild('largeModal') largeModal!: ElementRef;
  @Input() selectedCompany: any;


  showReferrelRow: boolean = true;
  divShow: boolean = true;
  showContent: boolean = true;
  showLoading: boolean = false;

  subscriptionArray: any[] = [
    { "packageName": "Basic", "packageRupees": 199, "packageDuration": "3 referral / Month" },
    { "packageName": "Classic", "packageRupees": 499, "packageDuration": "10 referral / Month" },
    { "packageName": "Premium", "packageRupees": 499, "packageDuration": "25 referral / Month" },
  ];

  requestForm = {
    jobUrl: '',
  }
  showScore: boolean = false;
  subscriptionObj: any = {
    packageName: '',
    packageRupees: '',
    packageDuration: '',
  }

  referralRequestId: string = "";
  emailId: string = "prashant@worko.ai";
  constructor(private companyListing: CompanyListingService) { }
  ngOnInit(): void {

  }


  checkRequestReferral(form: any) {
    console.log(this.requestForm);
    console.log(this.selectedCompany);
    this.companyListing.getReferralCount(this.emailId).then(async (response) => {
      if (response.isSubscribed) {
        console.log("Helo");
        let count = response.referralCount;
        if (count) {
          this.createRequest();
        }
      }
    })
      .catch(error => {
        // this.setErrorMessage(error.error?.errors[0].message);
        console.error('Create Employee Error:', error);
      });
  }

  createRequest() {
    // "jobUrl":"https://jobs.netflix.com/jobs/306631088"
    let data = {
      "companySK": this.selectedCompany.SK,
      "jobUrl": this.requestForm.jobUrl
    }

    this.companyListing.createReferralRequest(this.emailId, data).then(async (response) => {
      if (response) {
        console.log("Helo11");

        if (response.referralRequestId) {
          this.referralRequestId = response.referralRequestId;
          this.showLoading = true;
          this.showReferrelRow = false;
          this.getScore(this.referralRequestId);
        }
      }
    })
      .catch(error => {
        console.error('Create Employee Error:', error);
      });
  }

  getScore(referralRequestId: string){
    this.companyListing.getMatchingScore(this.emailId, referralRequestId).then(async (response) => {
      if (response) {
        console.log("Matchingscore");
        
        this.showLoading = false;
        this.showScore = true;
      }
    })
      .catch(error => {
        console.error('Create Employee Error:', error);
      });
  }
  reqNowBtn() {
    this.showReferrelRow = false;
  }

  hideDiv() {
    this.divShow = false;
  }

}

