import { Component } from '@angular/core';
import { DeviceTypeChecker } from '../device-type-checker.service';
import { Spinner } from '../shared/components/spinner/spinner.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  constructor(public deviceTypeChecker: DeviceTypeChecker,private spinner: Spinner) { this.spinner.hide(); }
}
