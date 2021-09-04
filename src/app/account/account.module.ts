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
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';


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
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  providers: [AccountService]
})
export class AccountModule { }
