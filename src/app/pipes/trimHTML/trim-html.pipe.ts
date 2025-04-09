import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trimHTML',
  standalone: true
})
export class TrimHTMLPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;

    // Convert SafeHtml to string and then remove leading/trailing spaces
    const htmlString = (value as any).changingThisBreaksApplicationSecurity || value as string;

    // Trim leading and trailing spaces from HTML elements
    const trimmedHtml = htmlString.replace(/>\s+/g, '>').replace(/\s+</g, '<');

    // Return the sanitized trimmed HTML
    return trimmedHtml;
  }

}
