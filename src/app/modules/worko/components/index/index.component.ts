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
      { image: '/assets/index-images-KA/card-img1.png', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', name: 'Surya Pratap Singh', role: 'Senior Developer' },
      { image: '/assets/index-images-KA/card-img2.png', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', name: 'Aryan Kumar', role: 'Software Engineer' },
      { image: '/assets/index-images-KA/card-img3.png', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', name: 'Rajesh Sharma', role: 'Frontend Developer' },
      { image: '/assets/index-images-KA/card-img1.png', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', name: 'Vikram Singh', role: 'UX Designer' },
      { image: '/assets/index-images-KA/card-img2.png', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', name: 'Akash Gupta', role: 'UI Developer' },
      { image: '/assets/index-images-KA/card-img3.png', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', name: 'Rahul Patel', role: 'Software Engineer' },      
      { image: '/assets/index-images-KA/card-img1.png', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', name: 'Surya Pratap Singh', role: 'Senior Developer' },
    ];

    marginLeft: number = -24; 
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
        this.marginLeft = -25 -(this.currentIndex) * 50 -32;
        this.marginLeftmd =  -(this.currentIndex + 1) * 80 - 70;
        this.marginLeftsm = -(this.currentIndex + 1) * 80 - 117;
      }
      // this.adjustMarginLeft();
    }

    adjustMarginLeft() {
      this.marginLeft = -25 -this.currentIndex * 50 - this.currentIndex; 
      this.marginLeftmd = -66 - this.currentIndex * 80 - this.currentIndex;
      this.marginLeftsm = -78 - this.currentIndex * 87 - this.currentIndex;
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
    }, 1000);

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

