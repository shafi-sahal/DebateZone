import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AuthenticationComponent } from './authentication.component';
import { HeaderComponent } from './header/header.component';
import { CredentialsComponent } from './credentials/credentials.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FocusInvalidInputDirective } from '../shared/directives/focus-invalid-input.directive';
import { AngularMaterialModule } from '../angular-material.module';
import { AuthenticationService } from './authentication.service';
import { MatSelectSearchComponent } from '../shared/components/mat-select-search/mat-select-search.component';
import { MatSelectSearchModule } from 'dist/mat-select-search';
import { RendererDirective } from './renderer.directive';


@NgModule({
  declarations: [
    AuthenticationComponent,
    HeaderComponent,
    CredentialsComponent,
    MatSelectSearchComponent,
    FocusInvalidInputDirective,
    RendererDirective
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    MatSelectSearchModule
  ],
  providers: [AuthenticationService]
})
export class AuthenticationModule { }
