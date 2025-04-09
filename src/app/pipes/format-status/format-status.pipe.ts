import { Pipe, PipeTransform } from "@angular/core";
import { Pagination } from "../../constants/pagination";

@Pipe({
  name: "formatStatus",
  standalone: true,
})
export class FormatStatusPipe extends Pagination implements PipeTransform {
  transform(value: any, extraArgument?: string): any {
    switch (value) {
      case this.API_EVENT.block:
        return "Inactive";
      case this.API_EVENT.inactive:
        return "Inactive";
      case this.API_EVENT.active:
        return "Active";
      case this.API_EVENT.delete:
        return "Deleted";
      case this.API_EVENT.pending:
      case this.API_EVENT.bidAgain:
        return "Pending";
      case this.API_EVENT.success:
        return "Success";
      case this.API_EVENT.cancel:
        return "Canceled";
      case this.API_EVENT.expire:
        return "Expired";
      case this.API_EVENT.high:
        return "High";
      case this.API_EVENT.low:
        return "Low";
      case this.API_EVENT.medium:
        return "Medium";
      case this.API_EVENT.approve:
        return "Approved";
      case this.API_EVENT.reject:
        return "Rejected";
      default:
        return "-";
    }
  }
}
