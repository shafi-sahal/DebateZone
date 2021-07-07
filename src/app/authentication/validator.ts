import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CountryCode, parsePhoneNumber} from 'libphonenumber-js';
import { Observable} from 'rxjs';
import { debounceTime, first, map, switchMap } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class UsernameAvailabilityCheck implements AsyncValidator {
  constructor(private authenticationService: AuthenticationService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return control.valueChanges.pipe(
      debounceTime(1000),
      switchMap(username => this.authenticationService.isDuplicateUsername(username)),
      map(isDuplicateUsername => isDuplicateUsername ? { isDuplicateUsername: true } : null),
      first()
    );
  }
}

@Injectable()
export class EmailUniquenessValidator implements AsyncValidator {
  constructor(private authenticationService: AuthenticationService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const email = control.value;
    return this.authenticationService.isDuplicateEmail(email).pipe(
      map(isDuplicateEmail => isDuplicateEmail ? { isDuplicateEmail: true } : null)
    );
  }
}

@Injectable()
export class MobileUniquenessValidator implements AsyncValidator {
  private _country = { name: 'India', dialCode: '+91', code: 'IN' };

  constructor(private authenticationService: AuthenticationService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const mobile = control.value;
    return this.authenticationService.isDuplicateMobile(mobile, this._country.code).pipe(
      map(isDuplicateMobile => isDuplicateMobile ? { isDuplicateMobile: true } : null)
    );
  }
}

export function validateUsername(): ValidatorFn {
  return  (control: AbstractControl): ValidationErrors | null => {
    const username: string = control.value;
    if (!username) { return null; }

    const disAllowedStartingCharacters = /^[.]/;
    if (disAllowedStartingCharacters.test(username)) { return { disallowedStartingCharacter: true }; }

    const allowedCharacters = /[a-zA-Z0-9._@-]+$/;
    if (!allowedCharacters.test(username)) { return { disallowedCharacter: true }; }

    const allowedEndingCharcters = /[a-zA-Z0-9_@-]+(?<!\.)$/;
    if (!allowedEndingCharcters.test(username)) { return { disallowedEndingCharacter: true }; }

    if (username.length < 5) { return { isTooSmall: true }; }
    if (username.length > 30) { return { isTooBig: true }; }

    return null;
  };
}

export function validateMobile(countryCode: CountryCode): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const mobile: string = control.value;
    if (!mobile) { return null; }

    try {
      const mobileParsed = parsePhoneNumber(mobile, countryCode);
      const isValid =  mobileParsed.isValid() && mobileParsed.country === countryCode;
      if(!isValid) { return { invalidMobile: true }; }
    } catch {
      return { invalidMobile: true };
    }

    return null;
  };
}
