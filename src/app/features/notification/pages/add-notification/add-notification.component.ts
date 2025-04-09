import { MatCheckboxModule } from "@angular/material/checkbox";
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { BreadcrumbService } from "src/app/components/breadcrumb/breadcrumb.service";
import { ToastService } from "src/app/components/toast-notification/toast.service";
import { NotificationService } from "../../_services/notification.service";
import { CUSTOM_BUTTON_CONST } from "src/app/constants/actionbutton-constant";
import { API_STATUS, NUMBER_CONST } from "src/app/constants/number";
import { ApiResponse } from "src/app/constants/interface";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  BehaviorSubject,
  firstValueFrom,
  Subscription,
} from "rxjs";
import { ButtonComponent } from "src/app/components/button/button.component";
import { ErrorMessagePipe } from "src/app/pipes/error-message/error-message.pipe";
import { DataLoaderComponent } from "src/app/components/data-loader/data-loader.component";
import { MatIconModule } from "@angular/material/icon";
import { NoLeadingSpaceDirective } from "src/app/directives/no-leading-space/no-leading-space.directive";
import { BC_NOTIFICATION_ADD } from "src/app/constants/breadcrumb-routes";
import {
  ACCOUNT_TYPE_ENUM,
  NOTIFICATION_USERS,
} from "src/app/constants/constant";
import { MatRadioModule } from "@angular/material/radio";
import {
  MatAutocompleteTrigger,
} from "@angular/material/autocomplete";
import { CommonService } from "src/app/services/common/common.service";
import { Router } from "@angular/router";
import { NOTIFICATION_MANAGEMENT } from "src/app/constants/routes";
import { REGEX } from "src/app/constants/validators";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationModalComponent } from "src/app/components/confirmation-modal/confirmation-modal.component";

const MODULES = [
  MatButtonModule,
  MatInputModule,
  MatFormFieldModule,
  FormsModule,
  ButtonComponent,
  ReactiveFormsModule,
  ErrorMessagePipe,
  DataLoaderComponent,
  MatIconModule,
  MatSelectModule,
  NoLeadingSpaceDirective,
  MatRadioModule,
  MatCheckboxModule,

];
@Component({
  selector: "app-add-notification",
  standalone: true,
  imports: [CommonModule, ...MODULES],
  templateUrl: "./add-notification.component.html",
  styleUrls: ["./add-notification.component.scss"],
})
export class AddNotificationComponent implements OnInit, OnDestroy {
  public customButtonConst = CUSTOM_BUTTON_CONST;
  public dataLoading: boolean = false;
  public actionInProgress: boolean = false;
  public eventId: string;
  public numberConst = NUMBER_CONST;
  public userType = NOTIFICATION_USERS;
  public selectedUserCount: number = 0;
  public isManualSelected: any;
  public notificationForm: FormGroup<any>;
  private searchKey$ = new BehaviorSubject<string>("");
  private subscription: Subscription[] = [];
  public accountType = ACCOUNT_TYPE_ENUM;
  public searchForm = new FormControl('');
  private searchSub!: Subscription;
  allUsersData: any[] = [];
  selectedUsersData: any[] = [];
  searchKey: string;
  selectedUserError: boolean = false;
  private currentPage: number = 1;
  private limit: number = 20;
  private nextHit: number = 1;
  public noRecordFound: boolean = false;
  public isLoading: boolean = false;

  @ViewChild("selectedUsersInput") selectedUsers: ElementRef<HTMLInputElement>;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger:
    | MatAutocompleteTrigger
    | undefined;

  constructor(
    private readonly _breadcrumbService: BreadcrumbService,
    private readonly _notificationService: NotificationService,
    private readonly _toastService: ToastService,
    private readonly _fb: FormBuilder,
    private readonly _commonService: CommonService,
    private readonly _router: Router,
    private readonly _dialog: MatDialog
  ) {
    this._breadcrumbService.setBreadcrumb(BC_NOTIFICATION_ADD);
  }
  ngOnInit(): void {
    this.createForm();

  }
  createForm() {
    this.notificationForm = this._fb.group({
      title: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(REGEX.NAME),
          Validators.maxLength(50),
        ],
      ],
      description: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(REGEX.NAME),
          Validators.maxLength(200),
        ],
      ],
      users:["", Validators.required]
    
    });
  }
  /****** Form controls ******/
  get frmCtrl(): any {
    return this.notificationForm.controls;
  }

  /****** Back To Location ******/
  backNavigation() {
    this._router.navigate([NOTIFICATION_MANAGEMENT.fullUrl]);
  }

  /****** Send Notification Api Call ******/
  onSubmit() {
    if (this.notificationForm.valid) {
      this.actionInProgress = true;
      const dialog = this._dialog.open(ConfirmationModalComponent, {
        panelClass: "account-popup",
        width: "480px",
        data: {
          title: 'Send Notification',
          message: 'Are you sure you want to send this Notification?',
          btn1: 'Send',
        },
      });
      dialog.afterClosed().subscribe((result) => {
        result ? this.addNotificationApiCall() : this.actionInProgress = false;
      });
    }
  }

  async addNotificationApiCall(): Promise<void> {
    try {
      const requestBody = { ...this.notificationForm.value,userType:'USER'};
      const responseData: ApiResponse = await firstValueFrom(this._notificationService.addNotification(requestBody));
      if (responseData.statusCode === API_STATUS.TWO_ZERO_ONE) {
        this._toastService.success(responseData.message);
        this.actionInProgress = false;
        this.backNavigation();
      } else if (responseData.statusCode === API_STATUS.FOUR_ZERO_ZERO) {
        this._toastService.error(responseData.message);
        this.actionInProgress = false;
      }
    } catch (error) {
      this.actionInProgress = false;
      this._toastService.error(error.message);
    }
  }
  ngOnDestroy(): void {
    if (this.subscription?.length > 0) {
      this._commonService.unsubscribe(this.subscription);
    }
  }
}
