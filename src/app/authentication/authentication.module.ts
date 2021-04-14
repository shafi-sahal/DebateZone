import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AuthenticationComponent } from './authentication.component';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

import { HeaderComponent } from './header/header.component';
import { CredentialsComponent } from './credentials/credentials.component';
import { CredentialsService } from '../services/credentials.service';


@NgModule({
  declarations: [AuthenticationComponent, HeaderComponent, CredentialsComponent],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [CredentialsService]
})
export class AuthenticationModule { }
