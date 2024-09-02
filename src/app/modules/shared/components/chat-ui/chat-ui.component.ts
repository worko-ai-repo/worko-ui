import { Component, Input } from '@angular/core';
import { ChatService } from 'src/app/modules/services/chat.service';

@Component({
  selector: 'app-chat-ui',
  templateUrl: './chat-ui.component.html',
  styleUrls: ['./chat-ui.component.scss']
})
export class ChatUIComponent {

  @Input() messages: any[] = [];
  @Input() userId!: string;
  @Input() referralId!: string;
  newMessage = '';

  constructor(private chatService: ChatService) {}

  ngOnChanges(): void {
    // This will handle the incoming messages and update the UI
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const message = {
        action: "sendMessage",
        messageData: {
          text: this.newMessage,
          referralId: this.referralId,
          senderId: this.userId
        }
      };
      this.chatService.sendMessage(message);
      this.newMessage = '';
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
