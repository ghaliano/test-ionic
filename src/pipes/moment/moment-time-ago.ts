import * as moment from 'moment';

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'momentTimeAgo'})
export class MomentTimeAgoPipe implements PipeTransform {
  transform(date, format) {
    return moment(date).fromNow();  
  }
}