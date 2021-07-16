import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { SessionService } from '../session.service';
import { Spinner } from '../shared/components/spinner/spinner.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  mode = 'closed';
  isMobile = true;

  constructor(
    private spinner: Spinner,
    private router: Router,
    private sessionService: SessionService
  ) { this.spinner.hide(); }

  onMenuClick():void { this.sidenav.toggle(); }

  onClickLogout(): void {
    this.sessionService.clearUser();
    this.router.navigate(['authentication']);
  }
}
