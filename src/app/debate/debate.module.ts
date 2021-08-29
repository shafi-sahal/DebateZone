import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebateRoutingModule } from './debate-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DebateListComponent } from './debate-list/debate-list.component';
import { DebateCreateComponent } from './debate-create/debate-create.component';


@NgModule({
  declarations: [
    DebateListComponent,
    DebateCreateComponent
  ],
  imports: [
    CommonModule,
    DebateRoutingModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class DebateModule { }
