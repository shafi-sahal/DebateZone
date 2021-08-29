import { Component } from '@angular/core';
import { DeviceTypeChecker } from 'src/app/device-type-checker.service';

@Component({
  selector: 'app-debate-list',
  templateUrl: './debate-list.component.html',
  styleUrls: ['./debate-list.component.scss']
})
export class DebateListComponent {

  constructor(public deviceTypeChecker: DeviceTypeChecker) {}
}
