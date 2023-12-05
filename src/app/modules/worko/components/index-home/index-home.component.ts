import { Component, OnInit, ViewChild } from '@angular/core';
import { PopUpService } from '../../../services/pop-up.service';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';

@Component({
  selector: 'app-index-home',
  templateUrl: './index-home.component.html',
  styleUrls: ['./index-home.component.scss']
})
export class IndexHomeComponent {
  @ViewChild(ModalComponent) modal!: ModalComponent;

  modalMessage: string = "";
  modalTitle: string = "";
  modalType = ModalType;
  showModal: ModalType | undefined;

  constructor(private PopUpService:PopUpService) {}

  showPopup() {
    this.PopUpService.showPopup();
  }
  isDivOpen: boolean = true;

  toggleDiv() {
    this.isDivOpen = !this.isDivOpen;
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

    openLogin(){
      this.openModal(ModalType.LOGIN_SIGNUP);
    }

}
