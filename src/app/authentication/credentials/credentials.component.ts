/* eslint-disable @typescript-eslint/no-empty-function */
import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, Renderer2, ViewChild
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';
import { CredentialsService } from 'src/app/shared/services/credentials.service';
import { AuthenticationService } from '../authentication.service';
import { countries } from '../datasets';
import {
  validateUsername, validateMobile, UsernameAvailabilityCheck, EmailUniquenessValidator, MobileUniquenessValidator
} from 'src/app/shared/validator';
import { CountryCode } from 'libphonenumber-js';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.scss'],
  providers: [
    CredentialsService, AuthenticationService, UsernameAvailabilityCheck, EmailUniquenessValidator, MobileUniquenessValidator
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CredentialsComponent implements AfterViewInit, OnDestroy {
  @Input() isSignUp = new Observable<boolean>();
  @ViewChild('formDirective') formDirective!: FormGroupDirective;
  @ViewChild('dialCodeInput') dialCodeInput!: ElementRef;
  @ViewChild('countrySelect') countrySelect!: MatSelect;
  @ViewChild('inputMobile') inputMobile!: ElementRef;
  @ViewChild('inputEmail') inputEmail!: ElementRef;
  buttonText = 'Login';
  countries = countries;
  _country = { name: 'India', dialCode: '+91', code: 'IN' };
  filteredCountries: Record<string, string>[] = countries;
  labelUnknownDialCode = 'Unknown Dial Code';
  classDialCode = 'dial-code-normal';
  showLoginError = false;
  shouldAsyncValidateEmail = new Subject<boolean>();
  shouldAsyncValidateMobile = new Subject<boolean>();
  private listenerBlur = () => {};
  private listenerFocus = () => {};

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

  signUpForm = this.formBuilder.group({
    name: [
      '',
      {
        updateOn: 'blur',
        validators: [Validators.required, Validators.pattern(this.regexName)]
      }
    ],
    username: ['', [Validators.required, validateUsername()], this.usernameAvailabilityCheck.validate.bind(this)],
    email: [
      '',
      {
        updateOn: 'blur',
        validators: [Validators.required, Validators.pattern(this.regexEmail)],
        asyncValidators: this.emailUniquenessValidator.validate.bind(this)
      }
    ],
    mobile: [
      '',
      {
        updateOn: 'blur',
        validators: [Validators.required, validateMobile(this._country.code as CountryCode)],
        asyncValidators: this.mobileUniquenessValidator.validate.bind(this)
      }
    ],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
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
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit(): void {
    this.subscriptions.add(this.isSignUp.subscribe(isSignUp => this.initForm(isSignUp)));
  }

  set country(country: { name: string, dialCode: string, code: string }) {
    this._country = country;
    this.countrySelect.value = this._country.name;
    this.changeMobileValidator();
  }

  get form(): FormGroup { return this.buttonText === 'Login' ? this.loginForm : this.signUpForm; }
  get name(): AbstractControl | null { return this.signUpForm.get('name'); }
  get username(): AbstractControl | null { return this.signUpForm.get('username'); }
  get email(): AbstractControl | null { return this.form.get('email'); }
  get mobile(): AbstractControl | null { return this.signUpForm.get('mobile'); }
  get password(): AbstractControl | null { return this.form.get('password'); }

  getCountryIndex(countryName: string): number { return this.countries.findIndex(country => country.name === countryName); }

  initForm(isSignUp: boolean): void {
    this.showLoginError = false;
    this.formDirective.resetForm();
    if (isSignUp) {
      this.inputDetails = this.inputDetailsSignUp;
      this.buttonText = 'Sign Up';
      setTimeout(() => {
        this.observeFocusChangeOfElement(this.inputMobile, this.shouldAsyncValidateMobile);
        this.observeFocusChangeOfElement(this.inputEmail, this.shouldAsyncValidateEmail);
      });
    } else {
      this.inputDetails = this.inputDetailsLogin;
      this.buttonText = 'Login';
    }
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

  onCountryOpenedChanged(): void {
    if (this.countrySelect.value === this.labelUnknownDialCode) {
      this.dialCodeInput.nativeElement.value = this._country.dialCode.replace('+', '');
      this.countrySelect.value = this._country.name;
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

  onSubmit(): void {
    if (this.buttonText === 'Login')  this.login();  else  this.addUser();
  }

  private observeFocusChangeOfElement(element: ElementRef, shouldAsyncValidateElement: Subject<boolean>): void {
    this.listenerBlur = this.renderer.listen(element.nativeElement, 'blur', blur => {
      const button = (blur.relatedTarget as HTMLButtonElement);
      const isBlurredByloginClick = button && button.textContent === 'Login';
      shouldAsyncValidateElement.next(!isBlurredByloginClick);
    });

    this.listenerFocus = this.renderer.listen(element.nativeElement, 'focus', () => shouldAsyncValidateElement.next(true));
  }

  private changeMobileValidator(): void {
    this.mobile?.setValidators([Validators.required, validateMobile(this._country.code as CountryCode)]);
    this.mobile?.updateValueAndValidity();
  }

  private addUser(): void {
    if (this.signUpForm.invalid || this.signUpForm.pending) return;
    this.authenticationService.countryCode = this._country.code;
    this.authenticationService.user = this.signUpForm.value;
    this.authenticationService.addUser().subscribe(isUserAdded => {
      if (isUserAdded) { this.router.navigate(['/']); }
    });
  }

  private login(): void {
    if (this.loginForm.invalid) return;
    this.authenticationService.login(this.email?.value, this.password?.value).subscribe(isAuthenticated => {
      this.showLoginError = !isAuthenticated;
      this.changeDetector.markForCheck();
      if (isAuthenticated) { this.router.navigate(['/']); }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.listenerBlur();
    this.listenerFocus();
  }
}
