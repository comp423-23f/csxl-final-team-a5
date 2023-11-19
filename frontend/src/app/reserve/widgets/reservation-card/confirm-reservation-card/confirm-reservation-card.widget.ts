import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, map, mergeMap, timer } from 'rxjs';
import { Router } from '@angular/router';
import { ReservationService } from 'src/app/coworking/reservation/reservation.service';
import { Reservation } from 'src/app/coworking/coworking.models';

@Component({
  selector: 'confirm-reservation-card',
  templateUrl: './confirm-reservation-card.widget.html',
  styleUrls: ['./confirm-reservation-card.widget.css']
})
export class ConfirmReservationCard implements OnInit {
  @Input() reservation!: Reservation;

  public draftConfirmationDeadline$!: Observable<string>;

  constructor(
    public router: Router,
    public reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.draftConfirmationDeadline$ = this.initDraftConfirmationDeadline();
  }

  checkinDeadline(reservationStart: Date): Date {
    return new Date(reservationStart.getTime() + 10 * 60 * 1000);
  }

  cancel() {
    this.reservationService.cancel(this.reservation).subscribe();
  }

  confirm() {
    this.reservationService.confirm(this.reservation).subscribe();
  }

  checkout() {
    this.reservationService.checkout(this.reservation).subscribe();
  }

  private initDraftConfirmationDeadline(): Observable<string> {
    const fiveMinutes =
      5 /* minutes */ * 60 /* seconds */ * 1000; /* milliseconds */

    const reservationDraftDeadline = (reservation: Reservation) =>
      reservation.created_at.getTime() + fiveMinutes;

    const deadlineString = (deadline: number): string => {
      const now = new Date().getTime();
      const delta = (deadline - now) / 1000; /* milliseconds */
      if (delta > 60) {
        return `Confirm in ${Math.ceil(delta / 60)} minutes`;
      } else if (delta > 0) {
        return `Confirm in ${Math.ceil(delta)} seconds`;
      } else {
        this.cancel();
        return 'Cancelling...';
      }
    };

    return timer(0, 1000).pipe(
      map(() => this.reservation),
      map(reservationDraftDeadline),
      map(deadlineString)
    );
  }
}
