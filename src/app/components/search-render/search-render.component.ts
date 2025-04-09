import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { CommonService } from 'src/app/services/common/common.service';
import { PreventKeysDirective } from 'src/app/directives/prevent-keys/prevent-keys.directive';

@Component({
  selector: 'app-search-render',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    PreventKeysDirective,
  ],
  templateUrl: './search-render.component.html',
  styleUrls: ['./search-render.component.scss'],
})
export class SearchRenderComponent implements OnInit, OnDestroy {
  @Input() placeholder!: string;
  @Input() cssClass!: string;
  @Input() prefillSearch!: string;

  @Output() renderSearch = new EventEmitter();
  searchSub!: Subscription;
  searchForm = new FormControl('');

  constructor() {
    
  }
  
  ngOnInit() {
    this.realTimeSearch();
    if(this.prefillSearch){
      this.searchForm.patchValue(this.prefillSearch)
    }
    
  }

  realTimeSearch() {
    this.searchSub = this.searchForm.valueChanges
      .pipe(debounceTime(800), distinctUntilChanged())
      .subscribe((value) => {
        this.searchEmit(value);
      });
  }

  searchEmit(text: string | null) {
    if (text) {
      text = text.trim();
      if (text) {
        this.renderSearch.emit(text.toLowerCase());
      }
    } else if (text == '' || !text) {
      this.renderSearch.emit('');
    }
  }

  clearValue(callFromOther = false) {
    if (this.searchForm.value) {
      this.searchForm.setValue('');
    }
  }

  ngOnDestroy() {
    if (this.searchSub) {
      this.searchSub.unsubscribe();
    }
  }
}
