import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';

import { Observable, Subscription, map, tap } from 'rxjs';
import {
  CoworkingStatus,
  CoworkingStatusJSON,
  Reservation,
  ReservationJSON,
  SeatAvailability,
  SeatAvailabilityJSON,
  parseCoworkingStatusJSON,
  parseReservationJSON,
  parseSeatAvailabilityJSON
} from '../coworking/coworking.models';
import { ProfileService } from '../profile/profile.service';
import { Profile } from '../models.module';
import { RxCoworkingStatus } from '../coworking/rx-coworking-status';
import { MatSnackBar } from '@angular/material/snack-bar';

const ONE_HOUR = 60 * 60 * 1000;

@Injectable({
  providedIn: 'root'
})
export class ReserveService implements OnDestroy {
  private status: RxCoworkingStatus = new RxCoworkingStatus();
  public status$: Observable<CoworkingStatus> = this.status.value$;

  private profile: Profile | undefined;
  private profileSubscription!: Subscription;

  public constructor(
    protected http: HttpClient,
    protected profileSvc: ProfileService,
    protected snackBar: MatSnackBar
  ) {
    this.profileSubscription = this.profileSvc.profile$.subscribe(
      (profile) => (this.profile = profile)
    );
  }

  ngOnDestroy(): void {
    this.profileSubscription.unsubscribe();
  }
  pollStatus(): void {
    this.http
      .get<CoworkingStatusJSON>('/api/coworking/status')
      .pipe(map(parseCoworkingStatusJSON))
      .subscribe((status) => this.status.set(status));
  }

  searchAvailability(selectedTime: Date) {
    if (this.profile === undefined) {
      throw new Error('Only allowed for logged in users.');
    }

    let start = new Date(selectedTime.getTime() - 5 * ONE_HOUR);
    let end = new Date(start.getTime() + 2 * ONE_HOUR);
    let start_str = start.toISOString();
    start_str = start_str.slice(0, -1);
    start_str += '0';

    let end_str = end.toISOString();
    end_str = end_str.slice(0, -1);
    end_str += '0';
    console.log(start_str);
    console.log(end_str);

    let flag = false;

    this.status$.subscribe({
      next: (status) => {
        let reservations = status.my_reservations;
        for (let reservation of reservations) {
          let res_start_adjust_gmt = new Date(
            reservation.start.getTime() - 5 * ONE_HOUR
          );
          let res_end_adjust_gmt = new Date(
            reservation.end.getTime() - 5 * ONE_HOUR
          );
          if (
            (res_start_adjust_gmt >= start && res_start_adjust_gmt < end) ||
            (res_end_adjust_gmt > start && res_end_adjust_gmt <= end)
          ) {
            flag = true;
            break;
          }
        }
      }
    });

    if (flag) {
      this.snackBar.open(
        'You already have a reservation at this time!',
        'Close',
        {
          duration: 3000
        }
      );
    }

    return this.http
      .get<SeatAvailabilityJSON[]>('/api/reserve/availability', {
        params: {
          start: start_str,
          end: end_str,
          flag: flag
        }
      })
      .pipe(
        map((seatAvailability) =>
          seatAvailability.map(parseSeatAvailabilityJSON)
        )
      );
  }

  draftReservation(seatSelection: SeatAvailability[]) {
    if (this.profile === undefined) {
      throw new Error('Only allowed for logged in users.');
    }

    let start = seatSelection[0].availability[0].start;
    let end = new Date(start.getTime() + 2 * ONE_HOUR);
    let reservation = {
      users: [this.profile],
      seats: seatSelection.map((seatAvailability) => {
        return { id: seatAvailability.id };
      }),
      start,
      end
    };

    let no_reservables = true;
    for (let seat of seatSelection) {
      if (seat.reservable == true) {
        no_reservables = false;
        break;
      }
    }
    if (no_reservables) {
      this.snackBar.open(
        'These seats are currently unavailable for reservations!',
        'Close',
        {
          duration: 3000
        }
      );
    }

    return this.http
      .post<ReservationJSON>('/api/coworking/reservation', reservation)
      .pipe(map(parseReservationJSON));
  }
}
