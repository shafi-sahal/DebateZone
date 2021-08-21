import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';
import { DeviceTypeChecker } from '../device-type-checker.service';
import { NavService } from '../home/nav-elements/nav.service';
import { HomeService } from '../home/home.service';
import { SessionService } from '../session.service';
import { Spinner } from '../shared/components/spinner/spinner.service';
import { regexes } from '../shared/datasets';
import { User } from '../shared/models/user.model';
import { EmailUniquenessValidator, FocusChangeObserver, MobileUniquenessValidator, UsernameAvailabilityCheck, validateMobile, validateUsername } from '../shared/validator';
import { AccountService } from './account.service';
import { InputFieldsComponent } from './input-fields/input-fields.component';
import { takeWhile } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CountryCode, parsePhoneNumber } from 'libphonenumber-js';
import { MobileInputComponent } from '../shared/modules/mobile-input/mobile-input.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UsernameAvailabilityCheck, EmailUniquenessValidator, FocusChangeObserver, AuthenticationService, NavService, MobileUniquenessValidator]
})
export class AccountComponent implements OnInit, AfterViewInit, OnDestroy {
  inputFields = new BehaviorSubject<InputFieldsComponent | null>(null);
  shouldAsyncValidateEmail = new Subject<boolean>();
  shouldAsyncValidateMobile = new Subject<boolean>();
  isDuplicateUsername = false;
  isDuplicateEmail = false;
  cachedEmail = '';
  usernameStatus: 'INVALID' | 'PENDING' | 'VALID' = 'INVALID';
  isLoading = true;
  user: User = { name: '', username: '' };
  isButtonDisabled = true;
  isUserMobileUpdated = false;

  private subscriptions = new Subscription();
  private dialogSubscriptions = new Subscription();
  private isMobile = true;
  private userDataChangeSnapshot: Record<string, string> = {};
  private country = { name: 'India', dialCode: '+91', code: 'IN' };
  private userCountry = this.country;

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
    mobile: [
      '',
      {
        updateOn: 'blur',
        validators: [Validators.required, validateMobile(this.country.code as CountryCode)],
        asyncValidators: this.mobileUniquenessValidator.validate.bind(this)
      }
    ]
  })

  constructor(
    public deviceTypeChecker: DeviceTypeChecker,
    private spinner: Spinner,
    private formBuilder: FormBuilder,
    private usernameAvailabilityCheck: UsernameAvailabilityCheck,
    private emailUniquenessValidator: EmailUniquenessValidator,
    private mobileUniquenessValidator: MobileUniquenessValidator,
    private focusChangeObserver: FocusChangeObserver,
    private authenticationService: AuthenticationService,
    private navService: NavService,
    private accountService: AccountService,
    private changeDetector: ChangeDetectorRef,
    private homeService: HomeService,
    private sessionService: SessionService,
    private dialog: MatDialog
  ) { this.spinner.hide(); }

  get mobile(): AbstractControl | null { return this.form.get('mobile'); }

  ngOnInit(): void {
    this.subscriptions
      .add(this.deviceTypeChecker.isMobile.subscribe(isMobile => this.isMobile = isMobile))
      .add(this.homeService.user.pipe(
        takeWhile(() => this.isLoading === true),
      ).subscribe(user => {
        if(!user) return;
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
      .add(this.form.statusChanges.subscribe(() => this.setButtonDisabled()))
    );
  }

  onControlBlur(event: FocusEvent): void {
    const inputElement = event.target as HTMLInputElement;
    const controlName = inputElement.attributes[2].nodeValue;
    if (!controlName) return;
    const control = this.form.get(controlName);
    if (inputElement.value === '' || control?.invalid) {
      control?.setValue(this.user[controlName as keyof User]);
      this.onInput(event);
    }
  }

  onInput(event: Event): void {
    const inputEvent = event as InputEvent;
    const inputElement = inputEvent.target as HTMLInputElement;
    this.setUserDataChanged(inputElement);
    this.setButtonDisabled();
  }

  onEditMobileClicked(): void {
    this.isUserMobileUpdated = false;
    const dialogRef = this.dialog.open(
      MobileInputComponent,
      { data: { form: this.form, shouldAsyncValidateMobile: this.shouldAsyncValidateMobile }, panelClass: 'dialog-rounded' }
    );

    setTimeout(() => {
      this.userCountry = dialogRef.componentInstance.userMobileData.country;
      this.mobile?.setValidators([Validators.required, validateMobile(this.userCountry.code as CountryCode)]);
      this.mobile?.updateValueAndValidity();
    });

    this.dialogSubscriptions
      .add(dialogRef.componentInstance.countryChanged.subscribe(country => {
        this.country = country;
        this.changeMobileValidator();
        this.changeDetector.detectChanges();
      }))
      .add(dialogRef.componentInstance.updateClicked.subscribe(() => this.updateUserMobile(dialogRef)))
      .add(dialogRef.afterClosed().subscribe(() => {
        if (this.isUserMobileUpdated) return;
        this.country = this.userCountry;
        this.changeMobileValidator();
        this.mobile?.setValue(this.user.mobile);
      })
    );
  }

  updateUserMobile(dialogRef: MatDialogRef<MobileInputComponent, any>): void {
    if(!this.mobile?.valid) return;
    this.spinner.show('Updating...');
    this.isUserMobileUpdated = true;
    const mobileParsed = parsePhoneNumber(this.mobile?.value, this.country.code as CountryCode).number.toString();
    this.accountService.updateUser({ mobile:  mobileParsed}).subscribe(() => {
      this.user.mobile = mobileParsed;
      this.mobile?.setValue(mobileParsed);
      this.changeMobileValidator();
      dialogRef.close();
      this.spinner.hide();
    });
  }

  updateUser(): void {
    if (!this.form.valid) return;
    const isUserDataChanged = Object.keys(this.userDataChangeSnapshot).length > 0;
    if (!isUserDataChanged) return;
    this.spinner.show('Updating...');

    this.accountService.updateUser(this.userDataChangeSnapshot).subscribe(() => {
      this.user = this.sessionService.user = {...this.user, ...this.userDataChangeSnapshot};
      this.homeService.user.next(this.user);
      this.userDataChangeSnapshot = {};
      this.usernameStatus = 'PENDING';
      this.isButtonDisabled = true;
      this.changeDetector.markForCheck();
      this.homeService.changes.next();
      this.spinner.hide();
    });
  }

  private prepareForm(user: User): void {
    this.isLoading = false;
    this.user = this.sessionService.user = user;
    this.changeDetector.markForCheck();
    this.homeService.changes.next();
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

  private setUserDataChanged(inputElement: HTMLInputElement): void {
    // Gets the formControlName of the input element
    // To work correctly place formControlName as the second attribute of the input element
    const controlName = inputElement.attributes[2].nodeValue;
    if (!controlName) return;
    if (inputElement.value.trim() !== this.user[controlName as keyof User]) {
      this.userDataChangeSnapshot[controlName] = inputElement.value;
    } else {
      delete this.userDataChangeSnapshot[controlName];
    }
  }

  private setButtonDisabled(): void {
    const isUserDataChanged = Object.keys(this.userDataChangeSnapshot).length > 0;
    this.isButtonDisabled = !isUserDataChanged || !this.form.valid;
  }

  private changeMobileValidator(): void {
    this.mobile?.setValidators([Validators.required, validateMobile(this.country.code as CountryCode)]);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.dialogSubscriptions.unsubscribe();
  }
}
