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
  isPaginationEnabled = false; // Flag to control pagination

  @ViewChild('chatContainer') chatContainerRef!: ElementRef;
  @ViewChild('topSentinel') topSentinel!: ElementRef;

  previousScrollHeight: any;
  isChatLoaded = false;

  private noMoreMessagesSubscription!: Subscription;
  private isFetchingMessagesSubscription!: Subscription;
  observer!: IntersectionObserver;
  timeoutId!: any;

  constructor(private chatService: ChatService, private cdr: ChangeDetectorRef) { }


  ngAfterViewInit(): void {
    // this.scrollToBottom();
    const chatContainer = this.chatContainerRef.nativeElement;

    // Create an IntersectionObserver
    this.observer = new IntersectionObserver(
      (entries) => {
        // If the top sentinel is intersecting AND the scrollTop is at 0, load more messages
        if (entries[0].isIntersecting && chatContainer && this.chatContainerRef.nativeElement.scrollTop === 0 && this.isChatLoaded) {
          this.isPaginationEnabled = true;
          // Starting timeout to hide the "No more messages" indicator
          this.timeoutId = setTimeout(() => {
            this.isPaginationEnabled = false; // Hide the indicator
          }, 3000);
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
    this.noMoreMessagesSubscription = this.chatService.noMoreMessages$.subscribe(
      (value: boolean) => (this.noMoreMessages = value)
    );
    // Subscribe to noMoreMessages with a delay
    // this.noMoreMessagesSubscription = this.chatService.noMoreMessages$
    //   .pipe(delay(200)) // Add a 200ms delay (adjust as needed)
    //   .subscribe((value: boolean) => (this.noMoreMessages = value));
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
    clearTimeout(this.timeoutId);
  }


  adjustScrollAfterPagination(): void {
    const element = this.chatContainerRef.nativeElement;
    const newScrollHeight = element.scrollHeight;
    element.scrollTop = newScrollHeight - this.previousScrollHeight;
  }

  /**
   * Scrolls to the bottom of the chat container.
   */
  // scrollToBottom(): void {
  //   const chatContainer = this.chatContainerRef.nativeElement;
  //   chatContainer.scrollTop = chatContainer.scrollHeight;
  //   this.isChatLoaded = true;  // Mark chat as loaded, allowing scrolling to trigger
  // }

  scrollToBottom(): void {
    try {
      const chatContainer = this.chatContainerRef.nativeElement; 
      // Check if the container is scrollable or not
      const isScrollable = chatContainer.scrollHeight > chatContainer.clientHeight;
      if (isScrollable) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
        this.isChatLoaded = true;
      } else {
        // Force scroll to the bottom if the container isn't scrollable
        setTimeout(() => {
          chatContainer.scrollTop = chatContainer.scrollHeight;
          this.isChatLoaded = true;
        }, 0); //I will adjust the delay if needed to wait more for rendering
      }
    } catch (err) {
      console.error('Error scrolling to bottom: ', err);
    }
  }

  // scrollToBottom(): void {
  //   try {
  //     const chatContainer = document.querySelector('. chat-messages'); // Target the correct class here
  //     if (chatContainer) {
  //       chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the bottom of the container
  //     }
  //   } catch (err) {
  //     console.error('Scroll to bottom failed:', err);
  //   }
  // }
  

 

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

      // Trigger change detection 
      this.cdr.detectChanges();

      // setTimeout(() => {
      //   this.scrollToBottom();  // Ensure the chat scrolls to the bottom after sending the message
      // }, 100);
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
    this.isPaginationEnabled = false;
  }

}
