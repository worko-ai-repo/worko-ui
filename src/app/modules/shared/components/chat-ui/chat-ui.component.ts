import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit } from "@angular/core";
import { ChatService } from "src/app/modules/services/chat.service";

@Component({
  selector: "app-chat-ui",
  templateUrl: "./chat-ui.component.html",
  styleUrls: ["./chat-ui.component.scss"],
})
export class ChatUIComponent implements OnInit, OnChanges, OnDestroy {
  @Input() messages: any[] = [];
  @Input() userId!: string;
  @Input() referralId!: string;
  newMessage = "";

  constructor(private chatService: ChatService, private cdrf:ChangeDetectorRef) {}

  ngOnInit(): void {
    // // Subscribe to incoming messages
    // this.chatService.onMessage().subscribe((response) => {
    //   console.log(response); // log the response to understand its structure

    //   // Assuming receivedMessages is the response object
    //   const receivedMessages = response; /* response from WebSocket */
    //   const messagesArray = Object.values(receivedMessages).filter(
    //     (item) => typeof item === "object"
    //   );
    //   // Push each message to the `messages` array
    //   messagesArray.forEach((message) => {
    //     this.messages.push(message);
    //   });

    //   // Update the UI by triggering change detection
    //   this.cdrf.detectChanges();

    //   // Log the updated messages array
    //   console.log(this.messages);
    // });
  }

  ngOnDestroy(): void {
    
  }

  ngOnChanges(): void {
    console.log("messages from chat-ui-componenet ====", this.messages);
    // This will handle the incoming messages and update the UI
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const message = {
        action: "sendMessage",
        messageData: {
          text: this.newMessage,
          referralId: this.referralId,
          senderId: this.userId,
        },
      };
      this.chatService.sendMessage(message);
      this.newMessage = "";
    }
  }

  // messages = [
  //   { sender: 'Jack', text: 'Anyone is up for illustrations?' },
  //   { sender: 'You', text: 'Yes, It will decrease the loading 👍' },
  // ];
  // newMessage = '';

  // sendMessage() {
  //   if (this.newMessage.trim()) {
  //     this.messages.push({ sender: 'You', text: this.newMessage });
  //     this.newMessage = '';
  //   }
  // }
}
