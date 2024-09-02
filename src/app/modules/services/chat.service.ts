import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../worko/services/auth.service';

const API_URL = environment.apiUrl; // dev: app.dev.worko.work, prod: app.worko.ai

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private messageSubject: Subject<any> = new Subject<any>();
  private readonly chatCreationRoute = 'https://ffrtkziill.execute-api.ap-south-1.amazonaws.com/dev'; // Base URL for chat creation
  private readonly chatCreationPath = '/chat/create'; // Endpoint path only
  private readonly connectRoute = 'wss://noscx5rfo1.execute-api.ap-south-1.amazonaws.com/dev';
  private ws!: WebSocket;

  constructor(private authService: AuthService, private http: HttpClient) {}

  /**
   * Connects to the WebSocket server.
   * @param userId - The logged-in user ID.
   * @param referralId - The referral ID.
   */
  connect(userId: string, referralId: string): void {
    // Retrieve the auth token
    const authToken = this.authService.getHttpOptions().headers.get('Authorization')?.split(' ')[1] || '';
    console.log('Auth token:', authToken);

    // Construct WebSocket URL with authorization token as query parameter
    const wsUrl = `${this.connectRoute}?userId=${encodeURIComponent(userId)}&referralId=${encodeURIComponent(referralId)}&Authorization=Bearer ${encodeURIComponent(authToken)}`;
    
    // Create a new WebSocket connection
    this.ws = new WebSocket(wsUrl);

    // Event handler for connection open
    this.ws.onopen = (event) => {
      console.log('Connected to WebSocket server.');
    };

    // Event handler for incoming messages
    this.ws.onmessage = (event) => {
      let parsedMessage;
      try {
        parsedMessage = JSON.parse(event.data);
      } catch (error) {
        console.error('Error parsing message:', error);
        return;
      }
      console.log('Received message:', parsedMessage);
      this.messageSubject.next(parsedMessage);
    };

    // Event handler for connection close
    this.ws.onclose = (event) => {
      console.log('Disconnected from WebSocket server.');
    };

    // Event handler for errors
    this.ws.onerror = (event) => {
      console.error('WebSocket error:', event);
    };
  }

  /**
   * Disconnects from the WebSocket server.
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      console.log('Disconnected from WebSocket server.');
    }
  }

  /**
   * Sends a message through the WebSocket connection.
   * @param message - The message to be sent.
   */
  sendMessage(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const messageString = JSON.stringify(message);
      console.log('Sending message:', messageString);
      this.ws.send(messageString);
    } else {
      console.warn('WebSocket is not open. Unable to send message.');
    }
  }

  /**
   * Retrieves messages for a given referral.
   * @param referralId - The referral ID to retrieve messages for.
   * @param senderId - The ID of the sender.
   */
  getMessages(referralId: string, senderId: string): void {
    const message = {
      action: 'getMessages',
      referralId: referralId,
      senderId: senderId,
    };
    this.sendMessage(message);
  }

  /**
   * Listens for incoming messages.
   * @returns An Observable of incoming messages.
   */
  onMessage(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  /**
   * Creates a new chat between two users.
   * @param data - The data to send to the API.
   * @returns A Promise of the API response.
   */
  createChat(data: any): Promise<any> {
    const url = `${this.chatCreationRoute}${this.chatCreationPath}`;
    return this.http.post(url, data, this.authService.getHttpOptions()).toPromise();
  }
}
