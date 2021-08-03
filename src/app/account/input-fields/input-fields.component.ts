import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-input-fields',
  templateUrl: './input-fields.component.html',
  styleUrls: ['./input-fields.component.scss']
})
export class InputFieldsComponent implements AfterViewInit {
  @Input() form!: FormGroup;
  @Input() isDuplicateUsername = false;
  @Input() isDuplicateEmail = false;
  @Output() inputFields = new EventEmitter<this>();
  @ViewChild('inputEmail')  inputEmail!: ElementRef;

  get name(): AbstractControl | null { return this.form.get('name'); }
  get username(): AbstractControl | null { return this.form.get('username'); }
  get email(): AbstractControl | null { return this.form.get('email'); }

  ngAfterViewInit(): void {this.inputFields.emit(this); console.log(this.username?.errors);
    this.username?.setErrors({ isDuplicateUsername: this.isDuplicateUsername });
    if(this.isDuplicateEmail) this.email?.setErrors({ isDuplicateEmail: this.isDuplicateEmail });
  }
  print(){console.log(this.isDuplicateUsername);}
}
