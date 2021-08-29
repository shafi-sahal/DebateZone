import { Component } from '@angular/core';
import { DeviceTypeChecker } from '../device-type-checker.service';

@Component({
  selector: 'app-debate',
  templateUrl: './debate.component.html',
  styleUrls: ['./debate.component.scss']
})
export class DebateComponent {

  constructor(public deviceTypeChecker: DeviceTypeChecker) { }

}
