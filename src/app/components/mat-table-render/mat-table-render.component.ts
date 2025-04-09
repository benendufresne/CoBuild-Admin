import {
  ChangeDetectorRef,
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatMenuModule } from "@angular/material/menu";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule } from "@angular/material/sort";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Router, RouterModule } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { ConfirmationModalComponent } from "../confirmation-modal/confirmation-modal.component";
import { TableService } from "./table.service";
import { DataLoaderComponent } from "../data-loader/data-loader.component";
import { LazyImageComponent } from "../lazy-image/lazy-image.component";
import { ResultNotFoundComponent } from "../result-not-found/result-not-found.component";
import { SearchRenderComponent } from "../search-render/search-render.component";
import { FilterComponent } from "./filter/filter.component";
import { Subscription } from "rxjs";
import { MatIconModule } from "@angular/material/icon";
import { slideInDownAnimation } from "./filter-animation";
import { MatTabsModule } from "@angular/material/tabs";
import { MatButtonModule } from "@angular/material/button";
import { ViewMoreComponent } from "../view-more/view-more.component";
import { EmptyValuePipe } from "../../pipes/empty-value/empty-value.pipe";
import { FormatStatusPipe } from "../../pipes/format-status/format-status.pipe";
import { Pagination } from "../../constants/pagination";
import { DATE_TYPES, LISTING_COMMON_MESSAGES} from "../../constants/messages";
import { CommonService } from "../../services/common/common.service";
import { StorageService } from "src/app/services/storage/storage.service";
import { REQUEST_TYPES_TAB, SUB_ADMIN_TAB_LINKS_CUSTOMERS, USER_TYPES } from "src/app/constants/constant";
import { ButtonComponent } from "../button/button.component";
import { CUSTOM_BUTTON_CONST } from "src/app/constants/actionbutton-constant";
import { ToastService } from "../toast-notification/toast.service";
import { environment } from "src/environments/environment";
import { UserTypePipe } from "src/app/pipes/userType/user-type.pipe";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { SERVICE_CATEGORY, SERVICE_TYPE } from "src/app/constants/routes";
import { ScrollTabsComponent } from "../scroll-tabs/scroll-tabs.component";
import { ServiceTypePipe } from "src/app/pipes/serviceType/service-type.pipe";
import { NotificationTypePipe } from "src/app/pipes/notificationType/notification-type.pipe";

