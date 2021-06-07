import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CountryCode, parsePhoneNumber} from 'libphonenumber-js';

export function validateUsername(): ValidatorFn {
  return  (control: AbstractControl): ValidationErrors | null => {
    const username: string = control.value;
    if (!username) { return null; }

    const allowedStartingCharacters = /^[a-zA-Z0-9_]/;
    if (!allowedStartingCharacters.test(username)) { return { disallowedStartingCharacter: true }; }

    const isConsecutiveAllowedSpecialCharcters = /^(?!.*__)(?!.*\.\.)[a-zA-Z0-9._]/;
    if (!isConsecutiveAllowedSpecialCharcters.test(username)) { return { consecutiveAllowedSpecialCharacter: true }; }

    const allowedCharacters = /^[a-zA-Z0-9._]+$/;
    if (!allowedCharacters.test(username)) { return { disallowedCharacter: true }; }

    const allowedEndingCharcters = /[a-zA-Z0-9._]+(?<!\.)$/;
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
