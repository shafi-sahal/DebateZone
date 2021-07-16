import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from './session.service';
import { Spinner } from './shared/components/spinner/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'DebateZone';

  constructor(
    private spinner: Spinner,
    private sessionService: SessionService,
    private router: Router
  ) { this.spinner.show('I am coming...'); }

  ngOnInit(): void {
    window.addEventListener('storage', () => this.checkAuthentication());
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.checkAuthentication);
  }

  private checkAuthentication():void {
    if (!this.sessionService.readToken()) this.router.navigate(['authentication']);
  }
}
