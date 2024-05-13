import { Component, HostListener, ViewChild } from '@angular/core';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { Router } from '@angular/router';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {
  @ViewChild(ModalComponent) modal!: ModalComponent;
  getReferral: boolean = true;
  giveReferral: boolean = false;
  userLoggedIn: boolean = false;
  modalType = ModalType;
  showModal: ModalType | undefined;
  modalMessage: string = "";
  modalTitle: string = "";
  userType :  string = "";
  // refereeBenefits: any;
  // purposeList: any;
  // candidateBenefits: any;

  constructor(private router: Router, private cognitoService: CognitoService) { }


    // Reviews carousel section starts:

    reviews = [
      { image: "/assets/index-images-KA/card-img1.png", content: "After reaching out to numerous connections on LinkedIn without much success, I turned to Worko for help. The team went above and beyond to assist me in securing referrals, and within a few weeks, I started receiving interview calls from some of the companies I applied to.", name: "Surya Pratap Singh", company: "EY" },
      { image: "/assets/index-images-KA/card-img2.png", content: "Worko not only helped me secure referrals at my dream companies but also provided invaluable support during the interview process. The Interview Handholding service from senior employee was immensely helpful and aided me greatly in my preparation.", name: "Aditya Raj", company: "Flipkart" },
      { image: "/assets/index-images-KA/card-img3.png", content: "Worko's Peer 2 Peer hiring approach is truly revolutionary. Unlike other platforms, they never bombard me with random CVs. Instead, I find top-tier candidates perfectly matched to our requirements. Not only have I earned a significant referral bonus, but my HR team is also thrilled with the quality of candidates I refer", name: "A referee from Paytm", company: "Paytm" },
      { image: "/assets/index-images-KA/card-img1.png", content: "Despite applying to jobs on various portals like Naukri and IIMjobs, I wasn't making any headway. Thanks to Worko, not only did I secure strong referrals, but I also received interview calls, which was a game-changer for me.", name: "Avijit Sarkar", company: "Amazon" },
      { image: "/assets/index-images-KA/card-img2.png", content: "When I faced rejection for not receiving a referral on Worko, I reached out to their team for assistance. I was impressed by the detailed help I received, from CV preparation to finding the right job opportunities. Thanks to Worko, I found the platform to be a much-needed blessing.", name: "Rahul Kumar", company: "Swiggy" },
      { image: "/assets/index-images-KA/card-img3.png", content: "I initially referred candidates on Worko out of goodwill, even though my previous company lacked a referral policy. Little did I know that this act of kindness would come full circle. When I found myself laid off months later, Worko stepped in, offering their services free of charge. Their empathy, honesty, and transparency ultimately helped me secure a new job within just two months. Worko's support proved invaluable, showcasing their commitment to their users' success.", name: "A Referee from Amazon", company: "Amazon" },
      { image: "/assets/index-images-KA/card-img1.png", content: "I want to express my gratitude for creating Worko. It's a much-needed platform today. The website experience and referral process are seamless. Your personalized approach to engaging with job seekers is commendable and will likely lead to positive word-of-mouth marketing. Achieving so much in such a short time is impressive. Best of luck to your team!", name: "Amit Jetwani", company: "CareEdge group" },
      { image: "/assets/index-images-KA/card-img1.png", content: "Unlike other chaotic platforms, Worko's Peer 2 Peer hiring approach has made finding quality candidates a breeze. No longer do I have to sift through unfiltered resumes. With Worko, I easily find experienced and vetted candidates, maximizing my referral bonus.", name: "A Referee from Muthoot Fincorp", company: "Muthoot Fincorp" },
      { image: "/assets/index-images-KA/card-img2.png", content: "I had been struggling to make headway in my job search, especially at the companies I aspired to work for. Worko came to my rescue, offering not only referral but also personalized guidance on resume improvement. With Worko's assistance, I finally managed to land an interview & then job at my dream company!", name: "Sanchit Kaur", company: "Walmart" },
      { image: "/assets/index-images-KA/card-img3.png", content: "My lack of attendance at a Tier-1 college posed challenges in securing interviews at top companies. Thanks to Worko, I found someone who not only referred me to Google but also provided invaluable guidance throughout the interview process. Worko truly opened doors for me at Google.", name: "Rohan Kumar", company: "Google" }
    ];

    marginLeft: number = -25; 
    marginLeftmd: number = -66;
    marginLeftsm: number = -78;
    currentIndex: number = 0;
    prevButtonDisabled: boolean = false;
    nextButtonDisabled: boolean = false;

    previousReview() {
      console.log(this.currentIndex);
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.nextButtonDisabled = false;
        this.adjustMarginLeft();
      }else {
          
          this.prevButtonDisabled = true;
          this.marginLeft = 3;
          this.marginLeftmd = 3;
          this.marginLeftsm = 6;
          // const lastReview = this.reviews.pop()!;
          // this.reviews.unshift(lastReview);
        }
        // this.adjustMarginLeft();
    }

    nextReview() {
      if (this.currentIndex < this.reviews.length - 3) {
        this.currentIndex++;
        this.prevButtonDisabled = false;
        this.adjustMarginLeft();
      } else {
        
        this.nextButtonDisabled = true;
        // const lastReview = this.reviews.pop()!;
        // this.reviews.unshift(lastReview);
        this.marginLeft = -15 -(this.currentIndex) * 50 -52;
        this.marginLeftmd =  -(this.currentIndex + 1) * 80 - 70;
        this.marginLeftsm = -(this.currentIndex + 1) * 80 - 140;
      }
      // this.adjustMarginLeft();
    }

    adjustMarginLeft() {
      this.marginLeft = -26 -this.currentIndex * 50.5 - this.currentIndex; 
      this.marginLeftmd = -66 - this.currentIndex * 80 - this.currentIndex;
      this.marginLeftsm = -78 - this.currentIndex * 88 - this.currentIndex;
    }

   // Reviews carousel section ends:


  // activeSection = 'peer';

  // @HostListener('window:scroll', [])
  // onWindowScroll() {
  //   const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
  //   const windowHeight = window.innerHeight;
  //   const sectionHeight = windowHeight;

  //   if (scrollPosition < sectionHeight) {
  //     this.activeSection = 'peer';
  //   } else if (scrollPosition < 2 * sectionHeight) {
  //     this.activeSection = 'feedback';
  //   } else {
  //     this.activeSection = 'smart';
  //   }
  // }

  async ngOnInit(): Promise<void> {
    setInterval(() => {
      this.swapValues();
    }, 6000);

    this.userLoggedIn = await this.cognitoService.isLoggedIn();
  }

  swapValues() {
    const temp = this.getReferral;
    this.getReferral = this.giveReferral;
    this.giveReferral = temp;
  }

  openGetReferral() {
    if (this.userLoggedIn) {
      this.redirectToEmployeeReferral();
    } else {
      this.userType = "employee";
      this.openModal(ModalType.LOGIN_SIGNUP);
    }
  }

  async redirectToCompanyListing() {
    this.router.navigateByUrl('/company-listing');
  }

  async redirectToEmployeeReferral() {
    this.router.navigateByUrl('/employee/Referral');
  }


  /**
   * Open modal.
   *
   * @param {ModalType} modalType
   * @param {string} [message = ""]
   * @param {string} [title = ""]
   * @returns {void}
   */
  openModal(modalType: ModalType, message: string = "", title: string = ""): void {
    this.showModal = modalType;
    this.modalMessage = message;
    this.modalTitle = title;
    this.modal.open();
  }
  /**
   * Close modal.
   *
   * @returns {void}
   */
  closeModal(): void {
    this.modal.cancel();
  }

  async receiveDataFromChild(userType: any) {
    console.log(userType);
    this.closeModal();
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
    if (this.userLoggedIn) {
      if (userType == "CAND") {
        this.router.navigate(['/candidate/dashboard']);
      } else {
        this.router.navigate(['/employee/Dashboard']);
      }
    }
  }

  purposeList = [
    {
      image: '/assets/index-images-KA/purpose1.png', title: "Peer-to-Peer Hiring", text: "We facilitate connections between candidates and employees, helping candidates secure referrals and employees maximise referral bonuses."
    },
    {
      image: '/assets/index-images-KA/purpose2.png', title: " Interview Hand Holding", text: "During the hiring process, have an internal employee vouch and follow-up for you and provide guidance at each step"
    },
    {
      image: '/assets/index-images-KA/purpose3.png', title: "Feedback & Transparency", text: "We offer comprehensive job application analysis, recruiter feedback for every referral, and an application status report"
    },
    {
      image: '/assets/index-images-KA/purpose4.png', title: "Career Guidance", text: "While candidates can get guidance from industry experts, employees can offer their services and earn, creating a win-win path to success."
    },
    {
      image: '/assets/index-images-KA/purpose5.png', title: "Smart Matching Algorithm", text: "Our advanced algorithm provides detailed feedback and scores to candidates, highlighting their suitability. It informs employees why a referral would be ideal, enhancing the quality of recommendations"
    },
    {
      image: '/assets/index-images-KA/purpose6.png', title: " Access to Hidden Job", text: "Get access to hidden jobs that are not available on any other platform"
    }
  ]

  refereeBenefits = [
    {
      image: '/assets/index-images-KA/rbenefits1.png', text: " Get pre-vetted candidates for referral through our smart matching algorithm."
    },
    {
      image: '/assets/index-images-KA/rbenefits2.png', text: "Refer best of talent and maximise corporate referral bonus."
    },
    {
      image: '/assets/index-images-KA/rbenefits3.png', text: " Earn through mock interviews, referrals and mentorship."
    },
    {
      image: '/assets/index-images-KA/rbenefits4.png', text: "Extend a hand today, and when you need it, the universe echoes your kindness."
    },
    {
      image: '/assets/index-images-KA/rbenefits5.png', text: " Your anonymity, assured and preserved"
    },
  ]

  candidateBenefits = [
    {
      image: '/assets/index-images-KA/cbenefits1.png', text: "Get reviewed and referred by the best employees."
    },
    {
      image: '/assets/index-images-KA/cbenefits2.png', text: " Increase chances of interview calls by 20X!"
    },
    {
      image: '/assets/index-images-KA/cbenefits3.png', text: " Support and guidance from an internal employee throughout the hiring process."
    },
    {
      image: '/assets/index-images-KA/cbenefits4.png', text: " AI-powered profile analysis to provide feedback and guidance on the right job"
    },
    {
      image: '/assets/index-images-KA/cbenefits5.png', text: " Get resume reviewed, career guidance, mock interview from senior industry professionals"
    },
  ]
}

