import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, NgModule, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { ChatService } from "src/app/modules/services/chat.service";
import { DatePipe, formatDate } from '@angular/common';
import { delay, Subscription } from "rxjs";
// In your chat-ui.component.ts

@Component({
  selector: "app-chat-ui",
  templateUrl: "./chat-ui.component.html",
  styleUrls: ["./chat-ui.component.scss"],
})

export class ChatUIComponent implements AfterViewInit, OnDestroy {
  @Input() noMoreMessages: boolean = false;
  @Input() isFetchingMessages: boolean = false; // To prevent multiple fetches  
  @Input() messages: any[] = [];
  @Input() groupedMessages: any[] = [];
  @Input() userId!: string;
  @Input() referralId!: string;
  newMessage = "";
  @Output() loadMoreMessages = new EventEmitter<void>();

  @ViewChild('chatContainer') chatContainerRef!: ElementRef;
  @ViewChild('topSentinel') topSentinel!: ElementRef;

  previousScrollHeight: any;
  isChatLoaded = false;

  private noMoreMessagesSubscription!: Subscription;
  private isFetchingMessagesSubscription!: Subscription;
  observer!: IntersectionObserver;

  constructor(private chatService: ChatService, private cdr: ChangeDetectorRef) { }


  ngAfterViewInit(): void {
    // this.scrollToBottom();
    const chatContainer = this.chatContainerRef.nativeElement;

    // Create an IntersectionObserver
    this.observer = new IntersectionObserver(
      (entries) => {
        // If the top sentinel is intersecting AND the scrollTop is at 0, load more messages
        if (entries[0].isIntersecting && chatContainer && this.chatContainerRef.nativeElement.scrollTop === 0) {
          if (!this.isFetchingMessages && !this.noMoreMessages) {
            this.previousScrollHeight = chatContainer.scrollHeight;
            this.loadMoreMessages.emit();
          }
        }
      },
      { threshold: 0 }
    );

    // Start observing the top sentinel element
    if (this.topSentinel) {
      this.observer.observe(this.topSentinel.nativeElement);
    }

    // Subscribe to noMoreMessages and isFetchingMessages from ChatService
    // this.noMoreMessagesSubscription = this.chatService.noMoreMessages$.subscribe(
    //   (value: boolean) => (this.noMoreMessages = value)
    // );
    // Subscribe to noMoreMessages with a delay
    this.noMoreMessagesSubscription = this.chatService.noMoreMessages$
      .pipe(delay(200)) // Add a 200ms delay (adjust as needed)
      .subscribe((value: boolean) => (this.noMoreMessages = value));
    this.isFetchingMessagesSubscription = this.chatService.isFetchingMessages$.subscribe(
      (value: boolean) => (this.isFetchingMessages = value)
    );

  }

  ngOnDestroy(): void {
    // Disconnect the observer
    if (this.observer) {
      this.observer.disconnect();
    }

    this.noMoreMessagesSubscription.unsubscribe();
    this.isFetchingMessagesSubscription.unsubscribe();
  }


  adjustScrollAfterPagination(): void {
    const element = this.chatContainerRef.nativeElement;
    const newScrollHeight = element.scrollHeight;
    element.scrollTop = newScrollHeight - this.previousScrollHeight;
  }

  /**
   * Scrolls to the bottom of the chat container.
   */
  scrollToBottom(): void {
    const chatContainer = this.chatContainerRef.nativeElement;
    chatContainer.scrollTop = chatContainer.scrollHeight;
    this.isChatLoaded = true;  // Mark chat as loaded, allowing scrolling to trigger
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const message = {
        action: "sendMessage",
        sendMessageData: {
          text: this.newMessage,
          referralId: this.referralId,
          senderId: this.userId,
        },
      };
      this.chatService.sendMessage(message);
      this.newMessage = "";
    }
  }

  formatTime(timestamp: string): string {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(timestamp, 'shortTime') || '';
  }

  /**
 * Called when there are no more messages to load.
 */
  showNoMoreMessages(): void {
    this.isFetchingMessages = false;  // Stop showing the loading indicator
    this.noMoreMessages = true;  // Setting flag here to show "No more messages"
  }

  // Reset UI states
  resetUI(): void {
    this.isFetchingMessages = false;
    this.noMoreMessages = false;
    this.isChatLoaded = false;  // Reset chat load state
  }

}
