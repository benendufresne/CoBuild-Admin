import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";
import { AbsoluteRoutePipe } from "src/app/pipes/absolute-route/absolute-route.pipe";

@Component({
  selector: "app-reset-password-success",
  standalone: true,
  imports: [CommonModule, RouterModule,AbsoluteRoutePipe, MatButtonModule],
  templateUrl: "./reset-password-success.component.html",
  styleUrls: ["./reset-password-success.component.scss"],
})
export class ResetPasswordSuccessComponent {}
