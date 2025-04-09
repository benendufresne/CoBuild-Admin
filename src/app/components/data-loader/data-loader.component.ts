import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-loader.component.html',
  styleUrls: ['./data-loader.component.scss']
})
export class DataLoaderComponent{
@Input() cssClasses: string;
@Input() conditionalClass: string;

}
