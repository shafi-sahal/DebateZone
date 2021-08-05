/* eslint-disable @typescript-eslint/no-empty-function */
import { ElementRef, Injectable, OnDestroy, Renderer2 } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CountryCode, parsePhoneNumber} from 'libphonenumber-js';
import { Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, first, map, switchMap } from 'rxjs/operators';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable()
export class UsernameAvailabilityCheck implements AsyncValidator {
  private isDuplicateUsername = false;
  private usernameStatus: 'INVALID' | 'PENDING' | 'VALID' = 'INVALID';
  private cachedUsername = '';

  constructor(private authenticationService: AuthenticationService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    if (this.cachedUsername !== control.value) this.usernameStatus = 'PENDING';

    return control.valueChanges.pipe(
      debounceTime(1000),
      switchMap(username => {
        this.cachedUsername = username;
        return this.authenticationService.isDuplicateUsername(username);
      }),
      map(isDuplicateUsername => {
        this.isDuplicateUsername = isDuplicateUsername;
        this.usernameStatus = this.isDuplicateUsername ? 'INVALID' : 'VALID';
        return isDuplicateUsername ? { isDuplicateUsername: true } : null;
      } ),
      first(),
      catchError(() => of({ unknownError: true }))
    );
  }
}

@Injectable()
export class EmailUniquenessValidator implements AsyncValidator {
  private shouldAsyncValidateEmail = new Subject<boolean>();
  private isDuplicateEmail = false;
  private cachedEmail!: string;
  private isLoading = true;

  constructor(private authenticationService: AuthenticationService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const email = control.value;
    return this.shouldAsyncValidateEmail.pipe(
      first(),
      switchMap(canValidate => {
        console.log(canValidate);
        if (!canValidate) return of(false);
        if (this.cachedEmail === email) {
          this.cachedEmail = '';
          return of(this.isDuplicateEmail);
        }
        return this.authenticationService.isDuplicateEmail(email);
      }),
      map(isDuplicateEmail => {
        this.isDuplicateEmail = isDuplicateEmail;
        return isDuplicateEmail ? { isDuplicateEmail: true } : null;
      }),
      catchError(() => of({ unknownError: true }))
    );
  }
}

@Injectable()
export class MobileUniquenessValidator implements AsyncValidator {
  private _country = { name: 'India', dialCode: '+91', code: 'IN' };
  private shouldAsyncValidateMobile = new Subject<boolean>();

  constructor(private authenticationService: AuthenticationService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const mobile = control.value;
    return this.shouldAsyncValidateMobile.pipe(
      first(),
      switchMap(canValidate => {
        if (!canValidate) return of(false);
        return this.authenticationService.isDuplicateMobile(mobile, this._country.code);
      }),
      map(isDuplicateMobile => isDuplicateMobile ? { isDuplicateMobile: true } : null),
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

  removeObserver(): void { this.listenerBlur(); }

  ngOnDestroy(): void { this.removeObserver(); }
}

export function validateUsername(): ValidatorFn {
  return  (control: AbstractControl): ValidationErrors | null => {
    const username: string = control.value;
    if (!username) return null;

    const disAllowedStartingCharacters = /^[.]/;
    if (disAllowedStartingCharacters.test(username)) return { disallowedStartingCharacter: true };

    const allowedCharacters = /[a-zA-Z0-9._@-]+$/;
    if (!allowedCharacters.test(username)) return { disallowedCharacter: true };

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
      if(!isValid) return { invalidMobile: true };
    } catch {
      return { invalidMobile: true };
    }

    return null;
  };
}
