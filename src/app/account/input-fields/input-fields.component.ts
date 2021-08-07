import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SessionService } from 'src/app/session.service';

@Component({
  selector: 'app-input-fields',
  templateUrl: './input-fields.component.html',
  styleUrls: ['./input-fields.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputFieldsComponent implements AfterViewInit {
  @Input() form!: FormGroup;
  @Input() isDuplicateUsername = false;
  @Input() isDuplicateEmail = false;
  @Input() usernameStatus: 'INVALID' | 'PENDING' | 'VALID' = 'INVALID';
  @Input() isLoading = false;
  @Input() shouldDisableButton = true;
  @Input() keepMeLoggedIn = true;
  @Output() inputFields = new EventEmitter<this>();
  @Output() dataChange = new EventEmitter<Event>();
  @Output() keepMeLoogedIn = new EventEmitter<boolean>();
  @Output() controlBlur = new EventEmitter<FocusEvent>();
  @Output() formSubmit = new EventEmitter();
  @ViewChild('inputEmail')  inputEmail!: ElementRef;

  constructor(
    public changeDetector: ChangeDetectorRef,
    public sessionService: SessionService,
  ) {}

  get name(): AbstractControl | null { return this.form.get('name'); }
  get username(): AbstractControl | null { return this.form.get('username'); }
  get email(): AbstractControl | null { return this.form.get('email'); }

  ngAfterViewInit(): void {
    this.inputFields.emit(this);

    // Preserve the valifation errors on device change
    if(this.isDuplicateUsername) this.username?.setErrors({ isDuplicateUsername: true });
    if(this.isDuplicateEmail) this.email?.setErrors({ isDuplicateEmail: true });
    setTimeout(() => this.changeDetector.markForCheck());
  }
}
