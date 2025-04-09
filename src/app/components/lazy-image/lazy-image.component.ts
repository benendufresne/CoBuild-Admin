import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LazyDirective } from "src/app/directives/lazy/lazy.directive";
import { ImgLoaderDirective } from "src/app/directives/img-loader.directive";

@Component({
  selector: "app-lazy-image",
  standalone: true,
  imports: [CommonModule, LazyDirective,ImgLoaderDirective],
  templateUrl: "./lazy-image.component.html",
  styleUrls: ["./lazy-image.component.scss"],
})
export class LazyImageComponent implements OnInit {
  /**
   * @SETTER_GETTER using Input & Output
   */
  _img: string;
  _alt: string = 'cobuild image';
  @Input() cssClasses: any;

  @Input() set img(value: any) {
    this._img = value;
  }

  @Input() set alt(value: any) {
    this._alt = value;
  }

  constructor() {}

  ngOnInit() {}
}
