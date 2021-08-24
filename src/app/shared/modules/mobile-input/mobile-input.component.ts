import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Optional, Output, Renderer2, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { CountryCode, parsePhoneNumber } from 'libphonenumber-js';
import { Subject, Subscription } from 'rxjs';
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
export class MobileInputComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() form!: FormGroup;
  @Input() shouldAsyncValidateMobile!: Subject<boolean>;
  @Input() mode: 'SIGNUP' | 'EDIT' = 'EDIT';
  @Output() countryChanged = new EventEmitter<{ name: string, dialCode: string, code: string}>()
  @Output() updateClicked = new Subject<void>();
  @ViewChild('countrySelect') countrySelect!: MatSelect;
  @ViewChild('dialCodeInput') private dialCodeInput!: ElementRef;
  @ViewChild('inputMobile') private inputMobile!: ElementRef;
  countries = countries;
  _country = { name: 'India', dialCode: '+91', code: 'IN' };
  filteredCountries: Record<string, string>[] = countries;
  labelUnknownDialCode = 'Unknown Dial Code';
  classDialCode = 'dial-code-normal';
  isButtonDisabled = true;

  private validateForNullRelatedTargetBlur = true;
  private userMobileNumber = '';
  private subscriptions = new Subscription();

  constructor(
    private authenticationService: AuthenticationService,
    private focusChangeObserver: FocusChangeObserver,
    private chnageDetector: ChangeDetectorRef,
    private renderer: Renderer2,
    @Optional() @Inject(MAT_DIALOG_DATA)
    public dialogData: {
      form: FormGroup,
      shouldAsyncValidateMobile: Subject<boolean>,
      country: { name: string, dialCode: string, code: string },
      mobileNumber: string
    }
  ) {}

  set country(country: { name: string, dialCode: string, code: string }) {
    this._country = country;
    this.countrySelect.value = this._country.name;
    this.countryChanged.emit(this._country);
    if (this.mode === 'EDIT') this.setButtonDisabled();
  }

  get mobile(): AbstractControl | null { return this.form.get('mobile'); }

  ngOnInit(): void {
    if (this.dialogData) this.form = this.dialogData.form;
    this.shouldAsyncValidateMobile = this.shouldAsyncValidateMobile
      ? this.shouldAsyncValidateMobile
      : this.dialogData.shouldAsyncValidateMobile;

    this.validateForNullRelatedTargetBlur = !!this.form;
  }

  ngAfterViewInit(): void {
    setTimeout(() =>
      this.focusChangeObserver.observeFocusChangeOfElement(
        this.inputMobile, this.shouldAsyncValidateMobile, ['Login'], this.validateForNullRelatedTargetBlur
      )
    );
    if (this.mode === 'SIGNUP') return;
    this.subscriptions.add(this.mobile?.statusChanges.subscribe(() => this.setButtonDisabled()));

    if(!this.dialogData) return;
    this._country = this.dialogData.country;
    this.userMobileNumber = this.dialogData.mobileNumber;
  }

  trackFunction(index: number, country: Record<string, string>): string {
    return country.code;
  }

  onCountrySelectionChange(countryName: string): void {
    const country = this.countries.find(country => country.name === countryName);
    if (country) {
      this.country = country;
    }
    this.classDialCode = 'dial-code-normal';
    this.clearErrors();
    this.mobile?.updateValueAndValidity();
  }

  onCountryOpenedChanged(): void {
    if (this.countrySelect.value === this.labelUnknownDialCode) {
      this.renderer.setProperty(this.dialCodeInput.nativeElement, 'value', this._country.dialCode.replace('+', ''));
      this.countrySelect.value = this._country.name;
    }
  }

  setDialCodeWeight(): void {
    this.classDialCode = this.dialCodeInput.nativeElement.value  ? 'dial-code-normal' : 'dial-code-lighter';
  }

  onDialCodeInput(): void {
    this.clearErrors();
    const inputValue = this.dialCodeInput.nativeElement.value;
    const dialCode = '+' + inputValue;
    const country = this.countries.find(country => country.dialCode === dialCode.trim());
    if (country) {
      this.country = country;
      this.mobile?.updateValueAndValidity();
      this.shouldAsyncValidateMobile.next(true);
    } else {
      this.countrySelect.value = this.labelUnknownDialCode;
      if (this.mobile?.value) { this.mobile?.setErrors({ invalidMobile: true }); }
    }
  }

  onMobileInput(number: string): void {
    this.clearErrors();
    const countryCode = this.authenticationService.getCountryCodeFromMobile(number);
    if (!countryCode) return;
    const country = this.countries.find(country => country.code === countryCode);
    if (country) {
      this.country = country;
      this.renderer.setProperty(this.dialCodeInput.nativeElement, 'value', this._country.dialCode.replace('+', ''));
    }
  }

  setButtonDisabled(): void {
    let mobileNumber = this.inputMobile.nativeElement.value;

    try {
      mobileNumber = parsePhoneNumber(mobileNumber, this._country.code as CountryCode).number;
    } catch(error) {
      console.error(error);
    }

    const isCountryChanged = this.dialogData.country.code !== this._country.code;
    const isMobileNumberChanged = this.dialogData.mobileNumber !== mobileNumber;

    this.isButtonDisabled = (!isCountryChanged && !isMobileNumberChanged) || !!this.mobile?.errors || !mobileNumber;
  }

  clearErrors(): void {
    this.shouldAsyncValidateMobile.next(false);
    this.mobile?.setErrors(null);
  }

  ngOnDestroy(): void { this.subscriptions.unsubscribe(); }
}
