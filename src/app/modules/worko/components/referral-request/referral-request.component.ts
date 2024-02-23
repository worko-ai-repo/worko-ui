import { Component, ElementRef, OnInit, ViewChild, Input, SimpleChanges  } from '@angular/core';
import { CompanyListingService } from '../../services/company-listing.service';
import { SubscriptionPackService } from '../../services/subscription-pack.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-referral-request',
  templateUrl: './referral-request.component.html',
  styleUrls: ['./referral-request.component.scss']
})
export class ReferralRequestComponent implements OnInit {
  @ViewChild('largeModal') largeModal!: ElementRef;

  @Input() selectedCompany: any;

  showSubscription:boolean=false;
  showReferrelRow: boolean = true;
  showContent: boolean = true;
  showLoading: boolean = false;
  showsubscriptionPlan: boolean = false;
  // subscriptionList:any[]=[];
  // subscriptionArray: any[] = [
  //   { "packageName": "Basic", "packageRupees": 199, "packageDuration": "3 referral / Month", isPopular: "no" },
  //   { "packageName": "Classic", "packageRupees": 499, "packageDuration": "10 referral / Month", isPopular: "yes" },
  //   { "packageName": "Premium", "packageRupees": 499, "packageDuration": "25 referral / Month", isPopular: "no" },
  // ];

  requestForm!: FormGroup;
  showScore: boolean = false;
  // subscriptionObj:any={
  //   SK:"",
  //   amount:0,
  //   details:"",
  //   duration:0,
  //   isActive:true,
  //   name:"",
  //   referralCount:0,
  // }
  matchingScore: number = 0;
  referralRequestId: string = "";
  emailId: string = "";
  constructor(private companyListing: CompanyListingService , private subscriptionPack : SubscriptionPackService, private storage: StorageService,private formBuilder: FormBuilder,) { }
  ngOnInit(): void {
    // this.getSubcriptionPack();
    this.initializeForm();
    this.emailId = this.storage.get("useremail");
  }
  initializeForm(): void {
    this.requestForm = this.formBuilder.group({
      jobUrl: ['', [Validators.required, Validators.pattern('^https:\/\/.*$')]],
      jobDescription: ['', Validators.required]
    });
  }
  checkRequestReferral(): void {
    if (this.requestForm.valid) {
      this.companyListing.getReferralCount(this.emailId).then(async (response) => {
        if (response.isSubscribed) {
          let count = response.referralCount;
          if (count) {
            this.createRequest();
            this.requestForm.reset();
          } else {
            this.showsubscriptionPlan = true;
            this.showReferrelRow = false;
          }
        }
      }).catch(error => {
        console.error('Error:', error);
      });
    }
  }

  createRequest() {
    
    let data = {
      "companySK": this.selectedCompany.SK,
      "jobUrl": this.requestForm.value.jobUrl,
      "jdExtracted": this.requestForm.value.jobDescription
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

  getScore(referralRequestId: string) {
    this.companyListing.getMatchingScore(this.emailId, referralRequestId).then(async (response) => {
      if (response) {
        console.log("Matchingscore");
        this.matchingScore = response.matchingScore;
        this.showLoading = false;
        this.showScore = true;
      }
    })
      .catch(error => {
        console.error('Create Employee Error:', error);
      });
  }

  // getSubcriptionPack(){
  //   this.subscriptionPack.getSubscription().subscribe({
  //       next: (response) => {
  //         console.log(response);
  //          this.subscriptionList = response.data;
          
  //       },
  //       error: (error) => {
  //         debugger;
  //         console.error(error);
          
          
  //       },
  //       complete: () => {
         
  //       }
  //     });
  //   }

  receiveDataFromChild(data: any){
    alert("payment done")
  }

  receieveError(data: any){
    alert("payment failed")
  }

}

