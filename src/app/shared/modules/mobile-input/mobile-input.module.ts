import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobileInputComponent } from './mobile-input.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectSearchModule } from 'mat-select-search';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatOptionMultiLineDirective } from './mat-option-multi-line.directive';



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
    MatProgressSpinnerModule
  ],
  exports: [MobileInputComponent]
})
export class MobileInputModule { }
