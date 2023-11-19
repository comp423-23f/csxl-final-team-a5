import { NgModule } from '@angular/core';
import { ReservePageComponent } from './reserve-page/reserve-page.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

import { SharedModule } from '../shared/shared.module';
import { ReservationCard } from './widgets/reservation-card/reservation-card.widget';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

import { CoworkingHoursCard } from '../coworking/widgets/operating-hours-panel/operating-hours-panel.widget';
import { CoworkingDropInCard } from '../coworking/widgets/dropin-availability-card/dropin-availability-card.widget';
import { CoworkingReservationCard } from '../coworking/widgets/coworking-reservation-card/coworking-reservation-card';
import { CoworkingModule } from '../coworking/coworking.module';
import { ReserveAvailibilityCard } from './widgets/reservation-card/reserve-availability-card/reserve-availability-card.widget';

@NgModule({
  declarations: [ReservePageComponent],
  imports: [
    CommonModule,
    CoworkingModule,
    SharedModule,
    MatCardModule,
    MatListModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatButtonModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    ReservationCard,
    ReserveAvailibilityCard
  ]
})
export class ReserveModule {}
