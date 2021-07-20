import { Component, HostListener, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from './session.service';
import { Spinner } from './shared/components/spinner/spinner.service';
import { WindowRef } from './window-ref.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'DebateZone';

  constructor(
    private spinner: Spinner,
    private sessionService: SessionService,
    private router: Router,
    private windowRef: WindowRef,
    private renderer: Renderer2
  ) {
    this.spinner.show('I am coming...');
    this.checkKeepUserLoggedIn();
  }

  @HostListener('window:storage', ['$event'])
  private checkAuthentication(): void {
    if (!this.sessionService.readToken()) this.router.navigate(['authentication']);
  }

  private checkKeepUserLoggedIn(): void {
    if (!this.sessionService.readKeepUserLoggedIn()) {
      const beforeUnload = this.renderer.listen(this.windowRef.nativeWindow, 'beforeUnload', () => {
        this.sessionService.destroySession();
        beforeUnload();
      });
    }
  }
}
