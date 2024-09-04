import { Component, EventEmitter, Output, Input, ViewChild, SimpleChanges, ChangeDetectorRef, ElementRef, } from '@angular/core';
import { ModalComponent } from '../../../modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChatService } from 'src/app/modules/services/chat.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { first, Subscription } from 'rxjs';
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
  isHidden: boolean = false
  userId: any;
  messages: any[] = [];
  private messageSubscription: Subscription | null = null;
  @ViewChild('chatMessagesContainer') private chatMessagesContainer: ElementRef | undefined;
  constructor(private breakpointObserver: BreakpointObserver, private chatService: ChatService, private storage: StorageService, private cdrf: ChangeDetectorRef) { }

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
      // Unsubscribe from any previous message stream
      this.unsubscribeFromMessages();

      // Clearing the current messages to ensure we only display messages for the new referral ID
      this.messages = [];
      // Disconnect previous WebSocket connection if any
      this.chatService.disconnect();

      // Checking if the status is ACCEPTED before connecting
      if (this.selectedReferral.status === 'ACCEPTED') {
        // Connecting to the chat and subscribing to messages in one step
        this.connectAndSubscribeToMessages();
      }
    }
  }

  ngOnDestroy(): void {
    // Cleaning up the subscription on destroy
    this.unsubscribeFromMessages();
    this.chatService.disconnect();
  }

  ngAfterViewChecked(): void {
    if (this.chatMessagesContainer) {
      this.scrollToBottom();
    }
  }

  scrollToBottom(): void {
    const container = this.chatMessagesContainer?.nativeElement;
    container.scrollTop = container?.scrollHeight;
  }

  unsubscribeFromMessages(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  // referralMarkAsDone() {
  //   this.markAsDone.emit(this.selectedReferral);
  //   // this.showReferralDetails.emit(item);
  // }

  connectAndSubscribeToMessages(): void {
    this.chatService.connect(this.userId, this.getSlicedValue(this.selectedReferral?.SK))
      .then(() => {
        this.subscribeToIncomingMessages();
        this.getExistingMessages();
      })
      .catch((error) => {
        console.error("WebSocket connection error: ", error);
      });
  }

  subscribeToIncomingMessages(): void {
    this.messageSubscription = this.chatService.onMessage().subscribe((response) => {
      // Only handle new incoming messages here
      if (response.eventName !== "getMessages") {
        this.handleIncomingMessage(response);
      }
      this.cdrf.detectChanges();
    });
  }

  getExistingMessages(): void {
    this.chatService.onMessage().pipe(
      first((response) => response.eventName === "getMessages")
    ).subscribe((response) => {
      console.log("response from get existing", response);
      // this.messages = response.messages;
      const messagesArray = Object.values(response.messages).filter(
        (item) => typeof item === "object" && item?.hasOwnProperty("text")
      );

      this.messages.push(...messagesArray);
      this.cdrf.detectChanges();
    });
  }

  handleIncomingMessage(response: any): void {
    // if (response.eventName === "getMessages") {
    //   const messagesArray = Object.values(response).filter(
    //     (item) => typeof item === "object" && item?.hasOwnProperty("text")
    //   );

    //   this.messages.push(...messagesArray);
    // } else 
    if (response && typeof response === "object" && response?.hasOwnProperty("text")) {
      this.messages.push(response);
    }
  }

  // connectAndSubscribeToMessages(): void {
  //   this.chatService.connect(this.userId, this.getSlicedValue(this.selectedReferral?.SK)).then(() => {
  //     // Subscribe to incoming messages after successful connection
  //     this.messageSubscription = this.chatService.onMessage().subscribe((response) => {
  //       console.log(response); // log the response to understand its structure

  //     // Check if the response is an array-like object or a single message
  //     if (response.eventName === "getMessages") {
  //       // If it's an array-like response
  //       const messagesArray = Object.values(response).filter(
  //         (item) => typeof item === "object" && item?.hasOwnProperty("text")
  //       );

  //       messagesArray.forEach((message) => {
  //         this.messages.push(message);
  //       });
  //     } else {
  //       // If it's a single message response
  //       const message = response;
  //       if (message && typeof message === "object" && message.hasOwnProperty("text")) {
  //         this.messages.push(message);
  //       }
  //     }

  //       // Trigger change detection
  //       this.cdrf.detectChanges();
  //       console.log(this.messages);
  //     });
  //   });
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
