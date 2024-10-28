import { Component, EventEmitter, Output, Input, ViewChild, SimpleChanges, ChangeDetectorRef, } from '@angular/core';
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
  @Input() userType: any;
  @Input() selectedReferral: any;
  @Output() markAsDone = new EventEmitter<string>();
  latestRejectionReason: any;
  latestUserComment: any;
  rejectedReasons: { reason: any; comment: any; } | undefined;
  feedbackTitle: string = "Rejection Feedback"
  feedbackDetails: string = "";
  modalSize: string = 'md';  // Default modal size
  showClose: boolean = false;  // Default close button visibility

  constructor(private cdrf: ChangeDetectorRef) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedReferral']) {
      this.checkReferralRejection();
    }
  }

  checkReferralRejection(): void {
    if (this.selectedReferral && this.selectedReferral?.rejectedByUserIds && this.selectedReferral?.rejectedByUserIds.length > 0) {
      const latestRejection = this.selectedReferral.rejectedByUserIds[this.selectedReferral.rejectedByUserIds.length - 1];
      this.rejectedReasons = {
        reason: latestRejection?.reason,
        comment: latestRejection?.userComment
      };
    }
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

    // Dynamically set modalSize and showClose based on modalType
    if (modalType === this.modalType.SHOW_MORE_DETAILS) {
      this.modalSize = 'lg';
      this.showClose = true;  // Show the close icon for Show More Details
    } else if (modalType === this.modalType.REJECT_DETAILS) {
      this.modalSize = 'md';
      this.showClose = false;  // Hide the close button for Reject Details
    } else {
      this.modalSize = 'md';  // Default size
      this.showClose = false;
    }

    this.cdrf.detectChanges();
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
    if (this.selectedReferral?.rejectedByUserIds?.length > 0) {
      this.openModal(ModalType.REJECT_DETAILS);
    } else if (this.selectedReferral?.rejectionFeedbackBySystem) {
      this.feedbackDetails = this.selectedReferral.rejectionFeedbackBySystem;
      this.openModal(ModalType.SHOW_MORE_DETAILS);
    }
  }
}