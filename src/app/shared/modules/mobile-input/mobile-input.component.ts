import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { CountryCode } from 'libphonenumber-js';
import { Subject } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { countries } from '../../datasets';
import { validateMobile } from '../../validator';

@Component({
  selector: 'app-mobile-input',
  templateUrl: './mobile-input.component.html',
  styleUrls: ['./mobile-input.component.scss'],
  providers: [AuthenticationService]
})
export class MobileInputComponent {
  @Input() mobile!: AbstractControl | null;
  @ViewChild('countrySelect') countrySelect!: MatSelect;
  @ViewChild('dialCodeInput') private dialCodeInput!: ElementRef;
  @ViewChild('inputMobile') private inputMobile!: ElementRef;
  countries = countries;
  _country = { name: 'India', dialCode: '+91', code: 'IN' };
  filteredCountries: Record<string, string>[] = countries;
  labelUnknownDialCode = 'Unknown Dial Code';
  classDialCode = 'dial-code-normal';
  shouldAsyncValidateMobile = new Subject<boolean>();

  constructor(private authenticationService: AuthenticationService) {}

  set country(country: { name: string, dialCode: string, code: string }) {
    this._country = country;
    this.countrySelect.value = this._country.name;
    this.changeMobileValidator();
  }

  trackFunction(index: number, country: Record<string, string>): string {
    return country.code;
  }

  onCountrySelectionChange(countryName: string): void {
    const country = this.countries.find(country => country.name === countryName);
    if (country) {
      this._country = country;
      this.changeMobileValidator();
    }
    this.classDialCode = 'dial-code-normal';
  }

  onCountryOpenedChanged(): void {
    if (this.countrySelect.value === this.labelUnknownDialCode) {
      this.dialCodeInput.nativeElement.value = this._country.dialCode.replace('+', '');
      this.countrySelect.value = this._country.name;
    }
  }

  setDialCodeWeight(): void {
    this.classDialCode = this.dialCodeInput.nativeElement.value  ? 'dial-code-normal' : 'dial-code-lighter';
  }

  onDialCodeInput(): void {
    const inputValue = this.dialCodeInput.nativeElement.value;
    const dialCode = '+' + inputValue;
    const country = this.countries.find(country => country.dialCode === dialCode.trim());
    if (country) {
      this.country = country;
    } else {
      this.countrySelect.value = this.labelUnknownDialCode;
      if (this.mobile?.value) { this.mobile?.setErrors({ invalidMobile: true }); }
    }
  }

  onMobileInput(number: string): void {
    const countryCode = this.authenticationService.getCountryFromMobile(number);
    if (!countryCode) { return; }
    const country = this.countries.find(country => country.code === countryCode);
    if (country) {
      this.country = country;
      this.dialCodeInput.nativeElement.value = this._country.dialCode.replace('+', '');
    }
  }

  clearErrors(control: AbstractControl | null, canAsyncValidate?: Subject<boolean>): void {
    canAsyncValidate?.next(false);
    control?.setErrors(null);
  }

  private changeMobileValidator(): void {
    this.mobile?.setValidators([Validators.required, validateMobile(this._country.code as CountryCode)]);
    this.mobile?.updateValueAndValidity();
  }
}
