import { Component, OnInit } from '@angular/core';
import { Route, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reserve-page',
  templateUrl: './reserve-page.component.html',
  styleUrls: ['./reserve-page.component.css']
})
export class ReservePageComponent {
  public static Route = {
    path: 'reserve',
    title: 'Reserve',
    component: ReservePageComponent,
    canActivate: []
  };
}
