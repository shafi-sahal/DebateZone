import { Component } from '@angular/core';

@Component({
  selector: 'app-input-fields',
  templateUrl: './input-fields.component.html',
  styleUrls: ['./input-fields.component.scss']
})
export class InputFieldsComponent {
  onDescriptionKeyDown(isCharLimitExceeded: boolean, event: Event): void {
    if (isCharLimitExceeded) event.preventDefault();
  }
}
