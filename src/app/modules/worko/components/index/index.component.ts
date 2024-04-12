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
  getReferral: boolean = false;
  giveReferral: boolean = true;
  userLoggedIn: boolean = false;
  modalType = ModalType;
  showModal: ModalType | undefined;
  modalMessage: string = "";
  modalTitle: string = "";
  userType :  string = "";

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
    }, 2000);

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
}
