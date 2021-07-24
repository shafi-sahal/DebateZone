import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DeviceTypeChecker } from '../device-type-checker.service';
import { Spinner } from '../shared/components/spinner/spinner.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  form = this.formBuilder.group({
    name: []
  });

  constructor(
    public deviceTypeChecker: DeviceTypeChecker,
    private spinner: Spinner,
    private formBuilder: FormBuilder
  ) { this.spinner.hide(); }
}
