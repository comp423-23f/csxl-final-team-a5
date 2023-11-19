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
  TimeRange,
  parseCoworkingStatusJSON,
  parseReservationJSON,
  parseSeatAvailabilityJSON
} from '../coworking/coworking.models';
import { ProfileService } from '../profile/profile.service';
import { Profile } from '../models.module';
import { RxCoworkingStatus } from '../coworking/rx-coworking-status';

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
    protected profileSvc: ProfileService
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

  pollStatusRefresh(dateTime: string): void {
    console.log(`/api/coworking/status/reserve?date_time=${dateTime}`);
    this.http
      .get<CoworkingStatusJSON>(
        `/api/coworking/status/reserve?date_time=${dateTime}`
      )
      .pipe(map(parseCoworkingStatusJSON))
      .subscribe((status) => this.status.set(status));
  }

  searchAvailability(selectedTime: Date) {
    if (this.profile === undefined) {
      throw new Error('Only allowed for logged in users.');
    }

    let start = new Date(selectedTime.getTime() - 5 * ONE_HOUR);
    let end = new Date(start.getTime() + 2 * ONE_HOUR);
    console.log(start.toISOString());
    console.log(end.toISOString());

    return this.http
      .get<SeatAvailabilityJSON[]>('/api/reserve/availability', {
        params: {
          start: start.toISOString(),
          end: end.toISOString()
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

    return this.http
      .post<ReservationJSON>('/api/coworking/reservation', reservation)
      .pipe(map(parseReservationJSON));
  }
}
