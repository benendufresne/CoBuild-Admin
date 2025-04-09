import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ChatService } from "src/app/services/chat/chat.service";
import { SocketService } from "src/app/services/socket/socket.service";
import { StorageService } from "src/app/services/storage/storage.service";
import { generateMongoId, isObjEmpty } from "src/app/constants/helper";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { ChangeDetectorRef } from "@angular/core";
import { ChatDatePipe } from "src/app/pipes/chatDate/chat-date.pipe";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { DataLoaderComponent } from "src/app/components/data-loader/data-loader.component";
import { MatInputModule } from "@angular/material/input";
import { DATE_TYPES, MODULE_ID_OF } from "src/app/constants/messages";
import { RequestCardComponent } from "src/app/components/request-card/request-card.component";
import { SOCKET_EVENTS } from "src/app/constants/string";
import { MatFormFieldModule } from "@angular/material/form-field";
import { NoLeadingSpaceDirective } from "src/app/directives/no-leading-space/no-leading-space.directive";
import { CommonService } from "src/app/services/common/common.service";

const MODULES = [
  FormsModule,
  ReactiveFormsModule,
  MatIconModule,
  ChatDatePipe,
  InfiniteScrollModule,
  DataLoaderComponent,
  RequestCardComponent,
  MatFormFieldModule,
  MatInputModule,
  NoLeadingSpaceDirective,
];

@Component({
  selector: "app-chat-body",
  standalone: true,
  imports: [CommonModule, ...MODULES],
  templateUrl: "./chat-body.component.html",
  styleUrls: ["./chat-body.component.scss"],
})
export class ChatBodyComponent implements OnInit, OnChanges {
  @Input() userDetail: any;
@Input() jobStatus;
  @ViewChild("scrollContainer") scrollContainer: ElementRef;
  dateType = DATE_TYPES;
  chatMessages: any[] = [];
  message = new FormControl();
  lastMessageId: string | null = null;
  isLoadingMessages = false;
  allMessagesLoaded = false;
  adminSenderId: string;
  scrollPosition = 0;
  status = {
    isOnline: false,
    lastSeen: "",
  };
  userId: any;
  showDoubleTick: boolean = false;
  isAddEditAccess:boolean=true;
  passRejectRequestData;
  constructor(
    private readonly _storageService: StorageService,
    private readonly _chatService: ChatService,
    private readonly _socketService: SocketService,
    private readonly _cdr: ChangeDetectorRef,
    private readonly _commonService:CommonService
  ) {}

