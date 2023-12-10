/**
 * The Reserve Page Component serves as a location for students to reserve seats in the
 * CSXL. Students are able to reserve seats up to one week in advance, are capped on the
 * number of hours they are able to reserve per week, and only 50% of the seats are able
 * to be reserved. Desks that are not pre-reserved for the next hour will be available
 * for drop-in use as well.
 *
 * @author Bernie Chen, Kene Ochuba, Lucas Siegel, Sunny Wang
 * @copyright 2023
 * @license MIT
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Route, ActivatedRoute, Router } from '@angular/router';
import { ReserveService } from '../reserve.service';
import { isAuthenticated } from 'src/app/gate/gate.guard';
import { profileResolver } from 'src/app/profile/profile.resolver';
import {
  CoworkingStatus,
  OperatingHours,
  Reservation,
  SeatAvailability
} from '../../coworking/coworking.models';
import { Observable, Subscription, map, mergeMap, of, timer } from 'rxjs';
import { ReservationService } from '../../coworking/reservation/reservation.service';

@Component({
  selector: 'app-reserve-page',
  templateUrl: './reserve-page.component.html',
  styleUrls: ['./reserve-page.component.css']
})
export class ReservePageComponent implements OnInit, OnDestroy {
  public formattedDateTime: string | undefined;

  public status$: Observable<CoworkingStatus>;
  public seatAvailability: SeatAvailability[];
  public daySeatAvailability: SeatAvailability[];

  public openOperatingHours$: Observable<OperatingHours | undefined>;
  public isOpen$: Observable<boolean>;

  public activeReservation$: Observable<Reservation | undefined>;
  public searching: boolean;
  private timerSubscription!: Subscription;

  /** Route information to be used in Organization Routing Module */
  public static Route = {
    path: 'reserve',
    title: 'Reserve',
    component: ReservePageComponent,
    canActivate: [isAuthenticated],
    resolve: { profile: profileResolver }
  };

  constructor(
    route: ActivatedRoute,
    public reserveService: ReserveService,
    private router: Router,
    private reservationService: ReservationService
  ) {
    this.status$ = reserveService.status$;
    this.openOperatingHours$ = this.initNextOperatingHours();
    this.isOpen$ = this.initIsOpen();
    this.activeReservation$ = this.initActiveReservation();
    this.searching = false;
    this.seatAvailability = [];
    this.daySeatAvailability = [];
  }

  reserve(seatSelection: SeatAvailability[]) {
    this.reserveService.draftReservation(seatSelection).subscribe({
      next: (reservation) => {
        this.router.navigateByUrl(`/coworking/reservation/${reservation.id}`);
      }
    });
  }

  searchAvailableSeats(selectedTime: Date) {
    this.searching = true;
    console.log('Retrieving', this.searching);
    this.reserveService.searchAvailability(selectedTime).subscribe({
      next: (availability) => {
        this.seatAvailability = availability;
      }
    });
  }

  searchDayAvailableSeats(selectedTime: Date) {
    this.searching = true;
    console.log('Retrieving', this.searching);
    this.reserveService.searchDayAvailability(selectedTime).subscribe({
      next: (availability) => {
        this.daySeatAvailability = availability;
      }
    });
  }

  ngOnInit(): void {
    this.timerSubscription = timer(0, 10000).subscribe(() => {
      this.reserveService.pollStatus();
    });
  }

  ngOnDestroy(): void {
    this.timerSubscription.unsubscribe();
  }

  private initNextOperatingHours(): Observable<OperatingHours | undefined> {
    return this.status$.pipe(
      map((status) => {
        let now = new Date();
        now.setDate(now.getDate() + 1);
        return status.operating_hours.find((hours) => hours.start <= now);
      })
    );
  }

  private initIsOpen(): Observable<boolean> {
    return this.openOperatingHours$.pipe(
      map((hours) => {
        let now = new Date();
        return hours !== undefined && hours.start <= now && hours.end > now;
      })
    );
  }

  private initActiveReservation(): Observable<Reservation | undefined> {
    return this.status$.pipe(
      map((status) => {
        let reservations = status.my_reservations;
        let now = new Date();
        return reservations.find(
          (reservation) => reservation.start <= now && reservation.end > now
        );
      }),
      mergeMap((reservation) =>
        reservation
          ? this.reservationService.get(reservation.id)
          : of(undefined)
      )
    );
  }
}
