import { NgModule } from '@angular/core';
import { ReservePageComponent } from './reserve-page/reserve-page.component';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ReservePageComponent],
  imports: [CommonModule, SharedModule]
})
export class ReserveModule {}