  ngOnInit(): void {
    this.adminSenderId = this._storageService.profileDetail?.userId;
    this.listenForStatusUpdates();
    if (this.userDetail) this.listenForReadStatusUpdates();
this.permissionHandler();
  }
  listenForStatusUpdates() {
    this._socketService.socket.off(SOCKET_EVENTS.USER_STATUS);
    this._socketService.socket.on(SOCKET_EVENTS.USER_STATUS, (data: any) => {
      this.userId = data.userId;
      this.status.isOnline = data.isOnline;
      this.status.lastSeen = data.lastSeen;
    });
  }
  listenForReadStatusUpdates() {
    this._socketService.socket.off(SOCKET_EVENTS.READ_STATUS);
    this._socketService.socket.on(SOCKET_EVENTS.READ_STATUS, (data: any) => {
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["userDetail"]?.currentValue) {
      this.resetChat();
      this.loadChatMessages();
    this.message.reset();
    }
  }
     permissionHandler() {
        let permission = this._commonService.getPermissionByModuleId(
          MODULE_ID_OF.SUPPORT
        );
        if (!isObjEmpty(permission)) {
          if (!permission.edit) {
            this.isAddEditAccess = false;
          }
        }
      }

  private resetChat(): void {
    this.chatMessages = [];
    this.lastMessageId = null;
    this.allMessagesLoaded = false;
  }

  loadChatMessages(initialLoad = true): void {
    if (
      !this.userDetail?.chatId ||
      this.isLoadingMessages ||
      this.allMessagesLoaded
    )
      return;

    const inboxMessageData = {
      pageNo: 1,
      limit: 30,
      chatId: this.userDetail.chatId,
    };
    if (!initialLoad) {
      delete inboxMessageData["pageNo"];
      inboxMessageData["lastMsgId"] = this.lastMessageId;
    }

    this.isLoadingMessages = true;
    this._chatService.inboxMessageEmitter(inboxMessageData, (response) => {
      const messages = response.data || [];
      if (messages.length > 0) {
        this.lastMessageId = messages[messages.length - 1]._id;
        this.chatMessages = initialLoad
          ? messages.sort(this.sortByCreatedAt)
          : [...messages, ...this.chatMessages].sort(this.sortByCreatedAt);

        setTimeout(() => {
          if (initialLoad) {
            this.scrollToBottom();
          } else {
            this.restoreScrollPosition();
          }
        }, 0);
      } else {
        this.allMessagesLoaded = true;
      }
      this.isLoadingMessages = false;
      this._cdr.detectChanges();
    });

    this.registerChatListener();
  }

  private sortByCreatedAt(a: any, b: any): number {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  }
  showDateHeader(index: number): boolean {
    if (index === 0) return true; // Always show for the first message
  
    const currentMessage = this.chatMessages[index];
    const previousMessage = this.chatMessages[index - 1];
  
    if (!currentMessage?.created || !previousMessage?.created) return false;
  
    const currentDate = new Date(currentMessage.created);
    const previousDate = new Date(previousMessage.created);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const formatDate = (date: Date) =>
      `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  
    const currentFormatted = formatDate(currentDate);
    const previousFormatted = formatDate(previousDate);
    // Show the date header only if the current message is on a different day
    return currentFormatted !== previousFormatted;
  }
  
  private saveScrollPosition(): void {
    this.scrollPosition = this.scrollContainer?.nativeElement.scrollHeight;
  }

  private restoreScrollPosition(): void {
    setTimeout(() => {
      const container = this.scrollContainer?.nativeElement;
      if (container) {
        container.scrollTop = container.scrollHeight - this.scrollPosition;
      }
    }, 100);
    this.isLoadingMessages = false;
  }
  private scrollToBottom(immediate = false): void {
    const container = this.scrollContainer?.nativeElement;
    if (container) {
      if (immediate) {
        container.scrollTop = container.scrollHeight; // Set position without animation
      } else {
        setTimeout(() => {
          container.scrollTop = container.scrollHeight;
        }, 0);
      }
    }
    this.isLoadingMessages = false;
  }

  loadOlderMessages(): void {
    if (!this.isLoadingMessages && !this.allMessagesLoaded) {
      this.saveScrollPosition();
      this.loadChatMessages(false);
    }
  }

  registerChatListener(): void {
    this._socketService.socket.off(this.userDetail.chatId);
    this._socketService.socket.on(this.userDetail.chatId, (data: any) => {
      if (data.eventType === SOCKET_EVENTS.READ_STATUS) {
        this.showDoubleTick = true;
      } else {
        this.showDoubleTick = false;
      }
      if (data.eventType === SOCKET_EVENTS.REJECT_STATUS) {
        this.passRejectRequestData = data.data;
      } else {
        this.passRejectRequestData = [];
      }

      if (data.data && Object.keys(data.data).length > 0) {
        this.chatMessages = [...this.chatMessages, data.data].sort(
          this.sortByCreatedAt
        );
        setTimeout(() => this.scrollToBottom(), 0);
        this._cdr.detectChanges();
      }
    });
  }

  submitMessage(event?: KeyboardEvent): void {
    if (event) {
      event.preventDefault(); // Prevents moving to a new line
    }

    if (!this.message.value.trim()) return;

    const newMessage = {
      chatId: this.userDetail?.chatId,
      messageType: "TEXT",
      senderId: this.adminSenderId,
      localMessageId: generateMongoId(),
      message: this.message.value,
      created: new Date().toISOString(),
    };

    this.message.reset();
    this._cdr.detectChanges();
    this.scrollToBottom(false);

    this._chatService.sendMessageEmitter(newMessage, (response) => {
      if (!response) {
        console.error("Failed to send message");
      }
    });
  }
}
