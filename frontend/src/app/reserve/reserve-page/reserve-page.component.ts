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

import { Component, OnInit } from '@angular/core';
import { Route, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reserve-page',
  templateUrl: './reserve-page.component.html',
  styleUrls: ['./reserve-page.component.css']
})
export class ReservePageComponent {
  /** Route information to be used in Organization Routing Module */
  public static Route = {
    path: 'reserve',
    title: 'Reserve',
    component: ReservePageComponent,
    canActivate: []
  };
}
