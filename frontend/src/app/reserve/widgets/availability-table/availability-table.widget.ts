import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import {
  Seat,
  SeatAvailability,
  TimeRange
} from 'src/app/coworking/coworking.models';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';

class SeatType {
  public title: string;

  public available_hours: boolean[] = [];

  constructor(title: string) {
    this.title = title;
  }

  push(availability: boolean) {
    this.available_hours.push(availability);
  }
}

@Component({
  selector: 'availability-table',
  templateUrl: './availability-table.widget.html',
  styleUrls: ['./availability-table.widget.css'],
  standalone: true,
  imports: [MatCardModule, MatListModule, CommonModule]
})
export class AvailibilityTable implements OnChanges {
  @Input() day_availability!: SeatAvailability[];

  public seat_types: SeatType[] = [];

  constructor() {
    this.seat_types = this.initTypes();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['day_availability']) {
      this.seat_types = this.loadTypes();
    }
  }

  private initTypes(): SeatType[] {
    return [];
  }

  private loadTypes(): SeatType[] {
    let result: SeatType[] = [];

    for (let seat of this.day_availability) {
      let type = new SeatType(seat.title);

      for (let hour = 10; hour < 18; hour++) {
        let isAvailable = false;

        for (let availability of seat.availability) {
          let start = new Date(availability.start);
          let end = new Date(availability.end);

          let startTotalMinutes = start.getHours() * 60 + start.getMinutes();
          let endTotalMinutes = end.getHours() * 60 + end.getMinutes();
          let currentHourTotalMinutes = hour * 60;

          // Check if the current hour falls within the availability range
          if (
            currentHourTotalMinutes >= startTotalMinutes &&
            currentHourTotalMinutes < endTotalMinutes
          ) {
            isAvailable = true;
            break;
          }
        }

        type.push(isAvailable);
      }
      result.push(type);
    }

    return result;
  }
}