const ELEMENT_DATA = [];
@Component({
  selector: "mat-table-render",
  standalone: true,
  animations: [slideInDownAnimation],
  imports: [
    CommonModule,
    MatIconModule,
    SearchRenderComponent,
    RouterModule,
    MatSelectModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatTooltipModule,
    MatSortModule,
    ConfirmationModalComponent,
    ResultNotFoundComponent,
    FilterComponent,
    EmptyValuePipe,
    LazyImageComponent,
    MatButtonToggleModule,
    DataLoaderComponent,
    MatMenuModule,
    FormatStatusPipe,
    MatTabsModule,
    MatButtonModule,
    ViewMoreComponent,
    ButtonComponent,
    UserTypePipe,
    MatFormFieldModule,
    FormsModule,
    ScrollTabsComponent,
    ServiceTypePipe,
    NotificationTypePipe
  ],
  templateUrl: "./mat-table-render.component.html",
  styleUrls: ["./mat-table-render.component.scss"],
})
export class MatTableRenderComponent
  extends Pagination
  implements OnInit, OnDestroy, DoCheck
{
  isOpen = false;
  matHeaderRow: any = [];
  notData: boolean = false;
  length!: 0;
  pageSize!: 10;
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  subscriptions: Subscription[] = [];
  dateType = DATE_TYPES;
  showLoader = false;
  isActive;
  showLink: boolean = true;
  getFilterValues: boolean = false;
  tabs: Array<any> = SUB_ADMIN_TAB_LINKS_CUSTOMERS;
  
  @Input() pageType;
  @Input() tableHeaderLabel: string = '';
  @Input() filterRedDot: boolean = false;
  @Input() exportButton: boolean = false;
  @Input() openFilter: boolean = false;
  @Input() cls!: string;
  @Input() showFilter: boolean = false;
  @Input() showSearch: boolean = true;
  @Input() addCustomClass: string = "removeExportBtn";
  @Input() heading: any = [];
  @Input() notFound!: string;
  @Input() removeId: number = -1;
  @Input() placeholder: string = "Search";
  @Input() listType: string = "";
  @Input() isPageForBulkOperation = false;
  @Input() dataFromPerent: boolean = false;
  @Input() noAddButton = true;
  @Input() componentName: string;
  @Input() ClinicianType: string = "delivery";
  @Input() isTab = false;
 prefillSearchData:any;
  @Input() set prefillSearch(value) {
    this.prefillSearchData = value;
  }
  @Input() set getFilterValue(value) {
    this.getFilterValues = value;
  }
  @Input() addButtonText: string;
  @Input() Export: boolean = true;
  @Input() ExportTemplate: boolean = false;

  @Input() isUserManagementList: boolean = false;
  @Input() isRequestManagementList: boolean = false;
  @Input() isSubAdmin: boolean = false;
  @Input() selectedTableType: string;
  @Input() postOfTheMonthId: any;
  @Input() isAddEditAccess:boolean=false;
  @Input() set tableData(value) {
    if (value) {
      this.setTableData(value);
    }
  }
  @Output() csvdata: EventEmitter<any> = new EventEmitter();
  @Output() page: EventEmitter<any> = new EventEmitter();
  @Output() find: EventEmitter<any> = new EventEmitter();
  @Output() edit_route: EventEmitter<any> = new EventEmitter();

  @Output() sort: EventEmitter<any> = new EventEmitter();
  @Output() add: EventEmitter<any> = new EventEmitter();
  @Output() status: EventEmitter<any> = new EventEmitter();
  @Output() filter: EventEmitter<any> = new EventEmitter();
  @Output() open: EventEmitter<any> =
    new EventEmitter(); /*--open close filter--*/
  @Output() export: EventEmitter<any> = new EventEmitter();
  @Output() templateExport: EventEmitter<any> = new EventEmitter();

  @Output() detailInPopup: EventEmitter<any> = new EventEmitter();
  @Output() bulkOperation: EventEmitter<any> = new EventEmitter();
  @Output() tabEvent: EventEmitter<any> = new EventEmitter();
  @Output() userTableTypeChangeEvent: EventEmitter<any> = new EventEmitter();
  @Output() pomEvent: EventEmitter<string> = new EventEmitter();
  @Input() dropDownStatus: { value: string; label: string }[];
  // public dropDownStatus1 = JOB_STATUS_TYPE
  oldValues: { [key: string]: any } = {};

  @ViewChild("paginator") paginator!: MatPaginator;
  statusOptions: string[] = ["Completed", "Upcoming", "Canceled"];
  public userTypes = USER_TYPES;
  public requestTab= REQUEST_TYPES_TAB
  public customButtonConst = CUSTOM_BUTTON_CONST;
  // public postTypes = POST_TYPES;
  private bucketUrl = environment
  constructor(
    private _table: TableService,
    private _dialog: MatDialog,
    public storage: StorageService,
    public common: CommonService,
    private _router: Router,
    private _cdr: ChangeDetectorRef,
    private _toastService:ToastService
  ) {
    super();
  }

  ngOnInit() {    
    this.showLoader = true;
    this.heading?.forEach((item) => {
      this.matHeaderRow.push(item.heading);
    });
    if (!this.dataFromPerent) {
      this.TableDatObserve();
    }
    this.notFoundErrorHandler(respond.found);
  }

  isClickInsideFilter(event: MouseEvent): boolean {
    const filterElement = document.querySelector(
      ".filter-area-section"
    ) as HTMLElement;

    return filterElement && filterElement.contains(event.target as Node);
  }
  exportList() {
    this.export.emit(true);
  }
  exportTemplateList(){
    this.templateExport.emit(true);

  }
  TableDatObserve() {
    this.subscriptions.push(
      this._table.tableObserve.subscribe(
        (response: any) => {
          this.setTableData(response);
        },
        () => {
          this.showLoader = false;
        }
      )
    );
  }

  setTableData(response) {
    this.showLoader = false;
      response?.list?.forEach((list, index) => {
        // list["s_no"] = response.limit * (response.pageNo - 1) + (index + 1);
      });
    this.dataSource = new MatTableDataSource(response.list);    
    this.length = response.total;
    this.pageSize = response.limit;
    if (response.list?.length == 0) {
      this.notData = true;
    } else {
      this.notData = false;
    }
    if(!response.list){
      this.notData = true
    }
  }

  /**
   * @param text common not found text handel
   */
  notFoundErrorHandler(text: string) {
    if (this.notFound) {
      const notFoundText = this.notFound.split(" ");
      if (
        notFoundText[notFoundText.length - 1].toLowerCase() == respond.added ||
        notFoundText[notFoundText.length - 1].toLowerCase() == respond.found
      ) {
        notFoundText[notFoundText.length - 1] = text;
        this.notFound = notFoundText.join(" ");
      }
    }
  }
  ngDoCheck(): void {
    this._cdr.detectChanges();
  }

  async onNaviagateDetailsPage(link, id) {
    this._router.navigate([link, this.common.encryption(id)]);
    return;
  }

  onPageHandler(ev: any) {
    this.page.emit(ev);
  }

  onSelectionChange(data) {
    this.csvdata.emit(data.value);
  }
  onGettingList(filter, componentName?) {
    if (componentName == "Menu’s") {
      this.ClinicianType = filter;
    } else {
      this.isActive = filter;
    }
    this.filter.emit(filter);
    this.tabEvent.emit(filter);
  }

  //
  searchTable(search: string) {
    this.find.emit(search);
    if (search == "") {
      this.notFoundErrorHandler(respond.added);
    } else {
      this.notFoundErrorHandler(respond.found);
    }
  }
  closeFilter() {
    this.isOpen = false;
  }
  handleViewMoreClick(event, heading) {
    let title;
    heading.map((element) => {
      if (element.type == "viewMore") {
        title = element.heading;
      }
    });
    const dialog = this._dialog.open(ViewMoreComponent, {
      panelClass: "account-popup",
      width: "480px",
      data: {
        title: title,
        message: event,
      },
    });
    dialog.afterClosed().subscribe((result) => {
      return;
    });
  }
  sortingData(event) {
    this.heading.map((head) => {
      if (head.key !== event && head.sort) {
        head.sortOrder = null;
      }
    });
    this.sort.emit(event);
  }

  changeStatus(id: number, data: any, index: any, listType?) {
    const body = {
      id: id,
      index: index,
      data: data,
    };
    switch (id) {
      case 1:
        this.status.emit(body);
        break;
      case 9:
        this.confirmationDialog(id, body, listType); // For Post of the month action
        break;
      case 8:
        this.confirmationDialog(id, body, listType); // For Post of the month action
        break;
      case 4:
        this.confirmationDialog(id, body, listType); // form sending notification
        break;
      case 7:
        this.confirmationDialog(id, body, listType); // form sending notification
        break;
      default:
        this.confirmationDialog(id, body, listType);
        break;
    }
  }

  tableFilter(isOpen: boolean) {
    event.stopPropagation();
    this.isOpen = isOpen;
    this.open.emit(this.isOpen);
  }
  confirmationDialog(id: number, body: any, listType?) {
    let msg = false;
    let message = `${LISTING_COMMON_MESSAGES.DELETE_MSG} this ${listType.toLowerCase()}?`;
    let title = `${LISTING_COMMON_MESSAGES.DELETE_TITLE} ${listType}`;
    let btn1 = `${LISTING_COMMON_MESSAGES.DELETE_TITLE}`;
    body["action"] = this.API_EVENT.delete;
    if(id ==8){
      message = `${LISTING_COMMON_MESSAGES.REMOVE_MSG} this ${listType.toLowerCase()}?`;
      title = `${LISTING_COMMON_MESSAGES.REMOVE_TITLE} ${listType}`;
      btn1 = `${LISTING_COMMON_MESSAGES.REMOVE_TITLE}`;
      body["action"] = this.API_EVENT.delete;
    }
    if(id ==7){
      message = `${LISTING_COMMON_MESSAGES.RESEND_MSG} this ${listType.toLowerCase()}?`;
      title = `${LISTING_COMMON_MESSAGES.RESEND_TITLE} ${listType}`;
      btn1 = `${LISTING_COMMON_MESSAGES.RESEND_TITLE}`;
    }
    if (id == 4 || id == 6) {
      message =
        listType && body.data.status == this.API_EVENT.inactive
          ? `${LISTING_COMMON_MESSAGES.ACTIVE_MSG} this ${listType.toLowerCase()}?`
          : `${LISTING_COMMON_MESSAGES.BLOCK_MSG} this ${listType.toLowerCase()}?`;
      title =
        listType && body.data.status == this.API_EVENT.inactive
          ? `${LISTING_COMMON_MESSAGES.ACTIVE_TITLE} ${listType}`
          : `${LISTING_COMMON_MESSAGES.BLOCK_TITLE} ${listType}`;
      btn1 =
        body.data.status == this.API_EVENT.inactive
          ? `${LISTING_COMMON_MESSAGES.ACTIVE_TITLE}`
          : `${LISTING_COMMON_MESSAGES.BLOCK_TITLE}`;
      body["action"] =
        body.data.status == this.API_EVENT.inactive
          ? this.API_EVENT.inactive
          : this.API_EVENT.active;
    }
    if(id==9){
      message =
       `${LISTING_COMMON_MESSAGES.UN_BLOCK_MSG} this ${listType.toLowerCase()}?`
      title = `${LISTING_COMMON_MESSAGES.UN_BLOCK_TITLE} ${listType}`
      btn1 = `${LISTING_COMMON_MESSAGES.UN_BLOCK_TITLE}`
        
      body["action"] =
         this.API_EVENT.active;
    }

    const dialog = this._dialog.open(ConfirmationModalComponent, {
      panelClass: "account-popup",
      width: "480px",
      data: {
        title: title,
        message: message,
        note: msg,
        btn1: btn1,
        listType:
          body.action == this.API_EVENT.inactive ||
          body.action == this.API_EVENT.delete
            ? this.listType
            : "",
      },
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.status.emit(body);
      }
    });
  }

  applyFilter(event) {
    if (event.apply == null) {
      this.notFoundErrorHandler(respond.added);
      this.tableFilter(false);
    } else {
      if (event.apply) {
        this.notFoundErrorHandler(respond.found);
      } else {
        this.notFoundErrorHandler(respond.added);
      }
      this.tableFilter(false);
      this.filter.emit(event);
    }
  }

  onUserListChangeEvent(type: string) {
    this.userTableTypeChangeEvent.emit(type);
  }
  navigateToCategoryType(id){
   return id ===1 ?this._router.navigateByUrl(SERVICE_CATEGORY.fullUrl):this._router.navigateByUrl(SERVICE_TYPE.fullUrl)
  }

