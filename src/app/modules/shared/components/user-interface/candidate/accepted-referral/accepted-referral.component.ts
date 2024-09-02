import { Component, EventEmitter, Output, Input, ViewChild, SimpleChanges, } from '@angular/core';
import { ModalComponent } from '../../../modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChatService } from 'src/app/modules/services/chat.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
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
  isHidden:boolean=false
  userId: any;
  messages: any[] = [];
  constructor(private breakpointObserver: BreakpointObserver, private chatService: ChatService, private storage: StorageService) {}

  ngOnInit(): void {
    this.breakpointObserver.observe([
      Breakpoints.Small,
      Breakpoints.Handset
    ]).subscribe(result => {
      this.isHidden = result.matches;
    });
  
  }

  ngOnChanges(changes: SimpleChanges): void {

    this.userId = this.storage.get("userId");

    if (changes['selectedReferral'] && this.selectedReferral) {
      // Checking if the status is ACCEPTED before connecting
      if (this.selectedReferral.status === 'ACCEPTED') {

        // Connecting to the chat with the selected referral ID and user ID
        this.chatService.connect(this.userId, this.getSlicedValue(this.selectedReferral?.SK));

        // Fetch existing messages
        this.chatService.getMessages(this.getSlicedValue(this.selectedReferral?.SK), this.userId);

        // Subscribe to new messages
        this.chatService.onMessage().subscribe(message => {
          if (message.referralId === this.getSlicedValue(this.selectedReferral?.SK)) {  //this.getSlicedValue(this.selectedReferral?.SK) is referral Id here
            this.messages.push(message);
          }
        });

      }
    }
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
  }

  // referralMarkAsDone() {
  //   this.markAsDone.emit(this.selectedReferral);
  //   // this.showReferralDetails.emit(item);
  // }

  getSlicedValue(value: string): string {
    const parts = value?.split('#');
    return parts?.length > 2 ? parts[2] : '';
  }

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
   
  }

  doneRequest() {
    this.closeModal();
    this.action = "";
    this.markAsDone.emit(this.selectedReferral);
  }

  openDetailsModal() {
    this.openModal(ModalType.REFERRAL_DETAILS);
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
