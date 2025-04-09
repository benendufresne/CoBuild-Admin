import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatNativeDateModule } from "@angular/material/core";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { ChangeDetectionStrategy } from "@angular/core";
import { ButtonComponent } from "../../button/button.component";
import { CUSTOM_BUTTON_CONST } from "src/app/constants/actionbutton-constant";
@Component({
  selector: "app-filter",
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    ButtonComponent
  ],
  templateUrl: "./filter.component.html",
  styleUrls: ["./filter.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnInit {
  @Output() apply: EventEmitter<any> = new EventEmitter();
  @Input() isFilterFormFilled:boolean = false;
  public customButtonConst = CUSTOM_BUTTON_CONST;
  constructor() { }

  ngOnInit() {
    
  }

  applyForm(info: boolean) {
    const send = {
      apply: info
    }
    this.apply.emit(send);
  }
}
