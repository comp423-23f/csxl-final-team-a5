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
  times: Time[] = [
    { value: '10:00am' },
    { value: '11:00am' },
    { value: '12:00pm' },
    { value: '1:00pm' },
    { value: '2:00pm' },
    { value: '3:00pm' },
    { value: '4:00pm' },
    { value: '5:00pm' }
  ];
  minDate: Date;
  maxDate: Date;
  selectedTime: FormControl = new FormControl();
  selectedDate: FormControl = new FormControl();

  currentDate: Date | undefined;
  currentTime: Date | undefined;

  @Output() searchClicked = new EventEmitter<void>();

  constructor() {
    const today = new Date();
    this.minDate = today; // min date is today

    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(today.getDate() + 7); // add 7 days to the current date
    this.maxDate = twoWeeksFromNow; // max date is two weeks from now
    console.log(this.times);
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
    this.searchClicked.emit();
  }
}
