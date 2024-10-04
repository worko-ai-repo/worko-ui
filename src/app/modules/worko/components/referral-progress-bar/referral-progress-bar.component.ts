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
  @Input() referralId: any;
  showScore: boolean = false;
  showEmailContent: boolean = false;
  originalPoints = 2.1;
  possiblePoints = 100;
  startTime: number = Date.now();
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
  constructor(private companyListing: CompanyListingService, private storage: StorageService,private router: Router) { }
  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.score);
  }
  ngOnInit(): void {
    // console.log("current score is", this.score);
    this.emailId = this.storage.get("useremail");
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

// console.log("score",this.showScore)
// console.log("feeback",this.showFeedback)

  
  }
  routeToReferral(){
    this.router.navigate(['/candidate/referral']);
  }

  async fetchScore() {
    try{

    const fetchScoreWithRetry = async () => {
      const response = await this.companyListing.getMatchingScore(this.emailId, this.referralId);

      if (response && response.matchingScore !== undefined) {

        // this.feedbackDetails = "Feedback:\n\n- The job description specifically mentions a preference for experience with TypeScript, which is not listed among your technical skills.\n- While you have experience with front-end development using JavaScript frameworks like React and Angular, the job requires expertise in building reusable UX components or libraries, which is not explicitly mentioned in your resume.\n- The job requires 3+ years of professional front-end, web, or mobile software development experience, but based on the information provided, your experience appears to be around 5 years, which may not meet the minimum requirement.\n\nSuitable roles:\n\n- Full-Stack Developer: Your experience with both front-end (React, HTML, CSS, JavaScript) and back-end technologies (Node.js) makes you a suitable candidate for full-stack developer roles.\n- Front-End Developer: While you may not meet all the preferred qualifications for the specific role at Amazon, your skills in front-end development using React, JavaScript, HTML, and CSS make you a strong candidate for other front-end developer positions.\n- Software Engineer: Your Bachelor's degree in Computer Science and experience in software development, problem-solving, and algorithm design align well with software engineering roles across various industries.\n- Web Developer: Your expertise in web development technologies like HTML, CSS, JavaScript, and frameworks like React and Angular make you a good fit for web developer roles.\n\nRemember, while you may not be an ideal match for this particular role, your skills and experience can be valuable assets for other suitable positions. It's essential to highlight your strengths and align them with the job requirements during the application and interview process."
        if(response?.rejectionFeedbackBySystem) {
          this.feedbackDetails = response?.rejectionFeedbackBySystem;
        }
        else {
          this.feedbackDetails = "";
        }
        
        const elapsedTime = Date.now() - this.startTime;

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
         
          if (response.jdMatchErrorCode === 250) {
            this.response.emit();
            this.jobDescription = false;
            this.errorFound = true;
            this.showScore = false;
            this.cvError = true;
          } else if (response.jdMatchErrorCode === 251) {
            this.response.emit();
            this.cvError = false;
            this.jobDescription = true;
            this.errorFound = true;
            this.showScore = false;
          }
        } else if (response.jdMatchErrorCode === 200) {
          this.response.emit();
          this.score = response.matchingScore;
          this.showScore = true;
          if (this.score >= 70) {
            this.showScore = true;
      
            // Display the message for 5 seconds and then navigate
            setTimeout(() => {
              this.showScore = false;  // Hide the message after 5 seconds
              this.router.navigate(['/candidate/referral']);  // Navigate to another component
            }, 5000);  // 5000 ms = 5 seconds
          }
        }
      }
    };

    // Start the initial call
    await fetchScoreWithRetry();
  }catch(error:any){
    if (error.status==404) { 
   
      this.router.navigate(['/auth/logout']);
    }else if (error.status==401){
   
     this.router.navigate(['/']);
    }else{
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
