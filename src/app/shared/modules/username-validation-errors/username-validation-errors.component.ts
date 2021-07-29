import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-username-validation-errors',
  templateUrl: './username-validation-errors.component.html',
  styleUrls: ['./username-validation-errors.component.scss']
})
export class UsernameValidationErrorsComponent {
  @Input() errors: Record<string, boolean> | null | undefined = null;
}
