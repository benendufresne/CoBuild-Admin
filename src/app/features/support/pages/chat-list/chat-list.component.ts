import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ChatService } from "src/app/services/chat/chat.service";
import { UserCardComponent } from "../user-card/user-card.component";
import { ChatBodyComponent } from "../chat-body/chat-body.component";
import { Subject, takeUntil } from "rxjs";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { SearchRenderComponent } from "src/app/components/search-render/search-render.component";
import { SocketService } from "src/app/services/socket/socket.service";
import { DataLoaderComponent } from "src/app/components/data-loader/data-loader.component";
import { reportChatId } from "src/app/constants/storage-keys";
import { ButtonComponent } from "src/app/components/button/button.component";
import { SUPPORT_BUTTON, SUPPORT_CHAT_MODE } from "src/app/constants/constant";
import { SOCKET_EVENTS } from "src/app/constants/string";
import { titleCase } from "src/app/constants/helper";

@Component({
  selector: "app-chat-list",
  standalone: true,
  imports: [
    CommonModule,
    UserCardComponent,
    ChatBodyComponent,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    SearchRenderComponent,
    DataLoaderComponent,
    ButtonComponent,
  ],
  templateUrl: "./chat-list.component.html",
  styleUrl: "./chat-list.component.scss",
})
export class ChatListComponent implements OnInit,OnDestroy {
  userList: any[] = [];
  filteredUserList: any[] = [];
  selectedUser: any = null;
  pageNo: number = 1;
  chatMessages: any[] = [];
  private _unsubscribe$ = new Subject<void>();
  private isFetching = false;
  public isLoading: boolean = true;
  isSearchActive: boolean = false;
  isUserLoading: boolean = false;
  chatType = SUPPORT_BUTTON;
  chatMode: string = SUPPORT_CHAT_MODE.REQUEST;
  searchTerm;
  showRedDotIcon: boolean = false;
  unreadCount;
  jobStatus;
  constructor(
    private _chatService: ChatService,
    private readonly _socketService: SocketService
  ) {
    this._chatService.notifyEmitter();
    this.getNotifyCount();
    this.chatList();
    this.refreshInbox();
  }

  ngOnInit(): void {
    this.fetchUsers();
    this.initializeListeners();
    const reportId = atob(sessionStorage.getItem(reportChatId));
    if (reportId && reportId !== "ée" && reportId !== "undefined") {
      this.openChat(reportId);
    }
  }
  refreshInbox() {
    this._socketService.socket.on(SOCKET_EVENTS.REFRESH_INBOX, (data: any) => {
      this.jobStatus = data;
    });
  }
  getNotifyCount() {
    this._socketService.socket.on(SOCKET_EVENTS.UNREAD_NOTIFY, (data: any) => {
      this.unreadCount = data;
      this.updateChatType();
    });
  }
  updateChatType() {
    if (!this.unreadCount) return;
    this.chatType = this.chatType.map((item) => ({
      ...item,
      showRedDot:
        this.chatMode !== item.value &&
        this.unreadCount[`is${titleCase(item.value)}Unread`],
    }));
  }
  chatList() {
    this._chatService
      .userListener()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((data) => {
        if (data?.data) {
          this.isFetching = false;
          const filteredList = data.data.filter(
            (user) => user.chatMode === this.chatMode
          );

          if (this.pageNo === 1) {
            this.userList = filteredList;
          } else {
            this.userList = [...this.userList, ...filteredList];
          }

          if (!this.isSearchActive) {
            this.filteredUserList = [...this.userList];
          }

          this.isLoading = false;
        }
      });
  }

  fetchUsers() {
    if (this.isFetching) return; // Avoid multiple fetches
    this.isFetching = true;
    this.isSearchActive = !!this.searchTerm;
    const params = {
      pageNo: this.pageNo,
      limit: 1000,
      searchKey: this.searchTerm || "", // Pass search term if available
      chatMode: this.chatMode,
    };
    this.isUserLoading = true;
    this._chatService.userListEmitter(params, (data) => {
      if (data?.data) {
        this.isFetching = false;
        if (this.pageNo === 1) {
          this.userList = data.data; // First page, replace the list
        } else {
          const existingIds = new Set(this.userList.map((user) => user._id));
          const uniqueUsers = this.userList.filter(
            (user) => !existingIds.has(user._id)
          );
          this.userList = [...this.userList, ...uniqueUsers];
        }
        this.filteredUserList = [...this.userList];
        this.isLoading = false;
        this.isUserLoading = false;
      }
    });
  }

  initializeListeners() {
    this._chatService
      .joinRoomListener()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((data) => {});

    this._chatService
      .inboxMessageListener()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((data) => {});
  }
  loadMoreUsers() {
    if (this.isFetching || this.isLoading) return;
    if (this.userList.length > 1000) {
      this.pageNo++;
      this.fetchUsers();
    }
  }
  onSearchChange(searchTerm: string) {
    // this.pageNo = 1;
    this.userList = []; // Clear existing list for a new search
    this.searchTerm = searchTerm;
    this.isUserLoading = true;
    this.fetchUsers();
  }
  openChat(chat: any) {
    if (this.selectedUser && this.selectedUser.chatId !== chat._id) {
      this._chatService.leaveRoomEmitter(
        this.selectedUser.chatId,
        (response) => {
          sessionStorage.removeItem(reportChatId);
        }
      );
    }
    this._chatService.joinRoomEmitter(chat._id || chat, (response) => {
      this.selectedUser = response;
      sessionStorage.setItem(reportChatId, btoa(chat._id));
    });
  }

  trackByUserId(user: any): string {
    return user._id;
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
    this._chatService.leaveRoomEmitter(
      this.selectedUser?.chatId,
      (response) => {
        sessionStorage.removeItem(reportChatId);
      }
    );
  }
  getType(event) {
    this.chatMode = event;
    this.fetchUsers();
    this.updateChatType();
  }
}
