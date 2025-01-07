import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CompanyListingService } from '../../services/company-listing.service';
import { SubscriptionPackService } from '../../services/subscription-pack.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-referral-progress-bar',
  templateUrl: './referral-progress-bar.component.html',
  styleUrls: ['./referral-progress-bar.component.scss']
})
export class ReferralProgressBarComponent implements OnChanges {
  @Output() response = new EventEmitter<void>();

  public PASSING_SCORE = 70;
  @Input() showFeedback: boolean = false;
  @Input() score: any;
  @Input() referralId: any = "";
  @Input() jobApplicationRequestId: any = "";

  showScore: boolean = false;
  showEmailContent: boolean = false;
  originalPoints = 2.1;
  possiblePoints = 100;
  startTime!: number;
  errorFound: boolean = false;
  cvError: boolean = false;
  jobDescription: boolean = false;
  // maxDuration: number = 2 * 60 * 1000;
  //maxDuration: number = 1.5 * 60 * 1000;
  maxDuration: number = 5 * 60 * 1000;
  texts: string[] = [
    "Matching your educational qualification",
    "Checking your responsibilities and experiences",
    "Final checks happening",
    "We are almost done"
  ];
  emailId: string = "";
  feedbackDetails: any;
  feedbackTitle = "Rejection Feedback";
  constructor(private companyListing: CompanyListingService, private storage: StorageService, private router: Router) { }
  ngOnChanges(changes: SimpleChanges): void {
    // Check if referralId has changed
    // if (changes['referralId'] && changes['referralId'].currentValue) {
    //   this.emailId = this.storage.get("useremail");
    //   this.startTextLoop();
    // }
  }
  ngOnInit(): void {
    // console.log("current score is", this.score);
    this.emailId = this.storage.get("useremail");
    this.startTextLoop();
  }
  startTextLoop() {
    this.startTime = Date.now();

    let index = 0;
    const interval = setInterval(() => {
      if (index < this.texts.length) {
        const element = document.getElementById('loopedText');
        if (element) {
          element.innerText = this.texts[index];
          index++;
        }
      }
      else {
        clearInterval(interval);
        setTimeout(async () => {
          await this.fetchScore();
        }, 3000);   //30000
      }
    }, 5000); //7000
  }


  routeToReferral() {
    this.router.navigate(['/candidate/referral']);
  }

  async fetchScore() {
    try {

      // Helper function to decide which service call to use
      const fetchMatchingScore = async () => {
        if (this.jobApplicationRequestId) {
          return await this.companyListing.getJobMatchingScore(this.jobApplicationRequestId);
        } else if (this.referralId) {
          return await this.companyListing.getReferralMatchingScore(this.emailId, this.referralId);
        }
        throw new Error('Neither jobApplicationRequestId nor referralRequestId is available');
      };

      // Recursive function to handle retries
      const fetchScoreWithRetry = async () => {
        const response = await fetchMatchingScore();

        if (response && response.matchingScore !== undefined) {

          if (response?.rejectionFeedbackBySystem) {
            this.feedbackDetails = response?.rejectionFeedbackBySystem;
          }
          else {
            this.feedbackDetails = "";
          }

          const elapsedTime = Date.now() - this.startTime;

          // Switch statement to handle jdMatchErrorCode
          switch (response.jdMatchErrorCode) {
            case 250:
              this.response.emit();
              this.jobDescription = false;
              this.errorFound = true;
              this.showScore = false;
              this.cvError = true;
              break;

            case 251:
              this.response.emit();
              this.cvError = false;
              this.jobDescription = true;
              this.errorFound = true;
              this.showScore = false;
              break;

            case 200:
              this.response.emit();
              this.score = response.matchingScore;
              this.showScore = true;
              if (this.score >= 70) {
                this.showScore = true;

                // Display the message for 5 seconds and then navigate
                setTimeout(() => {
                  this.showScore = false;  // Hide the message after 5 seconds
                  if (this.jobApplicationRequestId) {
                    this.router.navigate(['/candidate/jobs']);  // Navigate to jobs component                    
                  }
                  else if (this.referralId) {
                    this.routeToReferral(); // Navigate to referral component   
                  }
                }, 5000);  // 5000 ms = 5 seconds
              }
              break;

            default:
              if (response.matchingScore === 0) {
                if (elapsedTime < this.maxDuration) {
                  setTimeout(async () => {
                    await fetchScoreWithRetry();
                  }, 20000); // Retry after 20 seconds
                } else {
                  // Maximum duration exceeded
                  this.response.emit();
                  this.jobDescription = false;
                  this.errorFound = true;
                  this.showScore = false;
                  this.cvError = true;
                }
              }
              break;
          }
        }
      };

      // Start the initial call
      await fetchScoreWithRetry();
    } catch (error: any) {
      if (error.status == 404) {

        this.router.navigate(['/auth/logout']);
      } else if (error.status == 401) {

        this.router.navigate(['/']);
      } else {
        //console.error('Create Employee Error:', error);
      }
    }
  }

  onViewMore(): void {
    // Toggle the visibility of the email content
    this.showScore = false;
    this.showFeedback = true;
    // this.showEmailContent = true;
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
