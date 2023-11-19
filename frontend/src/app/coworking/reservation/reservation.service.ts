import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, shareReplay, tap } from 'rxjs';
import {
  Reservation,
  ReservationJSON,
  parseReservationJSON
} from '../coworking.models';
import { RxReservation } from './rx-reservation';
import { RxReservations } from '../ambassador-home/rx-reservations';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private reservations: Map<number, RxReservation> = new Map();
  private current_reservations: RxReservations = new RxReservations();
  public reservations$: Observable<Reservation[]> =
    this.current_reservations.value$;
  constructor(private http: HttpClient) {}

  fetchUpcomingReservations(): void {
    this.http
      .get<ReservationJSON[]>('/api/reserve/upcoming')
      .subscribe((reservations) => {
        this.current_reservations.set(reservations.map(parseReservationJSON));
      });
  }

  get(id: number): Observable<Reservation> {
    let reservation = this.getRxReservation(id);
    reservation.load();
    return reservation.value$;
  }

  cancel(reservation: Reservation) {
    let endpoint = `/api/coworking/reservation/${reservation.id}`;
    let payload = { id: reservation.id, state: 'CANCELLED' };
    return this.http.put<ReservationJSON>(endpoint, payload).pipe(
      map(parseReservationJSON),
      tap((reservation) => {
        let rxReservation = this.getRxReservation(reservation.id);
        rxReservation.set(reservation);
      })
    );
  }
  cancel_rx(reservation: Reservation) {
    this.http
      .put<ReservationJSON>(`/api/coworking/reservation/${reservation.id}`, {
        id: reservation.id,
        state: 'CANCELLED'
      })
      .subscribe({
        next: (_) => {
          this.current_reservations.remove(reservation);
        },
        error: (err) => {
          alert(err);
        }
      });
  }

  confirm(reservation: Reservation) {
    let endpoint = `/api/coworking/reservation/${reservation.id}`;
    let payload = { id: reservation.id, state: 'CONFIRMED' };
    return this.http.put<ReservationJSON>(endpoint, payload).pipe(
      map(parseReservationJSON),
      tap((reservation) => {
        let rxReservation = this.getRxReservation(reservation.id);
        rxReservation.set(reservation);
      })
    );
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
    let reservation = this.reservations.get(id);
    if (reservation === undefined) {
      let loader = this.http
        .get<ReservationJSON>(`/api/coworking/reservation/${id}`)
        .pipe(
          map(parseReservationJSON),
          shareReplay({ windowTime: 1000, refCount: true })
        );
      reservation = new RxReservation(loader);
      this.reservations.set(id, reservation);
    }
    return reservation;
  }
}
