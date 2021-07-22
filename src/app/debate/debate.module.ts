import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebateRoutingModule } from './debate-routing.module';
import { DebateComponent } from './debate.component';


@NgModule({
  declarations: [
    DebateComponent
  ],
  imports: [
    CommonModule,
    DebateRoutingModule
  ]
})
export class DebateModule { }
