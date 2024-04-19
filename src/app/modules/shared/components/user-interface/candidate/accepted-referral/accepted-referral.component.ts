import { Component, EventEmitter, Output, Input, ViewChild, } from '@angular/core';
import { ModalComponent } from '../../../modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
@Component({
  selector: 'app-accepted-referral',
  templateUrl: './accepted-referral.component.html',
  styleUrls: ['./accepted-referral.component.scss']
})
export class AcceptedReferralComponent {
  @Input() userType: any;
  @Input() selectedReferral: any;
  @Input() refereeDetails: any;
  @Output() markAsDone = new EventEmitter<any>();
  @Output() referralRating = new EventEmitter<any>();
  @Output() raiseIssue = new EventEmitter<any>();
  @Output() cancelRatingPopup = new EventEmitter<any>();
  action: string = "";
  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  constructor() { }

  ngOnInit(): void {
    console.log(this.selectedReferral, "selectedReferral");
  }

  ngOnChanges(): void {
    console.log(this.selectedReferral, "selectedReferral");
  }

  // referralMarkAsDone() {
  //   this.markAsDone.emit(this.selectedReferral);
  //   // this.showReferralDetails.emit(item);
  // }

  referralReviewRating(reviewRatingData: any) {
    this.referralRating.emit({ selectedReferral: this.selectedReferral, reviewRatingData: reviewRatingData });
  }

  referralRaiseIssue(raiseIssueContent: any) {
    this.raiseIssue.emit({ selectedReferral: this.selectedReferral, raiseIssueContent: raiseIssueContent });
  }

  cancelReviewRatingPopup() {
    this.cancelRatingPopup.emit();
  }

  markAsDoneBtn() {
    // Handling the done logic here
    this.action = "mark this referral as done";
    this.openModal(ModalType.CONFIRMATION_DIALOG);
    console.log('mark as done');
  }

  doneRequest() {
    this.closeModal();
    this.action = "";
    this.markAsDone.emit(this.selectedReferral);
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
