import { Component, ViewChild } from '@angular/core';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  userLoggedIn: boolean = false;
  constructor(private cognitoService: CognitoService) { }


  async ngOnInit(): Promise<void> {
    this.userLoggedIn = await this.cognitoService.isLoggedIn();


  }

  async logout(): Promise<void> {
    await this.cognitoService.handleSignOut();
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
  }

  async receiveDataFromChild(data: any){
    // this.userLoggedIn = await this.cognitoService.isLoggedIn();

  }

  async openLogin() {
    if (this.userLoggedIn) {
      alert("User is Logged In")
    } else {
      this.openModal(ModalType.LOGIN_SIGNUP);
    }
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

}
