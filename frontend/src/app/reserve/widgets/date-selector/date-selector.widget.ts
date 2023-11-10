import { Component } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
//can not use the ReactiveFormsModule imported in reserve.module because DateSelector, which must be a standalone, can only be imported in reserve.module, not declared

@Component({
  selector: 'date-selector',
  templateUrl: 'date-selector.widget.html',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ]
})
export class DateSelector {
  minDate: Date;
  maxDate: Date;
  selectedDate: FormControl = new FormControl();

  constructor() {
    const today = new Date();
    this.minDate = today; // min date is today

    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(today.getDate() + 14); // add 14 days to the current date
    this.maxDate = twoWeeksFromNow; // max date is two weeks from now

    this.selectedDate.valueChanges.subscribe((value) => {
      console.log('Selected Date:', value);
    });
  }

  getSelectedDate(): Date {
    return this.selectedDate.value;
  }
  //to retrieve this in another component/service
  //create instance of DateSelector and call getSelectedDate()
}
