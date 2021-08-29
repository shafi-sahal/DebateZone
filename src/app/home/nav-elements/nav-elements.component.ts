import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DeviceTypeChecker } from 'src/app/device-type-checker.service';
import { SessionService } from 'src/app/session.service';
import { Spinner } from 'src/app/shared/components/spinner/spinner.service';
import { HomeService } from '../home.service';
import { NavService } from './nav.service';

@Component({
  selector: 'app-nav-elements',
  templateUrl: './nav-elements.component.html',
  styleUrls: ['./nav-elements.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavElementsComponent implements OnInit, OnDestroy {
  @Output() private closeButtonClicked = new EventEmitter();
  @Input() isMobile = true;
  private subscriptions = new Subscription();

  constructor(
    public deviceTypeChecker: DeviceTypeChecker,
    public navService: NavService,
    public sessionService: SessionService,
    public homeService: HomeService,
    private router: Router,
    private spinner: Spinner,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.navService.clickedNavbuttonIndex = this.navService.navButtons.findIndex(button => button.route === this.router.url);
    this.homeService.load(this.navService.clickedNavbuttonIndex);
    this.subscriptions
      .add(this.router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
          this.homeService.isRouting = true;
          this.navService.clickedNavbuttonIndex = this.navService.navButtons.findIndex(button => button.route === event.url);
          this.changeDetector.markForCheck();
          this.homeService.changes.next();
        }
        else if (event instanceof NavigationEnd) {
          this.homeService.isRouting = false;
          this.changeDetector.markForCheck();
        }
      })
      .add(this.homeService.changes.subscribe(() => this.changeDetector.markForCheck()))
    );
  }

  onCloseButtonClick(): void { this.closeButtonClicked.emit(); }

  onLogoutClick(): void {
    this.spinner.show('Logging out, See you soon...');
    this.sessionService.destroySession();
    this.router.navigate(['/authentication']);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.homeService.user.next(null);
  }
}
