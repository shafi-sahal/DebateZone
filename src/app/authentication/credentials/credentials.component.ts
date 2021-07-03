import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { CredentialsService } from 'src/app/shared/services/credentials.service';
import { AuthenticationService } from '../authentication.service';
import { countries } from '../../../assets/datasets';
import { validateUsername, validateMobile, UsernameAvailabilityCheck, EmailUniquenessValidator, MobileUniquenessValidator } from 'src/app/authentication/validator';
import { CountryCode } from 'libphonenumber-js';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.scss'],
  providers: [CredentialsService, UsernameAvailabilityCheck, EmailUniquenessValidator, MobileUniquenessValidator],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CredentialsComponent implements OnInit, OnDestroy {
  @Input() isSignUp = new Observable<boolean>();
  @ViewChild('formDirective') formDirective!: FormGroupDirective;
  @ViewChild('dialCodeInput') dialCodeInput!: ElementRef;
  @ViewChild('countrySelect') countrySelect!: MatSelect;
  buttonText = 'Login';
  countries = countries;
  country = { name: 'India', dialCode: '+91', code: 'IN' };
  filteredCountries: Record<string, string>[] = countries;
  labelUnknownDialCode = 'Unknown Dial Code';
  classDialCode = 'dial-code-normal';
  showLoginError = false;

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
      label: 'Username, email or mobile',
      placeholder: 'Enter your username, email or mobile(with country code)'
    },
    country: {
      label: '',
      placeholder: ''
    },
    mobile: {
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

  form = this.formBuilder.group({
    name: [
      '',
      {
        updateOn: 'blur',
        validators: [Validators.required, Validators.pattern(this.regexName)]
      }
    ],
    username: ['', [Validators.required, validateUsername()], this.usernameAvailabilityCheck.validate.bind(this)],
    email: [ '', { updateOn: 'blur', validators: [Validators.required] } ],
    mobile: [
      '',
      {
        updateOn: 'blur',
        validators: [Validators.required, validateMobile(this.country.code as CountryCode)],
        asyncValidators: this.mobileUniquenessValidator.validate.bind(this)
      }
    ],
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
      placeholder: 'Ex: neerjabhanot'
    },
    email: {
      label: 'Email',
      placeholder: 'Ex: neerjabhanot@example.com:'
    },
    country: {
      label: 'Country',
      placeholder: 'India'
    },
    mobile: {
      label: 'Mobile Number',
      placeholder: 'Ex: 7012154608'
    },
    password: {
      label: 'Password',
      placeholder: 'Ex: derTg@7674+>jFDuty.5'
    }
  }

  constructor(
    public credentialsService: CredentialsService,
    public authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private usernameAvailabilityCheck: UsernameAvailabilityCheck,
    private emailUniquenessValidator: EmailUniquenessValidator,
    private mobileUniquenessValidator: MobileUniquenessValidator,
    private changeDetector: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(this.isSignUp.subscribe(isSignUp => this.initForm(isSignUp)));
  }

  get name(): AbstractControl | null { return this.form.get('name'); }
  get username(): AbstractControl | null { return this.form.get('username'); }
  get email(): AbstractControl | null { return this.form.get('email'); }
  get mobile(): AbstractControl | null { return this.form.get('mobile'); }
  get password(): AbstractControl | null { return this.form.get('password'); }

  getCountryIndex(countryName: string): number { return this.countries.findIndex(country => country.name === countryName); }

  initForm(isSignUp: boolean): void {
    this.showLoginError = false;
    this.formDirective.resetForm();
    if (isSignUp) {
      this.inputDetails = this.inputDetailsSignUp;
      this.buttonText = 'Sign Up';
      this.password?.setValidators(Validators.minLength(8));
      this.email?.setValidators([Validators.pattern(this.regexEmail)]);
      this.email?.setAsyncValidators(this.emailUniquenessValidator.validate.bind(this));
    } else {
      this.inputDetails = this.inputDetailsLogin;
      this.buttonText = 'Login';
      this.password?.setValidators(Validators.required);
      this.password?.updateValueAndValidity();
      this.email?.setValidators(Validators.required);
      this.email?.clearAsyncValidators();
      this.email?.updateValueAndValidity;
    }
  }

  trackFunction(index: number, country: Record<string, string>): string {
    return country.code;
  }

  onCountrySelectionChange(countryName: string): void {
    const country = this.countries.find(country => country.name === countryName);
    if (country) {
      this.country = country;
      this.changeMobileValidator();
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
      this.country = country;
      this.countrySelect.value = this.country.name;
      this.changeMobileValidator();
    } else {
      this.countrySelect.value = this.labelUnknownDialCode;
      if (this.mobile?.value) { this.mobile?.setErrors({ invalidMobile: true }); }
    }
  }

  onCountryOpenedChanged(): void {
    if (this.countrySelect.value === this.labelUnknownDialCode) {
      this.dialCodeInput.nativeElement.value = this.country.dialCode.replace('+', '');
      this.countrySelect.value = this.country.name;
    }
  }

  changeMobileValidator(): void {
    this.mobile?.setValidators([Validators.required, validateMobile(this.country.code as CountryCode)]);
    this.mobile?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.buttonText === 'Login') { this.login(); } else { this.addUser(); }
  }

  addUser(): void {
    if (this.form.invalid || this.form.pending) { return; }
    this.authenticationService.countryCode = this.country.code;
    this.authenticationService.user = this.form.value;
    this.authenticationService.addUser().subscribe(userAdded => {
      if (userAdded) { this.router.navigate(['home']); }
    });
  }

  login(): void {
    if (!(this.email?.value && this.password?.value )) { return; }
    this.authenticationService.login(this.email?.value, this.password?.value).subscribe(authenticated => {
      this.showLoginError = !authenticated;
      this.changeDetector.markForCheck();
      if (authenticated) { this.router.navigate(['home']); }
    });
  }

  ngOnDestroy(): void { this.subscriptions.unsubscribe(); }
}
