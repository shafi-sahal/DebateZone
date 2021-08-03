import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';
import { DeviceTypeChecker } from '../device-type-checker.service';
import { NavService } from '../home/nav.service';
import { Spinner } from '../shared/components/spinner/spinner.service';
import { regexes } from '../shared/datasets';
import { EmailUniquenessValidator, FocusChangeObserver, UsernameAvailabilityCheck, validateUsername } from '../shared/validator';
import { InputFieldsComponent } from './input-fields/input-fields.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  providers: [UsernameAvailabilityCheck, EmailUniquenessValidator, FocusChangeObserver, AuthenticationService, NavService]
})
export class AccountComponent implements AfterViewInit, OnDestroy {
  inputFields = new BehaviorSubject<InputFieldsComponent | null>(null);
  private shouldAsyncValidateEmail = new Subject<boolean>();
  private subscriptions = new Subscription();
  private isMobile = true;
  isDuplicateUsername = false;
  isDuplicateEmail = false;
  cachedEmail = '';
  usernameStatus = 'VALID';

  form = this.formBuilder.group({
    name: [
      '',
      {
        updateOn: 'blur',
        validators: Validators.pattern(regexes.name)
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
    mobile: [{ value: '', disabled: true }]
  })

  constructor(
    public deviceTypeChecker: DeviceTypeChecker,
    private spinner: Spinner,
    private formBuilder: FormBuilder,
    private usernameAvailabilityCheck: UsernameAvailabilityCheck,
    private emailUniquenessValidator: EmailUniquenessValidator,
    private focusChangeObserver: FocusChangeObserver,
    private authenticationService: AuthenticationService,
    private navService: NavService
  ) { this.spinner.hide(); }

  ngAfterViewInit(): void {
    this.inputFields.subscribe(inputFields => {
      this.cachedEmail = this.form.get('email')?.value;
      if(!inputFields) return;
      setTimeout(() =>
        this.focusChangeObserver
          .observeFocusChangeOfElement(inputFields.inputEmail, this.shouldAsyncValidateEmail, this.getNavButtonsTextContent())
      );
    });

    this.subscriptions
      .add(this.deviceTypeChecker.isMobile.subscribe(isMobile => this.isMobile = isMobile))
      .add(this.form.get('username')?.statusChanges.subscribe(status => this.usernameStatus = status)
    );
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
