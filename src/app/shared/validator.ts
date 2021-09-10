/* eslint-disable @typescript-eslint/no-empty-function */
import { ElementRef, Injectable, OnDestroy, Renderer2 } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CountryCode, parsePhoneNumber} from 'libphonenumber-js';
import { Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, first, map, switchMap } from 'rxjs/operators';
import { AuthenticationService } from '../authentication/authentication.service';
import { User } from './models/user.model';


@Injectable()
export class UsernameAvailabilityCheck implements AsyncValidator {
  private isUsernameAvailable = false;
  private user: User = { name: '', username: '' };

  constructor(private authenticationService: AuthenticationService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const username = control.value;
    if (this.user && this.user.username === username) return of(null);

    return control.valueChanges.pipe(
      debounceTime(1000),
      switchMap(username => {
        return this.authenticationService.isDuplicateUsername(username);
      }),
      map(isDuplicateUsername => {
        // Storing whether username is available so that the "username is available!!!" message is persisted on device changes
        this.isUsernameAvailable = !isDuplicateUsername;
        return isDuplicateUsername ? { isDuplicateUsername: true } : null;
      }),
      first(),
      catchError(() => of({ unknownError: true }))
    );
  }
}

@Injectable()
export class EmailUniquenessValidator implements AsyncValidator {
  private shouldAsyncValidateEmail = new Subject<boolean>();
  private user: User = { name: '', username: ''};

  constructor(private authenticationService: AuthenticationService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const email = control.value;
    if (this.user && this.user.email === email) {
      return of(null);
    }

    return this.shouldAsyncValidateEmail.pipe(
      first(),
      switchMap(canValidate => {
        if (!canValidate) return of(null);
        return this.authenticationService.isDuplicateEmail(email);
      }),
      map(isDuplicateEmail => isDuplicateEmail ? { isDuplicateEmail: true } : null),
      catchError(() => of({ unknownError: true }))
    );
  }
}

@Injectable()
export class MobileUniquenessValidator implements AsyncValidator {
  private country = { name: 'India', dialCode: '+91', code: 'IN' };
  private shouldAsyncValidateMobile = new Subject<boolean>();

  constructor(private authenticationService: AuthenticationService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    let mobile = control.value;

    try {
      mobile = parsePhoneNumber(mobile, this.country.code as CountryCode).number;
    } catch(error) {
      console.error(error);
    }

    return this.shouldAsyncValidateMobile.pipe(
      first(),
      switchMap(canValidate => {
        if (!canValidate) return of(false);
        return this.authenticationService.isDuplicateMobile(mobile);
      }),
      map(isDuplicateMobile =>  isDuplicateMobile ? { isDuplicateMobile: true } : null),
      catchError(() => of({ unknownError: true }))
    );
  }
}

@Injectable()
export class FocusChangeObserver implements OnDestroy {
  private listenerBlur = () => {};

  constructor(private renderer: Renderer2) {}

  observeFocusChangeOfElement(
    element: ElementRef,
    shouldAsyncValidateElement: Subject<boolean>,
    exceptValidationTextContents: string[]
  ): void {
    this.listenerBlur = this.renderer.listen(element.nativeElement, 'blur', blur => {
      const button = (blur.relatedTarget as HTMLButtonElement);
      if (!button) {
        shouldAsyncValidateElement.next(true);
        return;
      }

      exceptValidationTextContents.forEach(textContent => {
        if (textContent === button.textContent) {
          shouldAsyncValidateElement.next(false);
          return;
        }
      });
      shouldAsyncValidateElement.next(true);
    });
  }

  removeObserver(): void { this.listenerBlur();}

  ngOnDestroy(): void { this.removeObserver(); }
}

export function validateUsername(): ValidatorFn {
  return  (control: AbstractControl): ValidationErrors | null => {
    const username: string = control.value;
    if (!username) return null;

    const allowedCharacters = /^[a-zA-Z0-9._@-]+$/;
    if (!allowedCharacters.test(username)) return { disallowedCharacter: true };

    const disAllowedStartingCharacters = /^[.]/;
    if (disAllowedStartingCharacters.test(username)) return { disallowedStartingCharacter: true };

    const allowedEndingCharcters = /[a-zA-Z0-9_@-]+(?<!\.)$/;
    if (!allowedEndingCharcters.test(username)) return { disallowedEndingCharacter: true };

    if (username.length < 5) return { isTooSmall: true };
    if (username.length > 30) return { isTooBig: true };

    return null;
  };
}

export function validateMobile(countryCode: CountryCode): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const mobile: string = control.value;
    if (!mobile) return null;
    try {
      const mobileParsed = parsePhoneNumber(mobile, countryCode);
      const isValid =  mobileParsed.isValid() && mobileParsed.country === countryCode;
      if (!isValid) return { invalidMobile: true };
    } catch {
      return { invalidMobile: true };
    }

    return null;
  };
}
