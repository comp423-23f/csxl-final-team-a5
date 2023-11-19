import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateTimeService {
  formattedDateTime = new EventEmitter<Date>();

  setFormattedDateTime(date: Date) {
    this.formattedDateTime.emit(date);
  }
}
