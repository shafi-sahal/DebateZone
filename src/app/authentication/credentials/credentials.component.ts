import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, ViewChild
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';
import { CredentialsService } from 'src/app/shared/services/credentials.service';
import { AuthenticationService } from '../authentication.service';
import { regexes } from '../../shared/datasets';
import {
  validateUsername, validateMobile, UsernameAvailabilityCheck, EmailUniquenessValidator, MobileUniquenessValidator, FocusChangeObserver
} from 'src/app/shared/validator';
import { CountryCode } from 'libphonenumber-js';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { Spinner } from 'src/app/shared/components/spinner/spinner.service';

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.scss', '../../shared/styles/messages.scss', '../../shared/styles/input-with-spinner.scss'],
  providers: [
    CredentialsService,
    AuthenticationService,
    UsernameAvailabilityCheck,
    EmailUniquenessValidator,
    MobileUniquenessValidator,
    FocusChangeObserver
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CredentialsComponent implements AfterViewInit, OnDestroy {
  @Input() isSignUp = new Observable<boolean>();
  @ViewChild('countrySelect') countrySelect!: MatSelect;
  @ViewChild('formDirective') private formDirective!: FormGroupDirective;
  @ViewChild('dialCodeInput') private dialCodeInput!: ElementRef;
  @ViewChild('inputMobile') private inputMobile!: ElementRef;
  @ViewChild('inputEmail') private inputEmail!: ElementRef;
  buttonText = 'Login';
  _country = { name: 'India', dialCode: '+91', code: 'IN' };
  labelUnknownDialCode = 'Unknown Dial Code';
  classDialCode = 'dial-code-normal';
  showLoginError = false;
  shouldAsyncValidateEmail = new Subject<boolean>();
  shouldAsyncValidateMobile = new Subject<boolean>();

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

  signUpForm = this.formBuilder.group({
    name: [
      '',
      {
        updateOn: 'blur',
        validators: [Validators.required, Validators.pattern(regexes.name)]
      }
    ],
    username: ['', [Validators.required, validateUsername()], this.usernameAvailabilityCheck.validate.bind(this)],
    email: [
      '',
      {
        updateOn: 'blur',
        validators: [Validators.required, Validators.pattern(regexes.email)],
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
    private focusChangeObserver: FocusChangeObserver,
    private spinner: Spinner
  ) {}

  ngAfterViewInit(): void {
    this.subscriptions.add(this.isSignUp.subscribe(isSignUp => this.initForm(isSignUp)));
  }

  get form(): FormGroup { return this.buttonText === 'Login' ? this.loginForm : this.signUpForm; }
  get name(): AbstractControl | null { return this.signUpForm.get('name'); }
  get username(): AbstractControl | null { return this.signUpForm.get('username'); }
  get email(): AbstractControl | null { return this.form.get('email'); }
  get mobile(): AbstractControl | null { return this.signUpForm.get('mobile'); }
  get password(): AbstractControl | null { return this.form.get('password'); }

  initForm(isSignUp: boolean): void {
    this.showLoginError = false;
    this.formDirective.resetForm();
    if (isSignUp) {
      this.inputDetails = this.inputDetailsSignUp;
      this.buttonText = 'Sign Up';
      setTimeout(() => {
        this.focusChangeObserver.observeFocusChangeOfElement(this.inputEmail, this.shouldAsyncValidateEmail, ['Login']);
      });
    } else {
      this.inputDetails = this.inputDetailsLogin;
      this.buttonText = 'Login';
    }
  }

  changeMobileValidator(): void {
    this.mobile?.setValidators([Validators.required, validateMobile(this._country.code as CountryCode)]);
    this.mobile?.updateValueAndValidity();
  }

  clearErrors(control: AbstractControl | null, canAsyncValidate?: Subject<boolean>): void {
    canAsyncValidate?.next(false);
    control?.setErrors(null);
  }

  onSubmit(): void {
    if (this.buttonText === 'Login')  this.login();  else  this.addUser();
  }

  private addUser(): void {
    if (!this.signUpForm.valid) return;
    this.spinner.show('I am working on it...');
    this.authenticationService.countryCode = this._country.code;
    this.authenticationService.user = this.signUpForm.value;
    this.authenticationService.addUser().subscribe(isUserAdded => {
      if (isUserAdded) { this.router.navigate(['/']); }
    });
  }

  private login(): void {
    if (this.loginForm.invalid) return;
    this.spinner.show('Taking you with me...');
    this.authenticationService.login(this.email?.value, this.password?.value).subscribe(isAuthenticated => {
      this.showLoginError = !isAuthenticated;
      this.changeDetector.markForCheck();
      if (isAuthenticated) { this.router.navigate(['/']); }
    });
  }

  ngOnDestroy(): void { this.subscriptions.unsubscribe(); }
  print(){console.log(this.mobile?.value);}
}
