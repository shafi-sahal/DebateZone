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
import { MatOptionMultiLineDirective } from './credentials/mat-option-multi-line.directive';
import { UsernameValidationErrorsModule } from '../shared/modules/username-validation-errors/username-validation-errors.module';



@NgModule({
  declarations: [
    AuthenticationComponent,
    HeaderComponent,
    CredentialsComponent,
    FocusInvalidInputDirective,
    MatOptionMultiLineDirective,
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    MatSelectSearchModule,
    UsernameValidationErrorsModule
  ]
})
export class AuthenticationModule {}
