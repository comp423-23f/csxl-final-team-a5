import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Reservation } from '../../coworking.models';
import { ReservationService } from '../../reservation/reservation.service';
import { Profile } from 'src/app/models.module';

@Component({
  selector: 'upcoming-reservations-card',
  templateUrl: './upcoming-reservations-card.html',
  styleUrls: ['./upcoming-reservations-card.css']
})
export class UpcomingReservationsCard {
  public reservations$: Observable<Reservation>;

  constructor(private reservationService: ReservationService) {
    // pid = Profile.pid; take in the pid somehow
    this.reservations$ = reservationService.get(0); //replace 0 with actual pid number
  }

  cancel(reservation: Reservation): void {
    this.reservationService.cancel(reservation);
    window.alert('Reservation has been canceled');
  }
}
