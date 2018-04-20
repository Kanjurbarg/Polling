import { Injectable } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';


@Injectable()
@Pipe({name: 'dateFormatPipe'})
export class DatePipeService implements PipeTransform {
  transform(value: string, type?: string) {
    const datePipe = new DatePipe('en-US');
    if (!type) {
      value = datePipe.transform(value, 'MMM d');
    }
    if (type === 'long') {

      value = datePipe.transform(value, 'h:mm a - d MMM yyy');
    }
    if (type === 'month') {
      value = datePipe.transform(value, 'MMM yyy');
    }
    console.log(value);
    return value;
 }
}
