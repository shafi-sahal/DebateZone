import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Spinner } from '../shared/components/spinner/spinner.service';
import { NavService } from './nav.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  @Input() isMobile = true;
  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  constructor(public navService: NavService, private spinner: Spinner) { this.spinner.hide(); }

  onMenuClick():void { this.sidenav.toggle(); }
}
