import { Component, EventEmitter, Output } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { FormControl, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

interface Time {
  value: string;
}

@Component({
  selector: 'reserve-card',
  templateUrl: './reservation-card.widget.html',
  styleUrls: ['./reservation-card.widget.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSelectModule,
    FormsModule
  ]
})
export class ReservationCard {
  @Output() formattedDateTimeChange = new EventEmitter<string>();

  times: Time[] = [
    { value: '10:00am' },
    { value: '11:00am' },
    { value: '12:00pm' },
    { value: '1:00pm' },
    { value: '2:00pm' },
    { value: '3:00pm' },
    { value: '4:00pm' }
    //ends at 4pm because we are only supporting 2-hr reservations and xl closes at 6
  ];
  minDate: Date;
  maxDate: Date;
  selectedTime: FormControl = new FormControl();
  selectedDate: FormControl = new FormControl();

  currentDate: Date | undefined;
  currentTime: string | undefined;

  formattedDateTime: string | undefined;

  @Output() searchClicked = new EventEmitter<void>();

  constructor() {
    const today = new Date();
    this.minDate = today; // min date is today

    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(today.getDate() + 7); // add 7 days to the current date
    this.maxDate = twoWeeksFromNow; // max date is two weeks from now

    this.selectedTime.valueChanges.subscribe((value) => {
      console.log('Selected Time:', value);
      this.currentTime = value;
    });

    this.selectedDate.valueChanges.subscribe((current) => {
      console.log('Selected Date:', current); // You can perform actions with the selected date here
      this.currentDate = current;
    });
  }
  selectDateTime() {
    if (this.currentDate && this.currentTime) {
      // Combine date and time into one string with the desired format
      this.formattedDateTime = this.formatDateTime(
        this.currentDate,
        this.currentTime
      );
      console.log('Selected Date and Time:', this.formattedDateTime);
      // You can use formattedDateTime for further processing or display
      this.searchClicked.emit();
    } else {
      console.log('Please select both date and time.');
    }
  }
  private formatDateTime(date: Date, time: string): string {
    const formattedDate = `${date.getFullYear()}-${this.padZero(
      date.getMonth() + 1
    )}-${this.padZero(date.getDate())}`;
    const formattedTime = `${this.extractHourFromTime(time)}:${this.padZero(
      this.extractMinuteFromTime(time)
    )}:00.0000`;
    this.formattedDateTimeChange.emit(`${formattedDate}T${formattedTime}`);
    return `${formattedDate}T${formattedTime}`;
  }

  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  private extractHourFromTime(time: string): number {
    const hour = parseInt(time.split(':')[0], 10);
    return time.includes('pm') && hour !== 12 ? hour + 12 : hour;
  }

  private extractMinuteFromTime(time: string): number {
    return parseInt(time.split(':')[1], 10);
  }
}
