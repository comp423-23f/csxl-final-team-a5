import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, map, tap, timer } from 'rxjs';
import { Reservation } from '../../coworking.models';
import { ReservationService } from '../../reservation/reservation.service';
import { Profile } from 'src/app/models.module';
import { ProfileService } from 'src/app/profile/profile.service';
import { HttpClient } from '@angular/common/http';
import { ReserveService } from 'src/app/reserve/reserve.service'
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'upcoming-reservations-card',
  templateUrl: './upcoming-reservations-card.html',
  styleUrls: ['./upcoming-reservations-card.css']
})
export class UpcomingReservationsCard implements OnInit, OnDestroy {
  //public reservations$: Observable<Reservation>;
  reservations$: Observable<Reservation[]>;

  columnsToDisplay = ['name', 'seat', 'date', 'start', 'end', 'actions'];

  private refreshSubscription!: Subscription;

  constructor(
    public reservationService: ReservationService,
    protected snackBar: MatSnackBar
  ) {
    // pid = Profile.pid; take in the pid somehow
    //this.reservations$ = reservationService.get(0); //replace 0 with actual pid number
    {
      this.reservations$ = this.reservationService.reservations$;
    }
  }

  ngOnInit(): void {
    this.refreshSubscription = timer(0, 5000)
      .pipe(tap((_) => this.reservationService.fetchUpcomingReservations()))
      .subscribe();
  }
  ngOnDestroy(): void {
    this.refreshSubscription.unsubscribe();
  }
  cancel(reservation: Reservation): void {
    this.reservationService.cancel_rx(reservation);
    this.snackBar.open('Your reservation has been canceled!', 'Close', {
      duration: 3000
    });
  }
}
