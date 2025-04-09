import { Injectable } from "@angular/core";
import { SocketService } from "../socket/socket.service";
import { Observable } from "rxjs";
import { SOCKET_EVENTS } from "src/app/constants/string";

interface PaginationParams {
  pageNo: number;
  limit: number;
  status?: string;
  searchKey?: string;
  // chatMode:string;
}

@Injectable({
  providedIn: "root",
})
export class ChatService {
  constructor(private _socketService: SocketService) {}

  /**
   * Emits the user list request with pagination and optional search.
   * @param params Pagination and search parameters
   */
  userListEmitter(
    params: PaginationParams,
    callback?: (response: any) => void
  ) {
    this._socketService.socketEmitter(
      SOCKET_EVENTS.USER_LIST,
      params,
      callback
    );
  }

  /**
   * Listens for user list response.
   */
  userListener(): Observable<any> {
    return this._socketService.getEventListener();
  }

  /**
   * Emits a request to join a chat room.
   * @param chatId ID of the chat to join
   * @param callback Callback for server response
   */
  joinRoomEmitter(chatId: string, callback?: (response: any) => void) {
    const data = { chatId };
    this._socketService.socketEmitter(SOCKET_EVENTS.JOIN_ROOM, data, callback);
  }

  /**
   * Listens for responses after joining a chat room.
   */
  joinRoomListener(): Observable<any> {
    return this._socketService.getJoinRoomListener();
  }

  /**
   * Emits a request to get inbox messages.
   * @param params Object containing chatId, pageNo, and limit
   * @param callback Callback for server response
   */
  inboxMessageEmitter(params: any, callback?: (response: any) => void) {
    this._socketService.socketEmitter(
      SOCKET_EVENTS.INBOX_MESSAGE,
      params,
      callback
    );
  }

  /**
   * Listens for inbox message responses.
   */
  inboxMessageListener(): Observable<any> {
    return this._socketService.getInboxRoomListener();
  }
  /**
   * Emits a request to get inbox messages.
   * @param params Object containing chatId,senderId, message etc
   * @param callback Callback for server response
   */
  sendMessageEmitter(params: any, callback?: (response: any) => void) {
    this._socketService.socketEmitter(
      SOCKET_EVENTS.SEND_MESSAGE,
      params,
      callback
    );
  }
  /**
   * @param params Object containing chatId etc
   * @param callback Callback for server response
   */
  rejectStatusEmitter(params: any, callback?: (response: any) => void) {
    this._socketService.socketEmitter(
      SOCKET_EVENTS.REJECT_STATUS,
      params,
      callback
    );
  }
  /**
   * Listens for send message responses.
   */
  sendMessageListener(): Observable<any> {
    return this._socketService.getSendMessageListener();
  }
  /**
   * Emits a request to get inbox messages.
   * @param chatId Object containing chatId etc
   * @param callback Callback for server response
   */
  leaveRoomEmitter(chatId: any, callback?: (response: any) => void) {
    const data = { chatId };
    this._socketService.socketEmitter(SOCKET_EVENTS.LEAVE_ROOM, data, callback);
  }
  /**
   * @param callback Callback for server response
   */
  notifyEmitter(callback?: (response: any) => void) {
    this._socketService.socketEmitter(
      SOCKET_EVENTS.UNREAD_NOTIFY,
      callback
    );
  }
}
