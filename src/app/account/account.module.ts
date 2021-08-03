import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account.component';
import { AccountRoutingModule } from './account-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { InputFieldsComponent } from './input-fields/input-fields.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountService } from './account.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { UsernameValidationErrorsModule } from '../shared/modules/username-validation-errors/username-validation-errors.module';


@NgModule({
  declarations: [
    AccountComponent,
    InputFieldsComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    MatCardModule,
    MatInputModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    UsernameValidationErrorsModule
  ],
  providers: [AccountService]
})
export class AccountModule { }
