import { Component, HostListener, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceTypeChecker } from './device-type-checker.service';
import { SessionService } from './session.service';
import { Spinner } from './shared/components/spinner/spinner.service';
import { WindowRef } from './window-ref.service';
import { screenSizes } from '../assets/screen-sizes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'DebateZone';
  private username: string | undefined;

  constructor(
    private spinner: Spinner,
    private sessionService: SessionService,
    private router: Router,
    private windowRef: WindowRef,
    private renderer: Renderer2,
    private deviceTypeChecker: DeviceTypeChecker
  ) {
    this.spinner.show('I am coming...');
    this.checkKeepUserLoggedIn();
    this.checkDeviceType();
    this.username = sessionService.user?.username;
  }

  @HostListener('window:storage', ['$event'])
  private checkAuthentication(): void {
    this.sessionService.onStorageChange();
    const isSameUser = this.username === this.sessionService.user?.username;
    if (!this.sessionService.isAuthenticated || !isSameUser) this.router.navigate(['authentication']);
  }

  @HostListener('window:resize', ['$event'])
  private checkDeviceType(): void {
    const isMobile = this.windowRef.nativeWindow.innerWidth < screenSizes.desktopWidth;
    this.deviceTypeChecker.isMobile.next(isMobile);
  }

  private checkKeepUserLoggedIn(): void {
    if (!this.sessionService.keepUserLoggedIn) {
      const beforeUnload = this.renderer.listen(this.windowRef.nativeWindow, 'beforeunload', () => {
        this.sessionService.destroySession();
        beforeUnload();
      });
    }
  }
}
