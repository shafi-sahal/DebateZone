import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from './session.service';
import { Spinner } from './shared/components/spinner/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'DebateZone';

  constructor(
    private spinner: Spinner,
    private sessionService: SessionService,
    private router: Router
  ) { this.spinner.show('I am coming...'); }

  @HostListener('window:storage', ['$event'])
  private checkAuthentication(): void {
    if (!this.sessionService.readToken()) this.router.navigate(['authentication']);
  }
}