// Store the old value when the dropdown is clicked
storeOldValue(key: string, value: any): void {
  this.oldValues[key] = value;
}
statusChange(event: any, jobId, key): void {
  const currentStatus = this.oldValues[key].toLowerCase();
  const newStatus = event?.value?.toLowerCase();
  if (
    (currentStatus === 'in_progress' && newStatus === 'scheduled') ||
    (currentStatus === 'completed' && ['in_progress', 'scheduled', 'canceled','pending'].includes(newStatus)) ||
    (currentStatus === 'canceled' && ['in_progress', 'scheduled', 'completed'].includes(newStatus))
  ) {
    event.source.value = currentStatus.toUpperCase();
    this._toastService.error(`You cannot change current status into previous status.`)
    
    return;
  }
  const statusMap = {
    in_progress: 'in progress',
    completed: 'complete',
    canceled: 'cancel',
    pending:'pending'
  };
  
  const showValue = statusMap[event?.value?.toLowerCase()] || 'schedule';
  const data = { event, jobId, id: 'dropdown' };
  const msg = false;
  const message = `${LISTING_COMMON_MESSAGES.SURE_MSG} ${showValue} this ${this.listType}?`;
  const title = `${this.listType} Status`;
  const btn1 = `${LISTING_COMMON_MESSAGES.SUBMIT}`;

  const dialog = this._dialog.open(ConfirmationModalComponent, {
    panelClass: 'account-popup',
    width: '480px',
    data: {
      title: title,
      message: message,
      note: msg,
      btn1: btn1,
    },
  });

  dialog.afterClosed().subscribe((result) => {
    if (result) {
      delete this.oldValues[key];
      this.status.emit(data);
    } else {
      // User canceled; revert to the old value
      const oldValue = this.oldValues[key];
      if (oldValue !== undefined) {
        this.dropDownStatus.find((item) => item.value === oldValue); // Ensure it exists in the dropdown
        event.source.value = oldValue; // Update the value in the UI
      }
    }
  });
}
  /**
   * @UNSUBSCRIPTION Unsubscribe all subscriptions to avoid memory leak
   */
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.common.unsubscribe(this.subscriptions);
    }
  }
}

enum respond {
  added = "added!",
  found = "found!",
}
