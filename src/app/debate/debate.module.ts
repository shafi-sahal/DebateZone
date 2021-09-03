import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebateRoutingModule } from './debate-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DebateListComponent } from './debate-list/debate-list.component';
import { DebateCreateComponent } from './debate-create/debate-create.component';
import { InputFieldsComponent } from './debate-create/input-fields/input-fields.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';


@NgModule({
  declarations: [
    DebateListComponent,
    DebateCreateComponent,
    InputFieldsComponent
  ],
  imports: [
    CommonModule,
    DebateRoutingModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule
  ]
})
export class DebateModule { }
