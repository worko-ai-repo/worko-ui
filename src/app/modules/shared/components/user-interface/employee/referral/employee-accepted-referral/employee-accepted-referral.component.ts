import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ModalComponent } from '../../../../modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChatService } from 'src/app/modules/services/chat.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { first, Subscription } from 'rxjs';
import { ChatUIComponent } from '../../../../chat-ui/chat-ui.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-accepted-referral',
  templateUrl: './employee-accepted-referral.component.html',
  styleUrls: ['./employee-accepted-referral.component.scss']
})
export class EmployeeAcceptedReferralComponent {
  @Input() empdetailsList: any = "";
  @Input() empEducationList: any = "";
  @Input() empExperienceList: any = "";
  @Input() empCoreSkillsList: any = "";
  @Input() empAchievmentsList: any = "";
  @Input() empDetails: any = {};
  @Input() empEducationDetails: any = {};
  @Input() empAchievmentsDetails: any = {};
  @Input() empCoreSkillsDetails: any = {};
  @Input() empExperienceDetails: any = {};
  @Input() selectedStatus: any;
  @Input() selectedReferral: any;
  @Input() userType: any;
  @Input() refereeDetails: any;
  @Output() markAsDone = new EventEmitter<any>();
  @Output() referralRating = new EventEmitter<any>();
  @Output() raiseIssue = new EventEmitter<any>();
  @Output() cancelRatingPopup = new EventEmitter<any>();
  showCard: boolean = false;
  action: string = "";
  scoreDetails: any = "";
  matchingScore: number = 0;
  profileImage: any;
  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  isSmallerScreen: boolean = false
  isHidden: boolean = false
  // circleDiameter:number=105;
  userId: any;
  messages: any[] = [];
  groupedMessages: any[] = [];
  private messageSubscription: Subscription | null = null;
  @ViewChild(ChatUIComponent) chatUIComponent!: ChatUIComponent;
  existMessageSubscription: any;
  noMoreMessages!: boolean;

  circleDiameter: number = 98;
  successmessage!: string;
  successtitle!: string;

  private isFetchingMessagesSubscription!: Subscription;
  private errorSubscription!: Subscription;
  isFetchingMessages!: boolean;

  constructor(private breakpointObserver: BreakpointObserver, private chatService: ChatService, private storage: StorageService, private cdrf: ChangeDetectorRef, private spinner: NgxSpinnerService, private router:Router) { }
  score: number = 0;
  originalPoints = 2.1;
  possiblePoints = 100;
  isEmployeeReferralPage = true;

  ngOnInit(): void {
    this.breakpointObserver.observe([
      Breakpoints.Small,
      Breakpoints.Handset
    ]).subscribe(result => {
      this.isSmallerScreen = result.matches;
      if (this.isSmallerScreen) {
        this.circleDiameter = 100;
      }
    });

    // Subscribe to isFetchingMessages$ from ChatService
    this.isFetchingMessagesSubscription = this.chatService.isFetchingMessages$.subscribe(
      (value: boolean) => {
        this.isFetchingMessages = value;

        // Show/hide spinner based on isFetchingMessages
        if (!this.isFetchingMessages) {
          this.spinner.hide();
        }
      }
    );

    // Subscribe to onError from ChatService
    this.errorSubscription = this.chatService.onError().subscribe((error) => {
      console.error("WebSocket OnMessage error:", error);
      this.spinner.hide();
      this.successmessage = "Something went wrong. Please try again after sometime";
      this.successtitle = "Error";
      this.openModal(ModalType.SUCCESS_MESSAGE);
    });

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (this.selectedReferral?.matchingScore === 251 || this.selectedReferral?.matchingScore === 250) {
      this.matchingScore = 0;
    } else {
      this.matchingScore = this.selectedReferral?.matchingScore;
    }
    this.scoreDetails = this.formatScoreDetails(this.selectedReferral?.scoreDetails);

    if (this.empdetailsList?.length > 0) {

      this.profileImage = this.empdetailsList[0].profileImageAwsS3SignedUrl ? this.empdetailsList[0]?.profileImageAwsS3SignedUrl : '/assets/public/candidate-img.png'

    }

    this.userId = this.storage.get("userId");

    if (changes['selectedReferral'] && this.selectedReferral) {
      
      this.chatService.resetState();
      this.chatUIComponent.isChatLoaded = false; // Reset chat loaded state in the child
      this.spinner.show();

      // Unsubscribe from any previous message stream
      this.unsubscribeFromMessages();
      this.groupedMessages = [];
      // Clearing the current messages to ensure we only display messages for the new referral ID
      this.messages = [];

      this.chatUIComponent.resetUI();  // Reset any UI states in the child

      // Disconnect previous WebSocket connection if any
      this.chatService.disconnect();

      this.spinner.show();
      // Connecting to the chat and subscribing to messages in one step
      this.connectAndSubscribeToMessages();

      // // Checking if the status is ACCEPTED before connecting
      // if (this.selectedReferral.status === 'ACCEPTED') {
      //   // Connecting to the chat and subscribing to messages in one step
      //   this.connectAndSubscribeToMessages();
      // }
    }

  }

  ngOnDestroy(): void {
    // Cleaning up the subscription on destroy
    this.unsubscribeFromMessages();
    this.isFetchingMessagesSubscription.unsubscribe();
    this.chatService.disconnect();
    // Unsubscribe from onError
    this.errorSubscription.unsubscribe();
  }

