import { Component, Input } from '@angular/core';
import { CompanyListingService } from '../../services/company-listing.service';
import { SubscriptionPackService } from '../../services/subscription-pack.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
@Component({
  selector: 'app-referral-progress-bar',
  templateUrl: './referral-progress-bar.component.html',
  styleUrls: ['./referral-progress-bar.component.scss']
})
export class ReferralProgressBarComponent {
  @Input() score: any;
  @Input() referralId: any;
  showScore: boolean = false;
  showEmailContent: boolean = false;
  originalPoints = 2.1;
  possiblePoints = 10;
  startTime: number = Date.now();
  errorFound: boolean = false;
  cvError: boolean = false;
  jobDescription: boolean = false;
  maxDuration: number = 2 * 60 * 1000;
  texts: string[] = [
    "Matching your educational qualification",
    "Checking your responsibilities and experiences",
    "Final checks happening",
    "We are almost done"
  ];
  emailId: string = "";
  constructor(private companyListing: CompanyListingService, private storage: StorageService) { }
  ngOnInit(): void {
    this.emailId = this.storage.get("useremail");
    let index = 0;
    const interval = setInterval(() => {
      if (index < this.texts.length) {
        const element = document.getElementById('loopedText');
        if (element) {
          element.innerText = this.texts[index];
          index++;
        }
      } else {
        clearInterval(interval);
        setTimeout(async () => {
          await this.fetchScore();
        }, 300); //30000
      }
    }, 700); //7000
  }

  async fetchScore() {


    const response = await this.companyListing.getMatchingScore(this.emailId, this.referralId);
    if (response && response.matchingScore !== undefined) {
  
      if (response.matchingScore === 0) {
        const elapsedTime = Date.now() - this.startTime;
        // console.log(this.maxDuration, "maxDuration");
        // console.log(this.startTime, "startTime");
        // console.log(elapsedTime, "elapsedTime");
        if (elapsedTime < this.maxDuration) {
          setTimeout(async () => {
            await this.fetchScore();
          }, 20000);
        } 
      } else if (response.matchingScore === 251) {
          this.jobDescription = true;
          this.cvError = false;
          this.errorFound = true;
          this.showScore = false;
          this.score = 0;
        } else if (response.matchingScore === 250) {
          this.cvError = true;
          this.jobDescription = false;
          this.errorFound = true;
          this.showScore = false;
          this.score = 0;
        // } 
        // else {
        //   // alert("No score found after 2 minutes");
        //   this.cvError = true;
        //   this.errorFound = true;
        //   this.showScore = false;
        //   this.score = 0;
        // }
      } else {
        this.score = response.matchingScore;
        this.showScore = true;
      }
    
    }
  }


  onViewMore(): void {
    // Toggle the visibility of the email content
    this.showEmailContent = true;
  }

  //   getScore() {
  //     this.companyListing.getMatchingScore(this.emailId, this.referralId).then(async (response) => {
  //       if (response) {
  //         console.log("Matchingscore");
  //         if(response.matchingScore){
  //           this.score = response.matchingScore;

  //           // this.showLoading = false;
  //           this.showScore = true;
  //         }else{
  //           setTimeout(() => {

  //             this.getScore();
  //           }, 20000); 

  //         }

  //       }
  //     })
  //       .catch(error => {
  //         console.error('Create Employee Error:', error);
  //       });
  //   }
  // }

  // getScore() {
  //   const startTime = Date.now();
  //   const maxDuration = 2 * 60 * 1000; // 2 minutes
  //   this.fetchScore(startTime, maxDuration)
  // }

  //  async  fetchScore(startTime: any, maxDuration: any){
  //     const response = await this.companyListing.getMatchingScore(this.emailId, this.referralId);
  //     if (response && response.matchingScore !== undefined) {
  //       if (response.matchingScore === 0) {
  //         const elapsedTime = Date.now() - startTime;
  //         if (elapsedTime < maxDuration) {
  //           setTimeout(this.fetchScore, 20000); // Retry after 20 seconds
  //         } else {
  //           // this.showScoreError = true;
  //           alert("No Score FOubnd")
  //         }
  //       } else {
  //         this.score = response.matchingScore;
  //         this.showScore = true;
  //       }
  //     }
  //   };
}
