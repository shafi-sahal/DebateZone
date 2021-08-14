import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { Subject } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { countries } from '../../datasets';
import { FocusChangeObserver } from '../../validator';

@Component({
  selector: 'app-mobile-input',
  templateUrl: './mobile-input.component.html',
  styleUrls: ['./mobile-input.component.scss', '../../styles/messages.scss', '../../styles/input-with-spinner.scss'],
  providers: [AuthenticationService, FocusChangeObserver],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MobileInputComponent implements OnInit, AfterViewInit {
  @Input() form!: FormGroup;
  @Output() countryChanged = new EventEmitter<{ name: string, dialCode: string, code: string}>()
  @ViewChild('countrySelect') countrySelect!: MatSelect;
  @ViewChild('dialCodeInput') private dialCodeInput!: ElementRef;
  @ViewChild('inputMobile') private inputMobile!: ElementRef;
  countries = countries;
  _country = { name: 'India', dialCode: '+91', code: 'IN' };
  filteredCountries: Record<string, string>[] = countries;
  labelUnknownDialCode = 'Unknown Dial Code';
  classDialCode = 'dial-code-normal';
  @Input()shouldAsyncValidateMobile = new Subject<boolean>();
  formGroup!: FormGroup;

  constructor(
    private authenticationService: AuthenticationService,
    private focusChangeObserver: FocusChangeObserver,
    private chnageDetector: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: { form: FormGroup }
  ) {  }

  set country(country: { name: string, dialCode: string, code: string }) {
    this._country = country;
    this.countrySelect.value = this._country.name;
    this.countryChanged.emit(this._country);
  }

  get mobile(): AbstractControl | null { return this.formGroup.get('mobile'); }

  ngOnInit(): void { this.formGroup = this.form ? this.form : this.dialogData.form; }

  ngAfterViewInit(): void {console.log('reach');
    setTimeout(() =>
      this.focusChangeObserver.observeFocusChangeOfElement(this.inputMobile, this.shouldAsyncValidateMobile, ['Login'])
    );
    this.matchCountryWithMobile();
  }

  trackFunction(index: number, country: Record<string, string>): string {
    return country.code;
  }

  onCountrySelectionChange(countryName: string): void {
    const country = this.countries.find(country => country.name === countryName);
    if (country) {
      this._country = country;
      this.countryChanged.emit(this._country);
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
    const countryCode = this.authenticationService.getCountryCodeFromMobile(number);
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

  private matchCountryWithMobile(): void {
    const mobileNumber = this.inputMobile.nativeElement.value;
    if (!mobileNumber) return;
    const countryCode = this.authenticationService.getCountryCodeFromMobile(mobileNumber);
    if (!countryCode) return;
    const country = this.countries.find(country => country.code === countryCode);
    if (!country) return;
    this.country = country;
    this.chnageDetector.detectChanges();
  }
}
