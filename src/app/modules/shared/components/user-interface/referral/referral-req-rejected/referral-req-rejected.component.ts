import { Component, EventEmitter, Output, Input, ViewChild, } from '@angular/core';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';

@Component({
  selector: 'app-referral-req-rejected',
  templateUrl: './referral-req-rejected.component.html',
  styleUrls: ['./referral-req-rejected.component.scss']
})
export class ReferralReqRejectedComponent {

  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  @Input() selectedReferral: any;
  @Output() markAsDone = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
    console.log(this.selectedReferral, "selectedReferral");
  }

  ngOnChanges(): void {
    console.log(this.selectedReferral, "selectedReferral");
  }

  referralMarkAsDone() {
    this.markAsDone.emit(this.selectedReferral);
    // this.showReferralDetails.emit(item);
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

  showMore() {
    this.openModal(ModalType.REJECT_DETAILS);
  }
}