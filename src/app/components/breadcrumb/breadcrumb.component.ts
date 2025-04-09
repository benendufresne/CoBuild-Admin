import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbService } from './breadcrumb.service';
import { IbreadcrumbRoute } from '../../constants/interface';
import { CommonService } from 'src/app/services/common/common.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule,RouterModule,MatIconModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {
  
  data: Array<IbreadcrumbRoute>;

  constructor(private breadcrumbService: BreadcrumbService,  private _common: CommonService,
    private _location: Location) { }

  ngOnInit() {
    this.breadcrumbService.data.subscribe((data:Array<IbreadcrumbRoute>) => {
      this.data = data;
    });
  }
  breadCrumbNavigationHandler(link: any) {
    if (link?.backNavigation) {
      this._location.back();
    } else if (link?.id) {
      this._common.navigate([`${link?.path}/${link.id}`]);

    } else {
      this._common.navigate([link?.path]);
    }
  }
}
