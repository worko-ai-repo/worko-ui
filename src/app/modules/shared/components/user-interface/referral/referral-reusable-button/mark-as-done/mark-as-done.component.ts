import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';

@Component({
  selector: 'app-mark-as-done',
  templateUrl: './mark-as-done.component.html',
  styleUrls: ['./mark-as-done.component.scss']
})
export class MarkAsDoneComponent {
  @Input() userType: any;
  @Output() referralRating1 = new EventEmitter<any>();
  @Output() markAsDone1 = new EventEmitter<any>();
  @Output() cancelRatingPopup1 = new EventEmitter<any>();
  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;

  referralMarkAsDone() {
    this.markAsDone1.emit();
    // this.showReferralDetails.emit(item);
    if(this.userType === 'Candidate') {
      this.openModal(ModalType.REFERRAL_RATING);
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

  async receiveDataFromChild(reviewRatingData: any) {
    this.referralRating1.emit(reviewRatingData);
    console.log(reviewRatingData);
    this.closeModal();
  }

  cancelReviewRatingPopup() {
    this.cancelRatingPopup1.emit();
    this.closeModal();
  }

}
