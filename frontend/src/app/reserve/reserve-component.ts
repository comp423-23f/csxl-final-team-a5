import { Component, OnInit } from '@angular/core';
import { Route, ActivatedRoute, Router } from '@angular/router';
import { isAuthenticated } from '../gate/gate.guard';
import { profileResolver } from '../profile/profile.resolver';

@Component({
  selector: 'app-reserve-home',
  templateUrl: './reserve-component.html',
  styleUrls: ['./reserve-component.css']
})
export class ReservePageComponent {
  public static Route: Route = {
    path: '',
    component: ReservePageComponent,
    title: 'Coworking',
    canActivate: [isAuthenticated],
    resolve: { profile: profileResolver }
  };
}
