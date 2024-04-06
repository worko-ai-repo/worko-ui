import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ModalComponent } from '../../../../modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';

@Component({
  selector: 'app-withdraw-referral',
  templateUrl: './withdraw-referral.component.html',
  styleUrls: ['./withdraw-referral.component.scss']
})
export class WithdrawReferralComponent {

  @Output() withdrawReferral: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(ModalComponent) modal!: ModalComponent;
  @Input() userType:any;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;

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

  withdrawBtn() {
    this.openModal(ModalType.WITHDRAW_REFERRAL);    
  }

  receiveDataFromChild(data:any) {
    this.withdrawReferral.emit(data);
    this.closeModal();
  }

}
