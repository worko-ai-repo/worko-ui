import { Component, ViewChild, Input} from '@angular/core';
import { ModalComponent } from '../../../../modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss']
})
export class BankDetailsComponent {
  @ViewChild(ModalComponent) modal!: ModalComponent;
  @Input() bankInfo: any;

  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  ngOnChanges(): void {
    console.log(this.bankInfo, "bankInfo");
    if(this.bankInfo){
      this.bankInfo = this.bankInfo[0];
    }
  }

  async openEditBankModal(event: Event): Promise<void> {
    event.preventDefault();
    // this.userLoggedIn = await this.cognitoService.isLoggedIn();
    // this.reqGuidanceData = item;
    // this.triggerReferral = false;
    // this.triggerGuidance = true;
    // if (this.userLoggedIn) {
      this.openModal(ModalType.EDIT_BANK_DETAILS);
    // } else {
    //   this.openModal(ModalType.LOGIN_SIGNUP);
    // }
  
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
      // this.referrralComponent.showReferrelRow = true;
      this.modal.cancel();
    }

}
