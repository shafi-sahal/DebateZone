import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AuthenticationComponent } from './authentication.component';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { AuthenticationHeaderComponent } from './authentication-header/authentication-header.component';


@NgModule({
  declarations: [AuthenticationComponent, AuthenticationHeaderComponent],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule
  ]
})
export class AuthenticationModule { }
