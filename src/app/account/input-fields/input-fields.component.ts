import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { EmailUniquenessValidator, FocusChangeObserver, UsernameAvailabilityCheck, validateUsername } from 'src/app/shared/validator';
import { regexes } from '../../shared/datasets';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-input-fields',
  templateUrl: './input-fields.component.html',
  styleUrls: ['./input-fields.component.scss'],
  providers: [UsernameAvailabilityCheck, EmailUniquenessValidator, AuthenticationService, FocusChangeObserver]
})
export class InputFieldsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('inputEmail')  inputEmail!: ElementRef;
  private shouldAsyncValidateEmail = new Subject<boolean>();

  form = this.formBuilder.group({
    name: [
      this.accountService.user.name,
      {
        updateOn: 'blur',
        validators: Validators.pattern(regexes.name)
      }
    ],
    username: [this.accountService.user.username, validateUsername(), this.usernameAvailabilityCheck.validate.bind(this)],
    email: [
      this.accountService.user.email,
      {
        updateOn: 'blur',
        validators: [Validators.required, Validators.pattern(regexes.email)],
        asyncValidators: this.emailUniquenessValidator.validate.bind(this)
      }
    ],
    mobile: [this.accountService.user.mobile]
  })

  constructor(
    private formBuilder: FormBuilder,
    private usernameAvailabilityCheck: UsernameAvailabilityCheck,
    private emailUniquenessValidator: EmailUniquenessValidator,
    private authenticationService: AuthenticationService,
    private focusChangeObserver: FocusChangeObserver,
    private accountService: AccountService
  ) { }

  ngAfterViewInit(): void {
    setTimeout(() => this.focusChangeObserver.observeFocusChangeOfElement(this.inputEmail, this.shouldAsyncValidateEmail));
  }

  get email(): AbstractControl | null { return this.form.get('email'); }

  ngOnDestroy(): void { this.accountService.user = this.form.value; }
}
