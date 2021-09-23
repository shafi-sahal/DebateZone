import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable()
export class UsernameErrorMessageService {
  getErrorMessage(username: AbstractControl | null): string {
    if (!username) return '';
    if (username.hasError('isTooSmall')) return 'Username must be atleast 5 characters long';
    if (username.hasError('isTooBig')) return 'Username must only have a maximum of 30 characters';
    if (username.hasError('disallowedStartingCharacter')) return 'Username should not start with a full stop';
    if (username.hasError('disallowedCharacter')) {
      return 'Username should only contain letters, numbers, underscores and full stops';
    }
    if (username.hasError('disallowedContinousCharacters')) return 'Username should not have more than one full stops in a row';
    if (username.hasError('disallowedEndingCharacter')) return 'Username should not end with a full stop';
    return '';
  }
}
