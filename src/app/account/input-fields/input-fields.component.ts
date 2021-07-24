import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EmailUniquenessValidator, UsernameAvailabilityCheck, validateUsername } from 'src/app/shared/validator';
import { regexes } from '../../shared/datasets';

@Component({
  selector: 'app-input-fields',
  templateUrl: './input-fields.component.html',
  styleUrls: ['./input-fields.component.scss']
})
export class InputFieldsComponent {
  form = this.formBuilder.group({
    name: [
      '',
      {
        updateOn: 'blur',
        validators: Validators.pattern(regexes.name)
      }
    ],
    username: ['', validateUsername(), this.usernameAvailabilityCheck.validate.bind(this)],
    email: [
      '',
      {
        updateOn: 'blur',
        validators: Validators.pattern(regexes.email),
        asyncValidators: this.emailUniquenessValidator.validate.bind(this)
      }
    ],
    mobile: ['']
  })

  constructor(
    private formBuilder: FormBuilder,
    private usernameAvailabilityCheck: UsernameAvailabilityCheck,
    private emailUniquenessValidator: EmailUniquenessValidator
  ) { }

}
