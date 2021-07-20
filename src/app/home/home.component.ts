import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Spinner } from '../shared/components/spinner/spinner.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  constructor(private spinner: Spinner) { this.spinner.hide(); }

  onMenuClick():void { this.sidenav.toggle(); }
}
