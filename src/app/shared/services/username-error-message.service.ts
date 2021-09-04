import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable()
export class UsernameErrorMessageService {
  getErrorMessage(control: AbstractControl | null): string {
    if (!control) return '';
    if (control.hasError('isTooSmall')) return 'Username must be atleast 5 characters long';
    if (control.hasError('isTooBig')) return 'Username must only have a maximum of 30 characters';
    if (control.hasError('disallowedStartingCharacter')) return 'Username should not start with a period';
    if (control.hasError('disallowedCharacter')) {
      return 'Username should only contain letters, numbers, periods, underscores, hyspanhens and @';
    }
    if (control.hasError('disallowedEndingCharacter')) return 'Username should not end with a period';
    if (control.hasError('isDuplicateUsername')) return 'Username already taken. Try a different one';
    return '';
  }
}
