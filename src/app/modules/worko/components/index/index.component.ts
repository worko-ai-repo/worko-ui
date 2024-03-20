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

  async ngOnInit(): Promise<void> {
    setInterval(() => {
      this.swapValues();
    }, 118000);

    this.userLoggedIn = await this.cognitoService.isLoggedIn();
  }

  swapValues() {
    const temp = this.getReferral;
    this.getReferral = this.giveReferral;
    this.giveReferral = temp;
  }

  openGetReferral() {
    console.log("clicked");
    if (this.userLoggedIn) {
      // alert("User is Logged In")
      this.redirectToCompanyListing();
    } else {
      console.log("Modal open");
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
