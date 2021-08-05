import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';
import { DeviceTypeChecker } from '../device-type-checker.service';
import { NavService } from '../home/nav.service';
import { Spinner } from '../shared/components/spinner/spinner.service';
import { regexes } from '../shared/datasets';
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
  private subscriptions = new Subscription();
  private isMobile = true;

  form = this.formBuilder.group({
    name: [
      '',
      {
        updateOn: 'blur',
        validators: Validators.pattern(regexes.name)
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
    private changeDetector: ChangeDetectorRef
  ) { this.spinner.hide(); }

  ngOnInit(): void {
    this.subscriptions
      .add(this.deviceTypeChecker.isMobile.subscribe(isMobile => this.isMobile = isMobile))
      .add(this.accountService.fetchUser().subscribe(user => {
        this.form.setValue(user);
        this.form.get('username')?.setAsyncValidators(this.usernameAvailabilityCheck.validate.bind(this));
        this.form.get('email')?.setAsyncValidators(this.emailUniquenessValidator.validate.bind(this));
      })
    );
  }

  ngAfterViewInit(): void {
    this.subscriptions.add(this.inputFields.subscribe(inputFields => {
      this.shouldAsyncValidateEmail.next(false);
      this.cachedEmail = this.form.get('email')?.value;
      if(!inputFields) return;
      setTimeout(() => {
        this.focusChangeObserver.removeObserver();
        this.focusChangeObserver
          .observeFocusChangeOfElement(inputFields.inputEmail, this.shouldAsyncValidateEmail, this.getNavButtonsTextContent()
        );
      });
    }));
  }

  private getNavButtonsTextContent(): string[] {
    const textContents = this.isMobile
      ? this.navService.navButtons.map(button => ' ' + button.icon + ' ')
      : this.navService.navButtons.map(button => ' ' + button.icon + ' ' + button.label);
    textContents.splice(1);
    textContents.push('Log out');
    return textContents;
  }

  ngOnDestroy(): void { this.subscriptions.unsubscribe(); }
}
