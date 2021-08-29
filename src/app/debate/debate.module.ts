import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebateRoutingModule } from './debate-routing.module';
import { DebateComponent } from './debate.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    DebateComponent
  ],
  imports: [
    CommonModule,
    DebateRoutingModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class DebateModule { }
