import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';
import { DeviceTypeChecker } from '../device-type-checker.service';
import { NavService } from '../home/nav-elements/nav.service';
import { InitialDataLoader } from '../initial-data-loader.service';
import { SessionService } from '../session.service';
import { Spinner } from '../shared/components/spinner/spinner.service';
import { regexes } from '../shared/datasets';
import { User } from '../shared/models/user.model';
import { EmailUniquenessValidator, FocusChangeObserver, UsernameAvailabilityCheck, validateUsername } from '../shared/validator';
import { AccountService } from './account.service';
import { InputFieldsComponent } from './input-fields/input-fields.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UsernameAvailabilityCheck, EmailUniquenessValidator, FocusChangeObserver, AuthenticationService, NavService]
})
export class AccountComponent implements OnInit, AfterViewInit, OnDestroy {
  inputFields = new BehaviorSubject<InputFieldsComponent | null>(null);
  shouldAsyncValidateEmail = new Subject<boolean>();
  isDuplicateUsername = false;
  isDuplicateEmail = false;
  cachedEmail = '';
  usernameStatus: 'INVALID' | 'PENDING' | 'VALID' = 'INVALID';
  isLoading = true;
  user: User = { name: '', username: '' };
  shouldDisableButton = true;
  keepMeLoggedIn = true;

  private subscriptions = new Subscription();
  private isMobile = true;
  private keepUserLoggedInChanged = false;
  private clonedUser: User = { name: '', username: '' };
  private userDataChangeSnapshot: Record<string, string> = {};

  form = this.formBuilder.group({
    name: [
      '',
      {
        updateOn: 'blur',
        validators: [Validators.required, Validators.pattern(regexes.name)]
      }
    ],
    username: ['', [Validators.required, validateUsername()]],
    email: [
      '',
      {
        updateOn: 'blur',
        validators: [Validators.required, Validators.pattern(regexes.email)]
      }
    ],
    mobile: ['']
  })

  constructor(
    public deviceTypeChecker: DeviceTypeChecker,
    private spinner: Spinner,
    private formBuilder: FormBuilder,
    private usernameAvailabilityCheck: UsernameAvailabilityCheck,
    private emailUniquenessValidator: EmailUniquenessValidator,
    private focusChangeObserver: FocusChangeObserver,
    private authenticationService: AuthenticationService,
    private navService: NavService,
    private accountService: AccountService,
    private changeDetector: ChangeDetectorRef,
    private initialDataLoader: InitialDataLoader,
    private sessionService: SessionService
  ) { this.spinner.hide(); }

  ngOnInit(): void {
    this.accountService.keepUserLoggedIn = !!this.sessionService.readKeepUserLoggedIn();
    this.subscriptions
      .add(this.deviceTypeChecker.isMobile.subscribe(isMobile => this.isMobile = isMobile))
      .add(this.initialDataLoader.user.subscribe(user => {
        if (!user) return;
        this.prepareForm(user);
      })
    );
  }

  ngAfterViewInit(): void {
    // Used to preserve the state and functions of the form on device changes
    this.subscriptions.
      add(this.inputFields.subscribe(inputFields => {
        this.shouldAsyncValidateEmail.next(false);
        this.cachedEmail = this.form.get('email')?.value;
        if (!inputFields) return;
        // Since the changed InputFieldsComponent has new input for email,
        // it is needed to listen to the blur event of the new input.
        setTimeout(() => {
          this.focusChangeObserver.removeObserver();
          this.focusChangeObserver
            .observeFocusChangeOfElement(inputFields.inputEmail, this.shouldAsyncValidateEmail, this.getNavButtonsTextContent()
            );
        });
      })
      .add(this.form.statusChanges.subscribe(() => this.setDisableButton()))
    );
  }

  onControlBlur(event: FocusEvent): void {
    const inputElement = event.target as HTMLInputElement;
    const controlName = inputElement.attributes[2].nodeValue;
    if (!controlName) return;
    const control = this.form.get(controlName);
    if (inputElement.value === '' || control?.invalid) {
      control?.setValue(this.user[controlName as keyof User]);
      this.onDataChange(event);
    }
  }

  onDataChange(event: Event): void {
    const inputEvent = event as InputEvent;
    const inputElement = inputEvent.target as HTMLInputElement;
    const inputFromKeepMeLoggedIn = inputElement.getAttribute('aria-checked');

    if (inputFromKeepMeLoggedIn) {
      this.setKeepUserLoggedInChanged(inputFromKeepMeLoggedIn);
    } else {
      this.setUserDataChanged(inputElement);
    }
    this.setDisableButton();
  }

  onFormSubmit(): void {
    if (!this.form.valid) return;
    this.accountService.updateUser(this.userDataChangeSnapshot).subscribe(() => {
      this.initialDataLoader.user.next({...this.user, ...this.userDataChangeSnapshot});
      this.userDataChangeSnapshot = {};
      this.shouldDisableButton = true;
    });
  }

  private prepareForm(user: User): void {
    this.isLoading = false;
    this.user = user;
    this.accountService.user = this.user;
    this.clonedUser = { ...this.user };
    this.changeDetector.markForCheck();
    this.form.setValue(user);
    setTimeout(() => {
      this.form.get('username')?.setAsyncValidators(this.usernameAvailabilityCheck.validate.bind(this));
      this.form.get('email')?.setAsyncValidators(this.emailUniquenessValidator.validate.bind(this));
    });
  }

  private getNavButtonsTextContent(): string[] {
    const textContents = this.isMobile
      ? this.navService.navButtons.map(button => ' ' + button.icon + ' ')
      : this.navService.navButtons.map(button => ' ' + button.icon + ' ' + button.label);
    textContents.splice(1);
    textContents.push('Log out');
    return textContents;
  }

  private setKeepUserLoggedInChanged(inputFromKeepMeLoggedIn: string): void {
    const keepUserLoggedIn = inputFromKeepMeLoggedIn === 'true';
    this.keepMeLoggedIn = keepUserLoggedIn;
    this.keepUserLoggedInChanged = keepUserLoggedIn !== this.accountService.keepUserLoggedIn;
  }

  private setUserDataChanged(inputElement: HTMLInputElement): void {
    // Gets the formControlName of the input element
    // To work correctly place formControlName as the second attribute of the input element
    const controlName = inputElement.attributes[2].nodeValue;
    if (!controlName) return;
    if (inputElement.value !== this.user[controlName as keyof User]) {
      this.userDataChangeSnapshot[controlName] = inputElement.value;
    } else {
      delete this.userDataChangeSnapshot[controlName];
    }
  }

  private setDisableButton(): void {
    const isUserDataChanged = Object.keys(this.userDataChangeSnapshot).length > 0;
    const isFormValueChanged = isUserDataChanged || this.keepUserLoggedInChanged;
    this.shouldDisableButton = !isFormValueChanged || !this.form.valid;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.initialDataLoader.user.next(null);
  }
}
