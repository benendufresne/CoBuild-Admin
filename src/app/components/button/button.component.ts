import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BUTTON_TYPE_CONST, CUSTOM_BUTTON_CONST } from 'src/app/constants/actionbutton-constant';

@Component({
  selector: "app-button",
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: "./button.component.html",
  styleUrl: "./button.component.scss",
})
export class ButtonComponent {
  @Input() btnType: string = CUSTOM_BUTTON_CONST.btnButton;
  @Input() cssClasses: string = CUSTOM_BUTTON_CONST.default;
  @Input() conditionClass:string
  @Input() btnLabel: string;
  @Input() isDisabled: boolean = false;
  @Input() isActionInProgress: boolean = false;
  @Input() isLoaderAvl: boolean = true;
  @Input() buttonWidth: string = "100%";
  @Input() buttonHeight: string = "100%";
  @Input() buttonRadius: string;
  @Input() componentType: string = BUTTON_TYPE_CONST.ONLY_BUTTON;
  @Input() iconURL: string;
  @Input() iconALT: string;
  @Output() buttonClickEvent: EventEmitter<any> = new EventEmitter();

  public buttonTypeConst = BUTTON_TYPE_CONST;
  onClick() {
    this.buttonClickEvent.emit();
  }
}
