import { Component, ViewChild } from '@angular/core';
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
  getReferral:boolean = false;
  giveReferral:boolean = true;
  userLoggedIn: boolean = false;
  modalType = ModalType;
  showModal: ModalType | undefined;
  modalMessage: string = "";
  modalTitle: string = "";

  constructor(private router: Router, private cognitoService: CognitoService){}


//   // Reviews carousel section starts:

//   reviews = [
//     { image: '/assets/index-images-KA/card-img1.png', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', name: 'Surya Pratap Singh', role: 'Senior Developer' },
//     { image: '/assets/index-images-KA/card-img2.png', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', name: 'Aryan Kumar', role: 'Software Engineer' },
//     { image: '/assets/index-images-KA/card-img3.png', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', name: 'Rajesh Sharma', role: 'Frontend Developer' },
//     { image: '/assets/index-images-KA/card-img1.png', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', name: 'Vikram Singh', role: 'UX Designer' },
//     { image: '/assets/index-images-KA/card-img2.png', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', name: 'Akash Gupta', role: 'UI Developer' },
//     { image: '/assets/index-images-KA/card-img3.png', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', name: 'Rahul Patel', role: 'Software Engineer' }
//   ];
//   marginLeft: number = 0;
//   currentIndex: number = 0;


//   previousReview() {
//     if (this.currentIndex > 0) {
//       this.currentIndex--;
//       this.adjustMarginLeft();
//     }
//   }

//   nextReview() {
//     if (this.currentIndex < this.reviews.length - 1) {
//       this.currentIndex++;
//       this.adjustMarginLeft();
//     }
//   }

//   adjustMarginLeft() {
//     this.marginLeft = -this.currentIndex * 70; 
//   }

//  // Reviews carousel section ends:


  async ngOnInit(): Promise<void> {
    setInterval(() => {
      this.swapValues();
    }, 5000);

    this.userLoggedIn = await this.cognitoService.isLoggedIn();
  }

  swapValues() {
    const temp = this.getReferral;
    this.getReferral = this.giveReferral;
    this.giveReferral = temp;
  }

  openGetReferral() {
    // console.log("clicked");
    if (this.userLoggedIn) {
      // alert("User is Logged In")
      this.redirectToCompanyListing();
    } else {
      // console.log("Modal open");
      this.openModal(ModalType.LOGIN_SIGNUP);
    }
  }

  async redirectToCompanyListing() {
    this.router.navigateByUrl('/company-listing');
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
