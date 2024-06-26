import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { ModalComponent } from '../../../../modal/modal.component';

@Component({
  selector: 'app-provide-feedback',
  templateUrl: './provide-feedback.component.html',
  styleUrls: ['./provide-feedback.component.scss']
})
export class ProvideFeedbackComponent {

  @Input() userType: any;
  @Output() referralRating1 = new EventEmitter<any>();
  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;

  giveReviewBtn() {
    this.openModal(ModalType.PROVIDE_FEEDBACK);
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

  async receiveDataFromChild(reviewRatingData: any) {
    this.referralRating1.emit(reviewRatingData);
  
    this.closeModal();
  }

  cancelReviewRatingPopup() {
    this.closeModal();
  }
  
}
