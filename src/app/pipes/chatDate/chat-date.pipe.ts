import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chatDate',
  standalone: true
})
export class ChatDatePipe implements PipeTransform {

  transform(value: Date | string): string {
    const inputDate = new Date(value);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (this.isSameDay(inputDate, today)) {
      return 'Today';
    } else if (this.isSameDay(inputDate, yesterday)) {
      return 'Yesterday';
    } else {
      return this.formatDate(inputDate); // Format as "MMM d, y"
    }
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  private formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString(undefined, options); // Example: "Feb 9, 2025"
  }

}
