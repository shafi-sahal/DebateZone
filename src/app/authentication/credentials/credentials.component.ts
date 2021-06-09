import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { CredentialsService } from 'src/app/shared/services/credentials.service';
import { AuthenticationService } from '../authentication.service';
import { countries } from '../../../assets/datasets';
import { validateUsername, validateMobile } from 'src/app/shared/validator';
import { CountryCode } from 'libphonenumber-js';

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.scss'],
  providers: [CredentialsService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CredentialsComponent implements OnInit, OnDestroy {
  @Input() isSignUp = new Observable<boolean>();
  @ViewChild('formDirective') formDirective!: FormGroupDirective;
  @ViewChild('dialCodeInput') dialCodeInput!: ElementRef;
  buttonText = 'login';
  countries = countries;
  _country = { name: 'India', dialCode: '+91', code: 'IN' };
  filteredCountries: Record<string, string>[] = countries;
  labelUnKnownDialCode = 'Unknown Dial Code';
  classMatSelectTrigger = 'valid';
  classDialCode = 'dial-code-normal';

  inputDetails = {
    name: {
      label: '',
      placeholder: ''
    },
    username: {
      label: '',
      placeholder: ''
    },
    email: {
      label: 'Email',
      placeholder: 'Enter your email'
    },
    country: {
      label: '',
      placeholder: ''
    },
    password: {
      label: 'Password',
      placeholder: 'Enter your password'
    }
  }

  private regexName = /^[a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'`-]+[ a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'`'-]{4,}$/;
  private regexEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  private regexCountry = /^((?!Unknown Dial Code).)*$/;

  form = this.formBuilder.group({
    name: ['',  [Validators.required, Validators.pattern(this.regexName)]],
    username: ['', [Validators.required, validateUsername()]],
    email: ['', [Validators.required, Validators.pattern(this.regexEmail)]],
    country: ['', [Validators.required, Validators.pattern(this.regexCountry)]],
    mobile: ['', [Validators.required, validateMobile(this._country.code as CountryCode)]],
    password: ['', Validators.required]
  });

  private subscriptions = new Subscription();
  private inputDetailsLogin = this.inputDetails;

  private inputDetailsSignUp = {
    name: {
      label: 'Full Name',
      placeholder: 'Ex: Neerja Bhanot'
    },
    username: {
      label: 'Username',
      placeholder: 'Ex: Neerja_Bhanot'
    },
    email: {
      label: 'Email',
      placeholder: 'Ex: neerjabhanot@example.com:'
    },
    country: {
      label: 'Country',
      placeholder: 'India'
    },
    password: {
      label: 'Password',
      placeholder: 'Ex: derTg@7674+>jFDuty.5'
    }
  }

  constructor(
    public credentialsService: CredentialsService,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.subscriptions.add(this.isSignUp.subscribe(isSignUp => this.initForm(isSignUp)));
  }

  get name(): AbstractControl | null { return this.form.get('name'); }
  get username(): AbstractControl | null { return this.form.get('username'); }
  get email(): AbstractControl | null { return this.form.get('email'); }
  get country(): AbstractControl | null { return this.form.get('country'); }
  get mobile(): AbstractControl | null { return this.form.get('mobile'); }
  get password(): AbstractControl | null { return this.form.get('password'); }

  initForm(isSignUp: boolean): void {
    this.formDirective.resetForm();
    if (isSignUp) {
      this.inputDetails = this.inputDetailsSignUp;
      this.buttonText = 'Sign Up';
      this.country?.setValue(this._country.name);
      this.classMatSelectTrigger = 'valid';
      this.password?.setValidators(Validators.minLength(8));
    } else {
      this.inputDetails = this.inputDetailsLogin;
      this.buttonText = 'Login';
      this.password?.setValidators(Validators.required);
      this.password?.updateValueAndValidity();
    }
  }

  onCountrySelectionChange(countryName: string): void {
    const country = this.countries.find(country => country.name === countryName);
    if (country) {
      this._country = country;
      this.changeMobileValidator();
      this.country?.setValue(this._country.name);
    }
    this.classDialCode = 'dial-code-normal';
  }

  setDialCodeWeight(): void {
    this.classDialCode = this.dialCodeInput.nativeElement.value  ? 'dial-code-normal' : 'dial-code-lighter';
  }

  onDialCodeKeyup(): void {
    const inputValue = this.dialCodeInput.nativeElement.value;
    const dialCode = '+' + inputValue;
    const country = this.countries.find(country => country.dialCode === dialCode.trim());
    if (country) {
      this._country = country;
      this.changeMobileValidator();
      this.country?.setValue(this._country.name);
      this.classMatSelectTrigger = 'valid';
    } else {
      this.country?.setValue(this.labelUnKnownDialCode);
      this.classMatSelectTrigger = 'invalid';
      if (this.mobile?.value) { this.mobile?.setErrors({ invalidMobile: true }); }
    }
    this.country?.markAsDirty();
  }

  onCountryOpenedChanged(): void {
    if (this.country?.value === this.labelUnKnownDialCode) {
      this.dialCodeInput.nativeElement.value = this._country.dialCode.replace('+', '');
      this.country.setValue(this._country.name);
      this.classMatSelectTrigger = 'valid';
    }
  }

  changeMobileValidator(): void {
    this.mobile?.setValidators([Validators.required, validateMobile(this._country.code as CountryCode)]);
    this.mobile?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.form.invalid) { return; }
    this.authenticationService.user = this.form.value;
    this.authenticationService.countryCode = this._country.code;
    this.authenticationService.addUser();
  }

  ngOnDestroy(): void { this.subscriptions.unsubscribe(); }
}
