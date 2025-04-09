import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { MatListModule } from "@angular/material/list";
import { ToastService } from "src/app/components/toast-notification/toast.service";
import { AbsoluteRoutePipe } from "src/app/pipes/absolute-route/absolute-route.pipe";
import { MatExpansionModule } from "@angular/material/expansion";
import { RequestManagementService } from "src/app/features/request-management/service/request-management.service";
import { StorageService } from "src/app/services/storage/storage.service";
import { MODULE_ID_OF } from "src/app/constants/messages";
import { DamageService } from "src/app/features/incidents-damage/_service/damage.service";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatListModule,
    RouterModule,
    AbsoluteRoutePipe,
    MatExpansionModule,
  ],
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent {
  public showManageRole: boolean = false;
  public isCmsActive: boolean = false;
  moduleId = MODULE_ID_OF;
  constructor(
    private _toast: ToastService,
    private _router: Router,
    private readonly _requestService:RequestManagementService,
    private readonly _storageService:StorageService,
    private readonly _damageService:DamageService
  ) {
    this._router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.isCmsActive = this.cmsActiveCheck();
      }
    });
  }
  underDevelopment() {
    this._toast.info("Under Development");
  }
  checkpermission(sectionId) {
    if (!this._storageService?.profileDetail) {
      return false;
    }
    if (this._storageService?.profileDetail.userType == 'ADMIN') {
      return true;
    }
    const permission = this._storageService?.profileDetail?.permission.find(item => item.moduleId == sectionId);
    if (permission && (permission?.view || permission?.edit)) {
      return true;
    } else {
      return false;
    }
  }

  toggleManageRole(event) {
    event.stopPropagation();
    this.showManageRole = !this.showManageRole;
  }
  clickTab(id:string){
    if(id !== "requestTab"){
      this._requestService.setIsRequestTableFiltered(
        {
          isFiltered: false,
          listName: '',
          values: {},
        }
      )
      this._requestService.setIsServiceTypeTableFiltered(
        {
          isFiltered: false,
          listName: '',
          values: {},
        }
      )
      this._requestService.setSearchCategoryData(
        
       ''
        
      )
      this._requestService.setSearchRequestData(
        
        ''
         
       )
       this._requestService.setSearchTypeData(
        
        ''
         
       )
    }
    if(id !== "damageTab"){
      this._damageService.setIsDamageTableFiltered(
        {
          isFiltered: false,
          listName: '',
          values: {},
        }
      )
      this._damageService.setSearchDamageData(
        
        ''
         
       )
    }
  }
  cmsActiveCheck = (): boolean =>  {
    return this._router.url.includes('cms-management');
  }
}
