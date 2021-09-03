import { Component } from '@angular/core';
import { DeviceTypeChecker } from 'src/app/device-type-checker.service';

@Component({
  selector: 'app-debate-create',
  templateUrl: './debate-create.component.html',
  styleUrls: ['./debate-create.component.scss', '../../shared/styles/input-fields.scss']
})
export class DebateCreateComponent {
  constructor(public deviceTypeChecker: DeviceTypeChecker) {}
}
