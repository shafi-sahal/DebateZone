import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DeviceTypeChecker } from 'src/app/device-type-checker.service';
import { NavService } from '../nav.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() menuClicked = new EventEmitter();
  private subscriptions = new Subscription();

  constructor(
    public navService: NavService,
    public deviceTypeChecker: DeviceTypeChecker,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) this.changeDetector.markForCheck();
    }));
  }

  ngOnDestroy(): void { this.subscriptions.unsubscribe(); }
}
