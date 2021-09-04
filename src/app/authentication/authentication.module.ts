import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AuthenticationComponent } from './authentication.component';
import { HeaderComponent } from './header/header.component';
import { CredentialsComponent } from './credentials/credentials.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FocusInvalidInputDirective } from '../shared/directives/focus-invalid-input.directive';
import { AngularMaterialModule } from '../angular-material.module';
import { MatSelectSearchModule } from 'mat-select-search';
import { MobileInputModule } from '../shared/modules/mobile-input/mobile-input.module';



@NgModule({
  declarations: [
    AuthenticationComponent,
    HeaderComponent,
    CredentialsComponent,
    FocusInvalidInputDirective
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    MatSelectSearchModule,
    MobileInputModule
  ]
})
export class AuthenticationModule {}