  unsubscribeFromMessages(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  connectAndSubscribeToMessages(): void {
    this.chatService.connect(this.userId, this.getSlicedValue(this.selectedReferral?.SK))
      .then(() => {
        this.subscribeToIncomingMessages();
        this.getExistingMessages();
      })
      .catch((error) => {
        console.error("WebSocket connection error: ", error);
        this.spinner.hide();
        this.successmessage = "Something went wrong. Please try again after sometime"
        this.successtitle = "Error"
        this.openModal(ModalType.SUCCESS_MESSAGE);
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

  getExistingMessages(isScrollToTop = false): void {

    // Unsubscribe from previous subscription if exists
    if (this.existMessageSubscription) {
      this.existMessageSubscription.unsubscribe();
    }

    this.existMessageSubscription = this.chatService.onMessage().subscribe((response) => {
      // console.log("response from get existing", response);
      // this.messages = response.messages;
      const messagesArray = Object.values(response.messages).filter(
        (item) => typeof item === "object" && item?.hasOwnProperty("text")
      );

      // Reverse the messages to show older ones at the top
      const reversedMessages = messagesArray.reverse();
      // Check for duplicates and merge messages
      this.messages = this.mergeMessages(this.messages, reversedMessages);
      // Group messages by date
      this.groupedMessages = this.groupMessagesByDate(this.messages);

      this.spinner.hide();
      this.cdrf.detectChanges();

      // If it's a scroll-to-top pagination event, adjust the scroll in the child component
      if (isScrollToTop) {
        setTimeout(() => {
          this.chatUIComponent.adjustScrollAfterPagination();  // Calling the child's method to adjust the scroll
        }, 0);
      } else {
        // Scroll to the bottom for the initial load
        setTimeout(() => this.chatUIComponent.scrollToBottom(), 0);
      }
    });

  }

  /**
 * Merges new messages with existing messages, avoiding duplicates based on createdAt.
 * @param existingMessages - Array of currently displayed messages.
 * @param newMessages - Array of new messages to be merged.
 * @returns - Merged array of messages without duplicates.
 */
  private mergeMessages(existingMessages: any[], newMessages: any[]): any[] {
    // Create a set of existing createdAt timestamps
    const existingCreatedAtSet = new Set(existingMessages.map((msg) => msg.createdAt));

    // Filter out new messages that have the same createdAt timestamp as existing ones
    const filteredNewMessages = newMessages.filter((msg) => !existingCreatedAtSet.has(msg.createdAt));

    // Return the merged messages, with new messages at the top
    return [...filteredNewMessages, ...existingMessages];
  }

  handleIncomingMessage(response: any): void {

    if (response && typeof response === "object" && response?.hasOwnProperty("text")) {
      this.messages.push(response);

      // Re-group messages by date to include the new message
      this.groupedMessages = this.groupMessagesByDate(this.messages);
    }

    this.cdrf.detectChanges();
    setTimeout(() => this.chatUIComponent.scrollToBottom(), 0);
  }

  onLoadMoreMessages(): void {
    // console.log('Load more messages triggered');
    this.getExistingMessages(true);
    this.chatService.fetchMoreMessages(this.getSlicedValue(this.selectedReferral?.SK), this.userId);
  }

  groupMessagesByDate(messages: any[]): any[] {
    const groupedMessages: any[] = [];
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    messages.forEach((msg) => {
      const messageDate = new Date(msg.createdAt);
      const isToday = messageDate.toDateString() === today.toDateString();
      const isYesterday = messageDate.toDateString() === yesterday.toDateString();
      let groupLabel = '';

      if (isToday) {
        groupLabel = 'Today';
      } else if (isYesterday) {
        groupLabel = 'Yesterday';
      } else {
        groupLabel = messageDate.toLocaleDateString(); // Use the actual date
      }

      // Find if the group already exists, and if not, create one
      let group = groupedMessages.find(g => g.label === groupLabel);
      if (!group) {
        group = { label: groupLabel, messages: [] };
        groupedMessages.push(group);
      }

      // Add the message to the correct group
      group.messages.push(msg);
    });

    return groupedMessages;
  }

  getSlicedValue(value: string): string {
    const parts = value?.split('#');
    return parts?.length > 2 ? parts[2] : '';
  }

  // referralMarkAsDone() {
  //   this.markAsDone.emit(this.selectedReferral);
  //   // this.showReferralDetails.emit(item);
  // }

  referralReviewRating(reviewRatingData: any) {
    this.referralRating.emit({ selectedReferral: this.selectedReferral, reviewRatingData: reviewRatingData });
  }

  cancelReviewRatingPopup() {
    this.cancelRatingPopup.emit();
  }

  referralRaiseIssue(data: any) {
    this.raiseIssue.emit(data);
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

  closeDetailedPopup() {
    // this.modalSize = 'md';
    this.closeModal();
  }

  openfile(event: { preventDefault: () => void; }) {
    event.preventDefault();
    // console.log(this.docResult.awsS3SignedUrl)
    //window.open(this.docResult.awsS3SignedUrl,'_blank')
    window.open(this.empdetailsList[0]?.cvAwsS3SignedUrl, '_blank');
  }

  viewDetails() {
    // this.modalSize = 'xl';
    this.openModal(ModalType.DETAILED_ANALYSIS);
  }

  formatScoreDetails(data: string): string {
    // Replacing all occurrences of \n with <br>
    return data?.replace(/\n/g, '<br>');
  }

  openDetailsModal() {
    this.openModal(ModalType.REFERRAL_DETAILS);
  }

  continue() {
    this.closeModal();
    //window.location.reload();
  }

  cancel() {
    this.closeModal();
    this.router.navigate(['/employee/Dashboard']);
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
