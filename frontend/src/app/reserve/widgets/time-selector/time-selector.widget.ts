import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

interface Time {
  value: string;
}

@Component({
  selector: 'time-selector',
  templateUrl: 'time-selector.widget.html',
  styleUrls: ['time-selector.widget.css']
})
export class TimeSelector {
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

  selectedTime: FormControl = new FormControl();

  constructor() {
    this.selectedTime.valueChanges.subscribe((value) => {
      console.log('Selected Time:', value);
    });
  }

  getSelectedTime(): Date {
    return this.selectedTime.value;
  }
}
