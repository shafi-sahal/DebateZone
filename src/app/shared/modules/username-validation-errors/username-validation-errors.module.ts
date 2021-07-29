import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsernameValidationErrorsComponent } from './username-validation-errors.component';



@NgModule({
  declarations: [
    UsernameValidationErrorsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [UsernameValidationErrorsComponent]
})
export class UsernameValidationErrorsModule { }
