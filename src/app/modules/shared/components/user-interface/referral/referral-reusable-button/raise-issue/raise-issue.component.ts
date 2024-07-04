import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';

@Component({
  selector: 'app-raise-issue',
  templateUrl: './raise-issue.component.html',
  styleUrls: ['./raise-issue.component.scss']
})
export class RaiseIssueComponent {

  @Input() userType:any;
  @Input() showButton: boolean = true; // Default to true
  @Output() raiseIssue1 = new EventEmitter<any>();
  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;

  // referralMarkAsDone(){
  //   this.markAsDone1.emit();
  //   // this.showReferralDetails.emit(item);
  //   this.openModal(ModalType.RAISE_ISSUE);
  // }

  raiseIssueBtnClicked() {
    this.openModal(ModalType.RAISE_ISSUE);
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

async receiveDataFromChild(raiseIssueContent:any) {
  
  this.raiseIssue1.emit(raiseIssueContent);
  this.closeModal();

}

}
