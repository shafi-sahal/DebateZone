import { ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { DeviceTypeChecker } from '../device-type-checker.service';
import { Spinner } from '../shared/components/spinner/spinner.service';
import { HomeService } from './home.service';
import { NavService } from './nav-elements/nav.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  constructor(
    public navService: NavService,
    public deviceTypeChecker: DeviceTypeChecker,
    public homeService: HomeService,
    private spinner: Spinner
  ) {
    this.spinner.hide();
  }
}
