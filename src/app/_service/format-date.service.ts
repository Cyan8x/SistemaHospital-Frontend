import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class FormatDateService {

  constructor() { }

  formatDate(dateString: string): string {
    const date = moment(dateString);
    const today = moment().startOf('day');
    const yesterday = moment().subtract(1, 'day').startOf('day');
    const tomorrow = moment().add(1, 'day').startOf('day');

    if (date.isSame(today, 'd')) {
      return 'Hoy, ' + date.format('h:mm A');
    } else if (date.isSame(yesterday, 'd')) {
      return 'Ayer, ' + date.format('h:mm A');
    } else if (date.isSame(tomorrow, 'd')) {
      return 'Mañana, ' + date.format('h:mm A');
    } else {
      return date.format('DD/MM/YYYY h:mm A');
    }
  }
}
