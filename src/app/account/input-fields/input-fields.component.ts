import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SessionService } from 'src/app/session.service';
import { UsernameErrorMessageService } from 'src/app/shared/services/username-error-message.service';

@Component({
  selector: 'app-input-fields',
  templateUrl: './input-fields.component.html',
  styleUrls: ['./input-fields.component.scss', '../../shared/styles/messages.scss'],
  providers: [UsernameErrorMessageService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputFieldsComponent implements AfterViewInit {
  @Input() form!: FormGroup;
  @Input() isUsernameAvailable = false;
  @Input() isLoading = false;
  @Input() isButtonDisabled = true;
  @Output() inputFields = new EventEmitter<this>();
  @Output() controlBlur = new EventEmitter<FocusEvent>();
  @Output() formSubmit = new EventEmitter();
  @Output() editMobileClicked = new EventEmitter<void>();
  @ViewChild('inputEmail')  inputEmail!: ElementRef;

  constructor(
    public changeDetector: ChangeDetectorRef,
    public sessionService: SessionService,
    public usernameErrorMessageService: UsernameErrorMessageService
  ) {}

  get name(): AbstractControl | null { return this.form.get('name'); }
  get username(): AbstractControl | null { return this.form.get('username'); }
  get email(): AbstractControl | null { return this.form.get('email'); }

  ngAfterViewInit(): void { this.inputFields.emit(this); }
}
