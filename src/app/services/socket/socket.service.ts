import { Injectable } from "@angular/core";
import { io, Socket } from "socket.io-client";
import { environment } from "src/environments/environment";
import { StorageService } from "../storage/storage.service";
import { SOCKET_EVENTS } from "src/app/constants/string";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SocketService {
  public socket: Socket;
  private chatListSubject = new BehaviorSubject<any>(null);
  private joinRoomSubject = new BehaviorSubject<any>(null);
  private inboxMessageSubject = new BehaviorSubject<any>(null);
  private sendMessageSubject = new BehaviorSubject<any>(null);

  constructor(private _storageService: StorageService) {}
  // Connect to the server
  connectToServer(accessToken: string) {
    this.socket = io(environment.SOCKET_URL, {
      transports: ["websocket"],
      upgrade: false,
      reconnection: true,
      reconnectionAttempts: 100,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      query: { accessToken },
    });
    this.preDefinedSocketListener();
  }

  preDefinedSocketListener() {
    this.socket.on(SOCKET_EVENTS.CONNECT, (data: any) => {
    });
    this.socket.on(SOCKET_EVENTS.USER_LIST, (data: any) => {
      this.chatListSubject.next(data); // Emit the received data
    });
    this.socket.on(SOCKET_EVENTS.JOIN_ROOM, (data: any) => {
      this.joinRoomSubject.next(data); // Emit the received data
    });
    this.socket.on(SOCKET_EVENTS.INBOX_MESSAGE, (data: any) => {
      this.inboxMessageSubject.next(data); // Emit the received data
    });
    this.socket.on(SOCKET_EVENTS.RECONNECT, (data: any) => {
    });
    this.socket.on(SOCKET_EVENTS.DISCONNECT, (data: any) => {
    });
    this.socket.on(SOCKET_EVENTS.ERROR, (data: any) => {
    });
  }

  // A socket listener
  socketListener(event: string) {
    this.socket.on(event, (data: any) => {
      if (data.unreadCount) {
        this._storageService.profileDetail.notificationCount = data.unreadCount;
      }
    });
  }
  getEventListener() {
    return this.chatListSubject.asObservable();
  }
  getJoinRoomListener() {
    return this.joinRoomSubject.asObservable();
  }
  getInboxRoomListener() {
    return this.inboxMessageSubject.asObservable();
  }
  getSendMessageListener() {
    return this.sendMessageSubject.asObservable();
  }


  socketEmitter(
    event: any,
    payload: any,
    callback?: (response: any) => void
  ) {
    this.socket.emit(event, payload, (response: any) => {
      if (callback) {
        callback(response); // Execute the callback with the server response
      }
    });
  }

  // Disconnect to the server
  disconnectToSocket() {
    this.socket.disconnect();
  }
}
