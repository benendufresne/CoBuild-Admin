import { CommonModule } from "@angular/common";
import { Component, inject, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { VIEW_MANAGEMENT } from "src/app/constants/routes";
import { RequestStatusPipe } from "src/app/pipes/requestStatus/request-status.pipe";
import { CommonService } from "src/app/services/common/common.service";
import { StorageService } from "src/app/services/storage/storage.service";

@Component({
  selector: "app-request-card",
  standalone: true,
  imports: [CommonModule, RequestStatusPipe],
  templateUrl: "./request-card.component.html",
  styleUrl: "./request-card.component.scss",
})
export class RequestCardComponent implements OnInit {
  @Input() quotationData;
  @Input() rejectRequestStatus;
  _router = inject(Router);
  _common = inject(CommonService);
  _storage = inject(StorageService);
  clickAccess
  ngOnInit(): void {
    const permission = this._storage.profileDetail.permission;
    const requestManagement = permission.find(
      (item) => item.module === "Request Management"
    );
    this.clickAccess = requestManagement ||  this._storage.profileDetail.userType ==='ADMIN'
  }
  navigateToRequest(reqId) {
    if (this.clickAccess) {
      this._router.navigate([
        VIEW_MANAGEMENT.fullUrl,
        this._common.encryption(reqId),
      ]);
    }
  }
}
