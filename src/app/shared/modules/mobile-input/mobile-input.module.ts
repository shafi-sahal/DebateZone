import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobileInputComponent } from './mobile-input.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectSearchModule } from 'mat-select-search';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatOptionMultiLineDirective } from './mat-option-multi-line.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [
    MobileInputComponent,
    MatOptionMultiLineDirective
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatSelectSearchModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule
  ],
  exports: [MobileInputComponent]
})
export class MobileInputModule { }
