import * as moment from 'moment';

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'momentDate'})
export class MomentDatePipe implements PipeTransform {
  transform(date, format) {
    return moment(date).format(format);
  }
}