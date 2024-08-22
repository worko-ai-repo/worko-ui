import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-ui',
  templateUrl: './chat-ui.component.html',
  styleUrls: ['./chat-ui.component.scss']
})
export class ChatUIComponent {

  messages = [
    { sender: 'Jack', text: 'Anyone is up for illustrations?' },
    { sender: 'You', text: 'Yes, It will decrease the loading 👍' },
  ];
  newMessage = '';

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({ sender: 'You', text: this.newMessage });
      this.newMessage = '';
    }
  }

}
