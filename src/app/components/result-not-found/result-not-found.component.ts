import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-result-not-found",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./result-not-found.component.html",
  styleUrls: ["./result-not-found.component.scss"],
})
export class ResultNotFoundComponent implements OnInit {
  @Input() msg!: string;
  @Input() isShowImage: boolean = true;
  constructor() {}

  ngOnInit() {
  }
}
