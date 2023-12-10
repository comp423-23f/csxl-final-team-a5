import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';

import { Observable, Subscription, map, shareReplay, tap } from 'rxjs';
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
import { RxReservations } from '../coworking/ambassador-home/rx-reservations';
import { RxReservation } from '../coworking/reservation/rx-reservation';

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

  private upcoming_reservations: RxReservations = new RxReservations();
  private ongoing_reservations: RxReservations = new RxReservations();
  private reservations_check: Map<number, RxReservation> = new Map();
  public reservations$: Observable<Reservation[]> =
    this.upcoming_reservations.value$;

  public reservations_ongoing$: Observable<Reservation[]> =
    this.ongoing_reservations.value$;

  public constructor(
    protected http: HttpClient,
    protected profileSvc: ProfileService,
    protected snackBar: MatSnackBar
  ) {
    this.profileSubscription = this.profileSvc.profile$.subscribe(
      (profile) => (this.profile = profile)
    );
  }
  fetchUpcomingReservations(): void {
    this.http
      .get<ReservationJSON[]>('/api/reserve/upcoming')
      .subscribe((reservations) => {
        this.upcoming_reservations.set(reservations.map(parseReservationJSON));
      });
  }

  fetchOngoingReservations(): void {
    this.http
      .get<ReservationJSON[]>('/api/reserve/ongoing')
      .subscribe((reservations) => {
        this.ongoing_reservations.set(reservations.map(parseReservationJSON));
      });
  }

  checkout(reservation: Reservation) {
    let endpoint = `/api/coworking/reservation/${reservation.id}`;
    let payload = { id: reservation.id, state: 'CHECKED_OUT' };
    return this.http.put<ReservationJSON>(endpoint, payload).pipe(
      map(parseReservationJSON),
      tap((reservation) => {
        let rxReservation = this.getRxReservation(reservation.id);
        rxReservation.set(reservation);
      })
    );
  }

  private getRxReservation(id: number): RxReservation {
    let reservation = this.reservations_check.get(id);
    if (reservation === undefined) {
      let loader = this.http
        .get<ReservationJSON>(`/api/coworking/reservation/${id}`)
        .pipe(
          map(parseReservationJSON),
          shareReplay({ windowTime: 1000, refCount: true })
        );
      reservation = new RxReservation(loader);
      this.reservations_check.set(id, reservation);
    }
    return reservation;
  }

  cancel_rx(reservation: Reservation) {
    this.http
      .put<ReservationJSON>(`/api/coworking/reservation/${reservation.id}`, {
        id: reservation.id,
        state: 'CANCELLED'
      })
      .subscribe({
        next: (_) => {
          this.upcoming_reservations.remove(reservation);
        },
        error: (err) => {
          alert(err);
        }
      });
  }

  cancel_rx_ongoing(reservation: Reservation) {
    this.http
      .put<ReservationJSON>(`/api/coworking/reservation/${reservation.id}`, {
        id: reservation.id,
        state: 'CANCELLED'
      })
      .subscribe({
        next: (_) => {
          this.ongoing_reservations.remove(reservation);
        },
        error: (err) => {
          alert(err);
        }
      });
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

    let reservation_at_time_flag = false;
    let too_many_reservations_flag = false;

    this.status$.subscribe({
      next: (status) => {
        let reservations = status.my_reservations;
        if (reservations.length >= 2) {
          too_many_reservations_flag = true;
        }
        if (too_many_reservations_flag == false) {
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
              reservation_at_time_flag = true;
              break;
            }
          }
        }
      }
    });

    if (reservation_at_time_flag) {
      this.snackBar.open(
        'You already have a reservation at this time!',
        'Close',
        {
          duration: 3000
        }
      );
    }

    if (too_many_reservations_flag) {
      this.snackBar.open(
        'You have exceeded the maximum number of reservations at a time!',
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
          flags: reservation_at_time_flag || too_many_reservations_flag
        }
      })
      .pipe(
        map((seatAvailability) =>
          seatAvailability.map(parseSeatAvailabilityJSON)
        )
      );
  }

  searchDayAvailability(selectedTime: Date) {
    if (this.profile === undefined) {
      throw new Error('Only allowed for logged in users.');
    }
    let start = new Date(selectedTime.getTime());
    start.setUTCHours(0, 0, 0, 0);
    let start_str = start.toISOString();
    start_str = start_str.slice(0, -1);
    start_str += '0';

    let end = start;
    end.setUTCHours(23, 59, 59, 0);
    let end_str = end.toISOString();
    end_str = end_str.slice(0, -1);
    end_str += '0';
    console.log(start_str);
    console.log(end_str);

    return this.http
      .get<SeatAvailabilityJSON[]>('/api/reserve/availability', {
        params: {
          start: start_str,
          end: end_str,
          flags: false
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
        'There are no seats available for reservations!',
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
