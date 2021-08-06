import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SessionService } from 'src/app/session.service';
import { User } from 'src/app/shared/models/user.model';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { AccountService } from '../account.service';


@Component({
  selector: 'app-input-fields',
  templateUrl: './input-fields.component.html',
  styleUrls: ['./input-fields.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UtilsService]
})
export class InputFieldsComponent implements AfterViewInit {
  @Input() form!: FormGroup;
  @Input() isDuplicateUsername = false;
  @Input() isDuplicateEmail = false;
  @Input() usernameStatus: 'INVALID' | 'PENDING' | 'VALID' = 'INVALID';
  @Input() isLoading = false;
  @Input() user: User = { name: '', username: '' };
  @Input() shouldDisableButton = true;
  @Output() inputFields = new EventEmitter<this>();
  @ViewChild('inputEmail')  inputEmail!: ElementRef;
  private clonedUser: User = { name: '', username: '' };
  private isUserDataChanged = false;

  constructor(
    public changeDetector: ChangeDetectorRef,
    public sessionService: SessionService,
    private accountService: AccountService,
    private utilsService: UtilsService
  ) {}

  get name(): AbstractControl | null { return this.form.get('name'); }
  get username(): AbstractControl | null { return this.form.get('username'); }
  get email(): AbstractControl | null { return this.form.get('email'); }

  ngAfterViewInit(): void {
    this.inputFields.emit(this);
    this.clonedUser = {...this.user};

    // Preserve the valifation errors on device change
    if(this.isDuplicateUsername) this.username?.setErrors({ isDuplicateUsername: true });
    if(this.isDuplicateEmail) this.email?.setErrors({ isDuplicateEmail: true });
    setTimeout(() => this.changeDetector.markForCheck());

    this.form.statusChanges.subscribe(status => this.shouldDisableButton = !(this.isUserDataChanged && status === 'VALID'));
  }

  setDisableButton(event: Event): void {
    const inputEvent = event as InputEvent;
    const inputElement = inputEvent.target as HTMLInputElement;

    // Gets the formControlName of the input element
    // To work correctly place formControlName as the third attribute of the input element
    const field  = (inputElement).attributes[2].nodeValue;
    if (field) this.clonedUser[field as keyof User] = inputElement.value;
    this.isUserDataChanged = !this.utilsService.isEqualObjects(this.clonedUser, this.user);
    this.shouldDisableButton = !this.isUserDataChanged || this.form.invalid;
  }
}
