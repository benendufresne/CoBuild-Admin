import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbService } from 'src/app/components/breadcrumb/breadcrumb.service';
import { BC_SUPPORT } from 'src/app/constants/breadcrumb-routes';
import { reportChatId } from 'src/app/constants/storage-keys';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './support.component.html',
  styleUrl: './support.component.scss'
})
export class SupportComponent implements OnInit,OnDestroy{
  _breadcrumb = inject(BreadcrumbService)
ngOnInit(): void {
  this._breadcrumb.setBreadcrumb(BC_SUPPORT)
}
ngOnDestroy(): void {
   sessionStorage.removeItem(reportChatId);
}
}
