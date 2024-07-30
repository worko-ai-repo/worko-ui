import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';

@Component({
  selector: 'app-see-review',
  templateUrl: './see-review.component.html',
  styleUrls: ['./see-review.component.scss']
})
export class SeeReviewComponent implements OnChanges {

  ngOnChanges(changes: SimpleChanges): void {
  
  }

  @Input() userType:any;
  @Input() isHidden:boolean=false
  @ViewChild(ModalComponent) modal!: ModalComponent;
  @Input() reviewData:any;

  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;

  seeReviewBtn() {
    this.openModal(ModalType.SEE_REVIEW);
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
