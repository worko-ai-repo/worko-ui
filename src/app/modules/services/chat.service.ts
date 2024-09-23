import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthService } from "../worko/services/auth.service";

const CHAT_URL = environment.chatApiUrl; //for dev - https://chatapi.dev.worko.work/, for prod - https://chatapi.worko.ai/
const CHAT_WS_URL = environment.chatWsUrl; //for dev - wss://chatws.dev.worko.work, for prod - wss://chatws.worko.ai

@Injectable({
  providedIn: "root",
})
export class ChatService {
  private noMoreMessagesSubject = new BehaviorSubject<boolean>(false);
  private isFetchingMessagesSubject = new BehaviorSubject<boolean>(false);
  private errorSubject: Subject<any> = new Subject<any>();

  noMoreMessages$ = this.noMoreMessagesSubject.asObservable();
  isFetchingMessages$ = this.isFetchingMessagesSubject.asObservable();

  private messageSubject: Subject<any> = new Subject<any>();
  private ws!: WebSocket;
  private paginationKey: string | null = null;  // Track the pagination key
  private isReconnecting: boolean = false;

  constructor(private authService: AuthService, private http: HttpClient) { }

  /**
   * Connects to the WebSocket server.
   * @param userId - The logged-in user ID.
   * @param referralId - The referral ID.
   */
  connect(userId: string, referralId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Retrieve the auth token
      const authToken =
        this.authService
          .getHttpOptions()
          .headers.get("Authorization")
          ?.split(" ")[1] || "";
      // console.log("Auth token:", authToken);

      // Constructing WebSocket URL with authorization token as query parameter
      const wsUrl = `${CHAT_WS_URL}?userId=${encodeURIComponent(
        userId
      )}&referralId=${encodeURIComponent(
        referralId
      )}&Authorization=Bearer ${encodeURIComponent(authToken)}`;

      // Create a new WebSocket connection
      this.ws = new WebSocket(wsUrl);

      // Event handler for connection open
      this.ws.onopen = (event) => {
        // console.log("Connected to WebSocket server.");
        // Fetch existing messages when the connection opens
        // Fetch existing messages only if this is NOT a reconnection
        if (!this.isReconnecting) {
          this.getMessages(referralId, userId);  // Fetch messages only during initial connection
        }
        //resolving here as connection is done
        resolve();
      };

      // Event handler for connection close
      this.ws.onclose = (event) => {
        // console.log("Disconnected from WebSocket server.");
      };

      // Event handler for errors
      this.ws.onerror = (event) => {
        console.error("WebSocket error:", event);
        reject(event);
      };

      // Event handler for incoming messages
      this.ws.onmessage = (event) => {
        // console.log("incoming data", event.data);

        let parsedMessage;
        try {
          // Check if the event data is already a JSON object or a stringified JSON (Parse the incoming data if it's a string)
          parsedMessage = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        } catch (error) {
          console.error("Error parsing message:", error);
          return;
        }

        // Check for error response
        if (parsedMessage?.errorCode && parsedMessage?.errors) {
          console.error("WebSocket error response:", parsedMessage);

          // Emit the error event
          this.errorSubject.next(parsedMessage);
          return;
        }

        // Check the eventName and process accordingly
        if (parsedMessage?.eventName === "getMessages" && Array.isArray(parsedMessage.data)) {

          const messages = parsedMessage?.data;

          if (messages.length > 0) {
            // Update pagination key if available
            this.paginationKey = parsedMessage.pagination?.lastKey || null;

            // Handle existing messages
            this.handleExistingMessages(messages, parsedMessage.pagination);
          } else {
            console.warn("No messages found in the response");
            // Handle the case where there are no initial messages
            this.isFetchingMessagesSubject.next(false);
          }
        }
        else if (parsedMessage?.eventName === "sendMessage") {
          // Handle new incoming messages
          this.messageSubject.next(parsedMessage);
        } else {
          console.warn("Unknown event name or invalid format:", parsedMessage?.eventName);
        }

      };

    });
  }

  /**
   * Handles existing messages fetched during the WebSocket connection.
   */
  private handleExistingMessages(messages: any, pagination: any): void {
    this.messageSubject.next({ eventName: "getMessages", messages });
    this.isFetchingMessagesSubject.next(false); // Indicate fetching completed

    // Check if there are more messages to fetch and update noMoreMessages accordingly
    this.noMoreMessagesSubject.next(!pagination.lastKey);
  }

  /**
   * Disconnects from the WebSocket server.
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      // console.log("Disconnected from WebSocket server.");
    }
  }

  /**
 * Retrieves messages for a given referral based on the updated backend payload.
 * @param referralId - The referral ID to retrieve messages for.
 * @param senderId - The ID of the sender.
 * @param lastKey - (Optional) The pagination key for retrieving more messages.
 */
  getMessages(referralId: string, senderId: string, lastKey?: string): void {
    const message: any = {
      action: "getMessages",
      getMessagesData: {
        referralId: referralId,
        senderId: senderId
      }
    };

    // Attach lastKey to getMessagesData if it's available
    if (lastKey) {
      message.getMessagesData.lastKey = lastKey;
    }

    // console.log("Requesting existing messages:", message);
    this.sendMessage(message);
  }

  /**
   * Sends a message through the WebSocket connection.
   * @param message - The message to be sent.
   */
  sendMessage(message: any, userId?: any, referralId?: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const messageString = JSON.stringify(message);
      // console.log("Sending message:", messageString);
      this.ws.send(messageString);
    } else {
      console.warn("Attempting to reconnect the chat...");
      this.reconnectWebSocket(userId, referralId).then(() => {
        // After reconnecting, send the message
        const messageString = JSON.stringify(message);
        this.ws.send(messageString);
      }).catch((error) => {
        console.error("Failed to reconnect chat:", error);
      });
    }
  }

  /**
   * Fetches more messages based on pagination.
   * @param referralId - The referral ID to retrieve messages for.
   * @param senderId - The ID of the sender.
   */
  fetchMoreMessages(referralId: string, senderId: string): any {
    if (this.paginationKey) {
      this.isFetchingMessagesSubject.next(true); // Indicate fetching started
      this.getMessages(referralId, senderId, this.paginationKey);
    }
    else {
      this.noMoreMessagesSubject.next(true); // Indicate no more messages
    }
  }

  resetState() {
    this.noMoreMessagesSubject.next(false);
    this.isFetchingMessagesSubject.next(false);
    this.paginationKey = null; // Reset pagination key if applicable
    this.isReconnecting = false;
    // we can reset any other relevant state in ChatService
  }

  /**
   * Listens for incoming messages.
   * @returns An Observable of incoming messages.
   */
  onMessage(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  /**
   * Provides an Observable to listen for error events.
   * @returns An Observable of error events.
   */
  onError(): Observable<any> {
    return this.errorSubject.asObservable();
  }

  /**
 * Attempts to reconnect the WebSocket.
 */
  reconnectWebSocket(userId: string, referralId: string): Promise<void> {
    this.isReconnecting = true;  // Setting reconnection flag here
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
        this.connect(userId, referralId).then(() => {  // Calling connect method to establish a WebSocket connection
          // console.log("Chat reconnected.");
          resolve();
        }).catch((error) => {
          // console.error("Error during chat reconnection:", error);
          reject(error);
        });
      } else {
        resolve();
      }
    });
  }

  /**
   * Creates a new chat between two users.
   * @param data - The data to send to the API.
   * @returns A Promise of the API response.
   */
  createChat(data: any): Promise<any> {
    return this.http.post(`${CHAT_URL}chat/create`, data, this.authService.getHttpOptions()).toPromise();
  }

  isConnected(): boolean {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }
}
