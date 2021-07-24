import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DeviceTypeChecker } from 'src/app/device-type-checker.service';
import { NavService } from '../nav.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() menuClicked = new EventEmitter();

  constructor(public navService: NavService, public deviceTypeChecker: DeviceTypeChecker) {}
}
