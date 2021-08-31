import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DeviceTypeChecker } from 'src/app/device-type-checker.service';
import { NavButton } from 'src/app/home/nav-buttons-enum';
import { NavService } from 'src/app/home/nav-elements/nav.service';

@Component({
  selector: 'app-debate-list',
  templateUrl: './debate-list.component.html',
  styleUrls: ['./debate-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NavService]
})
export class DebateListComponent {
  NavButton = NavButton;

  constructor(public deviceTypeChecker: DeviceTypeChecker, public navService: NavService) {}
}
