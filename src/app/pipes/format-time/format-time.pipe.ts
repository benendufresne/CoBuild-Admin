import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime',
  standalone: true,
})
export class FormatTimePipe implements PipeTransform {
  transform(value: any): string {
    const startTime = this.getTime(
      value.startTime?.hours,
      value.startTime?.minutes
    );
    const endTime = this.getTime(value.endTime?.hours, value.endTime?.minutes);
    return `${startTime} - ${endTime}`;
  }

  getTime(hr: any, minutes: any): string {
    let hour = hr;
    let min = minutes;
    let part = hour >= 12 ? 'PM' : 'AM';
    if (parseInt(hour) == 0) hour = 12;
    min = (min + '').length == 1 ? `0${min}` : min;
    hour = hour > 12 ? hour - 12 : hour;
    hour = (hour + '').length == 1 ? `0${hour}` : hour;
    return `${hour}:${min}${part}`;
  }
}
