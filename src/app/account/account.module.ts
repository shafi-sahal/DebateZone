import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account.component';
import { AccountRoutingModule } from './account-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { InputFieldsComponent } from './input-fields/input-fields.component';


@NgModule({
  declarations: [
    AccountComponent,
    InputFieldsComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    MatCardModule,
    MatInputModule
  ]
})
export class AccountModule { }
