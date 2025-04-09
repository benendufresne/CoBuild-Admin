import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { AbsoluteRoutePipe } from "src/app/pipes/absolute-route/absolute-route.pipe";

@Component({
  selector: "app-forgot-password-sucess",
  standalone: true,
  imports: [CommonModule, AbsoluteRoutePipe, RouterModule, MatButtonModule],
  templateUrl: "./forgot-password-sucess.component.html",
  styleUrls: ["./forgot-password-sucess.component.scss"],
})
export class ForgotPasswordSucessComponent {}
